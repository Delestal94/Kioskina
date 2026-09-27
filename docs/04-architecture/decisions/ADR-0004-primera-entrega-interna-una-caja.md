# ADR-0004 — Primera entrega interna en una caja Windows

- Estado: **Aceptado para la entrega interna con datos ficticios**
- Fecha: 2026-09-27
- Origen: instrucción del fundador de comenzar el desarrollo; primera computadora Windows, Chrome y Edge, datos ficticios.
- Relacionado: ADR-0001 a ADR-0003; RF-001 a RF-013, RF-016 a RF-027, RF-030 a RF-040, RF-043 a RF-057, RF-060 a RF-065; RNF-004, RNF-007, RNF-010, RNF-015 y RNF-016.

## Contexto

El piloto anterior suponía dos cajas y coordinador remoto; esa arquitectura sigue condicionada al spike. La nueva primera entrega se evaluará internamente en una sola computadora Windows con datos ficticios. No necesita replicación entre dispositivos para completar sus pruebas locales.

## Decisión

- Construir primero los flujos autocontenidos de venta y administración en una PWA local, con almacenamiento durable del navegador, transacciones atómicas y exportación/restauración.
- Conservar contratos y límites de dominio que permitan introducir el coordinador y la sincronización después de validar ADR-0001 a ADR-0003. Esta entrega no declara superado el spike ni promete operación distribuida.
- Mantener dinero en unidades mínimas enteras, identificadores únicos, registros de ventas/movimientos/auditoría inmutables y correcciones trazables.
- Probar únicamente con datos ficticios en Chrome y Edge del equipo Windows de referencia. Registrar versión exacta y resultados antes de declarar compatible una versión.
- Tratar autenticación, almacenamiento local y respaldo de esta entrega como controles de prueba interna; no ofrecerlos como controles comerciales hasta completar revisión de seguridad y recuperación.

## Alternativas

- Implementar de inmediato dos cajas y coordinador: adelanta el riesgo distribuido, pero retrasa los flujos operativos solicitados y exige el spike pendiente.
- Aplicación dependiente de Internet: simplifica persistencia central, pero contradice la autonomía local prevista para la evolución.

## Consecuencias y puerta posterior

La primera entrega puede cubrir un conjunto amplio de funciones sin afirmar convergencia entre cajas. Una sola computadora concentra el riesgo de pérdida de datos, por lo que exportación y restauración probadas son obligatorias. Antes de incorporar una segunda caja o datos reales se revisan ADR-0001 a ADR-0003, el spike, seguridad, fiscalidad, privacidad y la matriz de dispositivos; esta aprobación interna no los sustituye.
