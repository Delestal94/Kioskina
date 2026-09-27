# Paquete de trabajo — Primera entrega interna Windows

## Identificación

- Título: Aplicación local de venta y administración para pruebas internas
- Responsable/revisor: Agente implementador / fundador
- Estado: Implementación local inicial disponible; verificación de navegador/recuperación pendiente
- RF/RNF/RN: grupos de `../../01-product/mvp-scope.md`; RN-001 a RN-028 según flujo; RNF-004, RNF-007, RNF-010, RNF-015, RNF-016
- ADR: ADR-0004; ADR-0001 a ADR-0003 reservados para segunda caja

## Objetivo

Permitir que el equipo fundador pruebe con datos ficticios los flujos completos de un drugstore en una computadora Windows mediante Chrome y Edge.

## Incluye / no incluye

- Incluye: venta y caja, catálogo y stock, clientes/fiado, reportes, roles, auditoría, importación/exportación, respaldo/restauración y una interfaz sencilla conforme a RNF-016.
- No incluye: operación real, fiscalidad, pagos verificados por proveedor, WhatsApp, segunda caja ni servicios comerciales.

## Criterios de aceptación

1. Una venta confirmada registra exactamente una vez cobro, movimiento de stock y auditoría, y un fallo durante persistencia deja el estado anterior o el nuevo completo.
2. Caja, stock y fiado pueden conciliarse desde los registros guardados; anulaciones y ajustes se vinculan a su origen.
3. Cajero, encargado y dueño tienen permisos diferenciados, con denegación por defecto.
4. Exportar y restaurar datos ficticios reconstruye los resultados y conserva auditoría.
5. Los flujos principales se completan en Chrome y Edge sobre la PC de referencia; se registra la versión exacta.
6. La UI muestra acción principal, total, turno y mensajes de error con la claridad de RNF-016 y funciona con teclado y zoom de 200 %.

## Matriz de comportamiento

| Aspecto | Decisión/caso esperado |
|---|---|
| Permisos | Denegación por defecto; cada acción sensible verifica rol antes de mutar. |
| Auditoría | Ventas, anulaciones, cambios de stock/precio y gestión de usuarios dejan registro enlazado. |
| Offline y sincronización | Un solo dispositivo local; no se declara sincronización validada. |
| Recuperación ante fallo | Transacción local atómica; exportación/restauración probada. |
| Accesibilidad | Etiquetas, foco, teclado, zoom y contraste revisados. |
| Hardware/navegadores | Windows, Chrome y Edge del equipo de referencia; sin periféricos obligatorios. |
| Privacidad/retención | Exclusivamente datos ficticios, sin envío a terceros. |

## Diseño técnico

- Componentes y contratos afectados: dominio TypeScript, interfaz React/Vite, adaptador IndexedDB local y formato de exportación versionado. Motivos y alternativas en ADR-0004.
- Datos/migración: importación/restauración valida versión y estructura; no sobrescribe datos existentes sin paso explícito.
- Riesgos y reversión: una sola PC puede perder datos; exportar periódicamente y ensayar restauración. Si el adaptador local falla, conservar contratos de dominio y reemplazarlo antes de operación real.

## Pruebas

| ID | Nivel | Caso | Resultado |
|---|---|---|---|
| T-SALE-001 | Dominio/E2E | Doble confirmación de venta | Dominio aprobado; E2E pendiente |
| T-SALE-002 | Persistencia | Interrupción antes/durante/después de guardar | Aborto simulado aprobado; cierre forzado real pendiente |
| T-CASH-001 | Dominio/E2E | Apertura, movimientos y cierre | Dominio aprobado; E2E pendiente |
| T-STOCK-001 | Dominio | Insuficiencia y ajuste compensatorio | Aprobado en pruebas de dominio |
| T-AUTH-001 | Dominio/UI | Permisos y denegaciones | Permisos del dominio aprobados; UI pendiente |
| T-REC-001 | Integración | Exportación y restauración | Validación y restauración simulada aprobadas; simulacro en navegador pendiente |
| T-UX-001 | UI | Venta y gestión en Chrome/Edge | Inspección visual inicial en navegador integrado; Chrome/Edge pendientes |

## Evidencia y documentación

- Comandos/resultados: `npm test` — 12 pruebas aprobadas; `npm run build` — TypeScript/Vite aprobados; `npm audit` — 0 vulnerabilidades reportadas. Versiones instaladas fijadas en `package-lock.json`.
- Documentos afectados: requisitos, ADR-0004, modelo de datos, trazabilidad, estrategia y operación según comportamiento real.
- Riesgos o preguntas restantes: Q-049 a Q-051; seguridad, fiscalidad y privacidad para uso real siguen abiertos.
