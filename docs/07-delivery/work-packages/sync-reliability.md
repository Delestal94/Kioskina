# Paquete — Verificación y recuperación del transporte del spike

- Estado: Implementado; revisiones ejecutadas el 2026-09-27. Pruebas reales con CouchDB y navegadores siguen pendientes.
- Responsable/revisor: implementación por agente; revisión del equipo pendiente.
- Alcance: spike descartable autorizado; no modifica la puerta de producto.
- Referencias: RNF-002, RNF-004, RNF-014, RNF-015, RNF-016; RF-013, RF-056, RF-057; ADR-0001 a ADR-0003.

## Objetivo y alcance

Obtener un transporte que compile y tenga evidencia repetible de paginación, aislamiento, reintento y recuperación después de aplicación parcial. Corregir los defectos encontrados en el scaffold, sin afirmar validación comercial ni las 24 horas offline.

## Criterios de aceptación

1. Cliente, gateway y pruebas compilan con la configuración estricta del repositorio.
2. Un cliente que pide páginas menores que el máximo del gateway puede completar la descarga sin desbordar su lote.
3. No se modifica silenciosamente un sobre entrante; tipos/versiones no soportados se rechazan antes de escribir.
4. Una página malformada, ajena o conflictiva no adelanta el checkpoint. Repetir una página parcialmente aplicada conserva un evento por ID.
5. Una base local no se puede reutilizar inadvertidamente con otro comercio, sucursal, dispositivo o coordinador. Los procesos de sincronización concurrentes no pueden adelantar o retroceder el checkpoint fuera de orden.
6. Errores de contrato, límites, alcance e idempotencia tienen pruebas negativas; las pruebas usan datos sintéticos y secretos efímeros.
7. Build y resultados de pruebas se registran con sus límites; no se confunden dobles de infraestructura con CouchDB o hardware reales.
8. La UI distingue la conexión de red de la disponibilidad del coordinador; el endpoint `/health` sólo responde disponible cuando CouchDB responde para la base configurada.

## Comportamiento

| Aspecto | Cobertura |
|---|---|
| Permisos | Bearer del spike restringido a tenant, sucursal, dispositivo y actor; descarga sólo de su sucursal |
| Auditoría | Códigos y conteos técnicos; sin cuerpos ni tokens en registros |
| Offline | Outbox durable; descarga incremental independiente de secuencia causal |
| Fallos | Reintento idempotente, checkpoint posterior a aplicación; escrituras parciales recuperables |
| Disponibilidad | Sonda periódica con timeout; distingue navegador con red de gateway/CouchDB utilizables; no incluye token |
| Accesibilidad | Estado y errores en texto con región viva; controles accesibles |
| Hardware | Pruebas de persistencia simulada y build; navegador/Android requieren evidencia aparte |
| Privacidad | Sólo fixtures sintéticos; ningún secreto en archivos |

## Diseño y reversión

Puertos de aplicación separados de adaptadores HTTP y PouchDB. Contratos de error y descarga compartidos. La metadata local vincula almacenamiento con identidad y origen remoto; cambios de identidad exigen otra base, sin borrar la anterior. El runner nativo de Node evita agregar un framework de pruebas. IndexedDB simulado, si se incorpora, será dependencia exclusiva de pruebas para inyectar fallos; no sustituye validación en navegador.

## Pruebas y evidencia

`npm run test:sync`: 13 pruebas aprobadas en la suite vigente: intercambio paginado entre nodos, rechazo de alcance, replay tras escritura parcial, rechazo de versión futura, detección de huecos, aislamiento de base local, rechazo de secuencias repetidas/cuerpo excesivo, salud degradada del coordinador, exportación canónica paginada que excluye otros tenants y preserva salida existente/limpia parciales ante documentos inválidos o IDs inconsistentes, validación monetaria sintética, idempotencia de venta local y replicación de venta entre dos nodos. Las pruebas de exportación/venta usan dobles de infraestructura; no se ejecutaron contra CouchDB real. En el entorno Windows de esta ejecución, `os.userInfo()` falla dentro del runtime local de tsx; las pruebas se ejecutaron aprobadas con un ajuste temporal en los dos archivos ignorados de `node_modules/tsx` y ambos se restauraron inmediatamente. `npm run typecheck:client`, `npm run typecheck:gateway`, `npm run typecheck:tests`, `npm run build:gateway` y `npm run build:client` aprobados. El build del cliente ya no externaliza `events` tras añadir el polyfill explícito. `npm audit` conserva dos avisos moderados vinculados al uuid 8.3.2 incluido por PouchDB 9.0.0; uuid directo usa la versión corregida 13.0.1. No se ejecutó el coordinador CouchDB real ni navegador/Android; ventas comerciales, partición de 24 h, backup y restauración permanecen pendientes.

La disponibilidad visible se amplía en esta iteración y queda pendiente de validación en ejecución: el gateway comprueba CouchDB y el cliente consulta `/health` con espera acotada. La prueba de contrato correspondiente es `T-SYNC-008`; el doble de coordinador no sustituye la verificación con CouchDB real.

La interfaz local `http://127.0.0.1:5173/` se recargó y mostró «Coordinador no disponible» al no estar levantados gateway/CouchDB. Esta comprobación confirma el estado de fallo visible en el navegador disponible; no valida Chrome/Edge/Android de la matriz ni la respuesta de un CouchDB real.

## Intento de validación con CouchDB real — 2026-09-27

En el host Windows hay Docker CLI, pero `docker version` no pudo conectar con el daemon (`npipe:////./pipe/docker_engine`, pipe inexistente); tampoco hay ejecutable local `couchdb`. Por lo tanto no se pudo iniciar `infra/compose.yaml` y la validación real continúa pendiente. El `.env` local ya contiene los nombres requeridos, pero no se registran aquí sus valores. El preview del cliente permaneció accesible en `http://127.0.0.1:4173/` (HTTP 200). Repetir el procedimiento de README cuando el daemon Docker esté disponible; no interpretar las pruebas con coordinador en memoria como sustituto.
