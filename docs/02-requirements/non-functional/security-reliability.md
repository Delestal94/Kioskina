# Requisitos no funcionales — seguridad y confiabilidad

- Estado: **Borrador; métricas pendientes**

### RNF-001 — Integridad de auditoría

- Origen: entrevista 06
- Prioridad: candidata a MVP
- Criterio verificable preliminar: ninguna función ordinaria puede modificar o eliminar un evento; las correcciones agregan eventos vinculados y la integridad del archivo puede verificarse.

### RNF-002 — Aislamiento entre comercios

- Origen: RF-036 y análisis de seguridad
- Prioridad: obligatoria desde el diseño
- Criterio verificable preliminar: pruebas automatizadas negativas demuestran que una identidad sin autorización no puede leer, inferir, exportar ni modificar datos de otro comercio.

### RNF-003 — Protección de credenciales y datos en tránsito

- Origen: análisis de seguridad
- Prioridad: obligatoria
- Criterio verificable preliminar: contraseñas se derivan con algoritmo resistente y parámetros vigentes; toda comunicación remota autenticada usa cifrado de transporte; secretos no aparecen en registros.

### RNF-004 — Idempotencia de operaciones críticas

- Origen: ventas, pagos, sincronización y entrevista 06
- Prioridad: obligatoria
- Criterio verificable preliminar: reintentos, doble toque, reconexión y notificaciones duplicadas no duplican venta, cobro, movimiento de caja ni stock.

### RNF-005 — Recuperación y respaldo por plan

- Origen: entrevista 06
- Prioridad: bloqueante para oferta comercial
- Criterio verificable preliminar: cada plan declara y prueba pérdida máxima tolerable de datos, tiempo objetivo de recuperación, frecuencia de copia y procedimiento restaurado en simulacro.

### RNF-006 — Degradación comprensible sin conexión

- Origen: entrevista 06
- Prioridad: candidata a MVP
- Criterio verificable preliminar: el sistema informa conectividad y antigüedad de datos, impide funciones inseguras y conserva operaciones locales hasta sincronización dentro del período soportado.

### RNF-007 — Rendimiento de caja

- Origen: entrevista 07
- Prioridad: candidata a MVP
- Criterio verificable preliminar: bajo la carga y dispositivo mínimos definidos, agregar un artículo responde perceptiblemente en menos de 0,5 segundos y una venta común en efectivo puede completarse en menos de 30 segundos por un usuario capacitado.

### RNF-008 — Capacidad del piloto

- Origen: entrevista 07
- Prioridad: candidata a MVP
- Criterio verificable preliminar: soportar al menos dos cajas concurrentes, dos empleados, 2.000 artículos y 100 ventas diarias con margen de prueba pendiente de fijar.
- Criterio técnico del spike: paginar la lectura local para limitar memoria y registrar mediciones de lectura/escritura; no se considera validada la capacidad hasta ejecutar T-STORAGE-001 y las mediciones de carga acordadas.

### RNF-009 — Disponibilidad operativa continua

- Origen: entrevista 07
- Prioridad: objetivo pendiente de cuantificar
- Criterio verificable preliminar: la caja puede operar a cualquier hora; mantenimiento, dependencia cloud, modo offline y objetivo porcentual de disponibilidad deben documentarse por plan.

### RNF-010 — Compatibilidad web verificable

- Origen: entrevista 07
- Prioridad: candidata a MVP
- Criterio verificable preliminar: todos los flujos críticos pasan pruebas en la matriz publicada de navegadores, versiones, tamaños, entrada táctil y dispositivos.
- Criterio del spike: la PWA instalada puede volver a abrir su shell previamente descargado sin red; credenciales y respuestas de la API no se guardan en caché de recursos.

### RNF-011 — Despliegue reversible

- Origen: entrevista 07
- Prioridad: obligatoria
- Criterio verificable preliminar: una versión fallida puede detenerse y revertirse, incluyendo una estrategia probada para migraciones de datos compatibles.

### RNF-012 — Observabilidad con minimización de datos

- Origen: entrevista 07
- Prioridad: candidata a MVP
- Criterio verificable preliminar: errores y métricas permiten diagnosticar los flujos críticos sin capturar por defecto datos personales, comerciales o credenciales.

### RNF-013 — Autonomía de nodo

- Origen: entrevista 10
- Prioridad: obligatoria para MVP
- Criterio verificable preliminar: cada caja completa venta en efectivo, movimientos esenciales y cierre durante 24 horas sin Internet y con la otra caja apagada.

### RNF-014 — Convergencia de sincronización

- Origen: entrevista 10 y ADR-0001
- Prioridad: obligatoria
- Criterio verificable preliminar: después de restablecer conexión y procesar los mismos eventos, todos los nodos alcanzan los mismos resultados de ventas, caja y stock sin pérdida ni duplicación; conflictos no combinables quedan explícitos.
- Criterio adicional del spike: el cliente sólo retira de la outbox los eventos cuyo recibo se valida contra el lote enviado; IDs duplicados, faltantes o inesperados conservan los eventos como pendientes.

### RNF-015 — Durabilidad local

- Origen: entrevista 10 y ADR-0001
- Prioridad: obligatoria
- Criterio verificable preliminar: cerrar navegador, reiniciar dispositivo o sufrir un fallo durante una escritura no elimina eventos confirmados ni deja movimientos parciales; la prueba se ejecuta con la cuota y plataforma mínimas soportadas.

### RNF-016 — Configuración externa sin datos comerciales incrustados

- Origen: instrucción del fundador, 2026-09-26
- Prioridad: obligatoria
- Criterios de aceptación:
  1. Identidad de comercio, sucursal, dispositivo y actor, nombre de aplicación y endpoints se suministran mediante configuración del entorno; no se incorporan valores reales al código ni al bundle web.
  2. El cliente valida la configuración antes de iniciar y falla de forma comprensible si falta un valor o su formato es inválido.
  3. Ningún secreto del coordinador se entrega al cliente ni se guarda en el repositorio.
  4. Tokens y credenciales locales se mantienen fuera de Git; los valores del ejemplo son vacíos o no sensibles.
  5. Identificadores operativos, endpoints y límites de sincronización se pueden cambiar mediante `runtime-config.json` sin recompilar el bundle; branding/manifest se genera por separado desde `APP_*` para cada entorno.
