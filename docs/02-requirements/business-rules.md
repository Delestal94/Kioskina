# Reglas de negocio

- Estado: **Borrador; no aprobado**

| ID | Regla provisional | Origen | Estado |
|---|---|---|---|
| RN-001 | Una venta modifica stock y caja sólo al completarse, salvo reservas explícitas futuras. | Entrevista 03 | Por validar |
| RN-002 | Una venta electrónica no se considera pagada sin confirmación confiable o intervención manual autorizada y auditada. | Entrevista 03 | Por validar con proveedores |
| RN-003 | Un pago rechazado no habilita la entrega de mercadería. | Entrevista 03 | Confirmada por fundador |
| RN-004 | Los descuentos requieren autorización de un usuario con el permiso correspondiente. | Entrevista 03 | Confirmada por fundador |
| RN-005 | Devoluciones, cambios, cancelaciones y anulaciones requieren permisos configurables y auditoría. | Entrevista 03 | Confirmada por fundador |
| RN-006 | Cada movimiento de efectivo se atribuye a un turno y usuario individual. | Entrevista 03 | Confirmada por fundador |
| RN-007 | El comercio puede permitir o impedir el alta rápida de productos durante la venta. | Entrevista 03 | Confirmada por fundador |
| RN-008 | No entregar un comprobante al cliente no elimina el registro interno ni obligaciones fiscales aplicables. | Análisis | Por validar legalmente |
| RN-009 | Pedidos para retiro no forman parte del alcance inicial declarado. | Entrevista 03 | Confirmada por fundador |
| RN-010 | Cada artículo vendible/SKU tiene un único código de barras; presentaciones distintas se modelan como artículos relacionados. | Entrevista 04 y análisis | Por validar |
| RN-011 | El stock se descuenta sólo cuando la venta queda completada. | Entrevista 04 | Confirmada por fundador |
| RN-012 | Si una venta supera el stock disponible, se registra un ajuste compensatorio por el faltante y luego la salida, vinculados a la venta y visibles en auditoría. | Entrevista 05 | Confirmada por fundador; detalles abiertos |
| RN-013 | El piloto mantiene un stock total por artículo y comercio. | Entrevista 04 | Confirmada por fundador |
| RN-014 | Los movimientos de inventario confirmados no se borran; se corrigen mediante reversión o ajuste trazable. | Análisis | Por validar |
| RN-015 | Una importación o extracción automática requiere revisión y confirmación antes de cambiar catálogo, costos o precios. | Análisis de riesgo | Por validar |
| RN-016 | Lotes y vencimientos no forman parte del alcance inicial. | Entrevista 04 | Confirmada por fundador |
| RN-017 | Identificar al cliente es opcional en una venta común y obligatorio para fiado o cuando lo exija el comprobante. | Entrevista 05 | Confirmada por fundador; sujeta a normativa |
| RN-018 | Entre promociones válidas se aplica el beneficio más conveniente para el cliente según una comparación determinista. | Entrevista 05 | Confirmada por fundador; algoritmo abierto |
| RN-019 | El cajero ve por defecto sólo su turno y operaciones; ampliar acceso requiere permisos explícitos. | Entrevista 05 | Confirmada por fundador |
| RN-020 | El ajuste compensatorio ocurre por el faltante exacto, no interrumpe la venta, se advierte después y se resume diariamente al dueño. | Entrevista 06 | Confirmada por fundador |
| RN-021 | Los registros auditados se rectifican mediante nuevos eventos vinculados; el original no se modifica ni elimina. | Entrevista 06 | Confirmada por fundador |
| RN-022 | El acceso remoto de soporte requiere autorización temporal del dueño y una identidad propia del agente. | Entrevista 06 | Confirmada por fundador |
| RN-023 | Sin conexión se restringen los servicios que requieren verificación remota, mensajería o fiscalidad en línea. | Entrevista 06 | Confirmada conceptualmente; detalle pendiente |
| RN-024 | Stock y ventas se sincronizan como movimientos identificados; los saldos finales de dispositivos no se sobrescriben entre sí. | Entrevista 10 | Confirmada por fundador |
| RN-025 | Si movimientos sincronizados producen stock negativo, se agrega el ajuste compensatorio exacto y auditado para llevarlo a cero. | Entrevista 10 | Confirmada por fundador |
| RN-026 | El precio puede divergir temporalmente por caja durante una desconexión; al reconectar un administrador elige el precio futuro compartido y las ventas históricas conservan lo cobrado. | Entrevistas 10 y aprobación posterior | Confirmada por fundador |
| RN-027 | La configuración de retención no puede reducir mínimos legales o contractuales. | Entrevista 10 e investigación oficial | Confirmada por fundador |
| RN-028 | Los roles iniciales acumulables son dueño/administrador, encargado y cajero. Se aplican los permisos iniciales aprobados para el MVP; toda acción no concedida explícitamente se deniega por defecto. | Ratificación del fundador, 2026-09-26 | Confirmada para la línea base propuesta; la línea base general sigue pendiente |

