import { Value } from "@sinclair/typebox/value";
import {
  syncResponseSchema,
  syncPullResponseSchema,
  type CoordinatorReceipt,
  type EventEnvelope,
  type SyncPullResponse,
} from "@kioskina/event-contracts";
import type { EventSyncClient } from "@kioskina/application";

export class HttpEventSyncClient implements EventSyncClient {
  constructor(private readonly apiUrl: string, private readonly accessToken: () => string, private readonly fetcher: typeof fetch = fetch) {}

  async submit(events: EventEnvelope[]): Promise<CoordinatorReceipt[]> {
    const response = await this.fetcher(`${this.apiUrl}/v1/events`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.accessToken()}`,
      },
      body: JSON.stringify({ events }),
    });
    if (!response.ok) throw new Error(`El coordinador rechazó el lote (${response.status}).`);

    const body: unknown = await response.json();
    if (!Value.Check(syncResponseSchema, body)) {
      throw new Error("El coordinador devolvió una respuesta incompatible; los eventos siguen pendientes.");
    }
    const receiptIds = body.receipts.map(({ eventId }) => eventId);
    const acceptedIds = body.acceptedEventIds;
    if (new Set(receiptIds).size !== receiptIds.length
      || new Set(acceptedIds).size !== acceptedIds.length
      || receiptIds.length !== acceptedIds.length
      || receiptIds.some((eventId) => !acceptedIds.includes(eventId))) {
      throw new Error("El coordinador devolvió recibos inconsistentes; los eventos siguen pendientes.");
    }
    return body.receipts;
  }

  async pull(cursor: string | null, limit: number): Promise<SyncPullResponse> {
    if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("El límite de descarga debe ser un entero positivo.");
    const url = new URL(`${this.apiUrl}/v1/events`);
    if (cursor) url.searchParams.set("cursor", cursor);
    url.searchParams.set("limit", String(limit));
    const response = await this.fetcher(url, {
      headers: { authorization: `Bearer ${this.accessToken()}` },
    });
    if (!response.ok) throw new Error(`El coordinador no pudo entregar cambios (${response.status}).`);
    const body: unknown = await response.json();
    if (!Value.Check(syncPullResponseSchema, body)) throw new Error("El coordinador devolvió una página incompatible.");
    return body;
  }
}
