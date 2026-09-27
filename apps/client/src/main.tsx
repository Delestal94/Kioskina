import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./ui/App";
import { parseClientConfiguration } from "./config";
import "./ui/styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento raíz de la aplicación.");
}

const root = createRoot(rootElement);

async function bootstrap(): Promise<void> {
  const response = await fetch("/runtime-config.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`No se pudo leer la configuración runtime (HTTP ${response.status}).`);
  const config = parseClientConfiguration(await response.json() as unknown);
  document.title = config.appName;
  document.documentElement.style.setProperty("--color-accent", config.appThemeColor);
  document.documentElement.style.setProperty("--color-canvas", config.appBackgroundColor);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", config.appThemeColor);
  root.render(<App config={config} />);
  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // A failed offline-shell registration must not prevent the current session from working.
      console.warn("No se pudo habilitar el shell offline.");
    });
  }
}

void bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "No se pudo iniciar la aplicación.";
  root.render(
    <main className="setup-shell">
      <section className="setup-card" aria-labelledby="setup-title">
        <p className="eyebrow">Configuración local</p>
        <h1 id="setup-title">No se pudo iniciar</h1>
        <p className="muted">{message}</p>
        <p className="quiet-note">Revisá las variables locales del dispositivo. No ingreses información personal real en este spike.</p>
      </section>
    </main>,
  );
});
