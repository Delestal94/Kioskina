import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { assertSupportedEvent, eventBatchSchema, syncErrorSchema, syncPullQuerySchema, syncPullResponseSchema, syncResponseSchema, type EventEnvelope } from "@kioskina/event-contracts";
import type { GatewayConfiguration, SpikeCredential } from "./config.js";
import { CouchDbEventStore, IdempotencyConflictError, InvalidChangesCursorError } from "./couchdb-event-store.js";

function bearerToken(header: string | undefined): string | null {
  const match = header?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function sameScope(event: EventEnvelope, credential: SpikeCredential): boolean {
  return event.tenantId === credential.tenantId
    && event.branchId === credential.branchId
    && event.deviceId === credential.deviceId
    && event.actorId === credential.actorId;
}

export async function createGateway(
  configuration: GatewayConfiguration,
  eventStore: Pick<CouchDbEventStore, "accept" | "pull"> = new CouchDbEventStore(configuration),
  logging = true,
): Promise<FastifyInstance> {
  const app = Fastify({
    bodyLimit: configuration.maxRequestBytes,
    ajv: { customOptions: { coerceTypes: false, removeAdditional: false, useDefaults: false } },
    logger: logging ? { redact: ["req.headers.authorization"] } : false,
  })
    .withTypeProvider<TypeBoxTypeProvider>();

  app.setErrorHandler<FastifyError>((error, request, reply) => {
    const status = typeof error.statusCode === "number" ? error.statusCode : 500;
    if (status >= 500) request.log.error({ code: error.code }, "Falló una solicitud del gateway");
    void reply.code(status).send({ error: status === 413 ? "La solicitud supera el límite de bytes configurado." : status < 500 ? "La solicitud no cumple el contrato del gateway." : "El gateway no pudo procesar la solicitud." });
  });

  await app.register(cors, {
    origin: configuration.allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["content-type", "authorization"],
  });

  app.get("/health", async () => ({ status: "ok" }));

  app.post("/v1/events", {
    schema: {
      body: eventBatchSchema,
      response: { 200: syncResponseSchema, 400: syncErrorSchema, 401: syncErrorSchema, 403: syncErrorSchema, 409: syncErrorSchema, 413: syncErrorSchema, 503: syncErrorSchema },
    },
  }, async (request, reply) => {
    const token = bearerToken(request.headers.authorization);
    const credential = token
      ? configuration.credentials.find((candidate) => candidate.token === token)
      : undefined;
    if (!credential) return reply.code(401).send({ error: "Credencial no válida para el spike." });

    const { events } = request.body;
    if (events.length > configuration.maxEventsPerBatch) {
      return reply.code(413).send({ error: "El lote supera el máximo configurado." });
    }
    if (new Set(events.map(({ eventId }) => eventId)).size !== events.length) {
      return reply.code(400).send({ error: "El lote contiene identificadores de evento repetidos." });
    }
    if (events.some((event) => !sameScope(event, credential))) {
      return reply.code(403).send({ error: "El evento no pertenece al comercio, sucursal, dispositivo y actor autorizados." });
    }
    try { for (const event of events) assertSupportedEvent(event); }
    catch { return reply.code(400).send({ error: "El lote contiene un tipo, versión o contenido de evento no soportado." }); }
    if (new Set(events.map((event) => event.deviceSequence)).size !== events.length) {
      return reply.code(400).send({ error: "El lote reutiliza una secuencia del dispositivo." });
    }

    const receipts: Array<{ eventId: string; acceptedAt: string; duplicate: boolean }> = [];
    for (const event of events) {
      try {
        receipts.push(await eventStore.accept(event));
      } catch (error) {
        if (error instanceof IdempotencyConflictError) {
          return reply.code(409).send({ error: error.message, eventId: event.eventId });
        }
        request.log.error({ err: error, eventId: event.eventId }, "No se pudo persistir un evento");
        return reply.code(503).send({ error: "El coordinador no pudo persistir todos los eventos del lote." });
      }
    }

    return {
      acceptedEventIds: receipts.map(({ eventId }) => eventId),
      receipts,
    };
  });

  app.get("/v1/events", {
    schema: { querystring: syncPullQuerySchema, response: { 200: syncPullResponseSchema, 400: syncErrorSchema, 401: syncErrorSchema, 503: syncErrorSchema } },
  }, async (request, reply) => {
    const token = bearerToken(request.headers.authorization);
    const credential = token
      ? configuration.credentials.find((candidate) => candidate.token === token)
      : undefined;
    if (!credential) return reply.code(401).send({ error: "Credencial no válida para el spike." });
    try {
      const requestedLimit = request.query.limit === undefined ? configuration.maxEventsPerBatch : Number(request.query.limit);
      if (!Number.isSafeInteger(requestedLimit) || requestedLimit < 1) return reply.code(400).send({ error: "El límite de descarga no es válido." });
      return await eventStore.pull(credential.tenantId, credential.branchId, request.query.cursor, Math.min(requestedLimit, configuration.maxEventsPerBatch));
    } catch (error) {
      if (error instanceof InvalidChangesCursorError) return reply.code(400).send({ error: error.message });
      request.log.error({ err: error }, "No se pudo leer cambios del coordinador");
      return reply.code(503).send({ error: "El coordinador no pudo leer los cambios." });
    }
  });

  return app;
}
