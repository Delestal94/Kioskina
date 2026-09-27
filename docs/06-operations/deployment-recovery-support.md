# Despliegue, recuperación y soporte

- Estado: **Valores candidatos para línea base ratificados el 2026-09-26; validación técnica y condiciones comerciales pendientes**
- Fecha: 2026-09-20

## Operación de la entrega interna Windows (2026-09-27)

La aplicación de prueba se ejecuta con Vite sobre localhost y usa IndexedDB del navegador. Chrome y Edge conservan bases distintas; no existe sincronización entre ambas. Desde Configuración, el dueño descarga una copia JSON y puede restaurarla con confirmación; el archivo contiene datos y hashes de credenciales. Usar sólo datos ficticios y guardar la copia fuera de la PC. El código permite restaurar una copia validada, pero un simulacro manual en Chrome y Edge, con cierre/reapertura y pérdida de almacenamiento, sigue pendiente. Las metas de RPO/RTO del coordinador descritas abajo no aplican a esta entrega local. La entrega comercial exige una política automática de copias, seguridad y recuperación revisada.

## Entornos

- Desarrollo local con datos sintéticos.
- Integración continua para pruebas y análisis de dependencias.
- Preproducción aislada con dos navegadores/dispositivos y restauraciones.
- Producción piloto con un comercio y credenciales separadas.

Nunca se reutilizan secretos ni bases entre entornos.

## Entrega de la PWA

- Artefactos versionados e inmutables con hash.
- Despliegue gradual al piloto y posibilidad de detener promoción.
- El Service Worker descarga una versión, pero no la activa en medio de una venta o con migración incompatible pendiente.
- Cambios de esquema siguen expandir/migrar/contraer y declaran versión mínima compatible de sincronización.
- Rollback ensayado; si los datos ya migraron, se usa compatibilidad hacia atrás o restauración documentada, no una reversión ciega.

## Coordinador

- Gateway y CouchDB no se publican con credenciales predeterminadas.
- TLS, secretos externos a imágenes, principio de mínimo privilegio y red restringida.
- Salud de gateway, cola, rechazos, conflictos, espacio, backup y versión se monitorean.
- Alertas no incluyen nombres, teléfonos, productos vendidos ni importes salvo diagnóstico autorizado y necesario.

## Respaldo y recuperación

Valores candidatos para el plan piloto con coordinador, ratificados por el fundador para la línea base el 2026-09-26; validar mediante spike y no publicar como SLA hasta completar revisión operativa:

- RPO central: 15 minutos para datos ya sincronizados.
- RTO del coordinador: 4 horas dentro del horario de soporte.
- Operación local durante caída: 24 horas objetivo.
- Backup cifrado diario completo más mecanismo incremental, conservado en ubicación separada.
- Prueba de restauración mensual y antes de cambios mayores.
- Exportación técnica de eventos independiente de CouchDB.

Una operación aún no sincronizada sólo existe en el dispositivo: el sistema debe advertirlo. Perder ese dispositivo puede superar el RPO central. El plan “local sin copia” no debe presentarse como recuperable.

## Pérdida o reemplazo de dispositivo

1. Revocar credencial del equipo perdido cuando exista conexión.
2. Registrar incidente y última secuencia sincronizada.
3. Autorizar equipo nuevo.
4. Restaurar datos y verificar proyecciones/checkpoints.
5. Si reaparece el equipo viejo, bloquear envío hasta conciliar eventos no recibidos con un procedimiento controlado.
6. Cerrar incidente con evidencia y auditoría.

## Severidades y objetivos candidatos

| Severidad | Ejemplo | Primera respuesta durante cobertura | Objetivo operativo |
|---|---|---:|---|
| S1 crítica | no se puede vender en ninguna caja, pérdida/corrupción o aislamiento roto | 30 min | contención inmediata; actualización cada 60 min |
| S2 alta | una caja bloqueada sin alternativa o totales dudosos | 2 h | workaround/restauración prioritaria |
| S3 media | función secundaria falla | 1 día hábil de soporte | planificar corrección |
| S4 baja | consulta o mejora | 2 días hábiles de soporte | incorporar a backlog |

Cobertura candidata ya declarada: lunes, miércoles y viernes de 09:00 a 21:00, America/Argentina/Buenos_Aires, en Jujuy o Tucumán. Falta definir radio presencial y expectativas fuera de horario; no prometer disponibilidad 24×7.

## Runbooks obligatorios antes del piloto

- Caja no inicia / almacenamiento lleno.
- Venta con resultado incierto.
- Pago electrónico tardío o duplicado.
- Sincronización detenida o conflicto masivo.
- Pérdida/robo de dispositivo.
- Restauración del coordinador.
- Revocación de usuario/soporte.
- Rollback de aplicación/esquema.
- Incidente de privacidad o seguridad.

## Prueba vencida y datos

El bloqueo comercial puede impedir operación, pero no debe destruir datos ni bloquear derechos legales. Como el fundador rechazó exportación desde la UI después del vencimiento, deberá existir un proceso de soporte autenticado para exportación/derechos y una política comunicada de retención. Este punto sigue abierto y bloquea términos comerciales definitivos.

