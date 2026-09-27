# Requisitos funcionales — catálogo, inventario y compras

- Estado: **Borrador; no aprobado**
- Origen principal: entrevista al fundador 04
- Alcance: catálogo e inventario para kioscos piloto de 500 a 2.000 artículos
- Prioridades: propuesta de `../../01-product/mvp-prioritization.md`; no sustituyen la aprobación de línea base.

### RF-016 — Ficha de producto

- Prioridad propuesta: MVP
- Descripción: mantener nombre, código interno, código de barras, categoría, marca, descripción, precio, costo, unidad, stock y estado.
- Criterios de aceptación:
  - Código interno y código de barras cumplen reglas de unicidad documentadas.
  - Un producto inactivo conserva su historial y no aparece como vendible por defecto.
  - Los datos fiscales necesarios se incorporan o derivan según la investigación legal, aunque no se expongan innecesariamente al usuario.
- Dependencias: fiscalidad, unidades, precios y auditoría.

### RF-017 — Variantes y presentaciones

- Prioridad propuesta: MVP
- Descripción: relacionar artículos vendibles por sabor, tamaño, color o presentación.
- Criterios de aceptación:
  - Cada variante vendible conserva identidad, código y stock propios.
  - La relación permite navegar y reportar el grupo sin mezclar existencias.
- Dependencias: RF-016 y búsqueda.

### RF-018 — Alta rápida mínima y revisión

- Prioridad propuesta: MVP
- Descripción: exigir nombre, precio, unidad y categoría temporal al crear un producto durante una venta.
- Criterios de aceptación:
  - El producto queda identificado como pendiente de revisión.
  - El sistema detecta posibles duplicados antes de confirmar.
  - Un rol autorizado puede completar, fusionar o desactivar el registro conservando trazabilidad.
- Dependencias: RF-003, RF-016, permisos y auditoría.

### RF-019 — Reglas e historial de precios

- Prioridad propuesta: MVP para precios básicos e historial; precedencia avanzada pendiente (Q-020)
- Descripción: soportar evolución hacia precios por sucursal, medio de pago, cliente y cantidad, con historial y programación.
- Criterios de aceptación:
  - Todo cambio registra valor anterior, nuevo, autor, fecha y alcance.
  - Sólo usuarios autorizados crean, modifican o programan precios.
  - Antes de implementar varias reglas se documentará cuál prevalece cuando coinciden.
  - Los precios por horario no forman parte del alcance hasta validar un caso real.
  - Un conflicto offline conserva ambos cambios, no modifica ventas históricas y requiere selección administrativa del precio futuro.
- Dependencias: permisos, promociones, clientes, sucursales y ADR/regla de precedencia.

### RF-020 — Actualización de stock por venta

- Prioridad propuesta: MVP
- Descripción: descontar existencias sólo cuando la venta se completa.
- Criterios de aceptación:
  - Carritos abandonados o cancelados no modifican existencias.
  - Reintentos no descuentan dos veces.
  - Una devolución aprobada genera el movimiento inverso correspondiente según el estado de la mercadería.
- Dependencias: RF-001, RF-006 y movimientos de inventario.

### RF-021 — Venta con stock insuficiente

- Prioridad propuesta: MVP; detalles de autorización abiertos (Q-018)
- Descripción: si el stock registrado no alcanza para una venta físicamente posible, generar un ajuste compensatorio automático por el faltante y luego la salida de venta, evitando saldo negativo.
- Criterios de aceptación:
  - Ajuste y venta son movimientos separados, vinculados e inmutables en auditoría.
  - El ajuste compensa sólo la cantidad faltante, no crea excedente.
  - La operación registra saldo previo, faltante, usuario, artículo, momento, dispositivo y venta.
  - El dueño puede consultar y recibir alertas por estos ajustes.
  - Visibilidad, motivo y posible autorización del cajero quedan por definir.
- Dependencias: permisos, auditoría e inventario.

### RF-022 — Stock total por comercio

- Prioridad propuesta: MVP
- Descripción: administrar una existencia total por artículo y comercio durante el piloto.
- Criterios de aceptación:
  - Todas las entradas y salidas afectan un saldo trazable.
  - Depósito, góndola y ubicaciones internas quedan fuera del MVP salvo cambio aprobado.
- Dependencias: movimientos e identidad del comercio.

### RF-023 — Movimientos y motivos de inventario

- Prioridad propuesta: MVP; conjunto inicial limitado por Q-022
- Descripción: registrar compras/ingresos, devoluciones, roturas, vencimientos, robos, consumo interno, regalos, ajustes y traslados mediante tipos extensibles.
- Criterios de aceptación:
  - Cada movimiento conserva artículo, cantidad, sentido, motivo, usuario, fecha y referencia.
  - Los tipos sensibles pueden requerir permiso o aprobación.
  - Corregir un movimiento genera reversión o ajuste; no borra el historial.
- Dependencias: permisos, auditoría y sucursales.

### RF-024 — Alertas y sugerencias de reposición

- Prioridad propuesta: Reducido; alerta por mínimo configurable. Sugerencias avanzadas posteriores.
- Descripción: alertar al alcanzar mínimos configurables y sugerir compras usando stock y ventas históricas.
- Criterios de aceptación:
  - El mínimo puede configurarse por artículo y comercio.
  - Una sugerencia explica los datos considerados y no crea una compra automáticamente.
  - El usuario puede descartar o modificar sugerencias.
- Dependencias: historial suficiente, proveedores y configuración.

### RF-025 — Ingreso y cuenta de proveedor

- Prioridad propuesta: Reducido; ingreso de mercadería y deuda simple
- Descripción: registrar ingreso de mercadería y deuda/saldo con el proveedor, sin exigir orden de compra formal inicialmente.
- Criterios de aceptación:
  - El ingreso actualiza stock y registra costo, proveedor, documento y responsable cuando estén disponibles.
  - Una obligación registra importe, vencimiento, pagos y saldo.
  - Cambios posteriores conservan historial.
- Dependencias: proveedores, costos, caja/cuentas y auditoría.

### RF-026 — Importación asistida de listas

- Prioridad propuesta: Reducido; Excel/CSV y entrada manual con vista previa. OCR posterior.
- Descripción: importar listas estructuradas y evolucionar hacia extracción desde PDF, mensajes o fotografías.
- Criterios de aceptación:
  - Ninguna extracción modifica datos maestros sin vista previa y confirmación autorizada.
  - La vista previa muestra coincidencias, productos nuevos, ambigüedades y errores.
  - Se conserva el archivo/origen y el resultado de la importación según política de retención.
- Dependencias: formatos reales de proveedores, OCR/IA, privacidad y almacenamiento.

### RF-027 — Conteo de inventario

- Prioridad propuesta: MVP
- Descripción: capturar conteos y compararlos con stock teórico.
- Criterios de aceptación:
  - El conteo muestra diferencias antes de aplicar ajustes.
  - Aplicar diferencias requiere permiso y genera movimientos auditados.
  - Se conserva quién contó, quién aprobó y cuándo.
- Dependencias: RF-022, RF-023 y permisos.

### RF-028 — Etiquetas y códigos de barras

- Prioridad propuesta: Condicionado; sólo para impresoras homologadas
- Descripción: diseñar e imprimir etiquetas de precio e identificadores compatibles con hardware definido.
- Criterios de aceptación:
  - La vista previa coincide con datos y formato configurados.
  - Un código generado identifica inequívocamente al artículo vendible dentro de su ámbito.
- Dependencias: impresoras, formatos, RF-016 e investigación de estándares.

### RF-029 — Catálogo compartido multisucursal

- Prioridad propuesta: Posterior al piloto
- Descripción: compartir catálogo entre sucursales manteniendo precio y stock por sucursal.
- Criterios de aceptación:
  - Un artículo mantiene identidad común sin mezclar existencias de sucursales.
  - Los cambios centrales y locales siguen reglas de herencia y permisos documentadas.
- Dependencias: modelo organizativo, sincronización y reglas de precios.

## Fuera del alcance inicial declarado

- Lotes y seguimiento de vencimientos.
- Separación de stock entre depósito, salón o góndolas.
- Órdenes de compra y recepciones parciales formales.
- Precio sugerido automáticamente a partir de costo y margen.
