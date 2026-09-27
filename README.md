# Kioskina

Plataforma de gestión para kioscos, drugstores y maxikioscos, concebida para abarcar desde un único comercio pequeño hasta organizaciones con múltiples sucursales.

## Estado

La línea base de producto todavía no fue aprobada. Está en curso un spike técnico descartable para reducir riesgos de la arquitectura local-first; no debe tratarse como producto ni como validación de producción.

## Cómo continuar

1. Leer el estado y el orden documental de `docs/README.md`.
2. Completar el spike descrito en `docs/07-delivery/work-packages/spike-arquitectura-local-first.md`.
3. Revisar ADR, dependencias, recuperación y compatibilidad.
4. Resolver los bloqueantes del piloto y aprobar la línea base antes de iniciar el producto.

## Estructura técnica del spike

- `apps/client`: interfaz web con configuración de runtime externa.
- `apps/sync-gateway`: API de sincronización; credenciales exclusivamente locales/de prueba.
- `packages/event-contracts`: contratos versionados compartidos.
- `packages/application`: casos de uso y puertos sin dependencias de UI ni persistencia concreta.
- `packages/spike-domain`: tipos y reglas descartables del spike.
- `packages/local-store`: almacenamiento local y outbox candidata.
- `infra`: entorno local parametrizado para el coordinador candidato.

Los identificadores de comercio, sucursal, dispositivo y actor no se fijan en el código. Completá `.env` a partir de `.env.example` con valores sintéticos locales. Nunca se deben agregar secretos al repositorio.

## Inicio local del spike

1. Copiá `.env.example` como `.env` y completá los identificadores sintéticos, la contraseña local de CouchDB y una credencial temporal de spike.
2. Iniciá el coordinador local: `docker compose --env-file .env -f infra/compose.yaml up -d`.
3. En una terminal, ejecutá `npm run dev:gateway`.
4. En otra terminal, ejecutá `npm run dev:client`.

La sincronización de prueba requiere que el token del cliente coincida con el token y el alcance configurados en `SYNC_CLIENT_CREDENTIALS_JSON`. Estas instrucciones son para desarrollo local y aún no se validaron mediante una ejecución completa. El shell offline debe evaluarse con el build instalable; Vite en modo desarrollo no forma parte de la garantía offline.

### Build instalable para revisión interna

`npm run build:client` genera el build web de este spike con la configuración pública indicada en `.env`. Para revisarlo localmente, ejecutá `npm run preview:client`; el host y puerto provienen de `VITE_CLIENT_HOST` y `VITE_CLIENT_PREVIEW_PORT`. Es una vista previa local del prototipo, no una release del POS ni un servidor de producción.

Para el spike se puede exportar desde el coordinador un tenant sintético a un archivo NDJSON nuevo con `npm run export:events --workspace @kioskina/sync-gateway -- <tenant-sintético> <archivo.ndjson>`. Guardá el archivo fuera del repositorio en un directorio restringido. Es una herramienta técnica local, no un flujo de exportación para el dueño. Detené el gateway y cualquier escritor antes de exportar; el proceso de soporte y autorización de RF-052 sigue pendiente.

### Validación continua

`.github/workflows/ci.yml` corre en cada push a `main`, pull request y ejecución manual. Usa Node de `.nvmrc`, instala desde el lockfile y ejecuta chequeos de tipos y builds. El job usa una identidad local `*-ci`, permisos de lectura y no despliega. No ejecuta pruebas de comportamiento. Un resultado verde no equivale a validar CouchDB real, navegadores Windows/Android ni una release del POS; el alcance está en `docs/07-delivery/work-packages/continuous-integration-spike.md`.

Toda persona o agente de IA debe comenzar leyendo `AGENTS.md` y `docs/README.md`.
