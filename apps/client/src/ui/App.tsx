import { useEffect, useMemo, useState } from "react";
import { v7 as uuidv7 } from "uuid";
import { synchronizePendingEvents } from "@kioskina/application";
import { PouchLocalEventStore } from "@kioskina/local-store";
import type { ClientConfiguration } from "../config";
import { HttpEventSyncClient } from "../infrastructure/HttpEventSyncClient";

type ConnectionState = "online" | "offline";

export function App({ config }: { config: ClientConfiguration }) {
  const store = useMemo(
    () => new PouchLocalEventStore({
      databaseName: config.localDatabaseName, scanPageSize: config.localScanPageSize,
      tenantId: config.tenantId, branchId: config.branchId, deviceId: config.deviceId, syncEndpoint: config.syncApiUrl,
    }),
    [config],
  );
  const [connection, setConnection] = useState<ConnectionState>(navigator.onLine ? "online" : "offline");
  const [pendingCount, setPendingCount] = useState(0);
  const [observation, setObservation] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (config) document.title = config.appName;
  }, [config]);

  useEffect(() => {
    const update = () => setConnection(navigator.onLine ? "online" : "offline");
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    if (!store) return;
    let active = true;
    const refresh = async () => {
      try {
        const count = await store.countPending();
        if (active) setPendingCount(count);
      } catch {
        if (active) setMessage("No se pudo consultar el almacenamiento local.");
      }
    };
    void refresh();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [store]);

  if (!store) return null;

  const saveObservation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!observation.trim()) return;
    setIsSaving(true);
    setMessage("");
    try {
      await store.appendObservation({
        eventId: uuidv7(),
        tenantId: config.tenantId,
        branchId: config.branchId,
        deviceId: config.deviceId,
        actorId: config.actorId,
        observation: observation.trim(),
      });
      setObservation("");
      setPendingCount(await store.countPending());
      setMessage("Evento guardado en este dispositivo.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el evento.");
    } finally {
      setIsSaving(false);
    }
  };

  const synchronize = async () => {
    if (!accessToken.trim()) {
      setMessage("Ingresá el token temporal de sincronización para esta sesión.");
      return;
    }
    setIsSyncing(true);
    setMessage("");
    try {
      const result = await synchronizePendingEvents(
        store,
        new HttpEventSyncClient(config.syncApiUrl, () => accessToken.trim()),
        config.syncBatchSize,
      );
      setPendingCount(await store.countPending());
      const message = `${result.acceptedCount} enviados y ${result.receivedCount} recibidos.`;
      const gapMessage = result.sequenceIssues.length > 0
        ? ` Hay ${result.sequenceIssues.length} anomalía(s) de secuencia; la convergencia no está confirmada.`
        : "";
      setMessage(`${message}${gapMessage}${result.hasMore ? " Hay más cambios; volvé a sincronizar." : ""}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo sincronizar.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label={`${config.appName}, inicio`}>
          <span className="brand-mark" aria-hidden="true">{config.appName.charAt(0).toLocaleUpperCase()}</span>
          <span>{config.appName}</span>
        </a>
        <div className={`connection-pill connection-pill--${connection}`} role="status">
          <span className="connection-dot" aria-hidden="true" />
          {connection === "online" ? "Con conexión" : "Sin conexión"}
        </div>
      </header>

      <section className="page-heading" id="inicio">
        <p className="eyebrow">Espacio de trabajo</p>
        <h1>Estado del dispositivo</h1>
        <p className="muted">Actividad local y sincronización.</p>
      </section>

      <section className="status-grid" aria-label="Estado del dispositivo">
        <article className="status-card">
          <span className="status-label">Eventos pendientes</span>
          <strong className="status-value">{pendingCount}</strong>
          <span className="status-caption">Guardados en este dispositivo</span>
        </article>
        <article className="status-card">
          <span className="status-label">Sucursal</span>
          <strong className="status-id">{config.branchId}</strong>
          <span className="status-caption">Configurada para este dispositivo</span>
        </article>
        <article className="status-card">
          <span className="status-label">Dispositivo</span>
          <strong className="status-id">{config.deviceId}</strong>
          <span className="status-caption">Identificador configurado</span>
        </article>
      </section>

      <div className="work-grid">
        <section className="panel" aria-labelledby="observation-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Almacenamiento local</p>
              <h2 id="observation-title">Registrar nota de prueba</h2>
            </div>
          </div>
          <p className="muted">Este texto se guarda localmente como dato de prueba. No ingreses nombres, ventas reales ni información personal.</p>
          <form onSubmit={saveObservation}>
            <label htmlFor="observation">Nota de prueba</label>
            <textarea
              id="observation"
              value={observation}
              onChange={(event) => setObservation(event.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Escribí una observación sintética"
              required
            />
            <button className="button button--primary" disabled={isSaving || !observation.trim()} type="submit">
              {isSaving ? "Guardando…" : "Guardar en este dispositivo"}
            </button>
          </form>
        </section>

        <section className="panel" aria-labelledby="sync-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Sincronización</p>
              <h2 id="sync-title">Pendientes por enviar</h2>
            </div>
          </div>
          <p className="muted">El token se conserva sólo en memoria durante esta sesión y nunca se incluye en el bundle.</p>
          <label htmlFor="sync-token">Token temporal del spike</label>
          <input
            id="sync-token"
            type="password"
            autoComplete="off"
            value={accessToken}
            onChange={(event) => setAccessToken(event.target.value)}
            placeholder="Pegá el token temporal"
          />
          <button className="button button--secondary" disabled={isSyncing || connection === "offline"} onClick={() => void synchronize()} type="button">
            {isSyncing ? "Sincronizando…" : "Sincronizar ahora"}
          </button>
        </section>
      </div>

      <div className="live-message" aria-live="polite">{message}</div>
      <footer className="app-footer">
        <span>Almacenamiento local activo</span>
        <span>Identificadores técnicos fuera de la vista cotidiana.</span>
      </footer>
    </main>
  );
}
