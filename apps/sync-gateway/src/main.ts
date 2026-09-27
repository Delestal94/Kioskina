import { readGatewayConfiguration } from "./config.js";
import { CouchDbEventStore } from "./couchdb-event-store.js";
import { createGateway } from "./server.js";

const configuration = readGatewayConfiguration();
const eventStore = new CouchDbEventStore(configuration);
await eventStore.ensureDatabase();
const app = await createGateway(configuration, eventStore);

try {
  await app.listen({ host: configuration.host, port: configuration.port });
} catch (error) {
  app.log.error(error, "No se pudo iniciar el gateway del spike");
  process.exitCode = 1;
  await app.close();
}
