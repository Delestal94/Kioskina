/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_HOST?: string;
  readonly VITE_CLIENT_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
