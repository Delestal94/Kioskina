# Requisitos funcionales — seguridad, hardware y continuidad

- Estado: **Borrador; no aprobado**
- Origen principal: entrevista al fundador 06
- Prioridades: propuesta de `../../01-product/mvp-prioritization.md`; no sustituyen la aprobación de línea base.

### RF-043 — Advertencia y resumen de ajustes compensatorios

- Prioridad propuesta: MVP
- Descripción: completar la venta, advertir después y consolidar los ajustes en un resumen diario para el dueño.
- Criterios de aceptación:
  - La advertencia no impide entregar una venta ya completada.
  - El resumen incluye artículo, faltante, usuario, venta, hora y saldo previo.
  - Un faltante de varias unidades genera exactamente la compensación necesaria.
- Dependencias: RF-021, notificaciones y auditoría.

### RF-044 — Inicio de sesión individual

- Prioridad propuesta: MVP
- Descripción: autenticar a cada persona mediante usuario y contraseña.
- Criterios de aceptación:
  - No se almacenan ni registran contraseñas en texto legible.
  - Las respuestas de error no revelan si existe una cuenta.
  - Inicio, cierre y fallos quedan auditados con contexto seguro.
- Dependencias: identidad, política de contraseñas y seguridad.

### RF-045 — Segundo factor configurable

- Prioridad propuesta: Condicionado; infraestructura preparada y 2FA de administrador si el canal está listo
- Descripción: permitir 2FA configurable por comercio, rol o nivel de riesgo.
- Criterios de aceptación:
  - La activación y desactivación requieren permiso y quedan auditadas.
  - Existen códigos o proceso de recuperación protegido.
  - Se definirá un valor seguro por defecto para administradores antes del lanzamiento.
- Dependencias: proveedor de identidad, canales y recuperación.

### RF-046 — Recuperación de acceso

- Prioridad propuesta: MVP
- Descripción: recuperar mediante administrador autorizado o autoservicio verificado por correo/WhatsApp.
- Criterios de aceptación:
  - Los tokens son de uso único, expiran y no exponen la contraseña anterior.
  - La recuperación genera auditoría y aviso por canales registrados.
  - Cambiar datos de recuperación es una acción sensible separada.
- Dependencias: correo, WhatsApp, identidad y prevención de abuso.

### RF-047 — Política de intentos fallidos

- Prioridad propuesta: MVP
- Descripción: configurar límites dentro de rangos seguros y aplicar demoras o bloqueos temporales.
- Criterios de aceptación:
  - La configuración no puede desactivar toda defensa automatizada contra intentos masivos.
  - El desbloqueo y los intentos se auditan.
  - El control no permite bloquear permanentemente a todo administrador sin recuperación.
- Dependencias: identidad, alertas y soporte.

### RF-048 — Sesión sin cierre automático

- Prioridad: decisión de riesgo aceptada provisionalmente; pendiente de prueba de campo
- Descripción: no cerrar ni bloquear automáticamente la sesión y no exigir bloqueo rápido/reautenticación adicional, según preferencia del fundador.
- Criterios de aceptación preliminares:
  - Debe existir cierre de sesión manual accesible.
  - La interfaz indica claramente qué usuario permanece activo.
  - La decisión se reevalúa en dispositivos compartidos del piloto y se registra cualquier incidente.
- Dependencias: modelo de amenazas, UX y permisos.

### RF-049 — Auditoría integral y archivo mensual

- Prioridad propuesta: MVP por subconjunto
- Descripción: auditar dominios críticos y mover períodos cerrados a archivo consultable mensualmente.
- Criterios de aceptación:
  - Cada evento conserva actor, acción, objetivo, momento, comercio, dispositivo y resultado, sin secretos.
  - Archivar no elimina ni altera eventos.
  - La consulta aplica permisos y permite verificar integridad.
  - El administrador sólo puede elegir plazos iguales o superiores a mínimos legales/contractuales.
- Dependencias: política de retención, almacenamiento y observabilidad.

### RF-050 — Rectificaciones inmutables

- Prioridad propuesta: MVP
- Descripción: corregir mediante un nuevo registro vinculado, sin editar o borrar el original.
- Criterios de aceptación:
  - Se visualizan original, rectificación, motivo, autor y autorización.
  - Los reportes aplican reglas explícitas para el valor vigente sin perder historial.
- Dependencias: auditoría y cada dominio rectificable.

### RF-051 — Acceso temporal de soporte

- Prioridad propuesta: MVP si se ofrece soporte remoto
- Descripción: conceder acceso limitado y temporal con autorización del dueño.
- Criterios de aceptación:
  - La autorización especifica alcance y vencimiento y puede revocarse.
  - El soporte opera con identidad propia; no suplanta al cliente.
  - Toda consulta y cambio del soporte queda auditado y visible al dueño.
- Dependencias: permisos, identidad, herramientas de soporte y privacidad.

### RF-052 — Exportación y cierre de cuenta

- Prioridad propuesta: MVP para exportación; cierre pendiente (Q-046)
- Descripción: permitir al dueño obtener datos y solicitar cierre controlado.
- Criterios de aceptación:
  - La exportación exige autenticación reforzada y entrega segura.
  - El cierre informa efectos, deudas, retención legal y período de recuperación si existe.
  - La eliminación no borra información que deba conservarse legalmente; la política será explícita.
- Dependencias: privacidad, facturación del servicio, retención y almacenamiento.

### RF-053 — Modalidades de almacenamiento y recuperación

- Prioridad: decisión de producto/arquitectura pendiente
- Descripción: distinguir plan local y plan cloud, dejando claras recuperación, respaldo y sincronización.
- Criterios de aceptación preliminares:
  - Antes de contratar se informa qué se guarda, dónde, cómo se respalda y qué ocurre ante pérdida del dispositivo.
  - El plan cloud permite reanudar desde un dispositivo autorizado con datos recuperados según objetivos definidos.
  - Un plan local sin copia exige advertencia explícita; se evaluará una copia recuperable mínima.
- Dependencias: ADR de despliegue, modelo comercial, respaldo y normativa.

### RF-054 — Operación sin periféricos

- Prioridad propuesta: MVP
- Descripción: completar flujos esenciales usando sólo un dispositivo compatible.
- Criterios de aceptación:
  - Código, búsqueda, peso, efectivo y comprobante tienen alternativa manual/digital.
  - La ausencia o falla de un periférico opcional no bloquea una venta en efectivo.
- Dependencias: diseño táctil y matriz de dispositivos.

### RF-055 — Lector opcional tipo teclado

- Prioridad propuesta: MVP
- Descripción: aceptar lectores USB/Bluetooth que emulan entrada de teclado.
- Criterios de aceptación:
  - Un escaneo completo se procesa una vez y no se mezcla con otros campos.
  - Códigos inexistentes siguen el flujo de búsqueda/alta autorizado.
- Dependencias: RF-002, dispositivos y navegadores/SO.

### RF-056 — Interrupción por falla del dispositivo

- Prioridad propuesta: MVP
- Descripción: cancelar una venta no confirmada si el dispositivo falla y evitar efectos parciales o duplicados.
- Criterios de aceptación:
  - Si no hubo confirmación, no quedan caja ni stock modificados.
  - Si el resultado es incierto, al reiniciar se consulta/resuelve antes de permitir repetir el cobro.
  - La cancelación o recuperación queda auditada.
- Dependencias: transacciones, idempotencia, pagos y almacenamiento.

### RF-057 — Operación local durante intermitencia

- Prioridad: MVP; validación técnica obligatoria mediante ADR-0001 a ADR-0003
- Descripción: permitir durante hasta 24 horas la venta en efectivo, los movimientos locales esenciales y el cierre sin Internet ni dependencia de la otra caja. QR/transferencias verificadas, WhatsApp y fiscalidad electrónica se bloquean o quedan pendientes mientras no exista el servicio remoto requerido.
- Criterios de aceptación:
  - El estado sin conexión y las funciones no disponibles son visibles antes de cobrar.
  - Cada caja puede completar las operaciones permitidas durante 24 horas con la otra caja apagada.
  - Al reconectar se sincroniza sin duplicar y se señalan conflictos.
- Dependencias: RF-013, RF-053, fiscalidad y ADR-0001 a ADR-0003.

### RF-058 — Venta de equipos configurados

- Prioridad propuesta: Posterior/paralelo; no bloquea el software
- Descripción: ofrecer equipos homologados/configurados con condiciones de entrega, garantía y reemplazo.
- Criterios de aceptación preliminares:
  - Cada equipo vendido identifica configuración, compatibilidad, garantía y responsable de soporte.
  - Los datos del cliente se separan de imágenes/configuraciones maestras.
- Dependencias: proveedores, inventario comercial, soporte y matriz de hardware.

### RF-059 — Atención de soporte

- Prioridad propuesta: MVP
- Descripción: brindar canales remoto y presencial en una ventana candidata de 09:00 a 21:00.
- Criterios de aceptación preliminares:
  - Días, zona horaria, tiempos de respuesta, severidades y cobertura presencial quedan publicados.
  - Fuera de horario existe un canal y expectativa explícita para incidentes críticos.
- Dependencias: capacidad del equipo, modelo comercial, monitoreo y acuerdos de servicio.
