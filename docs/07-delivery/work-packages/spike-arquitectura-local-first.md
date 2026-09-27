# Paquete de trabajo — Spike de arquitectura local-first

## Identificación

- Título: Validar persistencia local, sincronización y recuperación del piloto
- Responsable/revisor: Equipo fundador (por asignar)
- Estado: En curso; scaffold técnico descartable autorizado como spike. Línea base de producto no aprobada.
- Tipo: Spike descartable; no producción
- RF/RNF/RN: RF-013, RF-043, RF-049, RF-050, RF-056, RF-057; RN-001, RN-011 a RN-014, RN-020, RN-021, RN-024 a RN-026; RNF-001 a RNF-006, RNF-008, RNF-013 a RNF-016
- ADR: ADR-0001, ADR-0002, ADR-0003

## Objetivo

Retirar el riesgo técnico de la arquitectura local-first candidata: comprobar que dos nodos pueden registrar operaciones localmente, preservar eventos y efectos tras fallos, y converger después de una partición mediante un coordinador protegido. El spike informa si se aceptan, modifican o reemplazan los ADR; no habilita por sí mismo la construcción del MVP.

## Incluye / no incluye

- Incluye: monorepo npm con límites de paquetes; interfaz mínima de estado del nodo; shell PWA instalable y cacheable sin conexión; configuración externa por entorno/runtime; contrato de evento versionado y recibos; caso de uso de sincronización independiente de UI/adaptadores; persistencia local y outbox; gateway; coordinador CouchDB como candidato; compose local parametrizado.
- No incluye: UI de producción, flujos comerciales completos, usuarios reales, pagos/fiscalidad reales, despliegue productivo, promesas comerciales de disponibilidad/recuperación, ni adopción definitiva de dependencias.

## Criterios de aceptación

1. Dos nodos sobreviven 24 horas de partición simulada y sincronizan al reconectar al menos 1.000 ventas y 2.000 productos sin pérdida ni doble efecto.
2. Cierre forzado en cada punto de escritura deja la venta completa y recuperable o no deja ningún efecto parcial.
3. Reenvío, duplicación y entrega fuera de orden son idempotentes; huecos de secuencia se detectan y se reintentan antes de declarar convergencia.
4. Ventas concurrentes sobre stock conocido reconstruyen el libro de movimientos y el ajuste compensatorio documentado sin sobrescribir saldos.
5. Dos precios concurrentes preservan ambas propuestas, crean conflicto visible y permiten elegir un precio futuro sin alterar ventas históricas.
6. El gateway impide acceso entre dos comercios, valida identidad/dispositivo/tenant y no expone CouchDB directamente a la PWA.
7. Migración con eventos pendientes conserva la cola o revierte de manera segura; se exportan eventos a formato independiente del motor.
8. La evidencia registra navegador, SO, dispositivo, versión de dependencias, datos sintéticos, resultados, defectos y límites observados.
9. Se documentan mediciones de almacenamiento, inicio, búsqueda, venta, sincronización y reconstrucción frente a los objetivos del spike; cualquier incumplimiento queda explícito.
10. El cliente sincroniza lotes acotados por configuración y sólo cambia el estado local a aceptado cuando el contrato de respuesta valida todos los IDs del lote sin faltantes, duplicados ni extras.
11. Los recorridos del almacenamiento se paginan con tamaño configurable para acotar memoria; el costo de lectura total se mide y se documenta antes de escalar la carga.
12. El service worker sirve el shell y assets estáticos ya descargados sin red; las solicitudes POST al gateway no se cachean y el runtime config usa red con fallback local.
13. La herramienta local exporta eventos de un tenant sintético como NDJSON canónico, en páginas, sin metadatos del motor y sin sobrescribir un archivo existente; un ID de documento que no coincide con el sobre o una página inválida aborta y limpia el parcial. No crea ni representa una exportación disponible para el dueño desde la UI.
14. Cada cliente descarga cambios del tenant/sucursal de su credencial en páginas limitadas, guarda el cursor opaco sólo después de aplicar la página y puede repetirla tras interrupción sin duplicar eventos ni avanzar el cursor ante error.
15. El almacenamiento detecta huecos y secuencias duplicadas por dispositivo tras cada página; la interfaz informa que la convergencia no está confirmada mientras existan anomalías.
16. El gateway rechaza solicitudes cuyo cuerpo exceda un máximo configurable antes de procesar o persistir eventos; el límite se obtiene del entorno y la evidencia registra su valor.

## Matriz de comportamiento

| Aspecto | Decisión/caso esperado |
|---|---|
| Permisos | Sólo datos sintéticos y dispositivos de prueba autorizados; gateway valida tenant, dispositivo y tipo de evento. La exportación CLI requiere acceso local a credenciales del coordinador y tenant explícito; no simula los permisos del dueño. |
| Auditoría | Eventos y decisiones de aceptación/rechazo/resolución conservan IDs correlacionables; ningún secreto o dato personal real. |
| Offline y sincronización | Partición de 24 h; outbox durable; transporte al menos una vez con deduplicación por evento; recepción incremental por cursor opaco y repetible; conflictos no acumulables explícitos. |
| Recuperación ante fallo | Inyección de apagados/cierre forzado, pérdida durante sync, replay de una página con aplicación parcial, cuota insuficiente y migración incompatible; ninguna falsa señal de convergencia. |
| Accesibilidad | No se construye interfaz de producción; las limitaciones de navegador/almacenamiento relevantes para PWA se registran. |
| Hardware/navegadores | Chrome/Edge actuales en Windows y Chrome en Android, según estrategia de pruebas; equipos concretos quedan anotados como evidencia, no como promesa permanente. |
| Privacidad/retención | Datos completamente sintéticos; exportación de eventos verificable; retención del entorno de prueba eliminada al cerrar el spike. |
| Límite de entrada | Tamaño máximo HTTP configurable desde entorno, además del tope de eventos; cuerpos excesivos se rechazan antes de persistencia. |

## Diseño técnico

- Componentes y contratos afectados: caso de uso/puertos en `packages/application`, esquema de evento y respuesta, adaptador local PouchDB/IndexedDB, cliente HTTP del gateway y adaptador de coordinador CouchDB, todos candidatos sujetos a ADR-0002.
- Versiones directas fijadas en el lockfile del scaffold: Node 24/npm 11, React 19.3.0, Vite 8.3.0, TypeScript 7.0.2, Fastify 5.12.5, PouchDB 9.0.0 y CouchDB 3.5.2; candidatas sujetas a revisión de licencias, mantenimiento y vulnerabilidades.
- Configuración/secretos: RNF-016; identificadores de tenant, sucursal, dispositivo y actor requeridos por runtime; secretos del coordinador sólo en entorno local ignorado por Git.
- Datos/migración: tenant, branch, device, actor, secuencia, causalidad, correlación, versión de esquema, clave de idempotencia y payload sintético conforme al sobre del modelo lógico.
- Riesgos y reversión: prototipo aislado y descartable; no migrar datos de producción. Si durabilidad, aislamiento, convergencia, rendimiento o mantenibilidad fallan, registrar hallazgos y evaluar la alternativa de repositorio IndexedDB controlado con outbox/API o una opción local-first revisada, mediante ADR actualizado.
- Límite conocido del scaffold: el recorrido paginado de eventos aún escanea el registro para calcular secuencia y estado. Acota memoria, pero no el trabajo total; el spike debe medirlo y un índice por dispositivo/estado se evaluará antes de cargas comerciales.
- La recepción candidata usa `_changes` de CouchDB con selector por tenant/sucursal y cursor opaco serializado; el cursor local avanza después de aplicar documentos idempotentemente. No es una garantía de convergencia de proyecciones ni orden causal global; faltan pruebas de contrato, seguridad y recuperación.

## Pruebas

| ID | Nivel | Caso | Resultado |
|---|---|---|---|
| T-SYNC-001 | Sincronización | Dos nodos, partición de 24 h, 1.000 ventas/2.000 productos | Pendiente |
| T-SYNC-002 | Propiedades/contrato | Reintento, replay, duplicados, fuera de orden, huecos y validación de recibos (T-SYNC-004) | Pendiente |
| T-SYNC-003 | Conflicto | Precios concurrentes y resolución administrativa | Pendiente |
| T-SYNC-004 | Contrato | Recibos completos, sin IDs extras ni repetidos; lote fuera de alcance rechazado | Pendiente |
| T-SYNC-005 | Sincronización/recuperación | Dos nodos reciben cambios paginados; repetir una página o interrumpir su aplicación no duplica eventos ni avanza el cursor antes de completar | Pendiente |
| T-SYNC-006 | Integridad de secuencia | Eventos sintéticos con huecos o secuencias repetidas por dispositivo generan una anomalía visible; al recibir el evento faltante, desaparece el hueco | Pendiente |
| T-CONFIG-002 | Seguridad/contrato | Cuerpo mayor que `SYNC_MAX_REQUEST_BYTES` se rechaza sin persistir eventos; un cuerpo bajo el límite puede continuar por validación normal | Pendiente |
| T-STORAGE-001 | Persistencia | Outbox mayor a una página con lectura paginada y secuencia preservada | Pendiente |
| T-EXPORT-TECH-001 | Portabilidad | Exportación NDJSON de un tenant sintético sin `_rev` ni documentos de otro tenant | Pendiente |
| T-SALE-002 | Integración local | Cierre forzado alrededor de escrituras atómicas | Pendiente |
| T-STOCK-001 | Propiedades | Ventas concurrentes, ajuste compensatorio y reconstrucción | Pendiente |
| T-TENANT-001 | Seguridad | Intentos cruzados entre dos tenants mediante gateway | Pendiente |
| T-PWA-001 | Navegador | Apertura del shell instalado en modo offline después de una primera carga online | Pendiente |
| T-MIG-001 | Migración | Actualización con outbox pendiente y reversión | Pendiente |
| T-REC-001 | Recuperación | Pérdida de nodo durante sincronización y reingreso controlado | Pendiente |

## Evidencia y documentación

- Comandos/resultados: scaffold creado; validación de build, tipos, persistencia y sincronización aún pendiente. No se afirma que los criterios de spike estén demostrados.
- Documentos actualizados al terminar: ADR-0001 a ADR-0003; arquitectura-overview, data-model, security-model, test-strategy, deployment-recovery-support, traceability y discovery-status, según resultados.
- Riesgos o preguntas restantes: Q-005, Q-009, Q-030, Q-031, Q-033, Q-035, Q-036, Q-037, Q-047 y Q-048 permanecen según el estado registrado; el spike no los resuelve automáticamente.
- Puerta: no convertir código del spike en producto ni iniciar el MVP hasta que discovery-status indique línea base aprobada e implementación autorizada.
