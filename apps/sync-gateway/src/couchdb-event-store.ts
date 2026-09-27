import { Value } from "@sinclair/typebox/value";
import { assertSupportedEvent, canonicalJson, eventEnvelopeSchema, syncedEventSchema, type EventEnvelope, type SyncedEvent } from "@kioskina/event-contracts";
import type { GatewayConfiguration } from "./config.js";

interface CouchDbDocument {
  _id: string;
  _rev: string;
  event: EventEnvelope;
  coordinatorReceivedAt: string;
}

interface CouchDbChangeDocument {
  _id: string;
  event?: unknown;
  coordinatorReceivedAt?: unknown;
}

interface CouchDbChangesPage {
  last_seq: unknown;
  pending?: number;
  results: Array<{
    id: string;
    deleted?: boolean;
    doc?: CouchDbChangeDocument;
  }>;
}

export interface StoredEventResult {
  eventId: string;
  acceptedAt: string;
  duplicate: boolean;
}

export class IdempotencyConflictError extends Error {}
export class InvalidChangesCursorError extends Error {}

export class CouchDbEventStore {
  private readonly databaseUrl: URL;
  private readonly authorization: string;

  constructor(private readonly configuration: GatewayConfiguration) {
    const root = new URL(configuration.couchDbUrl.href.endsWith("/")
      ? configuration.couchDbUrl.href
      : `${configuration.couchDbUrl.href}/`);
    this.databaseUrl = new URL(`${encodeURIComponent(configuration.couchDbDatabase)}/`, root);
    this.authorization = `Basic ${Buffer.from(`${configuration.couchDbUsername}:${configuration.couchDbPassword}`).toString("base64")}`;
  }

  async ensureDatabase(): Promise<void> {
    const response = await fetch(this.databaseUrl, {
      method: "PUT",
      headers: { authorization: this.authorization },
    });
    if (response.status !== 201 && response.status !== 412) {
      throw new Error(`No se pudo preparar la base CouchDB (HTTP ${response.status}).`);
    }
  }

  async checkReady(): Promise<boolean> {
    try {
      const response = await fetch(this.databaseUrl, {
        method: "HEAD",
        headers: { authorization: this.authorization },
        signal: AbortSignal.timeout(2_500),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async accept(event: EventEnvelope): Promise<StoredEventResult> {
    assertSupportedEvent(event);
    const documentId = `event:${event.eventId}`;
    const coordinatorReceivedAt = new Date().toISOString();
    const document = { _id: documentId, event, coordinatorReceivedAt };
    const response = await fetch(new URL(encodeURIComponent(documentId), this.databaseUrl), {
      method: "PUT",
      headers: {
        authorization: this.authorization,
        "content-type": "application/json",
      },
      body: JSON.stringify(document),
    });

    if (response.status === 201) {
      return { eventId: event.eventId, acceptedAt: coordinatorReceivedAt, duplicate: false };
    }
    if (response.status !== 409) {
      throw new Error(`CouchDB rechazó la escritura del evento (HTTP ${response.status}).`);
    }

    const existingResponse = await fetch(new URL(encodeURIComponent(documentId), this.databaseUrl), {
      headers: { authorization: this.authorization },
    });
    if (!existingResponse.ok) {
      throw new Error(`No se pudo verificar el evento existente (HTTP ${existingResponse.status}).`);
    }
    const existing = await existingResponse.json() as CouchDbDocument;
    if (!existing || !Value.Check(syncedEventSchema, { event: existing.event, acceptedAt: existing.coordinatorReceivedAt })) {
      throw new Error("El coordinador contiene metadatos de evento inválidos.");
    }
    if (canonicalJson(existing.event) !== canonicalJson(event)) {
      throw new IdempotencyConflictError("El identificador de evento ya existe con otro contenido.");
    }

    return { eventId: event.eventId, acceptedAt: existing.coordinatorReceivedAt, duplicate: true };
  }

  async pull(tenantId: string, branchId: string, cursor: string | undefined, limit: number): Promise<{
    events: SyncedEvent[];
    cursor: string;
    hasMore: boolean;
  }> {
    if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("El límite de sincronización debe ser positivo.");

    let since = "0";
    if (cursor) {
      try {
        if (!/^[A-Za-z0-9_-]+$/.test(cursor) || Buffer.from(cursor, "base64url").toString("base64url") !== cursor) throw new Error("Codificación inválida.");
        const parsed: unknown = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Cursor inválido.");
        const scoped = parsed as Record<string, unknown>;
        if (scoped["version"] !== 1 || scoped["tenantId"] !== tenantId || scoped["branchId"] !== branchId
          || scoped["database"] !== this.configuration.couchDbDatabase) throw new Error("Alcance inválido.");
        const sequence = scoped["sequence"];
        if (sequence === null || sequence === undefined || (typeof sequence !== "string" && typeof sequence !== "number" && typeof sequence !== "object")) {
          throw new Error("Tipo de secuencia no admitido.");
        }
        const serialized = typeof sequence === "string" || typeof sequence === "number" ? String(sequence) : JSON.stringify(sequence);
        if (serialized === undefined) throw new Error("Cursor vacío.");
        since = serialized;
      } catch {
        throw new InvalidChangesCursorError("El cursor de sincronización no es válido.");
      }
    }

    const changesUrl = new URL("_changes", this.databaseUrl);
    changesUrl.searchParams.set("filter", "_selector");
    changesUrl.searchParams.set("include_docs", "true");
    changesUrl.searchParams.set("since", since);
    changesUrl.searchParams.set("limit", String(limit));
    const response = await fetch(changesUrl, {
      method: "POST",
      headers: {
        authorization: this.authorization,
        "content-type": "application/json",
      },
      body: JSON.stringify({ selector: { "event.tenantId": tenantId, "event.branchId": branchId } }),
    });
    if (!response.ok) throw new Error(`CouchDB rechazó la lectura incremental (HTTP ${response.status}).`);

    const page = await response.json() as CouchDbChangesPage;
    if (!page || !Array.isArray(page.results) || page.results.length > limit || page.last_seq === undefined || page.last_seq === null) {
      throw new Error("CouchDB devolvió una página de cambios inválida.");
    }
    if (page.pending !== undefined && (!Number.isSafeInteger(page.pending) || page.pending < 0)) {
      throw new Error("CouchDB devolvió un contador de cambios inválido.");
    }

    const events: SyncedEvent[] = [];
    for (const change of page.results) {
      if (!change || typeof change !== "object") throw new Error("CouchDB devolvió una fila de cambios inválida.");
      if (change.deleted) throw new Error("Se detectó el borrado de un evento inmutable en el coordinador.");
      if (typeof change.id !== "string" || !change.doc || change.doc._id !== change.id) {
        throw new Error("CouchDB devolvió un documento de sincronización inválido.");
      }
      const event = change.doc.event;
      if (!Value.Check(eventEnvelopeSchema, event)) {
        throw new Error(`CouchDB devolvió un evento inválido (documento ${change.id}).`);
      }
      assertSupportedEvent(event);
      if (event.tenantId !== tenantId || event.branchId !== branchId) {
        throw new Error("CouchDB devolvió un evento fuera del alcance autorizado.");
      }
      if (change.id !== `event:${event.eventId}` || typeof change.doc.coordinatorReceivedAt !== "string") {
        throw new Error(`CouchDB devolvió metadatos de recepción inválidos (documento ${change.id}).`);
      }
      const synced = { event, acceptedAt: change.doc.coordinatorReceivedAt };
      if (!Value.Check(syncedEventSchema, synced)) throw new Error("La recepción del evento no es válida.");
      events.push(synced);
    }

    const serializedCursor = JSON.stringify({ version: 1, tenantId, branchId, database: this.configuration.couchDbDatabase, sequence: page.last_seq });
    const nextCursor = Buffer.from(serializedCursor, "utf8").toString("base64url");
    if (nextCursor.length > 8192) throw new Error("El cursor del coordinador supera el límite del contrato.");
    return {
      events,
      cursor: nextCursor,
      hasMore: (page.pending ?? 0) > 0 || (page.pending === undefined && page.results.length >= limit),
    };
  }
}
