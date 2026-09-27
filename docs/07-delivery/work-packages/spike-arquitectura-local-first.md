# Paquete de trabajo — Spike de arquitectura local-first

## Identificación

- Título: Validar persistencia local, sincronización y recuperación del piloto
- Responsable/revisor: Equipo fundador (por asignar)
- Estado: Preparado; pendiente de habilitación según `discovery-status.md`
- Tipo: Spike descartable; no producción
- RF/RNF/RN: RF-013, RF-043, RF-049, RF-050, RF-056, RF-057; RN-001, RN-011 a RN-014, RN-020, RN-021, RN-024 a RN-026; RNF-001 a RNF-006, RNF-013 a RNF-015
- ADR: ADR-0001, ADR-0002, ADR-0003

## Objetivo

Retirar el riesgo técnico de la arquitectura local-first candidata: comprobar que dos nodos pueden registrar operaciones localmente, preservar eventos y efectos tras fallos, y converger después de una partición mediante un coordinador protegido. El spike informa si se aceptan, modifican o reemplazan los ADR; no habilita por sí mismo la construcción del MVP.

## Incluye / no incluye

- Incluye: prototipo mínimo de dos nodos; eventos versionados e idempotentes; persistencia local; outbox/reintentos; gateway de sincronización; coordinador CouchDB como candidato; detección de huecos y conflictos de precio; reconstrucción de proyecciones; exportación independiente del motor; evidencia en los navegadores/plataformas candidatas.
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

## Matriz de comportamiento

| Aspecto | Decisión/caso esperado |
|---|---|
| Permisos | Sólo datos sintéticos y dispositivos de prueba autorizados; gateway valida tenant, dispositivo y tipo de evento. |
| Auditoría | Eventos y decisiones de aceptación/rechazo/resolución conservan IDs correlacionables; ningún secreto o dato personal real. |
| Offline y sincronización | Partición de 24 h; outbox durable; transporte al menos una vez con deduplicación por evento; conflictos no acumulables explícitos. |
| Recuperación ante fallo | Inyección de apagados/cierre forzado, pérdida durante sync, cuota insuficiente y migración incompatible; ninguna falsa señal de convergencia. |
| Accesibilidad | No se construye interfaz de producción; las limitaciones de navegador/almacenamiento relevantes para PWA se registran. |
| Hardware/navegadores | Chrome/Edge actuales en Windows y Chrome en Android, según estrategia de pruebas; equipos concretos quedan anotados como evidencia, no como promesa permanente. |
| Privacidad/retención | Datos completamente sintéticos; exportación de eventos verificable; retención del entorno de prueba eliminada al cerrar el spike. |

## Diseño técnico

- Componentes y contratos afectados: puertos de persistencia/sincronización, esquema de evento, adaptador local PouchDB/IndexedDB, gateway Fastify/JSON Schema y adaptador de coordinador CouchDB, todos candidatos sujetos a ADR-0002.
- Datos/migración: tenant, branch, device, actor, secuencia, causalidad, correlación, versión de esquema, clave de idempotencia y payload sintético conforme al sobre del modelo lógico.
- Riesgos y reversión: prototipo aislado y descartable; no migrar datos de producción. Si durabilidad, aislamiento, convergencia, rendimiento o mantenibilidad fallan, registrar hallazgos y evaluar la alternativa de repositorio IndexedDB controlado con outbox/API o una opción local-first revisada, mediante ADR actualizado.

## Pruebas

| ID | Nivel | Caso | Resultado |
|---|---|---|---|
| T-SYNC-001 | Sincronización | Dos nodos, partición de 24 h, 1.000 ventas/2.000 productos | Pendiente |
| T-SYNC-002 | Propiedades/contrato | Reintento, replay, duplicados, fuera de orden, huecos | Pendiente |
| T-SYNC-003 | Conflicto | Precios concurrentes y resolución administrativa | Pendiente |
| T-SALE-002 | Integración local | Cierre forzado alrededor de escrituras atómicas | Pendiente |
| T-STOCK-001 | Propiedades | Ventas concurrentes, ajuste compensatorio y reconstrucción | Pendiente |
| T-TENANT-001 | Seguridad | Intentos cruzados entre dos tenants mediante gateway | Pendiente |
| T-MIG-001 | Migración | Actualización con outbox pendiente y reversión | Pendiente |
| T-REC-001 | Recuperación | Pérdida de nodo durante sincronización y reingreso controlado | Pendiente |

## Evidencia y documentación

- Comandos/resultados: completar durante la ejecución; conservar ambiente, versiones, datos semilla sintéticos, resultados y logs sanitizados.
- Documentos actualizados al terminar: ADR-0001 a ADR-0003; arquitectura-overview, data-model, security-model, test-strategy, deployment-recovery-support, traceability y discovery-status, según resultados.
- Riesgos o preguntas restantes: Q-005, Q-009, Q-030, Q-031, Q-033, Q-035, Q-036, Q-037, Q-047 y Q-048 permanecen según el estado registrado; el spike no los resuelve automáticamente.
- Puerta: no convertir código del spike en producto ni iniciar el MVP hasta que discovery-status indique línea base aprobada e implementación autorizada.
