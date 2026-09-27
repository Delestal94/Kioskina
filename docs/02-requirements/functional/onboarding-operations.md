# Requisitos funcionales — incorporación y operación del servicio

- Estado: **Borrador; no aprobado**
- Origen principal: entrevista al fundador 07
- Prioridades: propuesta de `../../01-product/mvp-prioritization.md`; no sustituyen la aprobación de línea base.

### RF-060 — Aplicación web instalable

- Prioridad propuesta: MVP
- Descripción: ejecutar en navegador y permitir instalación con experiencia de aplicación en dispositivos compatibles.
- Criterios de aceptación:
  - Instalación, actualización y desinstalación están documentadas por navegador soportado.
  - La aplicación indica versión, conectividad y disponibilidad de una actualización.
  - Funciones offline respetan RF-057 y no dependen de que el navegador conserve datos indefinidamente sin control.
- Dependencias: matriz de navegadores, almacenamiento local, PWA/ADR y seguridad.

### RF-061 — Importación inicial y validación

- Prioridad propuesta: MVP; Excel/CSV y entrada manual
- Descripción: cargar productos, precios, stock y otros datos aprobados desde Excel, entrada manual o escaneo.
- Criterios de aceptación:
  - La importación muestra vista previa, errores, duplicados y cambios antes de aplicar.
  - Sólo administrador o responsable autorizado confirma.
  - Aplicar o revertir un lote queda auditado sin dejar estado parcial.
- Dependencias: RF-026, plantillas, OCR y datos de piloto.

### RF-062 — Configuración guiada del comercio

- Prioridad propuesta: MVP
- Descripción: permitir preparar comercio, usuarios, cajas, productos, stock y políticas en una meta inicial de 4 a 8 horas.
- Criterios de aceptación:
  - Un checklist muestra pendientes y bloqueos antes de abrir ventas.
  - La configuración puede pausarse y reanudarse.
  - Se realiza una venta de prueba y cierre de prueba antes de habilitar producción.
- Dependencias: onboarding, importación, roles, caja y soporte.

### RF-063 — Ayuda de autoservicio por plan

- Prioridad propuesta: MVP
- Descripción: ofrecer ayuda sencilla en el plan básico y capacitación humana según servicio contratado.
- Criterios de aceptación:
  - Los flujos críticos tienen ayuda contextual y guía breve accesible.
  - El usuario puede distinguir soporte incluido, capacitación contratada y material gratuito.
- Dependencias: contenido, UX, accesibilidad y modelo comercial.

### RF-064 — Prueba gratuita

- Prioridad propuesta: Lanzamiento; prueba de 14 días
- Descripción: habilitar un período candidato de 14 días con inicio, vencimiento y conversión explícitos.
- Criterios de aceptación:
  - Antes de comenzar se informa qué incluye, qué ocurre al vencer y cómo exportar datos.
  - El vencimiento no elimina datos sin aviso y política de retención.
  - La conversión no altera ni duplica operaciones.
- Dependencias: planes, facturación de Kioskina, términos y ciclo de vida de datos.

### RF-065 — Actualizaciones y reversión

- Prioridad propuesta: MVP
- Descripción: administrar actualizaciones opcionales dentro de compatibilidad y revertir automáticamente despliegues fallidos.
- Criterios de aceptación:
  - El sistema informa versión, cambios, compatibilidad y necesidad de reinicio.
  - Una actualización fallida no impide volver a vender con la versión segura anterior.
  - Parches críticos son gratuitos pero el fundador no desea hacerlos obligatorios; versiones vulnerables quedan señaladas y sujetas a límites de soporte/conectividad por definir.
- Dependencias: despliegue, migraciones, telemetría y modelo de soporte por versiones.

### RF-066 — Telemetría técnica respetuosa de datos

- Prioridad propuesta: MVP
- Descripción: recopilar errores, rendimiento y salud sin incluir contenido comercial o personal innecesario.
- Criterios de aceptación:
  - Existe inventario de eventos y campos recopilados.
  - Secretos, contraseñas, importes, nombres y documentos no se incluyen por defecto.
  - El cliente conoce la telemetría aplicable y las opciones legales de control.
- Dependencias: privacidad, observabilidad y soporte.

### RF-067 — Panel operativo interno

- Prioridad propuesta: MVP reducido
- Descripción: mostrar salud de dispositivos, sincronización, errores, versión y último respaldo al equipo autorizado.
- Criterios de aceptación:
  - Acceso del equipo se limita por rol y se audita.
  - El panel muestra antigüedad y fuente del estado, sin aparentar tiempo real cuando no lo es.
  - No expone datos comerciales salvo autorización justificada.
- Dependencias: RF-051, RF-066, respaldos y seguridad.

### RF-068 — Gestión de tickets

- Prioridad propuesta: MVP
- Descripción: registrar incidentes y solicitudes en un sistema de tickets.
- Criterios de aceptación:
  - Cada ticket tiene comercio, contacto, severidad, estado, responsable, tiempos y resolución.
  - Adjuntos y diagnósticos respetan privacidad y permisos.
  - Incidentes críticos pueden escalarse según SLA pendiente.
- Dependencias: herramienta/proceso de soporte y RF-059.

### RF-069 — Capacidades y actualizaciones por plan

- Prioridad propuesta: Reducido; sin matrices arquitectónicas distintas por plan
- Descripción: habilitar servicios según plan sin negar correcciones necesarias para seguridad e integridad.
- Criterios de aceptación:
  - La matriz de planes declara funciones, límites, soporte, respaldo, capacitación y actualización.
  - Reducir/cambiar plan no corrompe ni elimina datos silenciosamente.
  - Los parches críticos son gratuitos y no quedan bloqueados por falta de suscripción; su instalación no será obligatoria por decisión del fundador, con riesgos y límites de soporte explícitos.
- Dependencias: modelo comercial, licenciamiento y políticas de seguridad.
