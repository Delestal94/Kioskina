# ADR-0002 — Stack tecnológico candidato del piloto

- Estado: **Propuesto; spike de scaffold en curso, aceptación aún condicionada a pruebas y revisión de dependencias**
- Fecha: 2026-09-20
- Requisitos: RF-013, RF-044 a RF-057, RF-060, RF-065; RNF-002 a RNF-015

## Contexto

El producto debe ser una PWA táctil para Chrome/Edge en Windows/Android, operar 24 horas sin Internet en dos cajas independientes y no depender inicialmente de licencias pagas. El equipo es pequeño y el principal riesgo técnico es sincronización, no renderizado de interfaz.

## Decisión candidata

- Lenguaje común: TypeScript con modo estricto.
- Repositorio: monorepo con paquetes separados para dominio, aplicación, UI, contratos, persistencia y pruebas.
- Cliente: React con Vite y manifiesto/Service Worker PWA.
- El scaffold genera manifiesto/identidad visual desde variables y usa un Service Worker pequeño para cachear sólo el shell y recursos estáticos; evita una dependencia adicional en este spike. El plugin oficial de Vite PWA queda como alternativa si la estrategia manual no cubre actualización, precache o accesibilidad operativa.
- Base local del spike: PouchDB 9 usando IndexedDB.
- Coordinación del spike: Apache CouchDB 3.5 detrás de un gateway propio; nunca acceso público irrestricto desde la PWA.
- Backend/gateway: Node.js LTS con Fastify y validación de contratos mediante JSON Schema.
- Pruebas: runner unitario compatible con Vite, Playwright para navegador/E2E y pruebas de contratos/propiedades para eventos.
- Contenedores: imágenes fijadas por digest para entornos de desarrollo, prueba y coordinador.
- Observabilidad: logs estructurados con IDs de correlación, métricas técnicas y sin datos personales por defecto.

Todos los componentes indicados deben superar una revisión de licencia, mantenimiento, vulnerabilidades y compatibilidad antes de quedar aprobados. PouchDB y CouchDB declaran Apache License 2.0; esta revisión no sustituye asesoramiento legal.

### Versiones fijadas para el scaffold del spike

El `package-lock.json` fija el árbol del prototipo. Las versiones directas actuales son Node.js 24, npm 11, React/React DOM 19.3.0, Vite 8.3.0, TypeScript 7.0.2, Fastify 5.12.5, PouchDB 9.0.0 y CouchDB 3.5.2. Esta fijación hace reproducible el scaffold y no constituye aprobación de producción; mantenimiento, licencias, advisories y compatibilidad deben revisarse antes de adoptar el stack.

## Motivos

- TypeScript reduce el cambio de contexto y permite compartir contratos sin compartir responsabilidades.
- PouchDB implementa el protocolo de replicación de CouchDB y conserva conflictos para resolución explícita.
- CouchDB ofrece checkpoints y replicación incremental, evitando construir el transporte distribuido completo antes de validar el negocio.
- El gateway permite aplicar aislamiento, revocación, validación de eventos y límites de cuota que no deben confiarse al cliente.
- La abstracción de repositorios evita que el dominio dependa de PouchDB/CouchDB si el spike falla.

## Alternativas consideradas

- **RxDB + backend propio:** buena experiencia TypeScript, pero plugins/capacidades comerciales y límites de edición añaden costo y dependencia no aceptados para este punto.
- **Dexie/IndexedDB + protocolo propio:** máximo control, pero obliga al equipo a construir checkpoints, reintentos, tombstones, conflictos y migraciones críticas desde cero.
- **PowerSync/Electric:** candidatas futuras; necesitan validar PWA, escritura, self-hosting, licencia y resolución de conflictos con la versión vigente.
- **Aplicación nativa/desktop:** acceso local más controlable, pero duplica plataformas y contradice la elección web instalable del piloto.
- **Cloud online con PostgreSQL:** simplifica consistencia central, pero no cumple las 24 horas offline.

## Consecuencias

Positivas:

- Costo de licencia inicial nulo para el candidato.
- Prototipo rápido del riesgo más difícil con replicación existente.
- Misma base de código de cliente para equipos y tamaños soportados.

Negativas:

- Modelo documental y consultas/reportes menos naturales que en un SQL relacional.
- CouchDB no resuelve reglas comerciales: elegir un ganador técnico no equivale a resolver un precio.
- PouchDB figura en incubación Apache; debe existir criterio de salida.
- La PWA depende de políticas de almacenamiento del navegador y no puede ser la única copia duradera.
- En el scaffold, la auditoría del 2026-09-27 señaló una corrección de límites de buffer en uuid (GHSA-w5hq-g745-h8pq). uuid directo se actualizó a 13.0.1. PouchDB 9.0.0 aún depende de uuid 8.3.2; su bundle fuente sólo importa `v4`, no las funciones afectadas `v3/v5/v6`, pero `npm audit` conserva un aviso moderado transitivo. La solución automática propone bajar PouchDB a 6.3.2 con cambio mayor, por lo que no se aplicó. Evaluar actualización upstream o un override compatible, con pruebas, antes de aprobar producción.
- El build de Vite 8.3.0 del 2026-09-27 externalizó el módulo Node `events` importado por PouchDB, aunque éste crea `new EventEmitter()` al inicializar. Se añadió el polyfill browser `events` 3.3.0 con alias explícito para evitar que el bundle reciba un módulo vacío. El build debe confirmar que desaparece esa externalización; la prueba de navegador y persistencia real sigue pendiente.

## Criterios de aceptación del spike

Además de ADR-0001:

1. Ejecutar Chrome y Edge en versiones soportadas sobre al menos un equipo Windows y un dispositivo Android representativos.
2. Confirmar atomicidad local de venta y recuperación tras cierre forzado en cada punto de fallo inyectado.
3. Replicar 1.000 ventas/2.000 productos, desconectar 24 horas simuladas y converger sin pérdida ni duplicación.
4. Demostrar aislamiento entre dos comercios a través del gateway.
5. Detectar y resolver precio concurrente conservando ambas versiones y ventas históricas.
6. Medir espacio, tiempo de arranque, búsqueda, venta, sincronización y reconstrucción de proyecciones.
7. Migrar un esquema con datos pendientes y revertir una versión incompatible.
8. Exportar todos los eventos a un formato independiente del motor.

## Estrategia de salida

Si falla durabilidad, rendimiento, seguridad, mantenimiento o complejidad, conservar el modelo de eventos/contratos y reemplazar adaptadores. La siguiente opción a medir será un repositorio IndexedDB controlado con API/outbox propia sobre backend relacional, o una plataforma local-first que cumpla costo/licencia.

## Fuentes técnicas

- [PouchDB — replicación](https://pouchdb.com/guides/replication.html)
- [PouchDB — conflictos](https://pouchdb.com/guides/conflicts.html)
- [Apache CouchDB — replicación y conflictos](https://docs.couchdb.org/en/stable/replication/conflicts.html)
- [Licencia de PouchDB](https://github.com/apache/pouchdb/blob/master/LICENSE)
- [Licencia de CouchDB](https://github.com/apache/couchdb/blob/main/LICENSE)
