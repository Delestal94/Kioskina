# Modelo comercial candidato

- Estado: **Modelo de alto nivel ratificado el 2026-09-26; precios y límites por plan no definidos**
- Fecha: 2026-09-20

## Modelo inicial ratificado

El fundador ratificó una suscripción por comercio/sucursal, no por empleado, con 1–2 cajas incluidas. Puesta en marcha, migración/capacitación, soporte presencial y hardware se cobran por separado. Los precios, niveles exactos y servicios incluidos aún no están aprobados.

## Recomendación inicial

Cobrar una suscripción por comercio/sucursal con una cantidad de cajas incluida, no por empleado. Cobrar aparte servicios puntuales —puesta en marcha, migración compleja, capacitación, soporte presencial y hardware—. Este modelo evita castigar el uso de cuentas individuales y alinea el precio con el valor operativo.

## Planes candidatos

| Plan | Cliente objetivo | Incluye como mínimo |
|---|---|---|
| Esencial | Kiosco pequeño autogestionado | venta, caja, productos, stock, fiado, reportes mínimos, 1–2 cajas, ayuda de autoservicio y actualizaciones de seguridad |
| Operativo | Comercio que necesita acompañamiento | Esencial + respaldo/recuperación administrada, más cajas, capacitación remota y soporte prioritario |
| Gestionado | Comercio con mayor dependencia | Operativo + puesta en marcha, soporte presencial dentro de cobertura, reportes/controles ampliados y SLA contratado |
| Empresa | Multisucursal futura | cotización, límites y arquitectura acordados; no forma parte del MVP |

Los límites deben aplicarse a capacidad o servicio, nunca degradar integridad, seguridad, aislamiento, derechos sobre datos o acceso al historial legal.

## Adicionales

- Configuración/migración inicial básica o avanzada.
- Horas de capacitación.
- Caja/dispositivo adicional.
- Respaldo y retención superiores.
- Soporte presencial fuera del radio incluido.
- Equipos homologados con garantía claramente separada.
- Integraciones pagas trasladadas de forma transparente.

## Prueba gratuita

- 14 días, alcance y fecha de finalización visibles desde el inicio.
- Sin tarjeta obligatoria como recomendación para el piloto local.
- Preparar catálogo y venta de prueba antes de iniciar el reloj cuando Kioskina hace la instalación.
- Al vencer: bloquear nuevas operaciones según decisión del fundador, conservar datos según política y ofrecer conversión.
- Aunque no haya exportación en la UI vencida, soporte debe permitir ejercer derechos y obtener los datos mediante proceso autenticado.

## Modalidades de almacenamiento

No se recomienda comercializar desde el inicio “local, nube y todos los híbridos” como productos diferentes. El MVP local-first ya combina trabajo local y coordinador remoto. Se puede diferenciar respaldo/retención/soporte por plan sin mantener tres arquitecturas. Una modalidad totalmente local o cloud puro requiere ADR, matriz de pruebas y costos propios después del piloto.

## Actualizaciones

- Correcciones de seguridad e integridad: gratuitas para versiones soportadas.
- Funciones nuevas: incluidas o no según plan/versión comercial.
- El cliente puede posponer una actualización dentro de una ventana publicada.
- Una versión vulnerable o incompatible puede perder sincronización/soporte remoto después de aviso; mantener conectividad insegura no es una prestación vendible.

## Validación antes de fijar precios

Calcular costo mensual por comercio de infraestructura, respaldo, mensajería, soporte, impuestos, garantía y medios de cobro. Definir margen y capacidad del equipo de tres. Probar disposición a pagar con los primeros clientes; no copiar precios de competidores sin comparar alcance y soporte.
