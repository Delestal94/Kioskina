# Estrategia de calidad y pruebas

- Estado: **Propuesta para línea base**
- Fecha: 2026-09-20

La primera entrega interna solicitada el 2026-09-27 se evaluará en Chrome y Edge sobre una computadora Windows con datos ficticios. La matriz de dos cajas y Android descrita más abajo corresponde al spike/piloto candidato anterior y se revisará al aprobar la nueva línea base.

Evidencia automatizada inicial (2026-09-27): `npm test` aprueba 12 pruebas de dominio, CSV y persistencia simulada, incluidas doble confirmación, permisos, ajuste compensatorio, anulación, fiado/caja, descuento y aborto de transacción. `npm run build` compila TypeScript y genera la PWA. `npm audit` informó 0 vulnerabilidades en el conjunto instalado. Inicio, venta y catálogo se inspeccionaron visualmente en el navegador integrado; faltan E2E manuales en Chrome y Edge, zoom 200 %, recuperación tras cierre forzado y simulacro real de restauración. La simulación con `fake-indexeddb` no prueba durabilidad de disco de los navegadores.

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

## Suites críticas iniciales

| ID | Escenario | Resultado esperado |
|---|---|---|
| T-SYNC-001 | Dos cajas venden offline 24 h y reconectan | Mismos eventos/proyecciones, sin pérdidas ni duplicados |
| T-SYNC-002 | Reenvío y entrega fuera de orden | Un efecto por evento; faltantes detectados |
| T-SYNC-003 | Precio concurrente | Conflicto visible y resolución futura sin cambiar ventas |
| T-SALE-001 | Doble toque en confirmar | Una venta, un cobro y un conjunto de movimientos |
| T-SALE-002 | Cierre forzado en cada punto de confirmación | Venta completa recuperable o ningún efecto parcial |
| T-STOCK-001 | Venta supera stock conocido | Ajuste exacto + salida, saldo cero y advertencia posterior |
| T-CASH-001 | Dos usuarios/turnos | Movimientos y diferencias atribuidos correctamente |
| T-AUTH-001 | Aplicar matriz inicial a cajero, encargado y dueño/administrador; probar asignaciones acumuladas y acciones no definidas desde UI, API y exportación | Denegación por defecto sin mutación y auditoría segura; autorizaciones con actor, autorizador y motivo |
| T-TENANT-001 | Identidad de comercio A consulta B | Sin lectura, inferencia, exportación ni cambio |
| T-REC-001 | Pérdida de caja sincronizada | Restauración dentro de objetivos sin duplicar al volver el equipo viejo |
| T-BACKUP-001 | Restauración mensual del coordinador desde copias completas e incrementales | Verificar integridad y cumplimiento del RPO central ≤15 min y RTO ≤4 h; registrar desviaciones; las operaciones no sincronizadas quedan excluidas |
| T-MIG-001 | Actualización con eventos pendientes | Migración conserva datos o se revierte de forma segura |
| T-A11Y-001 | Venta táctil sin teclado/lector | Flujo completo, objetivos accesibles y mensajes entendibles |
| T-UX-001 | Revisión de venta, caja, catálogo, stock, clientes y reportes en Chrome y Edge con datos ficticios; repetir venta y corrección de error con zoom al 200 % y teclado | Jerarquía y etiquetas consistentes, acción principal y datos críticos visibles, opciones avanzadas localizables y ninguna acción crítica perdida; registrar hallazgos y correcciones |

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


