# Requisitos funcionales — clientes, promociones y gestión

- Estado: **Borrador; no aprobado**
- Origen principal: entrevista al fundador 05
- Prioridades: propuesta de `../../01-product/mvp-prioritization.md`; no sustituyen la aprobación de línea base.

### RF-030 — Identificación opcional de cliente

- Prioridad propuesta: MVP
- Descripción: permitir venta anónima e identificar o crear cliente cuando el flujo lo necesite.
- Criterios de aceptación:
  - La venta común no exige datos personales salvo obligación aplicable.
  - El fiado no puede confirmarse sin un cliente identificable.
  - La búsqueda y creación rápida detectan posibles duplicados.
- Dependencias: privacidad, facturación y RF-009.

### RF-031 — Ficha y privacidad de cliente

- Prioridad propuesta: MVP con datos mínimos
- Descripción: administrar nombre, documento/CUIT, teléfono, correo, domicilio y fecha de nacimiento cuando exista propósito válido.
- Criterios de aceptación:
  - Se distingue dato obligatorio, opcional y no solicitado según el flujo.
  - Acceso, modificación y exportación respetan permisos y quedan auditados.
  - Retención, corrección y eliminación/anominización siguen política legal pendiente.
- Dependencias: análisis de protección de datos, seguridad y consentimiento.

### RF-032 — Crédito y cuenta corriente de cliente

- Prioridad propuesta: MVP
- Descripción: gestionar límite, vencimiento, bloqueo, consumos y pagos parciales.
- Criterios de aceptación:
  - Antes de vender muestra deuda, crédito disponible y cualquier bloqueo.
  - Exceder límite o bloqueo requiere la regla/autorización definida.
  - Todo movimiento conserva saldo anterior, importe, saldo posterior, usuario y referencia.
- Dependencias: RF-009, RF-030, permisos y caja.

### RF-033 — Estado de cuenta del cliente

- Prioridad propuesta: MVP
- Descripción: generar y compartir un resumen comprensible de deuda y movimientos.
- Criterios de aceptación:
  - El saldo del resumen coincide con el libro de movimientos.
  - El envío utiliza datos de contacto autorizados y registra canal, fecha y resultado.
- Dependencias: RF-032, comprobantes, privacidad y mensajería.

### RF-034 — Promociones, cupones y mejor beneficio

- Prioridad propuesta: Reducido; descuento autorizado y precio por cantidad
- Descripción: admitir 2×1, segunda unidad, porcentaje, importe fijo y producto de regalo, eligiendo el beneficio válido más conveniente.
- Criterios de aceptación:
  - La interfaz muestra promoción aplicada, ahorro y condiciones.
  - El resultado es determinista ante el mismo carrito, cliente, sucursal y momento.
  - Las reglas de acumulación, exclusión y precedencia se definen antes de implementación.
  - Quitar o devolver artículos recalcula o revierte el beneficio correctamente.
- Dependencias: RF-005, RF-019 y reglas de precios.

### RF-035 — Comunicación por WhatsApp

- Prioridad propuesta: Condicionado; sólo para recuperación o recibo si se elige proveedor
- Descripción: enviar comprobantes, estados de cuenta o promociones mediante proveedor autorizado.
- Criterios de aceptación:
  - El sistema diferencia mensajes transaccionales y comerciales.
  - Los mensajes comerciales exigen consentimiento y mecanismo de baja según normativa/políticas aplicables.
  - Se registra intento, proveedor, resultado y contenido o plantilla utilizada sin exponer datos innecesarios.
- Dependencias: proveedor de WhatsApp, privacidad, consentimiento, plantillas y costos.

### RF-036 — Administración de varios comercios

- Prioridad propuesta: Reducido; aislamiento obligatorio, consola multisucursal posterior
- Descripción: permitir que una identidad autorizada acceda a varios comercios independientes sin mezclar datos.
- Criterios de aceptación:
  - Cada consulta y operación se ejecuta en un comercio explícito.
  - Cambiar de comercio es visible y no arrastra caja, stock ni permisos incorrectos.
  - Una persona puede tener roles diferentes en cada comercio.
- Dependencias: aislamiento multiempresa, identidad y autorización.

### RF-037 — Reportes operativos y exportaciones

- Prioridad propuesta: MVP; ventas diarias, caja, stock, movimientos, fiado y exportación simple
- Descripción: reportar ventas por fecha, producto, categoría, cajero y medio; caja y diferencias; stock y movimientos; resultados estimados; cuentas de clientes y proveedores; exportar a XLSX, CSV y PDF.
- Criterios de aceptación:
  - Cada reporte declara filtros, zona horaria, moneda y fecha de generación.
  - Totales concilian con operaciones fuente bajo reglas documentadas.
  - La exportación respeta los mismos permisos y filtros que la pantalla.
- Dependencias: todos los dominios fuente, permisos y definición de margen/ganancia.

### RF-038 — Visibilidad de información por permisos

- Prioridad propuesta: MVP
- Descripción: limitar por defecto al cajero a sus operaciones y turno; costos, ganancias, deudas, clientes y actividad ajena requieren permisos separados.
- Criterios de aceptación:
  - La denegación se aplica tanto en interfaz como API y exportaciones.
  - Los roles iniciales usan mínimos privilegios y pueden ampliarse de manera explícita.
  - Los cambios de acceso quedan auditados.
  - Los permisos iniciales respetan RN-028; dueño/administrador puede gestionar usuarios, roles, configuración y exportaciones; encargado ve reportes operativos; el cajero queda limitado a su turno y operaciones propias salvo permiso explícito.
- Dependencias: roles, permisos, auditoría y RF-037.

### RF-039 — Alertas configurables

- Prioridad propuesta: MVP; subconjunto de alertas por definir (Q-022/Q-026)
- Descripción: alertar a destinatarios autorizados por anulaciones, diferencias de caja, descuentos, ajustes compensatorios y operaciones inusuales.
- Criterios de aceptación:
  - Se configuran evento, umbral, destinatario, canal y frecuencia dentro de límites seguros.
  - Las alertas repetidas se agrupan o limitan para evitar saturación.
  - Cada alerta enlaza a la evidencia que la originó sin exponerla a destinatarios no autorizados.
- Dependencias: eventos de negocio, notificaciones, permisos y detección de anomalías.

### RF-040 — Exportación para contabilidad

- Prioridad propuesta: MVP en formato simple
- Descripción: exportar información para el contador sin integrar inicialmente un sistema contable.
- Criterios de aceptación:
  - El período y contenido exportado son explícitos y reproducibles.
  - El formato se validará con al menos un contador de los comercios piloto.
- Dependencias: requisitos fiscales y RF-037.

### RF-041 — Gestión de personal

- Prioridad propuesta: Posterior al MVP; dividir antes de estimar
- Descripción: evaluar horarios, asistencia y comisiones; sueldos requieren análisis laboral/contable independiente.
- Criterios de aceptación preliminares:
  - No se incorporará liquidación de sueldos al MVP sin investigación legal y alcance aprobado.
  - Asistencia y horarios, si se priorizan, se separarán de permisos operativos.
- Dependencias: legislación laboral, privacidad e identidad.

### RF-042 — Panel móvil del dueño

- Prioridad propuesta: Reducido; vistas responsive, sin aplicación móvil separada
- Descripción: consultar desde teléfono ventas, estado de caja y alertas autorizadas.
- Criterios de aceptación:
  - La vista se adapta a pantallas pequeñas y no requiere precisión fina.
  - Datos sensibles requieren autenticación adecuada y respetan aislamiento de comercio.
  - La actualización indica hora y posible demora de sincronización.
- Dependencias: identidad, seguridad, conectividad, RF-037 y RF-039.

## Capacidades posteriores confirmadas

- Fidelización por puntos.
- Membresías y niveles de cliente.
- Precios personales o mayoristas avanzados.
- Tienda en línea y delivery.
- Integración contable directa.
