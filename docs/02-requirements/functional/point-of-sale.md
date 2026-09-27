# Requisitos funcionales — punto de venta

- Estado: **Borrador; no aprobado**
- Origen principal: entrevistas al fundador 02 y 03
- Alcance: flujo de venta inmediata para el piloto
- Prioridades: propuesta de `../../01-product/mvp-prioritization.md`; no sustituyen la aprobación de línea base.

## Requisitos

### RF-001 — Construcción y edición de venta

- Prioridad propuesta: MVP
- Descripción: el cajero podrá formar un carrito, cambiar cantidades y eliminar artículos antes del cobro.
- Criterios de aceptación:
  - Agregar, modificar o eliminar una línea recalcula totales de forma consistente.
  - Ninguna modificación previa al cobro altera stock definitivo ni movimientos de caja.
  - La interfaz previene activaciones dobles por pulsaciones repetidas.
- Dependencias: catálogo, precios e impuestos.

### RF-002 — Incorporación de productos por varios métodos

- Prioridad propuesta: MVP; métodos concretos por priorizar
- Descripción: admitir lector de código, ingreso manual de código, búsqueda por nombre, categorías visuales, favoritos y selección manual.
- Criterios de aceptación:
  - El flujo puede completarse mediante pantalla táctil sin teclado físico ni lector.
  - Un código reconocido agrega el producto correcto y muestra precio y cantidad.
  - Una búsqueda sin coincidencias ofrece una salida clara y autorizada.
- Dependencias: catálogo, búsqueda, hardware y diseño táctil.

### RF-003 — Alta rápida de producto durante la venta

- Prioridad propuesta: MVP; campos mínimos pendientes (Q-014)
- Descripción: permitir crear un producto faltante si la política y permisos del comercio lo autorizan.
- Criterios de aceptación:
  - La política puede habilitarse o deshabilitarse por comercio.
  - El alta exige un conjunto mínimo pendiente de definir.
  - Se registra identidad, fecha, dispositivo y valores ingresados.
  - El producto puede quedar marcado para revisión posterior.
- Dependencias: permisos, auditoría, catálogo, impuestos y stock.

### RF-004 — Unidades y presentaciones de venta

- Prioridad propuesta: Reducido; unidad y cantidad decimal manual, sin balanza integrada
- Descripción: contemplar productos por unidad, peso, volumen, fracción y pack.
- Criterios de aceptación:
  - Cada producto declara unidades permitidas y reglas de precisión.
  - Cantidad, precio unitario y total quedan registrados sin pérdida de precisión definida.
- Dependencias: modelo de producto, balanzas, precios e impuestos.

### RF-005 — Combos y promociones

- Prioridad propuesta: Reducido; precio por cantidad, sin combos complejos
- Descripción: aplicar precios o beneficios definidos para combinaciones de artículos.
- Criterios de aceptación:
  - El sistema identifica condiciones cumplidas y muestra el beneficio aplicado.
  - Quitar un artículo invalida o recalcula el beneficio.
  - La venta conserva evidencia de la regla aplicada.
- Dependencias: motor de precios y promociones.

### RF-006 — Cobro en efectivo y cálculo de vuelto

- Prioridad propuesta: MVP
- Descripción: registrar importe recibido, calcular vuelto y completar la venta en efectivo.
- Criterios de aceptación:
  - No permite confirmar un importe insuficiente salvo flujo explícito de pago combinado o fiado.
  - Muestra total, recibido y vuelto de forma visible antes de confirmar.
  - Al confirmar genera los movimientos de venta, stock y caja una sola vez.
- Dependencias: turnos, caja, moneda y transacciones atómicas/idempotentes.

### RF-007 — Transferencia y QR

- Prioridad propuesta: Reducido; registro manual auditado. La verificación automática queda condicionada a proveedor y pruebas.
- Descripción: iniciar o registrar pagos por transferencia y QR y verificar automáticamente cuando el proveedor lo permita.
- Criterios de aceptación:
  - La venta distingue claramente pendiente, acreditada, rechazada, vencida y estado desconocido.
  - Sólo una confirmación confiable permite completar automáticamente el pago.
  - Reintentos o notificaciones duplicadas no duplican cobro ni venta.
  - Si no existe integración verificable, cualquier confirmación manual queda identificada y auditada.
- Dependencias: proveedor de pagos, conectividad, conciliación, seguridad y webhooks/API.

### RF-008 — Pagos combinados

- Prioridad propuesta: MVP
- Descripción: distribuir el total entre dos o más medios de pago.
- Criterios de aceptación:
  - La suma confirmada debe coincidir con el total antes de completar.
  - El sistema conserva estado y referencia de cada componente.
  - Un fallo parcial ofrece una resolución explícita sin cobrar dos veces.
- Dependencias: RF-006, RF-007 y reglas de cancelación/reembolso.

### RF-009 — Cuenta corriente o fiado

- Prioridad propuesta: MVP
- Descripción: asignar deuda a un cliente identificado y registrar pagos posteriores.
- Criterios de aceptación:
  - Requiere cliente identificable y autorización según permisos.
  - Registra saldo anterior, movimiento, saldo nuevo, vencimiento si aplica y responsable.
  - Límites de crédito y bloqueo serán configurables si se incluyen en el alcance.
- Dependencias: clientes, permisos, auditoría y cobranzas.

### RF-010 — Turnos y efectivo por usuario

- Prioridad propuesta: MVP
- Descripción: cada usuario administrará un turno atribuible aunque comparta dispositivo.
- Criterios de aceptación:
  - Apertura registra usuario, caja, hora y fondo inicial.
  - Ingresos, retiros, ventas, devoluciones y diferencias quedan asociados al turno y usuario.
  - El cierre compara efectivo esperado y declarado, registrando diferencias y autorizaciones.
- Dependencias: identidad, dispositivos, cajas y auditoría.

### RF-011 — Autorizaciones configurables

- Prioridad propuesta: MVP
- Descripción: descuentos, devoluciones, cambios, cancelaciones y anulaciones requieren un permiso aplicable.
- Criterios de aceptación:
  - Sin permiso, la acción no se ejecuta y permite solicitar intervención autorizada.
  - La autorización registra quién solicitó, quién autorizó, motivo, valores y momento.
  - El comercio puede asignar el permiso a roles sin modificar código.
  - La matriz inicial permite al cajero vender y operar su propio turno, pero deniega edición de precios, anulaciones/devoluciones y ajustes de stock; el encargado puede autorizar descuentos, anulaciones y ajustes; dueño/administrador conserva la gestión de usuarios, permisos, configuración y exportaciones.
  - Toda capacidad no asignada explícitamente queda denegada; cambios y autorizaciones conservan actor, autorizador cuando aplique, motivo y auditoría.
- Dependencias: usuarios, roles, reautenticación y auditoría.

### RF-012 — Comprobantes y opción de entrega

- Prioridad propuesta: Reducido; ticket interno impreso o digital opcional, no fiscal
- Descripción: permitir elegir una modalidad válida de comprobante y decidir su entrega cuando la normativa lo permita.
- Criterios de aceptación:
  - La omisión de entrega no elimina el registro interno de la operación.
  - Las opciones ofrecidas dependen de configuración, hardware y requisitos fiscales.
  - Un fallo de emisión conserva un estado recuperable y evita duplicar la venta.
- Dependencias: investigación fiscal argentina, datos del cliente, impresión y canales digitales.

### RF-013 — Venta operativa sin conexión

- Prioridad propuesta: MVP; condicionada a validar ADR-0001 a ADR-0003
- Descripción: mantener como objetivo venta en efectivo, consulta local, movimientos de stock, impresión y cierre durante interrupciones.
- Criterios de aceptación preliminares:
  - El estado sin conexión es visible y no se confunde con operación sincronizada.
  - Cada operación recibe identidad única y se sincroniza sin duplicación.
  - Conflictos de precio, stock, turnos o numeración siguen reglas documentadas.
  - Operaciones que requieren autorización o servicio externo informan su indisponibilidad.
- Dependencias: ADR de operación sin conexión, fiscalidad, sincronización y almacenamiento local.

### RF-014 — Manejo de fallo de pago electrónico

- Prioridad propuesta: Condicionado; sólo con proveedor de pago automático
- Descripción: no completar una venta ni indicar entrega ante pago rechazado o no confirmado.
- Criterios de aceptación:
  - El cajero ve el estado y las opciones seguras: reintentar, cambiar medio o cancelar.
  - Un estado incierto no se presenta como rechazo definitivo sin conciliación.
  - Una acreditación tardía genera una alerta y proceso de resolución.
- Dependencias: RF-007, conciliación y soporte.

### RF-015 — Venta inmediata

- Prioridad propuesta: MVP
- Descripción: el piloto se concentrará en ventas completadas en el momento; pedidos para retiro quedan fuera hasta revisión.
- Criterios de aceptación:
  - El flujo finaliza como completado, cancelado o pendiente de resolución de pago.
  - No se introduce gestión de preparación o retiro como parte del MVP sin cambio de alcance.
- Dependencias: definición final del MVP.

## Capacidades de visión, no comprometidas para el MVP

- Tarjetas y otros medios de pago.
- Productos restringidos por edad u horario.
- Recargas telefónicas y de transporte.
- Cobro de servicios.
- Delivery y canales externos.
