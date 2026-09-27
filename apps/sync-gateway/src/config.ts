export interface SpikeCredential {
  token: string;
  tenantId: string;
  branchId: string;
  deviceId: string;
  actorId: string;
}

export interface GatewayConfiguration {
  host: string;
  port: number;
  allowedOrigins: string[];
  couchDbUrl: URL;
  couchDbDatabase: string;
  couchDbUsername: string;
  couchDbPassword: string;
  exportPageSize: number;
  credentials: SpikeCredential[];
  maxEventsPerBatch: number;
  maxRequestBytes: number;
}

export type CouchDbConfiguration = Pick<GatewayConfiguration,
  "couchDbUrl" | "couchDbDatabase" | "couchDbUsername" | "couchDbPassword" | "exportPageSize">;

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Falta la variable de entorno requerida: ${name}`);
  return value;
}

function positiveInteger(value: string, name: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new Error(`${name} debe ser un entero positivo.`);
  return parsed;
}

function readCredentials(raw: string): SpikeCredential[] {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("SYNC_CLIENT_CREDENTIALS_JSON debe contener JSON válido.");
  }
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("SYNC_CLIENT_CREDENTIALS_JSON debe contener al menos una credencial de prueba.");
  }

  const credentials = value.map((entry, index): SpikeCredential => {
    if (entry === null || typeof entry !== "object") {
      throw new Error(`La credencial ${index + 1} no es un objeto válido.`);
    }
    const candidate = entry as Record<string, unknown>;
    const fields = ["token", "tenantId", "branchId", "deviceId", "actorId"] as const;
    for (const field of fields) {
      if (typeof candidate[field] !== "string" || candidate[field].trim().length === 0) {
        throw new Error(`La credencial ${index + 1} necesita un valor para ${field}.`);
      }
    }
    const credential: SpikeCredential = {
      token: (candidate["token"] as string).trim(),
      tenantId: (candidate["tenantId"] as string).trim(),
      branchId: (candidate["branchId"] as string).trim(),
      deviceId: (candidate["deviceId"] as string).trim(),
      actorId: (candidate["actorId"] as string).trim(),
    };
    if (credential.token.length < 24) throw new Error("Cada token de prueba debe tener al menos 24 caracteres.");
    return credential;
  });

  if (new Set(credentials.map(({ token }) => token)).size !== credentials.length) {
    throw new Error("Los tokens de prueba deben ser únicos.");
  }
  return credentials;
}

export function readGatewayConfiguration(env: NodeJS.ProcessEnv = process.env): GatewayConfiguration {
  const origins = required(env, "SYNC_ALLOWED_ORIGINS").split(",").map((origin) => origin.trim()).filter(Boolean);
  const rawCredentials = required(env, "SYNC_CLIENT_CREDENTIALS_JSON");
  const couchDbConfiguration = readCouchDbConfiguration(env);

  return {
    ...couchDbConfiguration,
    host: required(env, "SYNC_API_HOST"),
    port: positiveInteger(required(env, "SYNC_API_PORT"), "SYNC_API_PORT"),
    allowedOrigins: origins,
    credentials: readCredentials(rawCredentials),
    maxEventsPerBatch: positiveInteger(required(env, "SYNC_MAX_EVENTS_PER_BATCH"), "SYNC_MAX_EVENTS_PER_BATCH"),
    maxRequestBytes: positiveInteger(required(env, "SYNC_MAX_REQUEST_BYTES"), "SYNC_MAX_REQUEST_BYTES"),
  };
}

export function readCouchDbConfiguration(env: NodeJS.ProcessEnv = process.env): CouchDbConfiguration {
  const couchDbUrl = new URL(required(env, "COUCHDB_URL"));
  if (couchDbUrl.protocol !== "http:" && couchDbUrl.protocol !== "https:") {
    throw new Error("COUCHDB_URL debe usar HTTP o HTTPS.");
  }
  return {
    couchDbUrl,
    couchDbDatabase: required(env, "COUCHDB_DATABASE"),
    couchDbUsername: required(env, "COUCHDB_USERNAME"),
    couchDbPassword: required(env, "COUCHDB_PASSWORD"),
    exportPageSize: positiveInteger(required(env, "SYNC_EXPORT_PAGE_SIZE"), "SYNC_EXPORT_PAGE_SIZE"),
  };
}
