# Matriz de trazabilidad

- Estado: **Borrador**

| Necesidad | Requisito | Regla/ADR | Implementación | Prueba | Estado |
|---|---|---|---|---|---|
| Uso sencillo y accesible | RF-002, RF-054, RF-060, RF-063 | Principios UX; RNF-007, RNF-010 | Spike visual: venta como foco y herramientas técnicas plegables; sin validación con usuarios | T-A11Y-001; T-UX-001 (spike) | Propuesta sin validación de campo; prueba táctil/lector y ventana móvil pendientes |
| Escalar desde un kiosco hasta una organización multinacional | RF-029, RF-036 | Arquitectura candidata; ADR-0001 | No iniciada | T-TENANT-001; pruebas futuras de escala | Visión evolutiva |
| Digitalizar comercios que usan papel o sistemas obsoletos | Pendiente | Pendiente | No iniciada | No definida | Hipótesis por validar |
| Comercializar el producto a terceros | Pendiente | Pendiente | No iniciada | No definida | Confirmado como intención |
| Pilotar con kioscos pequeños de Tucumán y Jujuy | Pendiente | Pendiente | No iniciada | Observación y piloto por definir | Confirmado como intención |
| Identidad individual y auditoría por empleado | RF-044, RF-049 | RNF-001; modelo de seguridad | No iniciada | T-AUTH-001 | Borrador |
| Operación completamente táctil | RF-002, RF-054, RF-060 | Principios UX; RNF-010 | No iniciada | T-A11Y-001 | Borrador |
| Roles configurables y acumulables | RF-011, RF-038, RF-044 | RN-004, RN-005, RN-019, RN-028 | No iniciada | T-AUTH-001 | Matriz inicial ratificada el 2026-09-26; línea base pendiente |
| Incorporación futura de idiomas | Pendiente | Pendiente | No iniciada | Pruebas de internacionalización por definir | Descubrimiento |
| Venta rápida con carrito editable y múltiples búsquedas | RF-001, RF-002 | RN-001 | Spike descartable: una línea sintética y persistencia/sync de evento | T-SALE-003/004, T-SYNC-009; flujo comercial/usabilidad pendientes | No es implementación de producto; línea base pendiente |
| Cobro inicial en efectivo, transferencia y QR | RF-006, RF-007, RF-008 | RN-002, RN-003 | No iniciada | Pruebas de pagos e idempotencia por definir | Borrador |
| Control individual de caja por empleado | RF-010 | RN-006 | No iniciada | Pruebas de turnos y arqueo por definir | Borrador |
| Controlar acciones sensibles mediante permisos | RF-011 | RN-004, RN-005, RN-028 | No iniciada | T-AUTH-001: permisos concedidos/denegados, actor, autorización y auditoría | Matriz inicial ratificada; línea base pendiente |
| Continuar ventas esenciales ante cortes de Internet | RF-013, RF-057 | ADR-0001 a ADR-0003; RNF-013 a RNF-015 | Spike descartable: outbox, gateway, venta sintética y señal de disponibilidad | T-SYNC-001 a T-SYNC-009 | Persistencia/sync parciales; 24 h, CouchDB real y ventas siguen pendientes |
| Catálogo de 500 a 2.000 artículos con variantes | RF-016, RF-017, RF-018 | RN-010 | No iniciada | Pruebas de catálogo y rendimiento por definir | Borrador |
| Stock total, movimientos e inventarios auditables | RF-020, RF-021, RF-022, RF-023, RF-027 | RN-011 a RN-014; ADR-0003 | No iniciada | T-STOCK-001 y propiedades del libro | Borrador |
| Alertas y sugerencias de reposición | RF-024 | Pendiente | No iniciada | Pruebas de umbrales y cálculo por definir | Borrador |
| Ingresos y deuda con proveedores | RF-025 | Pendiente | No iniciada | Pruebas contables por definir | Borrador |
| Importar listas de múltiples fuentes | RF-026 | RN-015 | No iniciada | Conjuntos reales y pruebas de revisión por definir | Borrador |
| Imprimir etiquetas y códigos | RF-028 | Pendiente | No iniciada | Matriz de impresoras por definir | Borrador |
| Evolucionar a catálogo multisucursal | RF-029 | Pendiente | No iniciada | Pruebas de aislamiento/herencia por definir | Posterior al piloto |
| Cliente opcional y fiado controlado | RF-030 a RF-033 | RN-017 | No iniciada | Pruebas de saldos, límites y privacidad por definir | Borrador |
| Promociones con mejor beneficio | RF-034 | RN-018 | No iniciada | Casos combinatorios por definir | Borrador |
| Comunicación por WhatsApp | RF-035 | Pendiente | No iniciada | Pruebas de consentimiento y proveedor por definir | Borrador |
| Administrar comercios independientes | RF-036 | Pendiente de arquitectura | No iniciada | Pruebas de aislamiento por definir | Borrador |
| Reportes, alertas y exportaciones | RF-037, RF-039, RF-040, RF-042 | Pendiente | No iniciada | Conciliación, permisos y dispositivos por definir | Borrador |
| Proteger información sensible por rol | RF-038 | RN-019 | No iniciada | Pruebas negativas de autorización por definir | Borrador |
| Gestión de personal | RF-041 | Pendiente | No iniciada | Investigación laboral por definir | Posterior/por priorizar |
| Autenticación y recuperación individual | RF-044 a RF-048 | Pendiente | No iniciada | Pruebas de abuso y recuperación por definir | Borrador |
| Auditoría inmutable y soporte autorizado | RF-049 a RF-051 | RN-021, RN-022; RNF-001 | No iniciada | Integridad y autorización por definir | Borrador |
| Exportación, cierre y recuperación por plan | RF-052, RF-053 | RNF-005 | Utilidad NDJSON sólo para spike; flujo dueño/soporte no iniciado | T-EXPORT-TECH-001; simulacros de exportación/restauración por definir | Borrador |
| Operar sin periféricos y con lector opcional | RF-054, RF-055 | Pendiente | No iniciada | Matriz de hardware por definir | Borrador |
| Resistir fallas, reintentos y cortes | RF-056, RF-057 | RN-023; RNF-004, RNF-006; ADR-0003 | No iniciada | T-SALE-002, T-SYNC-001/002, T-MIG-001 | Spike pendiente |
| Ofrecer hardware y soporte | RF-058, RF-059 | Pendiente | No iniciada | Piloto operativo por definir | Por validar |
| Aislar datos entre comercios | RF-036, RF-038 | RNF-002, RNF-003 | No iniciada | Pruebas negativas de seguridad por definir | Borrador |
| Aplicación web instalable y compatible | RF-060 | RNF-010 | Scaffold del spike con manifiesto/runtime; compatibilidad pendiente | T-PWA-001; matriz web/dispositivos por definir | Borrador |
| Migración y configuración en 4–8 horas | RF-061, RF-062 | Pendiente | No iniciada | Ensayo con datos del piloto por definir | Borrador |
| Ayuda y prueba comercial por plan | RF-063, RF-064, RF-069 | Pendiente | No iniciada | Prueba de onboarding y vencimiento por definir | Borrador |
| Actualizar y revertir con seguridad | RF-065 | RNF-011; plan de despliegue | No iniciada | T-MIG-001 y rollback operativo | Borrador |
| Diagnóstico técnico sin exponer datos | RF-066, RF-067 | RNF-012 | No iniciada | Revisión de eventos y acceso por definir | Borrador |
| Soporte trazable mediante tickets | RF-068 | Pendiente | No iniciada | SLA y flujo de escalamiento por definir | Borrador |
| Rendimiento y capacidad del piloto | RF-001, RF-006 | RNF-007 a RNF-009 | Scaffold del spike con lectura paginada, medición pendiente | T-STORAGE-001; pruebas de carga y usabilidad por definir | Borrador |
| Distinguir registro interno de comprobante fiscal | RF-070 | RN-008 | No iniciada | Validación del proceso externo por definir | Bloqueante para piloto real |
| Informar y respetar derechos sobre datos | RF-071, RF-072, RF-074 | RNF-002, RNF-003 | No iniciada | Revisión legal y pruebas de solicitudes por definir | Borrador |
| Conservar/eliminar según categoría y obligación | RF-073 | RN-021, RNF-001, RNF-005 | No iniciada | Pruebas de políticas y bloqueos por definir | Borrador |
| Controlar campañas futuras | RF-075 | Pendiente | No iniciada | Consentimiento/baja/No Llame por definir | Posterior al MVP |
| Operar local-first en dos cajas sincronizadas | RF-013, RF-057, RF-060 | RN-023 a RN-026; ADR-0001 a ADR-0003; RNF-004 a RNF-006, RNF-013 a RNF-015 | Spike: outbox, push/pull incremental, cursor acotado por scope y detección local de secuencias; no producción | T-SYNC-001 a T-SYNC-007 | Siete pruebas sintéticas aprobadas; coordinador real, navegador, ventas y objetivo de 24 h pendientes |
| Recuperar servicio y datos después de fallas | RF-052, RF-053, RF-056 | RNF-005, RNF-011; Q-048; plan operativo | No iniciada | T-REC-001, T-BACKUP-001, T-MIG-001 | Objetivos candidatos ratificados el 2026-09-26; spike y simulacro pendientes |
| Continuar sin investigación de campo previa | No aplica | RISK-022 | Telemetría/iteración no iniciada | Métricas del piloto | Riesgo aceptado |
| Despliegues configurables sin datos comerciales en código | RNF-016 | ADR-0002 (candidato) | Spike: `apps/client/src/config.ts`, configuración runtime y variables de entorno; gateway limita bytes por solicitud desde entorno | T-CONFIG-001, T-CONFIG-002 | En curso; spike descartable |
| Producto propietario de sociedad común | No aplica al comportamiento | Acuerdo societario/IP pendiente | No iniciada | Revisión documental legal | Intención confirmada |
| Documentación como memoria de agentes de IA | `AGENTS.md`, `docs/README.md` | Pendiente | Estructura inicial creada | Revisión manual | En curso |
