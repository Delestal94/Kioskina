import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const requiredFields = {
  appName: "APP_NAME",
  appThemeColor: "APP_THEME_COLOR",
  appBackgroundColor: "APP_BACKGROUND_COLOR",
  syncApiUrl: "CLIENT_SYNC_API_URL",
  localDatabaseName: "CLIENT_LOCAL_DATABASE_NAME",
  tenantId: "CLIENT_TENANT_ID",
  branchId: "CLIENT_BRANCH_ID",
  deviceId: "CLIENT_DEVICE_ID",
  actorId: "CLIENT_ACTOR_ID",
  syncBatchSize: "CLIENT_SYNC_BATCH_SIZE",
  localScanPageSize: "CLIENT_LOCAL_SCAN_PAGE_SIZE",
};

const configuration = {};
const missing = [];
for (const [field, variable] of Object.entries(requiredFields)) {
  const value = process.env[variable]?.trim();
  if (!value) missing.push(variable);
  else configuration[field] = ["syncBatchSize", "localScanPageSize"].includes(field) ? Number(value) : value;
}

if (missing.length > 0) {
  throw new Error(`Completá estas variables en .env antes de iniciar: ${missing.join(", ")}`);
}
for (const field of ["appThemeColor", "appBackgroundColor"]) {
  if (!/^#[\da-f]{6}$/i.test(configuration[field])) {
    throw new Error(`${requiredFields[field]} debe usar el formato hexadecimal #RRGGBB.`);
  }
}

const publicDirectory = process.env.CLIENT_PUBLIC_OUTPUT_DIR
  ? resolve(process.env.CLIENT_PUBLIC_OUTPUT_DIR)
  : fileURLToPath(new URL("../public/", import.meta.url));
await mkdir(publicDirectory, { recursive: true });
await writeFile(resolve(publicDirectory, "runtime-config.json"), `${JSON.stringify(configuration, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });

const manifest = {
  name: configuration.appName,
  short_name: configuration.appName.slice(0, 12),
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: configuration.appBackgroundColor,
  theme_color: configuration.appThemeColor,
  icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
};
await writeFile(resolve(publicDirectory, "manifest.webmanifest"), `${JSON.stringify(manifest, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="${configuration.appThemeColor}"/><path d="M30 57h68v43H30zM25 52l7-22h64l7 22c0 8-10 11-17 4-7 7-14 7-21 0-7 7-14 7-21 0-7 7-19 4-19-4Z" fill="none" stroke="${configuration.appBackgroundColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="7"/><path d="M47 100V77h18v23" fill="none" stroke="${configuration.appBackgroundColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="7"/></svg>`;
await writeFile(resolve(publicDirectory, "icon.svg"), `${icon}\n`, { encoding: "utf8", mode: 0o600 });
