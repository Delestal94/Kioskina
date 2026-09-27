import type { CoordinatorReceipt, EventEnvelope, SyncPullResponse, SyncedEvent } from "@kioskina/event-contracts";

export interface PendingEvent {
  event: EventEnvelope;
}

export interface EventOutbox {
  listPending(limit: number): Promise<PendingEvent[]>;
  markAccepted(receipts: CoordinatorReceipt[]): Promise<void>;
  loadCheckpoint(): Promise<string | null>;
  applyRemoteChanges(events: SyncedEvent[], cursor: string, expectedCursor: string | null): Promise<void>;
  findSequenceIssues(): Promise<DeviceSequenceIssue[]>;
  withSyncLock<T>(operation: () => Promise<T>): Promise<T>;
}

export interface DeviceSequenceIssue { deviceId: string; from: number; to: number; kind: "missing" | "duplicate"; }

export interface EventSyncClient {
  submit(events: EventEnvelope[]): Promise<CoordinatorReceipt[]>;
  pull(cursor: string | null, limit: number): Promise<SyncPullResponse>;
}

export interface SyncBatchResult {
  acceptedCount: number;
  receivedCount: number;
  sequenceIssues: DeviceSequenceIssue[];
  hasMore: boolean;
}

export async function synchronizePendingEvents(
  outbox: EventOutbox,
  client: EventSyncClient,
  batchSize: number,
): Promise<SyncBatchResult> {
  if (!Number.isSafeInteger(batchSize) || batchSize < 1) {
    throw new Error("El tamaño del lote debe ser un entero positivo.");
  }

  return outbox.withSyncLock(async () => {
  const pending = await outbox.listPending(batchSize);
  let acceptedCount = 0;
  if (pending.length > 0) {
    const expectedIds = new Set(pending.map(({ event }) => event.eventId));
    const receipts = await client.submit(pending.map(({ event }) => event));
    const receiptIds = receipts.map(({ eventId }) => eventId);
    const allReceiptsMatch = receiptIds.length === expectedIds.size
      && new Set(receiptIds).size === receiptIds.length
      && receiptIds.every((eventId) => expectedIds.has(eventId));
    if (!allReceiptsMatch) {
      throw new Error("La respuesta del coordinador no coincide con el lote enviado; los eventos siguen pendientes.");
    }
    await outbox.markAccepted(receipts);
    acceptedCount = receipts.length;
  }

  const checkpoint = await outbox.loadCheckpoint();
  const page = await client.pull(checkpoint, batchSize);
  if (page.events.length > batchSize || !page.cursor) {
    throw new Error("La página del coordinador excede el límite o no contiene un cursor válido.");
  }
  if (page.hasMore && page.cursor === checkpoint) throw new Error("El coordinador no avanzó el cursor; se detuvo la descarga.");
  await outbox.applyRemoteChanges(page.events, page.cursor, checkpoint);
  const remaining = await outbox.listPending(1);
  return {
    acceptedCount,
    receivedCount: page.events.length,
    sequenceIssues: await outbox.findSequenceIssues(),
    hasMore: page.hasMore || remaining.length > 0,
  };
  });
}
