# Arquitectura candidata del piloto

- Estado: **Propuesta; condicionada al spike**
- Fecha: 2026-09-20
- Decisiones: ADR-0001, ADR-0002 y ADR-0003

## Objetivos

- Completar ventas en efectivo durante 24 horas sin Internet y sin depender de otra caja.
- Evitar pérdida o duplicación al cerrar, reiniciar, reintentar o reconectar.
- Mantener una experiencia sencilla para el kiosco piloto sin cerrar la evolución a múltiples sucursales.
- Usar componentes open source y no asumir licencias pagas para el MVP.
- Separar reglas de negocio, almacenamiento y sincronización para poder reemplazar tecnología sin reescribir el dominio.

## Vista de contenedores

```text
Caja A (PWA) ----\                       /---- Portal de administración (misma PWA)
                  Gateway de sync/API --- Coordinador CouchDB
Caja B (PWA) ----/             |         \---- Procesos de conflicto/respaldo
                               |
                         Servicio de aplicación
                         (identidad, permisos,
                          soporte e integraciones)
```

Cada PWA contiene interfaz, lógica de aplicación, base local y cola de cambios. El gateway es el único punto público de sincronización y valida identidad, comercio, dispositivo y alcance; CouchDB no se expone directamente a Internet para uso del navegador. El servicio de aplicación resuelve funciones que necesitan autoridad central o secretos. En el piloto puede desplegarse junto al gateway, manteniendo límites lógicos claros.

## Componentes del cliente

| Componente | Responsabilidad | Restricción principal |
|---|---|---|
| Shell PWA | Instalación, cache de recursos y actualización controlada | No activar una versión incompatible durante una operación |
| UI táctil | Venta, caja, inventario, clientes, reportes y administración | Flujos críticos sin teclado ni precisión fina |
| Casos de uso | Aplicar permisos e invariantes de negocio | No depender de React ni del motor de persistencia |
| Repositorio local | Transacciones, índices, proyecciones y migraciones | Una venta se confirma completa o no produce efectos |
| Outbox/sync | Reintentos, checkpoints, recepción y conflictos | Idempotencia por identificador de evento |
| Estado de salud | Conectividad, cuota, última sincronización y conflictos | Visible sin alarmas ambiguas |

## Dominios

- Identidad, comercio, sucursal, caja, dispositivo, rol y permiso.
- Catálogo, presentación, código, precio y regla de precio.
- Venta, línea, cobro y comprobante interno.
- Turno, movimiento de caja y arqueo.
- Inventario, movimiento, conteo y ajuste.
- Cliente, cuenta corriente, deuda y pago.
- Proveedor e ingreso de mercadería.
- Auditoría, soporte temporal, sincronización y conflicto.
- Reportes como proyecciones reconstruibles, no como fuente de verdad.

## Autoridad de los datos

| Clase | Escritura offline | Convergencia |
|---|---:|---|
| Ventas, pagos manuales, caja, inventario y auditoría | Sí | Eventos inmutables acumulables |
| Productos y clientes | Sí con permisos | Conflicto por versión base; combinación sólo si es segura |
| Precio y configuración | Sí con permisos | Conflicto explícito; administrador elige valor futuro |
| Roles, permisos y revocaciones | Limitada | Autoridad central; una caja desconectada usa la última política válida y muestra antigüedad |
| Pagos verificados, mensajería y soporte remoto | No plenamente | Autoridad del servicio externo/servidor |

## Límites de consistencia

- La transacción local de una venta crea venta, líneas, cobros, movimientos de caja, movimientos de stock y auditoría de forma atómica.
- Sin Internet no existe stock global instantáneo. Cada caja muestra el saldo derivado de los eventos conocidos y la hora de la última sincronización.
- Los eventos aceptados no se editan. Una corrección agrega una reversión o rectificación vinculada.
- Los informes identifican su corte temporal y si quedan eventos pendientes de sincronizar.

## Evolución de escala

El piloto puede usar una base remota aislada por comercio. Para crecer, la clave de partición será `tenant_id`/`branch_id`, el gateway podrá distribuir comercios entre bases y los procesos de lectura podrán generar proyecciones externas. Esta posibilidad no autoriza construir desde ahora funciones multisucursal no incluidas en el MVP.

## Condiciones de implementación

La implementación de producto sigue prohibida mientras `00-discovery/discovery-status.md` indique que la línea base no está aprobada. El spike puede retirar el riesgo de ADR-0001 a ADR-0003, pero debe ejecutarse bajo el flujo de trabajo de IA y no se convierte en producción por sí mismo. El código de dominio no debe importar PouchDB/CouchDB directamente: usará puertos de repositorio y sincronización para conservar una ruta de salida.
