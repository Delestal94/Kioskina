# Estado del descubrimiento

- Estado: **Línea base de entrega interna aprobada; descubrimiento comercial en curso**
- Línea base aprobada: **Sí, sólo para la primera entrega interna con datos ficticios**
- Implementación autorizada: **Sí, dentro de esa línea base interna**
- Última actualización: 2026-09-27

## Revisión solicitada el 2026-09-27

El fundador pidió ampliar el MVP a «todas las funcionalidades que puedas», comenzar en una computadora Windows y diseñar el producto de forma general para drugstores, sin seleccionar un comercio piloto concreto. También indicó que no contará con un referente contable/legal. El 2026-09-27 confirmó que la primera entrega se probará internamente con datos ficticios en Chrome y Edge. La versión de Windows y las versiones de navegador siguen pendientes. Estas indicaciones iniciales no definían por sí solas una lista verificable de funciones; la propuesta concreta se registró en `../01-product/mvp-scope.md` y la autorización posterior consta abajo. Los bloqueantes fiscales y de privacidad siguen aplicando a un futuro piloto con ventas o datos reales.

## Aprobación de desarrollo interno (2026-09-27)

Ante la instrucción expresa del fundador «deja todo aprobado empecemos con el desarrollo del programa final», se aprueba la línea base **limitada a la primera entrega interna con datos ficticios** descrita en `../01-product/mvp-scope.md`. La revisión colectiva de los tres fundadores prevista para el piloto comercial no consta y permanece pendiente; esta autorización específica de desarrollo interno sustituye esa puerta sólo en el alcance sintético. Ningún requisito fiscal, integración, compatibilidad de hardware, prueba técnica o aprobación de un tercero se declara validado por esta decisión. Se autoriza implementar y probar en el equipo Windows de referencia con Chrome y Edge. El paso a datos/ventas reales exige una puerta separada. ADR-0004 documenta el orden de desarrollo de una caja y futura sincronización.

La implementación local inicial y 12 pruebas automatizadas están disponibles. La verificación manual en Chrome/Edge, recuperación real, alcance pendiente y aprobación de cualquier piloto comercial continúan abiertos.

## Avance

- Bloque A — visión y negocio: **Alcance alto nivel del MVP ratificado el 2026-09-26; modelo comercial de alto nivel ratificado el 2026-09-26; precios/planes y comercio piloto externo siguen pendientes**
- Bloque B — comercios, usuarios y accesibilidad: **Respondido por el fundador; validación de campo omitida por decisión consciente**
- Bloque C — venta y atención en caja: **Respondido parcialmente; requisitos en borrador y prioridades pendientes**
- Bloque D — catálogo, inventario y compras: **Respondido parcialmente; requisitos en borrador y prioridades pendientes**
- Bloque E — clientes, fidelización y canales: **Respondido parcialmente; requisitos en borrador y aspectos de privacidad pendientes**
- Bloque F — organización, administración y analítica: **Respondido parcialmente; requisitos en borrador y prioridades pendientes**
- Bloque G — seguridad, auditoría, privacidad y cumplimiento: **Respondido parcialmente; investigación legal y métricas pendientes**
- Bloque H — hardware, integraciones y entorno técnico: **Arquitectura candidata documentada; el equipo confirma disponer de equipos, pero inventario/modelos/versiones no documentados; spike pendiente**
- Bloque I — escala, calidad y operación: **Objetivos candidatos de recuperación ratificados para la línea base el 2026-09-26; validación técnica, SLA y matriz web pendientes**
- Bloque J — migración, lanzamiento y evolución: **Respondido parcialmente; métricas y alcance final pendientes**

## Investigación externa

- Cumplimiento nacional argentino: **Revisión oficial inicial realizada; validación profesional y normas provinciales/municipales pendientes**
- Competencia y mercado: **Sondeo inicial de páginas comerciales realizado el 2026-09-26; no hay medición de participación, comparación práctica ni validación con clientes**
- Comercios piloto: **No habrá comercio real en las pruebas iniciales; equipo fundador hará pruebas internas. Entrevistas/observación externa descartadas por el fundador para esta línea base; riesgo RISK-022 aceptado. Comercio real previo a comercializar sigue pendiente**
- Síntesis de entrevistas del fundador: **Realizada; limitada por falta de evidencia de usuarios reales**
- Tecnologías local-first: **Candidato PouchDB/CouchDB seleccionado para spike; producción no aprobada**
- Entrevista al equipo fundador: **Cerrada para línea base inicial; seguimientos puntuales permanecen abiertos**
- Plan de investigación del comercio piloto: **Archivado como material futuro; no se ejecutará antes de desarrollar**

## Condiciones para cerrar el descubrimiento inicial

- Visión, mercados y modelo comercial definidos.
- Tipos de usuarios y procesos críticos comprendidos o registrados como hipótesis con incertidumbre/riesgo aceptado; pruebas internas no sustituyen validación con usuarios reales antes de comercializar.
- Alcance de MVP y exclusiones acordados.
- Requisitos funcionales y no funcionales priorizados.
- Restricciones legales, fiscales, territoriales y de datos identificadas.
- Hardware e integraciones iniciales definidos.
- Estrategia de operación con y sin conexión acordada.
- Arquitectura candidata y principales ADR aprobados.
- Riesgos críticos y mitigaciones registrados.
- Estrategia de pruebas, migración, despliegue y soporte definida.

## Próximo paso

Revisar la arquitectura detallada y ejecutar el spike de sincronización descrito en ADR-0001 a ADR-0003. Luego cerrar los bloqueantes fiscales, de recuperación y de hardware antes de aprobar la línea base.

## Decisiones ya registradas

Las decisiones cerradas de alcance, operación sin conexión y conflicto de precio se consolidan en `../01-product/resolved-decisions.md`. El fundador ratificó el alcance de alto nivel del MVP el 2026-09-26. La consolidación no cambia el estado de línea base: sigue pendiente la aprobación conjunta y la evidencia exigida por los ADR.

## Decisión sobre investigación de campo

El 2026-09-20 el fundador decidió continuar sin entrevistar ni observar usuarios del comercio piloto. Esto no convierte las hipótesis de usabilidad, tiempos, roles ni procesos en hechos validados. La decisión puede revisarse más adelante sin bloquear el trabajo técnico actual.





