# Despliegue, recuperación y soporte

- Estado: **Valores candidatos para línea base ratificados el 2026-09-26; validación técnica y condiciones comerciales pendientes**
- Fecha: 2026-09-20

## Entornos

- Desarrollo local con datos sintéticos.
- Integración continua para pruebas y análisis de dependencias.
- Preproducción aislada con dos navegadores/dispositivos y restauraciones.
- Producción piloto con un comercio y credenciales separadas.

Nunca se reutilizan secretos ni bases entre entornos.

### Arranque del scaffold local-first

El README del repositorio describe el arranque local de CouchDB, gateway y cliente. `.env.example` contiene sólo valores de desarrollo no secretos; `.env` es local e ignorado por Git. El runtime público generado para el cliente contiene configuración operativa no secreta. No incluir en él contraseñas CouchDB ni tokens del coordinador. El procedimiento todavía no tiene evidencia de ejecución integral.

El service worker del scaffold mantiene shell y assets estáticos descargados para apertura offline. La configuración runtime se actualiza por red con fallback a la última copia local. El service worker no intercepta métodos de escritura ni cachea rutas arbitrarias de API. La política de actualización y la compatibilidad de esquema deberán probarse antes de usarlo con operaciones comerciales.

La herramienta NDJSON es sólo de laboratorio, requiere credenciales locales del coordinador y un tenant sintético explícito. Crea una salida nueva sin sobrescribir y limpia archivos parciales ante fallos normales. Solicita modo `0600`; la protección efectiva depende de los permisos del sistema de archivos (en Windows, de la ACL del directorio). Guardar la salida fuera del repositorio, en un directorio restringido. Detener escrituras durante la extracción. No sustituye la exportación segura, autenticada y autorizada requerida por RF-052; Q-046 sigue abierta para el flujo tras el bloqueo de prueba.

Para promover un mismo bundle entre entornos, `@kioskina/client` ofrece `configure:static`: con las variables de cada entorno, puede generar `runtime-config.json`, manifiesto e icono en la carpeta indicada por `CLIENT_PUBLIC_OUTPUT_DIR` (por ejemplo, la carpeta estática ya construida). Las credenciales del gateway no deben incluirse en esas variables públicas.

En modo desarrollo Vite sirve módulos fuente; esa configuración no prueba la apertura offline del paquete instalado. T-PWA-001 debe ejecutarse sobre el build distribuible en un navegador de la matriz.

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
