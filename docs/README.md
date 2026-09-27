# Base de conocimiento de Kioskina

Esta carpeta es la fuente de verdad del producto. Si el código y la documentación discrepan, la discrepancia debe resolverse explícitamente; no se debe adivinar cuál representa la intención vigente.

## Orden de lectura para cualquier tarea

1. `../AGENTS.md`
2. `00-discovery/discovery-status.md`
3. `01-product/product-brief.md`
4. `01-product/glossary.md`
5. Los requisitos, flujos, ADR y contratos vinculados con la tarea
6. `05-quality/traceability.md`

## Estructura documental prevista

- `00-discovery/`: investigación, cuestionario, personas, procesos actuales y hallazgos.
- `01-product/`: visión, alcance, glosario, preguntas abiertas y roadmap.
- `02-requirements/`: requisitos funcionales, no funcionales, reglas y criterios de aceptación.
- `03-ux/`: principios de experiencia, accesibilidad, flujos y prototipos.
- `04-architecture/`: arquitectura, datos, seguridad, integraciones y decisiones (ADR).
- `05-quality/`: estrategia de pruebas, trazabilidad y atributos de calidad.
- `06-operations/`: despliegue, observabilidad, respaldo, recuperación y soporte.
- `07-delivery/`: flujo y plantillas para trabajo realizado por agentes de IA.

Las carpetas y documentos específicos se incorporarán cuando sus contenidos hayan sido investigados; se evita crear documentos vacíos que aparenten decisiones inexistentes.

## Mapa técnico actual

- Alcance y etapas: `01-product/mvp-scope.md`, `01-product/mvp-prioritization.md` y `01-product/roadmap.md`.
- Decisiones de producto ya resueltas: `01-product/resolved-decisions.md`.
- Reglas del dominio: `02-requirements/business-rules.md`.
- Arquitectura: `04-architecture/architecture-overview.md`.
- Datos y conflictos: `04-architecture/data-model.md`.
- Seguridad: `04-architecture/security-model.md`.
- Integraciones: `04-architecture/integrations.md`.
- Decisiones: `04-architecture/decisions/README.md`.
- Pruebas: `05-quality/test-strategy.md`.
- Despliegue/recuperación/soporte: `06-operations/deployment-recovery-support.md`.
- Trabajo de agentes: `07-delivery/ai-development-workflow.md` y `07-delivery/work-package-template.md`.

## Convenciones

- Requisitos funcionales: `RF-###`.
- Requisitos no funcionales: `RNF-###`.
- Reglas de negocio: `RN-###`.
- Decisiones de arquitectura: `ADR-####`.
- Riesgos: `RISK-###`.
- Preguntas abiertas: `Q-###`.
- Cada requisito debe indicar origen, prioridad, criterios de aceptación, dependencias y pruebas relacionadas.
- Estados documentales: `Borrador`, `En revisión`, `Aprobado`, `Obsoleto`.
- Fechas en formato `AAAA-MM-DD` y zona horaria explícita cuando importe.

## Regla para agentes de implementación

Antes de crear código, confirmar que `00-discovery/discovery-status.md` diga **Línea base aprobada: Sí**. Mientras indique “No”, sólo se permiten documentación, investigación y spikes expresamente definidos para retirar riesgos; un spike no se convierte silenciosamente en código de producción.
