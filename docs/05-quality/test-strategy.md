# Estrategia de calidad y pruebas

- Estado: **Propuesta para línea base**
- Fecha: 2026-09-20

## Principios

- Probar invariantes y fallos, no sólo caminos felices.
- Cada requisito nuevo incluye criterios verificables e IDs de prueba antes de implementarse.
- El mismo caso crítico se prueba local, durante partición y después de reconectar.
- Ningún resultado manual aislado sustituye automatización repetible para dinero, stock o permisos.
- Los datos de prueba son sintéticos y no contienen información personal real.

## Niveles

| Nivel | Objetivo | Ejemplos |
|---|---|---|
| Unidad | Reglas puras | totales, vuelto, precisión, permisos, ajuste compensatorio |
| Propiedades | Invariantes para muchas combinaciones | movimientos conservan saldos; replay no duplica; reversión neutraliza |
| Contrato | Compatibilidad entre cliente, gateway e integraciones | versiones de evento, errores, webhooks, exportación |
| Integración local | Persistencia y transacciones | cierre abrupto, cuota, migración, reconstrucción |
| Sincronización | Convergencia distribuida | offline 24 h, orden aleatorio, duplicados, huecos y conflictos |
| E2E | Flujos visibles en navegadores reales | venta, turno, stock, fiado, permisos y reportes |
| Accesibilidad/usabilidad | Uso táctil y comprensible | teclado opcional, lector de pantalla, zoom, tamaño de objetivo, errores |
| Seguridad | Abuso y aislamiento | autorización negativa, replay, revocación, soporte temporal |
| Operación | Despliegue y recuperación | backup, restore, rollback, pérdida de dispositivo |

## Integración continua del spike

`.github/workflows/ci.yml` automatiza en GitHub los typechecks y builds del monorepo con Node fijado por `.nvmrc`. El runner sólo tiene permiso de lectura y compila el cliente con identidad sintética. No ejecuta suites de comportamiento. La suite de sincronización permanece definida aparte; la CI tampoco reemplaza CouchDB, navegadores/hardware reales, particiones de 24 horas, restore ni revisión manual de seguridad. No despliega ni publica.

## Suites críticas iniciales

| ID | Escenario | Resultado esperado |
|---|---|---|
| T-SYNC-001 | Dos cajas venden offline 24 h y reconectan | Mismos eventos/proyecciones, sin pérdidas ni duplicados |
| T-SYNC-002 | Reenvío y entrega fuera de orden | Un efecto por evento; faltantes detectados |
| T-SYNC-003 | Precio concurrente | Conflicto visible y resolución futura sin cambiar ventas |
| T-SYNC-004 | Gateway responde con IDs faltantes, repetidos o extraños | El cliente no marca eventos como aceptados si los recibos no coinciden exactamente con el lote enviado |
| T-SYNC-005 | Descarga incremental repetida o interrumpida durante aplicación local | Eventos idempotentes; el cursor sólo avanza tras aplicar la página; la siguiente descarga no omite cambios |
| T-SYNC-006 | Huecos o secuencias duplicadas en eventos de un dispositivo | La anomalía se informa y no se declara convergencia; al completar el hueco, el estado se recalcula |
| T-SYNC-007 | Evento con tipo o versión futura/desconocida | Rechazo antes de persistir y sin adelantar el cursor |
| T-SYNC-008 | Salud del coordinador | La UI no reporta sincronización disponible si CouchDB no responde; falta validar contra CouchDB real |
| T-SYNC-009 | Sincronizar venta del spike | Dos nodos reciben el mismo evento sin duplicar su identidad; no prueba proyecciones comerciales |
| T-SALE-001 | Doble toque en confirmar | Una venta, un cobro y un conjunto de movimientos |
| T-SALE-002 | Cierre forzado en cada punto de confirmación | Venta completa recuperable o ningún efecto parcial |
| T-SALE-003 | Importe de venta en enteros | Vuelto exacto con dos decimales; rechazo de pago insuficiente y precisión no admitida |
| T-SALE-004 | Reintento de confirmación local | Mismo ID/contenido devuelve venta previa; otro contenido no duplica ni modifica |
| T-STOCK-001 | Venta supera stock conocido | Ajuste exacto + salida, saldo cero y advertencia posterior |
| T-CASH-001 | Dos usuarios/turnos | Movimientos y diferencias atribuidos correctamente |
| T-AUTH-001 | Aplicar matriz inicial a cajero, encargado y dueño/administrador; probar asignaciones acumuladas y acciones no definidas desde UI, API y exportación | Denegación por defecto sin mutación y auditoría segura; autorizaciones con actor, autorizador y motivo |
| T-TENANT-001 | Identidad de comercio A consulta B | Sin lectura, inferencia, exportación ni cambio |
| T-REC-001 | Pérdida de caja sincronizada | Restauración dentro de objetivos sin duplicar al volver el equipo viejo |
| T-BACKUP-001 | Restauración mensual del coordinador desde copias completas e incrementales | Verificar integridad y cumplimiento del RPO central ≤15 min y RTO ≤4 h; registrar desviaciones; las operaciones no sincronizadas quedan excluidas |
| T-MIG-001 | Actualización con eventos pendientes | Migración conserva datos o se revierte de forma segura |
| T-A11Y-001 | Venta táctil sin teclado/lector | Flujo completo, objetivos accesibles y mensajes entendibles |
| T-CONFIG-001 | Configuración externa incompleta, inválida y válida | Falla cerrada sin exponer secretos; los valores de comercio/dispositivo provienen del runtime y no del bundle |
| T-CONFIG-002 | Cuerpo de solicitud excede el límite configurado del gateway | Rechazo previo a persistencia con tamaño límite obtenido de configuración externa |
| T-PWA-001 | Confirmar control del Service Worker y carga de assets; abrir online para refrescar shell, detener servidor y recargar; volver online y repetir tras una nueva versión | Shell y assets de la revisión más reciente se abren desde caché; estado del coordinador refleja falta de red; llamadas de API no se interceptan ni guardan |
| T-STORAGE-001 | Outbox sintética mayor a una página | Secuencias, conteo y extracción por lote recorren páginas sin cargar todos los documentos a memoria; no omiten ni repiten eventos |
| T-EXPORT-TECH-001 | Exportar eventos sintéticos de un tenant con escritores detenidos | NDJSON contiene sobres canónicos, excluye metadatos/otros tenants, pagina resultados, valida ID documento/sobre, no sobrescribe salida y limpia fallos normales |

## Matriz mínima de ejecución del spike

- Chrome estable actual en Windows 11, mouse/teclado y lector USB simulado.
- Edge estable actual en Windows 11 con entrada táctil cuando exista equipo.
- Chrome estable actual en Android, orientación vertical y horizontal.
- Ventanas pequeñas equivalentes a teléfono y tablet; zoom 200 %.

Las versiones exactas y equipos se registran como evidencia al ejecutar; “actual” no sirve como promesa contractual permanente.

## Puertas de calidad

### Para iniciar construcción del MVP

- ADR-0001 a ADR-0003 aceptados tras el spike.
- Cero pérdida/duplicación en suites de sincronización.
- Estrategia demostrada de exportación y recuperación.
- Amenazas críticas con mitigación o aceptación explícita.

### Para instalar en el piloto

- Todos los requisitos MVP trazados a pruebas.
- Cero defectos abiertos críticos o altos en venta, dinero, stock, permisos, aislamiento y recuperación.
- Pruebas E2E críticas aprobadas en la matriz publicada.
- Restore y rollback ensayados con evidencia.
- Proceso fiscal externo y aviso de privacidad listos.
- Defectos medios restantes aceptados por los tres fundadores con impacto y workaround.

## Evidencia

Cada ejecución liberable conservará versión, ambiente, dispositivo/navegador, conjunto de datos, resultados, logs sanitizados y defectos vinculados. La matriz de trazabilidad enlazará requisito → regla/ADR → prueba → evidencia.
