# Kioskina — instrucciones obligatorias para agentes de IA

Este repositorio se desarrolla y mantiene principalmente mediante agentes de IA. Estas reglas son obligatorias para cualquier tarea.

## Antes de trabajar

1. Leer `docs/README.md` y seguir el orden de lectura indicado allí.
2. Consultar los requisitos, decisiones y restricciones vinculados con la tarea.
3. No convertir supuestos en requisitos. Registrar toda incógnita relevante en `docs/01-product/open-questions.md`.
4. No contradecir una decisión aceptada. Si debe revisarse, crear o actualizar un ADR en `docs/04-architecture/decisions/`.
5. Mantener trazabilidad entre necesidad de negocio, requisito, historia/flujo, implementación y prueba.
6. Para cualquier implementación o spike, leer `docs/07-delivery/ai-development-workflow.md` y crear un paquete basado en `docs/07-delivery/work-package-template.md`.

## Al modificar el producto

- Actualizar la documentación afectada en la misma tarea que el código.
- Añadir criterios de aceptación verificables a cada requisito nuevo o modificado.
- Incluir accesibilidad, permisos, auditoría, funcionamiento sin conexión, recuperación ante fallos y operación con hardware cuando correspondan.
- Diseñar para el rango declarado de comercios sin introducir complejidad visible innecesaria para un kiosco pequeño.
- Usar lenguaje claro en la interfaz. No depender exclusivamente de color, memoria o precisión motriz.
- No introducir una dependencia, servicio externo o decisión irreversible sin documentar motivo, alternativas y consecuencias.
- No incluir secretos, datos personales reales ni credenciales en archivos, ejemplos, pruebas o registros.

## Definición documental de terminado

Una tarea no está terminada si cambió el comportamiento y no se actualizaron, según corresponda:

- requisitos funcionales o no funcionales;
- reglas de negocio;
- modelo de datos o contratos de integración;
- ADR relacionado;
- matriz de trazabilidad;
- plan y evidencia de pruebas;
- instrucciones de operación, despliegue o soporte.

## Estado actual

El proyecto está en descubrimiento. No comenzar implementación hasta que `docs/00-discovery/discovery-status.md` indique que existe una línea base aprobada.
