# Registros de decisiones de arquitectura (ADR)

## Índice

- `ADR-0001-local-first-con-coordinador.md`: topología aceptada, condicionada al prototipo.
- `ADR-0002-stack-tecnologico-del-piloto.md`: stack candidato, pendiente del spike y revisión de dependencias.
- `ADR-0003-eventos-sincronizacion-y-conflictos.md`: modelo de convergencia aceptado en diseño, pendiente del spike.
- `ADR-0004-primera-entrega-interna-una-caja.md`: orden de desarrollo aprobado para pruebas internas con datos ficticios en una caja Windows; no aprueba la arquitectura de dos cajas ni operación comercial.

Cada ADR se nombrará `ADR-NNNN-titulo-breve.md` y contendrá:

- estado y fecha;
- contexto y fuerzas relevantes;
- decisión;
- alternativas consideradas;
- consecuencias positivas y negativas;
- riesgos y estrategia de reversión;
- requisitos relacionados.

No se debe elegir stack, base de datos, topología de despliegue ni servicios externos sólo por preferencia del agente.
