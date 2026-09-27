# Lista de cierre del descubrimiento

- Estado: **En elaboración; no es aprobación de línea base**
- Fecha: 2026-09-26
- Fuente: criterios de `discovery-status.md`, requisitos, riesgos, ADR y preguntas abiertas.

Esta lista convierte las condiciones existentes de cierre en evidencia revisable. Un punto puede cerrarse con una decisión de alcance explícita o con evidencia; no se cierra por silencio. Las capacidades fuera del MVP pueden permanecer abiertas si quedan excluidas con responsable y etapa futura.

| Puerta | Evidencia/decisión necesaria | Referencias | Estado actual |
|---|---|---|---|
| Visión, mercado y modelo comercial | Ratificar segmento/región inicial, modalidad comercial a validar y límites del producto que se ofrecerá. | Product brief; commercial-model; Q-001, Q-003, Q-006 | Sondeo de escritorio realizado (competitor-scan-2026-09-26.md); modelo comercial ratificado el 2026-09-26; precio y validación con clientes pendientes |
| Usuarios y procesos críticos | Ratificar hipótesis de roles y flujos. La investigación de campo previa fue conscientemente omitida y RISK-022 fue aceptado; el equipo hará pruebas internas iniciales, que no sustituyen validar con un comercio y usuarios reales antes de comercializar. | role-hypotheses; research-synthesis; RISK-022; Q-008 | Hipótesis documentadas; pruebas internas declaradas; comercio/usuarios externos pendientes |
| Alcance MVP y prioridades | Aprobar MVP/prioridades, exclusiones y criterios de recorte; resolver qué funciones condicionadas realmente entran. | mvp-scope; mvp-prioritization; Q-013, Q-014, Q-020 a Q-026 | Alcance alto nivel ratificado el 2026-09-26; prioridades detalladas y dependencias condicionadas abiertas |
| Requisitos | Revisar prioridades y aceptación RF/RNF; fijar permisos mínimos, datos de clientes/productos y reglas de inventario/reportes. | 02-requirements; Q-011, Q-014, Q-018 a Q-026 | Borradores; tres roles iniciales ratificados, matriz de permisos y preguntas abiertas pendientes |
| Legal, fiscalidad y privacidad | Definir proceso fiscal externo válido para piloto con especialista; identificar situación tributaria; delimitar roles de datos, privacidad, retención y derechos/exportación. | compliance-argentina; security-model; Q-012, Q-015, Q-019, Q-023, Q-039, Q-043, Q-044, Q-046; RNF-001 a RNF-003 | Bloqueante para piloto real; validación pendiente |
| Hardware e integraciones | Aprobar matriz mínima verificable de navegador/SO/dispositivos; declarar periféricos obligatorios u opcionales y excluir los no validados. | integrations; test-strategy; Q-005, Q-009, Q-033, Q-036 | El equipo confirma disponer de equipos; aún no entregó inventario/modelos/versiones |
| Operación online/offline | Acordar servicios disponibles offline, conflicto no acumulable fuera de precio, y límites visibles de antigüedad/estado. | ADR-0001/0003; RF-013/RF-057; Q-031 | Precio resuelto; configuración/permisos pendientes |
| Arquitectura candidata | Completar spike con evidencia reproducible de durabilidad, transacción, sincronización, aislamiento, migración, exportación y compatibilidad; aceptar/actualizar ADR. | ADR-0001 a ADR-0003; Q-035, Q-047; work package del spike | Pendiente |
| Recuperación y seguridad | Elegir RPO/RTO, respaldo por plan y procedimientos; revisar amenazas, revocación, almacenamiento local y política de parches/soporte. | security-model; deployment-recovery-support; Q-029, Q-030, Q-037, Q-048; RISK-001, RISK-008, RISK-020, RISK-021, RISK-023, RISK-024 | RPO/RTO y política de copias ratificados como candidatos el 2026-09-26; T-BACKUP-001, spike y restantes decisiones abiertos |
| Éxito y duración del piloto | Ratificar duración, línea de base de métricas, cómo se medirán y quién acepta resultados. | product-brief; mvp-scope; Q-007, Q-016, Q-040 | Métricas candidatas; pendiente |
| Migración y salida del piloto | Acordar conjunto de datos a migrar y fuente; definir cómo se preserva/exporta la información y transición/cierre. | RF-052/RF-061/RF-064; Q-041, Q-046 | Pendiente |
| Soporte y continuidad | Aprobar días, zona, cobertura geográfica, severidades y SLA sostenibles por equipo; separar objetivos operativos de promesas comerciales. | RF-059/RF-068; deployment-recovery-support; Q-032, Q-038; RISK-004/RISK-011 | Candidato parcial; sin ratificación |
| Gobernanza y propiedad | Aclarar acuerdos de titularidad/licencia del código, activos y facultades de firma antes de comercializar. | Product brief; Q-045; RISK-019 | Pendiente legal; puede ser puerta de comercialización |
| Pruebas y trazabilidad | Confirmar matriz de navegador/hardware, pruebas obligatorias, responsables y forma de guardar evidencia; enlazar requisitos→reglas/ADR→pruebas. | test-strategy; traceability | Estrategia propuesta; spike pendiente |

## Secuencia recomendada

1. Ratificar alcance piloto/MVP y las exclusiones.
2. Confirmar comercio/localidad objetivo, o declarar el criterio de selección y qué evidencia se obtendrá al iniciar el piloto.
3. Cerrar proceso fiscal externo, privacidad, retención y derechos con el asesor correspondiente antes de operar datos reales.
4. Definir matriz mínima de dispositivos y soporte, aun si se limita inicialmente a un equipo de referencia.
5. Elegir reglas operativas pendientes que afectan dinero, permisos, stock, conflicto o recuperación.
6. Ejecutar el spike técnico autorizado en diseño y registrar resultados; actualizar ADR y estrategia de pruebas.
7. Ratificar métricas, duración y responsables; revisar todos los criterios de cierre de discovery-status y documentar aprobación conjunta.

## Criterio de salida

Sólo marcar `Línea base aprobada: Sí` cuando cada puerta necesaria para construir el MVP tenga decisión o evidencia trazable, las dependencias legales/técnicas bloqueantes estén resueltas o excluidas de manera explícita, los riesgos residuales tengan aceptación/responsable/mitigación, y la aprobación de las personas fundadoras quede registrada. Una lista de preguntas abiertas no impide por sí sola la aprobación si no afecta el alcance aprobado y tiene etapa futura asignada.
