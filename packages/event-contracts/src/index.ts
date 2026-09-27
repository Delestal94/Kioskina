import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export const eventEnvelopeSchema = Type.Object({
  eventId: Type.String({ minLength: 1, maxLength: 80 }),
  schemaVersion: Type.Integer({ minimum: 1 }),
  tenantId: Type.String({ minLength: 1, maxLength: 120 }),
  branchId: Type.String({ minLength: 1, maxLength: 120 }),
  deviceId: Type.String({ minLength: 1, maxLength: 120 }),
  actorId: Type.String({ minLength: 1, maxLength: 120 }),
  aggregateType: Type.String({ minLength: 1, maxLength: 80 }),
  aggregateId: Type.String({ minLength: 1, maxLength: 120 }),
  eventType: Type.String({ minLength: 1, maxLength: 120 }),
  occurredAtDevice: Type.String({ minLength: 1, maxLength: 40 }),
  recordedAtLocal: Type.String({ minLength: 1, maxLength: 40 }),
  deviceSequence: Type.Integer({ minimum: 1, maximum: Number.MAX_SAFE_INTEGER }),
  causationId: Type.String({ minLength: 1, maxLength: 120 }),
  correlationId: Type.String({ minLength: 1, maxLength: 120 }),
  idempotencyKey: Type.String({ minLength: 1, maxLength: 120 }),
  payload: Type.Record(Type.String(), Type.Unknown()),
}, { additionalProperties: false });

export const eventBatchSchema = Type.Object({
  events: Type.Array(eventEnvelopeSchema, { minItems: 1 }),
}, { additionalProperties: false });

export const syncResponseSchema = Type.Object({
  acceptedEventIds: Type.Array(Type.String({ minLength: 1, maxLength: 80 })),
  receipts: Type.Array(Type.Object({
    eventId: Type.String({ minLength: 1, maxLength: 80 }),
    acceptedAt: Type.String({ minLength: 1, maxLength: 40 }),
    duplicate: Type.Boolean(),
  }, { additionalProperties: false })),
}, { additionalProperties: false });

export const syncPullQuerySchema = Type.Object({
  cursor: Type.Optional(Type.String({ minLength: 1, maxLength: 8192 })),
  limit: Type.Optional(Type.String({ pattern: "^[1-9][0-9]*$", maxLength: 16 })),
}, { additionalProperties: false });

export const syncErrorSchema = Type.Object({
  error: Type.String(),
  eventId: Type.Optional(Type.String()),
}, { additionalProperties: false });

export const syncedEventSchema = Type.Object({
  event: eventEnvelopeSchema,
  acceptedAt: Type.String({ minLength: 1, maxLength: 40 }),
}, { additionalProperties: false });

export const syncPullResponseSchema = Type.Object({
  events: Type.Array(syncedEventSchema),
  cursor: Type.String({ minLength: 1, maxLength: 8192 }),
  hasMore: Type.Boolean(),
}, { additionalProperties: false });

export type EventEnvelope = Static<typeof eventEnvelopeSchema>;
export type EventBatch = Static<typeof eventBatchSchema>;
export type SyncResponse = Static<typeof syncResponseSchema>;
export type SyncedEvent = Static<typeof syncedEventSchema>;
export type SyncPullResponse = Static<typeof syncPullResponseSchema>;

const observationPayloadSchema = Type.Object({
  observation: Type.String({ minLength: 1, maxLength: 500, pattern: "\\S" }),
}, { additionalProperties: false });

export class UnsupportedEventError extends Error {}

export function assertSupportedEvent(value: unknown): asserts value is EventEnvelope {
  if (!Value.Check(eventEnvelopeSchema, value)) throw new UnsupportedEventError("El sobre de evento no es válido.");
  if (value.schemaVersion !== 1 || value.eventType !== "spike.observation-recorded.v1"
    || value.aggregateType !== "spike-observation" || !Value.Check(observationPayloadSchema, value.payload)) {
    throw new UnsupportedEventError("El tipo, versión o contenido del evento no está soportado por este spike.");
  }
  for (const identifier of [value.eventId, value.tenantId, value.branchId, value.deviceId, value.actorId]) {
    if (!identifier.trim() || identifier !== identifier.trim()) throw new UnsupportedEventError("El identificador del evento no es válido.");
  }
  for (const timestamp of [value.occurredAtDevice, value.recordedAtLocal]) {
    const parsed = Date.parse(timestamp);
    if (!Number.isFinite(parsed) || new Date(parsed).toISOString() !== timestamp) throw new UnsupportedEventError("La fecha del evento debe ser un instante UTC ISO válido.");
  }
  if ([value.aggregateId, value.idempotencyKey, value.causationId, value.correlationId].some((id) => id !== value.eventId)) {
    throw new UnsupportedEventError("La identidad de la observación no coincide con su evento.");
  }
}

export interface CoordinatorReceipt {
  eventId: string;
  acceptedAt: string;
  duplicate: boolean;
}

export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${canonicalJson(entry)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}
