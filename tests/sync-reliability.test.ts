import "fake-indexeddb/auto";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import { after, test } from "node:test";

if (!("self" in globalThis)) Object.defineProperty(globalThis, "self", { value: globalThis });
const { default: PouchDB } = await import("pouchdb-browser");
const { PouchLocalEventStore } = await import("../packages/local-store/src/index.ts");
const { synchronizePendingEvents } = await import("../packages/application/src/index.ts");
const { createSpikeObservation } = await import("../packages/spike-domain/src/index.ts");
const { createGateway } = await import("../apps/sync-gateway/src/server.ts");
const { HttpEventSyncClient } = await import("../apps/client/src/infrastructure/HttpEventSyncClient.ts");
const databases: Array<InstanceType<typeof PouchDB>> = [];
const lockTails = new Map<string, Promise<void>>();
const TOKEN = "synthetic-spike-token-000000000001";
const tenantId = "tenant-synthetic";
const branchId = "branch-synthetic";

function config(deviceId: string, databaseName = "test-" + randomUUID()) {
  return { databaseName, scanPageSize: 2, tenantId, branchId, deviceId, syncEndpoint: "http://gateway.invalid" };
}
function newStore(deviceId: string, name?: string, db?: InstanceType<typeof PouchDB>) {
  const database = db ?? new PouchDB(name ?? "test-" + randomUUID());
  databases.push(database);
  const locks = {
    async run<T>(name: string, operation: () => Promise<T>) {
      const previous = lockTails.get(name) ?? Promise.resolve();
      let release!: () => void;
      const current = new Promise<void>((resolve) => { release = resolve; });
      lockTails.set(name, current);
      await previous;
      try { return await operation(); }
      finally {
        release();
        if (lockTails.get(name) === current) lockTails.delete(name);
      }
    },
  };
  return new PouchLocalEventStore(config(deviceId, name), locks, database);
}
function observation(deviceId: string, sequence: number, id: string = randomUUID()) {
  return createSpikeObservation({
    eventId: id, tenantId, branchId, deviceId, actorId: "actor-synthetic",
    deviceSequence: sequence, observation: "dato sintético",
    occurredAt: new Date(Date.UTC(2026, 0, 1, 0, 0, sequence)).toISOString(),
  });
}
class MemoryCoordinator {
  readonly events = new Map<string, { event: ReturnType<typeof observation>; acceptedAt: string }>();
  async accept(event: ReturnType<typeof observation>) {
    const current = this.events.get(event.eventId);
    if (current && JSON.stringify(current.event) !== JSON.stringify(event)) throw new Error("idempotency conflict");
    const acceptedAt = current?.acceptedAt ?? new Date().toISOString();
    this.events.set(event.eventId, { event, acceptedAt });
    return { eventId: event.eventId, acceptedAt, duplicate: !!current };
  }
  async pull(tenant: string, branch: string, cursor: string | undefined, limit: number) {
    const offset = cursor ? Number(cursor) : 0;
    const eligible = [...this.events.values()].filter(({ event }) => event.tenantId === tenant && event.branchId === branch);
    const page = eligible.slice(offset, offset + limit);
    return { events: page, cursor: String(offset + page.length), hasMore: offset + page.length < eligible.length };
  }
}
function gatewayConfiguration(maxEventsPerBatch = 10, maxRequestBytes = 2_000_000) {
  return {
    host: "127.0.0.1", port: 3001, allowedOrigins: ["http://localhost:5173"],
    couchDbUrl: new URL("http://127.0.0.1:5984"), couchDbDatabase: "synthetic",
    couchDbUsername: "synthetic", couchDbPassword: "synthetic",
    exportPageSize: 10, maxEventsPerBatch, maxRequestBytes,
    credentials: [{ token: TOKEN, tenantId, branchId, deviceId: "device-a", actorId: "actor-synthetic" }],
  };
}
async function withGateway(coordinator: MemoryCoordinator, configOverride: ReturnType<typeof gatewayConfiguration>, run: (fetcher: typeof fetch) => Promise<void>) {
  const app = await createGateway(configOverride, coordinator, false);
  const fetcher: typeof fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const result = await app.inject({
      method: init?.method === "POST" ? "POST" : "GET",
      url: url.pathname + url.search,
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
      ...(typeof init?.body === "string" ? { payload: init.body } : {}),
    });
    return new Response(result.body, { status: result.statusCode });
  };
  try { await run(fetcher); } finally { await app.close(); }
}

after(async () => {
  await Promise.all(databases.map(async (database) => {
    try { await database.destroy(); } catch { /* The database can already be closed by a scenario. */ }
  }));
});

test("dos nodos intercambian eventos en páginas menores que el máximo del gateway", async () => {
  const coordinator = new MemoryCoordinator();
  const databaseA = new PouchDB<{}>("node-a-" + randomUUID());
  const databaseB = new PouchDB<{}>("node-b-" + randomUUID());
  databases.push(databaseA, databaseB);
  const storeA = newStore("device-a", undefined, databaseA);
  const storeB = newStore("device-b", undefined, databaseB);
  for (let index = 0; index < 13; index += 1) {
    await storeA.appendObservation({
      eventId: "event-a-" + String(index).padStart(2, "0"), tenantId, branchId,
      deviceId: "device-a", actorId: "actor-synthetic", observation: "venta sintética " + index,
    });
  }
  await withGateway(coordinator, gatewayConfiguration(10), async (fetcher) => {
    const clientA = new HttpEventSyncClient("http://gateway.invalid", () => TOKEN, fetcher);
    const clientB = new HttpEventSyncClient("http://gateway.invalid", () => TOKEN, fetcher);
    let result = await synchronizePendingEvents(storeA, clientA, 4);
    assert.equal(result.acceptedCount, 4);
    assert.equal(result.receivedCount, 4);
    assert.equal(await storeA.countPending(), 9);
    while (result.hasMore) result = await synchronizePendingEvents(storeA, clientA, 4);
    assert.equal(await storeA.countPending(), 0);
    const firstConcurrentPage = await Promise.all([
      synchronizePendingEvents(storeB, clientB, 4),
      synchronizePendingEvents(storeB, clientB, 4),
    ]);
    assert.deepEqual(firstConcurrentPage.map(({ receivedCount }) => receivedCount), [4, 4]);
    result = firstConcurrentPage[1]!;
    while (result.hasMore) result = await synchronizePendingEvents(storeB, clientB, 4);
    assert.equal((await storeB.findSequenceIssues()).length, 0);
    assert.equal(coordinator.events.size, 13);
    const remote = await databaseB.allDocs({ startkey: "event:", endkey: "event:\uffff" });
    assert.equal(remote.rows.length, 13);
  });
});

test("un evento remoto de otro alcance no modifica eventos ni checkpoint", async () => {
  const store = newStore("device-b");
  const invalid = { ...observation("device-x", 1, "foreign-event"), branchId: "branch-other" };
  await assert.rejects(
    store.applyRemoteChanges([{ event: invalid, acceptedAt: new Date().toISOString() }], "cursor-1", null),
    /no pertenece/,
  );
  assert.equal(await store.loadCheckpoint(), null);
});

test("si falla una escritura intermedia, reintentar aplica la página y avanza el cursor", async () => {
  const database = new PouchDB<{}>("fault-" + randomUUID());
  databases.push(database);
  const store = newStore("device-b", undefined, database);
  const first = observation("device-a", 1, "remote-one");
  const second = observation("device-a", 2, "remote-two");
  const realPut = database.put.bind(database);
  let shouldFail = true;
  database.put = ((document: { _id?: string }) => {
    if (document._id === "event:remote-two" && shouldFail) {
      shouldFail = false;
      return Promise.reject(new Error("fallo inyectado"));
    }
    return realPut(document);
  }) as typeof database.put;
  const page = [first, second].map((event) => ({ event, acceptedAt: new Date().toISOString() }));
  await assert.rejects(store.applyRemoteChanges(page, "cursor-1", null), /fallo inyectado/);
  assert.equal(await store.loadCheckpoint(), null);
  assert.ok(await database.get("event:remote-one"));
  await store.applyRemoteChanges(page, "cursor-1", null);
  assert.equal(await store.loadCheckpoint(), "cursor-1");
  assert.ok(await database.get("event:remote-two"));
  await assert.rejects(store.applyRemoteChanges(page, "stale-cursor", null), /modificó el cursor/);
  assert.equal(await store.loadCheckpoint(), "cursor-1");
});

test("un evento futuro no soportado no escribe ni adelanta el checkpoint", async () => {
  const store = newStore("device-b");
  const future = { ...observation("device-a", 1, "future-event"), schemaVersion: 2 };
  await assert.rejects(store.applyRemoteChanges([{ event: future, acceptedAt: new Date().toISOString() }], "cursor-future", null), /no está soportado/);
  assert.equal(await store.loadCheckpoint(), null);
  assert.equal(await store.listPending(1).then((items) => items.length), 0);
});

test("los huecos de secuencia se señalan y se limpian cuando llega el evento faltante", async () => {
  const store = newStore("device-b");
  const first = observation("device-a", 1, "sequence-one");
  const third = observation("device-a", 3, "sequence-three");
  await store.applyRemoteChanges([first, third].map((event) => ({ event, acceptedAt: new Date().toISOString() })), "cursor-three", null);
  assert.deepEqual(await store.findSequenceIssues(), [{ deviceId: "device-a", from: 2, to: 2, kind: "missing" }]);
  const second = observation("device-a", 2, "sequence-two");
  await store.applyRemoteChanges([{ event: second, acceptedAt: new Date().toISOString() }], "cursor-two", "cursor-three");
  assert.deepEqual(await store.findSequenceIssues(), []);
});

test("una base con datos no se reasigna a otro comercio o dispositivo", async () => {
  const databaseName = "identity-" + randomUUID();
  const original = newStore("device-a", databaseName);
  await original.appendObservation({
    eventId: "identity-event", tenantId, branchId, deviceId: "device-a", actorId: "actor-synthetic", observation: "sintético",
  });
  const other = new PouchLocalEventStore({ ...config("device-b", databaseName) }, {
    async run<T>(_name: string, operation: () => Promise<T>) { return operation(); },
  });
  await assert.rejects(other.countPending(), /pertenece a otro dispositivo/);
});

test("el gateway limita el lote, el cuerpo y rechaza secuencias duplicadas sin escritura parcial", async () => {
  const coordinator = new MemoryCoordinator();
  const event = observation("device-a", 1, "valid-event");
  await withGateway(coordinator, gatewayConfiguration(3, 2_000), async (fetcher) => {
    const response = await fetcher("http://gateway.invalid/v1/events", {
      method: "POST", headers: { authorization: "Bearer " + TOKEN, "content-type": "application/json" },
      body: JSON.stringify({ events: [event] }),
    });
    assert.equal(response.status, 200);
  });
  assert.equal(coordinator.events.size, 1);
  await withGateway(coordinator, gatewayConfiguration(3, 2_000), async (fetcher) => {
    const repeated = observation("device-a", 2, "second-event");
    const response = await fetcher("http://gateway.invalid/v1/events", {
      method: "POST", headers: { authorization: "Bearer " + TOKEN, "content-type": "application/json" },
      body: JSON.stringify({ events: [repeated, { ...observation("device-a", 2, "another-id"), eventId: "another-id", aggregateId: "another-id", idempotencyKey: "another-id", causationId: "another-id", correlationId: "another-id" }] }),
    });
    assert.equal(response.status, 400);
  });
  await withGateway(coordinator, gatewayConfiguration(2, 200), async (fetcher) => {
    const oversized = await fetcher("http://gateway.invalid/v1/events", {
      method: "POST", headers: { authorization: "Bearer " + TOKEN, "content-type": "application/json" },
      body: JSON.stringify({ events: [event] }),
    });
    assert.equal(oversized.status, 413);
  });
  assert.equal(coordinator.events.size, 1);
});
