export interface ClientConfiguration {
  appName: string;
  appThemeColor: string;
  appBackgroundColor: string;
  syncApiUrl: string;
  localDatabaseName: string;
  tenantId: string;
  branchId: string;
  deviceId: string;
  actorId: string;
  currency: string;
  locale: string;
  syncBatchSize: number;
  localScanPageSize: number;
}

export function parseClientConfiguration(value: unknown): ClientConfiguration {
  if (value === null || typeof value !== "object") {
    throw new Error("La configuración runtime no contiene un objeto válido.");
  }
  const candidate = value as Record<string, unknown>;
  const fields: Array<Exclude<keyof ClientConfiguration, "syncBatchSize" | "localScanPageSize">> = [
    "appName", "appThemeColor", "appBackgroundColor", "syncApiUrl", "localDatabaseName", "tenantId", "branchId", "deviceId", "actorId", "currency", "locale",
  ];
  const missing = fields.filter((field) => typeof candidate[field] !== "string" || !candidate[field].trim());
  if (missing.length > 0) {
    throw new Error(`Faltan valores de configuración: ${missing.join(", ")}.`);
  }

  const syncApiUrl = new URL(candidate["syncApiUrl"] as string);
  if (syncApiUrl.protocol !== "http:" && syncApiUrl.protocol !== "https:") {
    throw new Error("La URL del gateway debe usar HTTP o HTTPS.");
  }
  const themeColor = candidate["appThemeColor"] as string;
  const backgroundColor = candidate["appBackgroundColor"] as string;
  if (!/^#[\da-f]{6}$/i.test(themeColor) || !/^#[\da-f]{6}$/i.test(backgroundColor)) {
    throw new Error("Los colores de la aplicación deben estar en formato hexadecimal #RRGGBB.");
  }
  const syncBatchSize = Number(candidate["syncBatchSize"]);
  if (!Number.isSafeInteger(syncBatchSize) || syncBatchSize < 1) {
    throw new Error("El tamaño de lote de sincronización debe ser un entero positivo.");
  }
  const localScanPageSize = Number(candidate["localScanPageSize"]);
  if (!Number.isSafeInteger(localScanPageSize) || localScanPageSize < 1) {
    throw new Error("El tamaño de página local debe ser un entero positivo.");
  }
  if (!/^[A-Z]{3}$/.test(candidate["currency"] as string)) throw new Error("La moneda debe ser un código ISO de tres letras.");
  try { new Intl.NumberFormat(candidate["locale"] as string); }
  catch { throw new Error("La configuración regional no es válida."); }

  return {
    appName: (candidate["appName"] as string).trim(),
    appThemeColor: themeColor,
    appBackgroundColor: backgroundColor,
    syncApiUrl: syncApiUrl.href.replace(/\/+$/, ""),
    localDatabaseName: (candidate["localDatabaseName"] as string).trim(),
    tenantId: (candidate["tenantId"] as string).trim(),
    branchId: (candidate["branchId"] as string).trim(),
    deviceId: (candidate["deviceId"] as string).trim(),
    actorId: (candidate["actorId"] as string).trim(),
    currency: (candidate["currency"] as string).trim(),
    locale: (candidate["locale"] as string).trim(),
    syncBatchSize,
    localScanPageSize,
  };
}
