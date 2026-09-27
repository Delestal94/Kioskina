# Modelo lógico de datos

- Estado: **Propuesta para spike**
- Fecha: 2026-09-20
- Relacionado: ADR-0003, RN-001 a RN-027

## Convenciones obligatorias

- Identificadores generados offline: UUIDv7 o equivalente ordenable, sin coordinación central.
- Dinero: entero en unidad mínima (`amount_minor`) más moneda ISO; nunca `float`.
- Cantidades: decimal serializado con escala definida por producto/unidad.
- Tiempo: instante UTC, zona de negocio IANA y fecha comercial local; no confiar en el reloj del dispositivo para ordenar globalmente.
- Toda entidad pertenece a un `tenant_id`; las operativas incluyen `branch_id` y `device_id`.
- Los esquemas de evento tienen versión y migraciones reproducibles.
- Borrado funcional mediante estado/tombstone cuando deba replicarse; auditoría y movimientos no se borran por flujos ordinarios.

## Entidades principales

| Agregado | Datos esenciales | Fuente de verdad |
|---|---|---|
| Comercio/sucursal | identidad, zona, moneda, políticas | Documento versionado |
| Usuario/rol/permiso | identidad, credenciales remotas, asignaciones y vigencia | Autoridad central con caché local |
| Dispositivo/caja | registro, clave pública, versión, última sincronización | Documento central y estado local |
| Producto/SKU | nombre, códigos, unidad, precisión, estado, impuestos futuros | Documento versionado |
| Precio | SKU, alcance, moneda, importe, vigencia | Documento versionado; conflicto explícito |
| Venta | estado, totales, turno, actor, dispositivo, fechas | Evento/agregado inmutable |
| Cobro | medio, importe, referencia, estado, fuente de confirmación | Evento inmutable |
| Turno/caja | apertura, movimientos, cierre, diferencias | Eventos inmutables |
| Inventario | ingresos, salidas, ajustes, conteos y vínculos | Libro de movimientos |
| Cliente/fiado | datos mínimos, límite, movimientos y saldo derivado | Documento + libro de deuda |
| Auditoría | actor, acción, objeto, resultado, contexto y vínculo causal | Evento inmutable |
| Conflicto | versiones, tipo, estado, resolución y resolutor | Documento de workflow |

## Sobre de evento

Todo evento operativo replicable debe incluir como mínimo:

```json
{
  "event_id": "uuidv7",
  "schema_version": 1,
  "tenant_id": "...",
  "branch_id": "...",
  "device_id": "...",
  "actor_id": "...",
  "aggregate_type": "sale",
  "aggregate_id": "...",
  "event_type": "sale.completed.v1",
  "occurred_at_device": "...",
  "recorded_at_local": "...",
  "device_sequence": 123,
  "causation_id": "...",
  "correlation_id": "...",
  "idempotency_key": "...",
  "payload": {}
}
```

El coordinador agrega su fecha de recepción y resultado de validación; no reescribe el contenido comercial original. `device_sequence` detecta huecos por dispositivo, pero no pretende crear un reloj global.

En el spike, cada nodo compara las secuencias locales conocidas por dispositivo dentro de su tenant/sucursal y señala huecos o números repetidos; no declara convergencia mientras persista una anomalía. Este control no recupera eventos por sí solo: el emisor debe reenviar el faltante, y la detección automática de esa solicitud queda pendiente.

## Transacción de venta

Una confirmación local válida produce en una única transacción:

1. Evento `sale.completed` con el precio efectivamente cobrado.
2. Uno o más eventos de cobro.
3. Movimiento de caja si corresponde.
4. Una salida de inventario por línea.
5. Si falta stock conocido, ajuste positivo por el faltante exacto inmediatamente antes de la salida, ambos ligados a la venta.
6. Eventos de auditoría y actualización de proyecciones.

Un reintento con la misma clave devuelve el resultado previo. Una venta anulada se compensa; no se elimina.

## Conflictos

- Eventos con ID único: se unen por conjunto y se deduplican por `event_id`.
- Documento sin edición concurrente: nueva revisión normal.
- Producto/cliente editado concurrentemente: combinar campos sólo si no se tocaron los mismos valores y registrar la combinación.
- Precio, permiso o configuración concurrente: crear conflicto visible; no usar silenciosamente el ganador técnico del motor.
- Una resolución crea nueva revisión y auditoría, conserva ambas propuestas y no cambia ventas anteriores.

## Proyecciones

Stock actual, saldo de fiado, total de turno e informes son proyecciones derivadas. Deben poder reconstruirse desde movimientos/eventos y comprobarse contra ellos. Se pueden compactar datos técnicos sólo cuando la política de retención, exportación y auditoría lo permita.

## Exportación técnica del spike

- El intercambio entre motores usa NDJSON UTF-8: un sobre de evento canónico por línea, sin `_rev`, estado de entrega ni metadatos propios de CouchDB/PouchDB.
- La utilidad del spike requiere acceso local a credenciales de coordinador, un tenant sintético explícito y un archivo de salida nuevo; no forma parte de la interfaz del dueño ni satisface RF-052. Las pruebas deben mantener aislado el tenant exportado y revisar el manejo del archivo parcial ante errores. El modo `0600` se solicita al SO, pero el nivel real de protección depende de sus ACL y del sistema de archivos.
- La lectura se pagina y el archivo se publica al destino sólo cuando termina la exportación. El spike no crea una instantánea consistente frente a escrituras concurrentes: detener los escritores durante la extracción.
