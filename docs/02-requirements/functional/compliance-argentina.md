# Requisitos funcionales — cumplimiento inicial en Argentina

- Estado: **Borrador basado en fuentes oficiales; requiere validación profesional**
- Fuente: `docs/00-discovery/research/argentina-compliance-initial.md`

### RF-070 — Separación de ticket interno y comprobante fiscal

- Prioridad: bloqueante para piloto real
- Descripción: distinguir inequívocamente registro/ticket interno de un comprobante fiscal autorizado.
- Criterios de aceptación:
  - Ninguna pantalla o documento denomina factura fiscal a un registro sin autorización válida.
  - Si la integración no existe, el cierre de venta informa el proceso fiscal externo requerido.
  - El comercio confirma y documenta su modalidad externa antes del piloto.
- Dependencias: condición tributaria, ARCA, RF-012 y proceso del comercio.

### RF-071 — Aviso y minimización de datos personales

- Prioridad: bloqueante antes de recopilar clientes/empleados
- Descripción: informar finalidad, responsable, destinatarios, obligatoriedad y derechos; solicitar sólo datos necesarios.
- Criterios de aceptación:
  - Cada campo de cliente tiene finalidad, obligatoriedad y retención documentadas.
  - El aviso se presenta antes o al recolectar y conserva versión/evidencia aplicable.
  - Datos opcionales pueden omitirse sin bloquear flujos que no los necesitan.
- Dependencias: Ley 25.326, contratos y RF-031.

### RF-072 — Solicitudes de titulares

- Prioridad: necesaria para operación comercial
- Descripción: gestionar acceso, rectificación, actualización y supresión/anominización cuando corresponda.
- Criterios de aceptación:
  - La identidad se verifica antes de revelar o cambiar datos.
  - Se registran solicitud, plazo, decisión, respuesta y fundamento de conservación.
  - La respuesta no revela datos de terceros.
- Dependencias: privacidad, identidad, retención y soporte.

### RF-073 — Retención por categoría y mínimo legal

- Prioridad: bloqueante para arquitectura de datos
- Descripción: permitir configuración sólo dentro de límites legales/contractuales por tipo de registro.
- Criterios de aceptación:
  - Una política inferior al mínimo aplicable es rechazada.
  - Venta/fiscal, auditoría, soporte, telemetría y datos personales tienen categorías separadas.
  - La eliminación o anonimización es auditable y admite suspensión por obligación legal.
- Dependencias: validación profesional, archivo, respaldos y ciclo de vida de datos.

### RF-074 — Registro y roles de privacidad

- Prioridad: necesaria antes del lanzamiento comercial
- Descripción: mantener datos del responsable/encargado, bases registradas y contactos para derechos.
- Criterios de aceptación:
  - Avisos y contratos identifican correctamente a cada parte.
  - El estado de inscripción y responsables puede auditarse por comercio/servicio.
- Dependencias: AAIP, modelo contractual y arquitectura local/cloud/híbrida.

### RF-075 — Control de campañas comerciales

- Prioridad: posterior al MVP
- Descripción: antes de mensajes promocionales, gestionar consentimiento/base aplicable, baja y Registro No Llame.
- Criterios de aceptación:
  - Mensajes transaccionales y comerciales usan propósitos y plantillas distintas.
  - Una baja bloquea nuevas campañas dentro del plazo definido.
  - La elegibilidad se verifica contra obligaciones vigentes antes del envío.
- Dependencias: WhatsApp, proveedor, privacidad y Ley 26.951.
