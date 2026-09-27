import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../..", "VITE_");
  const port = Number(env["VITE_CLIENT_PORT"]);
  const host = env["VITE_CLIENT_HOST"]?.trim();
  if (!Number.isSafeInteger(port) || port < 1 || !host) {
    throw new Error("Configurá VITE_CLIENT_PORT y VITE_CLIENT_HOST en el archivo .env local.");
  }

  return {
    envDir: "../..",
    plugins: [react()],
    resolve: { alias: { events: "events/" } },
    server: {
      host,
      port,
      strictPort: true,
    },
  };
});
