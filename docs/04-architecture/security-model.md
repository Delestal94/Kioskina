# Modelo de seguridad

- Estado: **Propuesta; revisión de amenazas pendiente**
- Fecha: 2026-09-20

## Activos y amenazas prioritarias

Se protegen dinero, ventas, stock, datos personales, credenciales, auditoría y capacidad de operar. Las amenazas principales son: uso de una sesión ajena en dispositivo compartido, robo o pérdida del equipo, credenciales comprometidas, acceso entre comercios, manipulación/repetición de eventos, soporte excesivo y software desactualizado.

## Controles de identidad

- Cuenta individual; nunca cuentas compartidas de cajero o soporte.
- Contraseñas derivadas en servidor con Argon2id y parámetros revisados antes del lanzamiento.
- 2FA configurable, recomendado por defecto para administradores y obligatorio para soporte interno.
- Recuperación con token breve, uso único, aviso y auditoría; WhatsApp/correo no equivalen por sí solos a identidad suficiente para acciones de alto impacto.
- Roles acumulables y permisos con denegación por defecto.
- Acciones sensibles registran solicitante, autorizador, motivo y alcance.

## Roles iniciales del MVP

La matriz inicial ratificada el 2026-09-26 define tres roles acumulables:

- **Cajero:** vende y opera su propio turno; no edita precios, anula/devuelve ventas ni ajusta stock.
- **Encargado:** puede autorizar descuentos, anulaciones y ajustes de stock, y consultar reportes operativos.
- **Dueño/administrador:** incluye las capacidades de administración de usuarios, permisos, configuración y exportaciones.
- Cualquier otro acceso debe concederse explícitamente; la denegación es el valor predeterminado. Cada comercio puede acumular roles por usuario, y las acciones sensibles quedan auditadas.

## Autenticación offline

Para vender 24 horas sin conexión, el dispositivo podrá validar una credencial local protegida y limitada a usuarios previamente habilitados. La caché no contendrá la contraseña. Tendrá fecha de emisión, vencimiento máximo, comercio, dispositivo y permisos offline. Una revocación realizada durante el corte no puede surtir efecto hasta sincronizar; la interfaz mostrará la antigüedad de la política. Recuperación, alta de administradores, acceso de soporte y cambios críticos requerirán conexión.

La ausencia de bloqueo automático es un riesgo aceptado provisionalmente, no un control recomendado. Deben mantenerse usuario activo visible y cierre manual accesible; toda acción conserva el actor de la sesión.

## Dispositivo y transporte

- Alta de dispositivo autorizada y revocable, con credencial propia distinta de la del usuario.
- TLS para todo tráfico remoto y tokens de acceso breves con renovación controlada.
- Gateway con validación de tenant, sucursal, dispositivo, usuario y tipo de documento/evento.
- Protección contra repetición mediante ID, clave de idempotencia y secuencia de dispositivo.
- Ningún secreto de proveedor o credencial maestra dentro del bundle PWA.
- Solicitar almacenamiento persistente, vigilar cuota y advertir si el navegador puede desalojar datos.

## Datos y privacidad

- Recolectar sólo datos necesarios por flujo y separar datos personales de telemetría técnica.
- No registrar contraseñas, tokens, datos completos de pago ni contenido innecesario en logs.
- Exportación y soporte usan autorización reforzada y entrega segura.
- Cifrado de disco del sistema operativo se recomendará para equipos vendidos; el cifrado fiable de la base web se validará en el spike y no se prometerá sin prueba.
- Políticas de retención con mínimos no reducibles y proceso de derechos aun después del bloqueo comercial.

## Acceso de soporte

El dueño emite una concesión temporal con alcance y vencimiento. El agente usa su identidad Kioskina y cada acceso queda visible y auditado. La concesión no permite obtener contraseñas, desactivar auditoría ni cruzar comercios.

## Verificaciones antes del piloto

- Modelo de amenazas por flujo y revisión OWASP aplicable.
- Pruebas negativas de aislamiento entre comercios.
- Revocación, pérdida de dispositivo, recuperación y replay.
- Revisión de dependencias y SBOM.
- Simulación de versión vulnerable/incompatible y política de corte de sincronización.
- Procedimiento de incidente, notificación y preservación de evidencia.

