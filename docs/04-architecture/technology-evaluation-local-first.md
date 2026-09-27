# Evaluación tecnológica inicial — local-first web

- Estado: **Investigación cerrada para selección de spike; producción no aprobada**
- Fecha: 2026-09-20
- ADR relacionado: ADR-0001

## Capacidades base de navegador

Una PWA puede almacenar interfaz/recursos con Service Worker y datos estructurados con IndexedDB. Esto permite operación offline, pero el navegador puede detener procesos en segundo plano y la sincronización prolongada no debe depender exclusivamente de Background Sync.

El almacenamiento es `best-effort` por defecto. La aplicación puede solicitar persistencia con `navigator.storage.persist()`, pero el navegador decide si la concede. El usuario también puede borrar los datos. Por ello, IndexedDB no puede ser la única copia a largo plazo de operaciones comerciales.

Fuentes:

- [MDN — PWA offline y operación en segundo plano](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
- [MDN — cuotas y desalojo de almacenamiento](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [MDN — solicitud de almacenamiento persistente](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist)
- [MDN — limitaciones de IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Terminology)

## Candidato A — RxDB con replicación HTTP y backend propio

RxDB ofrece base local reactiva, operación offline y motor de replicación reanudable contra un backend propio. Su núcleo abierto incluye replicación, mientras que algunas opciones de almacenamiento, cifrado y rendimiento son comerciales.

- Ajuste al caso: alto para PWA TypeScript y coordinador propio.
- Ventajas: protocolo y conflictos ya modelados, migraciones, reactividad, varias opciones de almacenamiento.
- Riesgos: licencia/costo de plugins de producción, límite del plan abierto, tamaño y dependencia del proveedor; las invariantes de caja/stock siguen siendo responsabilidad de Kioskina.
- Prueba necesaria: 2.000 artículos, al menos 1.000 ventas, 24 horas offline, migración de esquema y conflicto de precio.

Fuentes:

- [RxDB — motor de replicación local-first](https://rxdb.info/replication.html)
- [RxDB — replicación HTTP](https://rxdb.info/replication-http.html)
- [RxDB — ediciones y licencias](https://rxdb.info/premium/)

## Candidato B — IndexedDB/Dexie y protocolo de eventos propio

Construir una base local sobre IndexedDB —posiblemente mediante Dexie— y una cola/outbox propia hacia un backend relacional.

- Ajuste al caso: técnicamente posible y sin dependencia de motor de sync comercial.
- Ventajas: control total de eventos, auditoría, conflictos y modelo de negocio.
- Riesgos: sincronización, migraciones, reintentos, tombstones, checkpoints, cifrado y recuperación recaen totalmente en el equipo; alto riesgo de errores silenciosos.
- Uso recomendado: referencia/prototipo mínimo, no elección automática de producción.

## Candidato C — plataforma de sincronización local-first

Servicios como PowerSync o ElectricSQL ofrecen almacenamiento local y sincronización con backend central. Pueden reducir trabajo, pero introducen restricciones de base de datos, write path, despliegue y licencia. La documentación encontrada de Electric incluye material legado y evolución activa; no se recomienda decidir sin un spike con versiones actuales. PowerSync declara SDK con SQLite local y opción de autoalojamiento, pero deben validarse específicamente PWA, almacenamiento web, conflictos y costo.

Fuentes iniciales:

- [PowerSync — arquitectura general](https://powersync.com/)
- [ElectricSQL — documentación](https://electric-sql.com/docs)

## Candidato D — PouchDB y Apache CouchDB

PouchDB mantiene una base local en navegador y replica con CouchDB mediante un protocolo HTTP incremental. Ambos conservan las revisiones conflictivas y el código declara Apache License 2.0. El motor elige un ganador técnico determinista, pero Kioskina debe detectar el conflicto y aplicar su propia regla comercial.

- Ajuste al caso: alto para probar dos PWA autónomas sin licencias pagas.
- Ventajas: replicación bidireccional existente, checkpoints, tolerancia a reconexión, conflictos inspeccionables y exportación JSON.
- Riesgos: PouchDB está en incubación Apache; modelo documental; seguridad multi-tenant si se expone CouchDB; consultas/reportes complejos; dependencia de IndexedDB.
- Restricción: usar gateway propio y encapsular el adaptador. No exponer CouchDB directamente ni tratar su revisión ganadora como decisión de precio.

Fuentes:

- [PouchDB — replicación](https://pouchdb.com/guides/replication.html)
- [PouchDB — conflictos](https://pouchdb.com/guides/conflicts.html)
- [Apache CouchDB — modelo de replicación y conflictos](https://docs.couchdb.org/en/stable/replication/conflicts.html)
- [Apache CouchDB — protocolo de replicación](https://docs.couchdb.org/en/stable/replication/protocol.html)
- [PouchDB — licencia Apache 2.0](https://github.com/apache/pouchdb/blob/master/LICENSE)

## Recomendación de evaluación

Usar PouchDB/CouchDB como candidato principal del spike, conforme ADR-0002, y mantener Dexie/protocolo propio como referencia de salida. RxDB y plataformas de sincronización quedan como alternativas si el candidato falla.

El spike debe simular venta en dos cajas, 24 horas desconectadas, precio concurrente, cierre, reconexión, fallos abruptos, migración, aislamiento y exportación. No evaluará UI completa: su objetivo es retirar el riesgo de sincronización sin comprometer producción.
