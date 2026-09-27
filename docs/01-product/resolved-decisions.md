# Decisiones de producto resueltas

- Última actualización: 2026-09-26

Este registro conserva las respuestas que ya no requieren una decisión adicional. No convierte una decisión del fundador en una línea base aprobada ni elimina las dependencias legales, técnicas o de validación que siguen vigentes.

| Pregunta de origen | Decisión registrada | Evidencia y documentación vinculada | Límites pendientes |
|---|---|---|---|
| Q-002 | El MVP se orienta a un kiosco de barrio; el núcleo es venta, caja/turnos, productos, stock esencial, clientes/fiado y reportes mínimos, en dos cajas con hasta 24 horas objetivo offline. Se excluyen del MVP fiscalidad integrada, OCR, delivery, fidelización y multisucursal. El fundador ratificó este alcance de alto nivel el 2026-09-26. | `mvp-scope.md`; `mvp-prioritization.md`; RF-001 a RF-013; confirmación del fundador del 2026-09-26. | Comercio/localidad externa del piloto (Q-001/Q-008), prioridades detalladas, dependencias legales y validación del spike siguen pendientes; esto no aprueba por sí solo la línea base. |
| Q-004 y Q-010 | Para el piloto, la caja debe sostener durante hasta 24 horas la venta en efectivo y las funciones locales esenciales; los servicios que necesitan verificación remota, mensajería o fiscalidad en línea quedan restringidos o pendientes. | `mvp-scope.md`; RF-013 y RF-057; RN-023 a RN-026; ADR-0001 y ADR-0003. | El spike debe validar la duración, durabilidad y sincronización. Los objetivos candidatos de recuperación de Q-048 fueron ratificados el 2026-09-26, sujetos a validación técnica. |
| Q-017 | Recargas, transporte, pago de servicios y delivery quedan fuera del MVP. | `mvp-scope.md`; `mvp-prioritization.md`; entrevista 03. | Se evaluarán como capacidades posteriores, con requisitos e integraciones propios. |
| Q-027 | Horarios, asistencia, sueldos y comisiones quedan fuera del MVP. | `mvp-scope.md`; `mvp-prioritization.md`; RF-041. | Una etapa posterior debe separar el alcance laboral y validar sus obligaciones. |
| Q-042 | Ante precios modificados de forma concurrente durante una desconexión, un administrador decide el precio futuro compartido; las ventas históricas conservan el precio cobrado. | RN-026; ADR-0001; ADR-0003. | Quedan por definir las políticas para otros conflictos no acumulables (Q-031). |
| Q-048 | Para la línea base del piloto, se ratifican como objetivos candidatos un RPO central de 15 minutos para datos ya sincronizados, RTO del coordinador de 4 horas, copia completa cifrada diaria más incrementales en ubicación separada y simulacro mensual de restauración. Ratificado por el fundador el 2026-09-26. | `deployment-recovery-support.md`; Q-048; revisión del fundador. | Condicionado a validar viabilidad y medición en el spike; no cubre operaciones pendientes en un dispositivo perdido ni constituye SLA comercial por sí solo. |
| Q-006 | El modelo inicial será una suscripción por comercio/sucursal, no por empleado, con 1–2 cajas incluidas; la puesta en marcha, migración/capacitación, soporte presencial y hardware se cobrarán por separado. Ratificado por el fundador el 2026-09-26. | `commercial-model.md`; confirmación del fundador del 2026-09-26. | Precios, límites exactos por plan y soporte incluido siguen pendientes (Q-028/Q-032/Q-038); el piloto interno no es una venta. |
| Q-011 | Los roles iniciales acumulables son dueño/administrador, encargado y cajero. El cajero vende y opera su propio turno, pero no edita precios, anula/devuelve ventas ni ajusta stock; el encargado puede autorizar descuentos/anulaciones y ajustes y consultar reportes operativos; dueño/administrador gestiona además usuarios, permisos, configuración y exportaciones. Otras capacidades requieren permisos explícitos. Ratificado el 2026-09-26. | `security-model.md`; RF-011, RF-038; RN-028; revisión del fundador. | Umbrales detallados, permiso para casos no listados y aprobación de línea base general pendientes. |
| Q-052 | La primera entrega se probará internamente con datos ficticios en una computadora Windows; se usarán Chrome y Edge. Confirmado por el fundador el 2026-09-27. | `mvp-scope.md`; `discovery-status.md`; respuesta del fundador del 2026-09-27. | No habilita ventas ni tratamiento de datos reales; Q-012, Q-039, Q-043 y Q-044 permanecen abiertos para un piloto real. Versiones y periféricos siguen en Q-051. |

## Decisiones relacionadas que aún no se consideran cerradas

- Q-018: el mecanismo de ajuste compensatorio está confirmado, pero faltan autorización y revisión operativa.
- Q-028: se confirmó que ningún plan puede estar por debajo de los mínimos legales o contractuales, pero faltan mínimos y planes concretos.
- Q-029: el riesgo de no bloquear ni reautenticar automáticamente fue aceptado de forma provisional; se reevalúa en el piloto.
- Q-031: sólo está resuelto el conflicto de precio de Q-042; las demás configuraciones siguen abiertas.






