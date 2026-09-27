# Investigación inicial de cumplimiento — Argentina

- Fecha de revisión inicial: 2026-09-20
- Revalidación de fuentes oficiales nacionales: 2026-09-26
- Estado: **Preliminar; requiere validación profesional para el comercio piloto**
- Alcance: fuentes oficiales nacionales. No cubre todavía normas provinciales/municipales de Tucumán y Jujuy ni la situación tributaria concreta del comercio.

## Facturación y comprobantes

La guía vigente de ARCA indica que los monotributistas deben emitir factura tipo C (salvo exportación) y factura electrónica para operaciones con consumidores finales. Además, la RG 5893/2026 extiende por etapas la obligación de comprobantes electrónicos o controlador fiscal a grupos que tenían excepciones: monotributistas sociales/promovidos desde el 1 de noviembre de 2026 y contribuyentes no alcanzados por IVA desde el 1 de marzo de 2027, con alcance y excepciones que deben verificarse para el sujeto concreto. Por lo tanto:

- Un ticket interno de Kioskina no equivale por sí mismo a una factura o comprobante fiscal.
- Si la integración fiscal queda fuera del MVP, el comercio debe continuar usando un mecanismo externo válido y el flujo debe explicarlo sin ambigüedad.
- La situación del contribuyente determina tipos de comprobante, datos requeridos y modalidad.
- ARCA publica webservices oficiales de factura electrónica, incluido `wsfev1`, con entornos/documentación para desarrolladores; una integración futura es viable pero constituye un proyecto propio.

Fuentes oficiales:

- [ARCA — Factura electrónica vs. controlador fiscal](https://www.arca.gob.ar/facturacion/comprobantes/fe-vs-cf.asp)
- [ARCA — Monotributo: comprobantes](https://arca.gob.ar/facturacion/monotributo/comprobantes.asp)
- [ARCA — RG 5893/2026, aplicación escalonada de comprobantes electrónicos](https://servicioscf.arca.gob.ar/publico/sitio/contenido/novedad/ver.aspx?id=5881)
- [ARCA — Datos de los comprobantes](https://www.arca.gob.ar/fe/emision-autorizacion/datos-comprobantes.asp)
- [ARCA — Webservices de factura electrónica](https://arca.gob.ar/ws/documentacion/ws-factura-electronica.asp)

## Conservación

ARCA publica un mínimo general de diez años para documentación y libros. Su guía de inspecciones describe, para libros, registros y comprobantes sujetos al cómputo desde la prescripción, cinco años después de operada ésta y distingue contribuyentes inscriptos/no inscriptos. No se debe convertir estas referencias en un plazo universal para todos los datos: el cómputo, categoría documental y obligación aplicable requieren validación contable/legal. En consecuencia:

- El administrador no puede configurar una eliminación inferior al mínimo aplicable.
- Venta, comprobante, registro contable, auditoría técnica y dato personal no necesariamente comparten el mismo plazo.
- La política debe definirse por categoría, fundamento y jurisdicción, permitir bloqueo legal de eliminación y distinguir registros fiscales, contables, auditoría, datos de clientes y telemetría.

Fuentes oficiales:

- [ARCA — Obligaciones de contribuyentes](https://arca.gob.ar/genericos/derechosObligaciones/tus-obligaciones.asp)
- [ARCA — Conservación durante inspecciones](https://arca.gob.ar/inspecciones/derechos-y-obligaciones/ciudadanos.asp)

## Protección de datos personales

El texto actualizado de la Ley 25.326 exige informar finalidad, destinatarios, responsable/domicilio, carácter obligatorio u opcional, consecuencias y derechos; exige medidas de seguridad y prevé derechos de acceso, rectificación y supresión, con límites cuando existe obligación legal de conservar. Sus artículos 21, 24 y 25 también hacen relevante revisar inscripción y contratos para bases y servicios informatizados por cuenta de terceros. El asesor debe confirmar qué registros de cada actor quedan alcanzados y cómo se distribuyen las obligaciones; no se presume que “encargado” tenga idéntico alcance que en otros regímenes.

Implicaciones iniciales:

- Recopilar documento, CUIT, teléfono, correo, domicilio o fecha de nacimiento sólo cuando exista finalidad definida.
- Distinguir al comercio como responsable de datos y a Kioskina como eventual encargado/proveedor; contratos y arquitectura deben reflejarlo.
- Incorporar avisos de privacidad, gestión de solicitudes, exportación, rectificación y supresión/anominización condicionada.
- Evaluar inscripción de las bases y responsable ante la AAIP antes de operar comercialmente.

Fuentes oficiales:

- [Ley 25.326 — texto actualizado](https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion)
- [AAIP — Protección de datos personales](https://www.argentina.gob.ar/aaip/datospersonales)
- [AAIP — Trámites del Registro de Bases de Datos Personales](https://www.argentina.gob.ar/node/165328)

## Seguridad y continuidad

La Resolución AAIP 47/2018 reúne medidas recomendadas para recolección, control de acceso, control de cambios, respaldo/recuperación, vulnerabilidades, destrucción, incidentes y entornos de desarrollo. Esto contradice la idea de que respaldo, gestión de vulnerabilidades o controles mínimos puedan omitirse sin evaluación sólo por tratarse de un plan económico.

Fuente oficial:

- [Resolución AAIP 47/2018 — medidas de seguridad](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-47-2018-312662/texto)

## WhatsApp y promociones

La Ley 26.951 protege números frente a contactos publicitarios no solicitados y obliga a quienes realizan publicidad telefónica a consultar periódicamente el Registro Nacional No Llame. Aunque el MVP pospone campañas, cualquier función futura deberá diferenciar mensajes transaccionales y comerciales, registrar consentimiento cuando corresponda, gestionar bajas y revisar el registro.

Fuentes oficiales:

- [Ley 26.951 — Registro Nacional No Llame](https://www.argentina.gob.ar/normativa/nacional/233066/texto)
- [Guía oficial — Registro No Llame](https://www.argentina.gob.ar/node/159880)

## Conclusión de lanzamiento

Antes de usar Kioskina en ventas reales se necesita, como mínimo:

1. identificar condición tributaria y mecanismo fiscal del comercio;
2. documentar que el ticket interno no sustituye comprobante fiscal;
3. definir responsable/encargado y aviso de privacidad;
4. fijar retenciones mínimas no configurables;
5. implementar respaldo, control de acceso, vulnerabilidades e incidentes;
6. validar requisitos provinciales/municipales aplicables.

La investigación sirve para diseñar y preparar preguntas. No sustituye la revisión de un profesional matriculado que conozca la situación concreta del comercio.

