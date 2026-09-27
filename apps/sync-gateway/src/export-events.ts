import { resolve } from "node:path";
import { CouchDbEventExporter } from "./couchdb-event-exporter.js";
import { readCouchDbConfiguration } from "./config.js";

const [tenantId, outputPath, ...extraArguments] = process.argv.slice(2);
if (!tenantId || !outputPath || extraArguments.length > 0) {
  throw new Error("Uso: npm run export:events -- <tenant-sintético> <archivo.ndjson>");
}

const configuration = readCouchDbConfiguration();
const exporter = new CouchDbEventExporter(configuration);
const exportedCount = await exporter.exportTenantEvents(tenantId, resolve(outputPath));
process.stdout.write(`${exportedCount} eventos exportados en formato NDJSON.\n`);
