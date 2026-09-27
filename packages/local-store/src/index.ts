import PouchDB from "pouchdb-browser";
import type { DeviceSequenceIssue, EventOutbox } from "@kioskina/application";
import { canonicalJson, assertSupportedEvent, type CoordinatorReceipt, type EventEnvelope, type SyncedEvent } from "@kioskina/event-contracts";
import { createSpikeObservation, type SpikeObservationInput } from "@kioskina/spike-domain";

interface StoredEventDocument {
  _id: string;
  _rev?: string;
  event: EventEnvelope;
  deliveryState: "queued" | "accepted";
  acceptedAt?: string;
}
interface SyncCheckpoint { _id: string; _rev?: string; cursor: string; }
interface LocalIdentity { tenantId: string; branchId: string; deviceId: string; syncEndpoint: string; }
interface IdentityDocument { _id: string; identity: LocalIdentity; }
export interface LocalStoreConfiguration extends LocalIdentity { databaseName: string; scanPageSize: number; }
export interface ExclusiveLock { run<T>(name: string, operation: () => Promise<T>): Promise<T>; }
export type PendingEvent = Pick<StoredEventDocument, "_id" | "event" | "deliveryState">;

const browserLock: ExclusiveLock = {
  async run(name, operation) {
    if (!navigator.locks) throw new Error("Este navegador no ofrece el bloqueo compartido necesario para operar con seguridad.");
    return navigator.locks.request(name, operation);
  },
};
const isMissing = (error: unknown): boolean =>
  typeof error === "object" && error !== null && "status" in error && error.status === 404;

export class PouchLocalEventStore implements EventOutbox {
  private readonly database: PouchDB.Database<{}>;
  private readonly identity: LocalIdentity;
  private readonly lockName: string;

  constructor(
    private readonly config: LocalStoreConfiguration,
    private readonly locks: ExclusiveLock = browserLock,
    database?: PouchDB.Database<{}>,
  ) {
    if (!config.databaseName.trim()) throw new Error("Falta el nombre de la base local configurado.");
    if (!Number.isSafeInteger(config.scanPageSize) || config.scanPageSize < 1) throw new Error("El tamaño de página local debe ser un entero positivo.");
    this.identity = { tenantId: config.tenantId, branchId: config.branchId, deviceId: config.deviceId, syncEndpoint: config.syncEndpoint };
    if (Object.values(this.identity).some((value) => !value.trim())) throw new Error("Falta la identidad del almacenamiento local.");
    this.lockName = "kioskina-spike:" + config.databaseName;
    this.database = database ?? new PouchDB<{}>(config.databaseName);
  }

  private async ensureIdentity(): Promise<void> {
    let stored: IdentityDocument | undefined;
    try { stored = await this.database.get<IdentityDocument>("_local/identity"); }
    catch (error) { if (!isMissing(error)) throw error; }
    if (stored) {
      if (canonicalJson(stored.identity) !== canonicalJson(this.identity)) {
        throw new Error("Esta base pertenece a otro dispositivo, sucursal o coordinador. Configurá otra base; los datos anteriores se conservan.");
      }
      return;
    }
    const documents = await this.database.allDocs({ limit: 1 });
    const checkpoint = await this.readCheckpoint();
    if (documents.rows.length > 0 || checkpoint) {
      throw new Error("Esta base anterior no tiene identidad verificable. Conservála y configurá una base nueva para el spike.");
    }
    await this.database.put<IdentityDocument>({ _id: "_local/identity", identity: this.identity });
  }

  private async exclusive<T>(operation: () => Promise<T>): Promise<T> {
    return this.locks.run(this.lockName + ":data", async () => {
      await this.ensureIdentity();
      return operation();
    });
  }

  async withSyncLock<T>(operation: () => Promise<T>): Promise<T> {
    return this.locks.run(this.lockName + ":sync", operation);
  }

  private assertScope(event: EventEnvelope): void {
    assertSupportedEvent(event);
    if (event.tenantId !== this.identity.tenantId || event.branchId !== this.identity.branchId) {
      throw new Error("El evento no pertenece al comercio y sucursal de esta base.");
    }
  }

  private async *readEventDocuments(): AsyncGenerator<StoredEventDocument> {
    let startKey = "event:";
    let skip = 0;
    while (true) {
      const page = await this.database.allDocs<StoredEventDocument>({
        startkey: startKey, endkey: "event:\uffff", skip, limit: this.config.scanPageSize, include_docs: true,
      });
      if (page.rows.length === 0) return;
      for (const row of page.rows) {
        if (!row.doc) throw new Error("No se pudo leer un evento local.");
        this.assertScope(row.doc.event);
        if (row.id !== "event:" + row.doc.event.eventId) throw new Error("La identidad de un evento local no coincide con su documento.");
        yield row.doc;
      }
      if (page.rows.length < this.config.scanPageSize) return;
      startKey = page.rows[page.rows.length - 1]!.id;
      skip = 1;
    }
  }

  async appendObservation(input: Omit<SpikeObservationInput, "deviceSequence" | "occurredAt">): Promise<EventEnvelope> {
    return this.exclusive(async () => {
      if (input.deviceId !== this.identity.deviceId) throw new Error("El dispositivo del evento no coincide con esta base.");
      let lastSequence = 0;
      for await (const document of this.readEventDocuments()) {
        if (document.event.deviceId === input.deviceId) lastSequence = Math.max(lastSequence, document.event.deviceSequence);
      }
      const event = createSpikeObservation({ ...input, deviceSequence: lastSequence + 1, occurredAt: new Date().toISOString() });
      this.assertScope(event);
      await this.database.put<StoredEventDocument>({ _id: "event:" + event.eventId, event, deliveryState: "queued" });
      return event;
    });
  }

  async listPending(limit: number): Promise<PendingEvent[]> {
    if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("El límite de lectura debe ser un entero positivo.");
    return this.exclusive(async () => {
      const pending: PendingEvent[] = [];
      for await (const document of this.readEventDocuments()) {
        if (document.deliveryState !== "queued") continue;
        if (document.event.deviceId !== this.identity.deviceId) throw new Error("La outbox contiene una escritura de otro dispositivo.");
        pending.push({ _id: document._id, event: document.event, deliveryState: document.deliveryState });
        if (pending.length === limit) break;
      }
      return pending;
    });
  }

  async countPending(): Promise<number> {
    return this.exclusive(async () => {
      let count = 0;
      for await (const document of this.readEventDocuments()) if (document.deliveryState === "queued") count += 1;
      return count;
    });
  }

  async markAccepted(receipts: CoordinatorReceipt[]): Promise<void> {
    return this.exclusive(async () => {
      for (const receipt of receipts) {
        const document = await this.database.get<StoredEventDocument>("event:" + receipt.eventId);
        this.assertScope(document.event);
        if (document.event.deviceId !== this.identity.deviceId) throw new Error("El recibo corresponde a otro dispositivo.");
        if (document.deliveryState === "accepted") continue;
        await this.database.put<StoredEventDocument>({ ...document, deliveryState: "accepted", acceptedAt: receipt.acceptedAt });
      }
    });
  }

  private async readCheckpoint(): Promise<SyncCheckpoint | null> {
    try { return await this.database.get<SyncCheckpoint>("_local/sync-checkpoint"); }
    catch (error) { if (isMissing(error)) return null; throw error; }
  }

  async loadCheckpoint(): Promise<string | null> {
    return this.exclusive(async () => (await this.readCheckpoint())?.cursor ?? null);
  }

  async applyRemoteChanges(events: SyncedEvent[], cursor: string, expectedCursor: string | null): Promise<void> {
    return this.exclusive(async () => {
      if (!cursor || cursor.length > 8192) throw new Error("El cursor de la página no es válido.");
      const checkpoint = await this.readCheckpoint();
      if ((checkpoint?.cursor ?? null) !== expectedCursor) throw new Error("Otra sincronización modificó el cursor. Volvé a sincronizar.");
      // Validate the full page before writing. Persistence can still fail mid-page.
      for (const { event } of events) this.assertScope(event);
      for (const { event, acceptedAt } of events) {
        const documentId = "event:" + event.eventId;
        let existing: StoredEventDocument | undefined;
        try { existing = await this.database.get<StoredEventDocument>(documentId); }
        catch (error) { if (!isMissing(error)) throw error; }
        if (existing && canonicalJson(existing.event) !== canonicalJson(event)) {
          throw new Error("Conflicto de integridad: el identificador local ya contiene otro evento.");
        }
        if (existing?.deliveryState === "accepted") continue;
        await this.database.put<StoredEventDocument>({
          ...(existing ?? { _id: documentId }), event, deliveryState: "accepted", acceptedAt,
        });
      }
      // Advance only after all writes. Retrying a partial page reuses identical documents.
      await this.database.put<SyncCheckpoint>({ ...(checkpoint ?? { _id: "_local/sync-checkpoint" }), cursor });
    });
  }

  async findSequenceIssues(): Promise<DeviceSequenceIssue[]> {
    return this.exclusive(async () => {
      const sequencesByDevice = new Map<string, number[]>();
      for await (const { event } of this.readEventDocuments()) {
        const sequences = sequencesByDevice.get(event.deviceId) ?? [];
        sequences.push(event.deviceSequence);
        sequencesByDevice.set(event.deviceId, sequences);
      }
      const issues: DeviceSequenceIssue[] = [];
      for (const [deviceId, sequences] of sequencesByDevice) {
        sequences.sort((left, right) => left - right);
        let expected = 1;
        let previous = 0;
        for (const sequence of sequences) {
          if (sequence === previous) issues.push({ deviceId, from: sequence, to: sequence, kind: "duplicate" });
          else if (sequence > expected) issues.push({ deviceId, from: expected, to: sequence - 1, kind: "missing" });
          expected = Math.max(expected, sequence + 1);
          previous = sequence;
        }
      }
      return issues;
    });
  }

  async close(): Promise<void> { await this.database.close(); }
}
