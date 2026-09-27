import { link, open, unlink } from "node:fs/promises";
import type { FileHandle } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { canonicalJson, eventEnvelopeSchema, type EventEnvelope } from "@kioskina/event-contracts";
import { Value } from "@sinclair/typebox/value";
import type { CouchDbConfiguration } from "./config.js";

interface CouchDbEventDocument {
  _id: string;
  event?: unknown;
}

interface CouchDbAllDocsPage {
  rows: Array<{ id: string; doc?: CouchDbEventDocument }>;
}

export class CouchDbEventExporter {
  private readonly databaseUrl: URL;
  private readonly authorization: string;

  constructor(private readonly configuration: CouchDbConfiguration) {
    const root = configuration.couchDbUrl.href.endsWith("/")
      ? configuration.couchDbUrl.href
      : `${configuration.couchDbUrl.href}/`;
    this.databaseUrl = new URL(`${encodeURIComponent(configuration.couchDbDatabase)}/`, root);
    this.authorization = `Basic ${Buffer.from(`${configuration.couchDbUsername}:${configuration.couchDbPassword}`).toString("base64")}`;
  }

  private async *readTenantEvents(tenantId: string): AsyncGenerator<EventEnvelope> {
    let startKey = "event:";
    let skip = 0;
    while (true) {
      const pageUrl = new URL("_all_docs", this.databaseUrl);
      pageUrl.searchParams.set("include_docs", "true");
      pageUrl.searchParams.set("startkey", JSON.stringify(startKey));
      pageUrl.searchParams.set("endkey", JSON.stringify("event:\uffff"));
      pageUrl.searchParams.set("skip", String(skip));
      pageUrl.searchParams.set("limit", String(this.configuration.exportPageSize));

      const response = await fetch(pageUrl, { headers: { authorization: this.authorization } });
      if (!response.ok) throw new Error(`No se pudo leer el coordinador para exportación (HTTP ${response.status}).`);
      const page = await response.json() as CouchDbAllDocsPage;
      if (!Array.isArray(page.rows)) throw new Error("El coordinador devolvió una página de exportación inválida.");
      if (page.rows.length === 0) return;

      for (const row of page.rows) {
        if (row === null || typeof row !== "object" || typeof row.id !== "string") {
          throw new Error("El coordinador devolvió una fila de exportación inválida.");
        }
        const event = row.doc?.event;
        if (event === null || typeof event !== "object" || Array.isArray(event)
          || !Value.Check(eventEnvelopeSchema, event)) {
          throw new Error(`Se encontró un evento inválido en el coordinador (documento ${row.id}).`);
        }
        if (event.tenantId === tenantId) yield event;
      }

      if (page.rows.length < this.configuration.exportPageSize) return;
      startKey = page.rows[page.rows.length - 1]!.id;
      skip = 1;
    }
  }

  async exportTenantEvents(tenantId: string, outputPath: string): Promise<number> {
    if (!tenantId.trim()) throw new Error("Indicá el tenant sintético que se va a exportar.");
    if (!outputPath.trim()) throw new Error("Indicá el archivo de salida.");

    const temporaryPath = `${outputPath}.${randomUUID()}.partial`;
    let file: FileHandle | undefined;
    let outputPublished = false;
    let count = 0;
    try {
      file = await open(temporaryPath, "wx", 0o600);
      for await (const event of this.readTenantEvents(tenantId)) {
        await file.writeFile(`${canonicalJson(event)}\n`, { encoding: "utf8" });
        count += 1;
      }
      await file.sync();
      await file.close();
      file = undefined;
      await link(temporaryPath, outputPath);
      outputPublished = true;
      await unlink(temporaryPath).catch(() => undefined);
      return count;
    } catch (error) {
      if (file) await file.close().catch(() => undefined);
      await unlink(temporaryPath).catch(() => undefined);
      if (outputPublished) await unlink(outputPath).catch(() => undefined);
      throw error;
    }
  }
}
