# Flujo de desarrollo asistido por IA

- Estado: **Obligatorio al comenzar implementación**
- Fecha: 2026-09-20

Este documento complementa `AGENTS.md`. La documentación es memoria de producto, no un reemplazo de pruebas o revisión humana.

## Puerta previa

No implementar producto mientras `../00-discovery/discovery-status.md` indique que la línea base no está aprobada. Se permiten únicamente spikes de riesgo expresamente aprobados y descartables.

## Entrada mínima de una tarea

Cada tarea debe identificar:

- objetivo y valor de negocio;
- RF/RNF/RN y ADR relacionados;
- alcance y exclusiones;
- criterios de aceptación observables;
- permisos y auditoría;
- conducta offline, conflicto y recuperación;
- accesibilidad y hardware aplicables;
- pruebas requeridas y documentación afectada.

Si falta una decisión que cambia materialmente la solución, se registra en `../01-product/open-questions.md`; no se inventa un requisito.

## Ciclo por tarea

1. Leer `AGENTS.md`, `docs/README.md`, estado, requisitos, ADR y trazabilidad relacionados.
2. Inspeccionar código y cambios existentes sin sobrescribir trabajo ajeno.
3. Proponer el cambio mínimo que cumple los criterios.
4. Implementar dominio antes de adaptadores/UI cuando corresponda.
5. Añadir o actualizar pruebas; incluir casos negativos y fallos.
6. Ejecutar validaciones pertinentes y conservar evidencia útil.
7. Actualizar en la misma tarea requisitos, ADR, contratos, operación y trazabilidad afectados.
8. Informar resultado, evidencia, riesgos residuales y archivos modificados.

## Prohibiciones

- No introducir dependencias, servicios o formatos persistentes sin registrar motivo/licencia/salida.
- No usar datos personales reales, secretos ni credenciales en prompts, archivos o pruebas.
- No resolver conflictos comerciales con “última escritura gana” salvo regla aprobada.
- No afirmar que una tarea está terminada si sólo compila o si faltan pruebas/documentación.
- No convertir el código de un spike en producción sin revisión explícita.

## Definición de terminado

- Criterios de aceptación satisfechos y trazados.
- Pruebas automáticas relevantes aprobadas; evidencia indicada.
- Accesibilidad, permisos, auditoría, offline, fallos y hardware cubiertos cuando aplican.
- Migración/reversión documentadas si cambian datos o contratos.
- Sin secretos, vulnerabilidades críticas conocidas ni errores críticos/altos abiertos en el alcance.
- Documentación y matriz de trazabilidad actualizadas.
