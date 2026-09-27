# Priorización propuesta de requisitos

- Estado: **Propuesta para aprobación de línea base**
- Fecha: 2026-09-20

Esta tabla convierte la visión amplia en una primera entrega comprobable. Al aprobarse, deben actualizarse las prioridades dentro de cada requisito funcional para evitar dos fuentes contradictorias.

## Leyenda

- **MVP:** necesario para instalar el piloto.
- **Reducido:** entra sólo con el subconjunto indicado.
- **Condicionado:** se construye si se resuelve la dependencia antes del corte; el núcleo no depende de ello.
- **Posterior:** fuera del MVP aunque la arquitectura no debe impedirlo.

| RF | Prioridad propuesta | Alcance del piloto |
|---|---|---|
| RF-001–002 | MVP | carrito editable; código, nombre, categorías/favoritos y entrada táctil |
| RF-003 | MVP | alta rápida habilitable, mínima, auditada y marcada para revisión |
| RF-004 | Reducido | unidad y cantidad decimal manual; integración de balanza posterior |
| RF-005 | Reducido | precio por cantidad; combos complejos posteriores |
| RF-006 | MVP | efectivo, recibido y vuelto |
| RF-007 | Reducido | registrar transferencia/QR manualmente; verificación automática condicionada |
| RF-008 | MVP | pagos combinados con efectivo y medios manuales |
| RF-009–011 | MVP | fiado, turnos individuales y autorizaciones configurables |
| RF-012 | Reducido | ticket interno impreso/digital opcional, siempre identificado como no fiscal |
| RF-013, RF-015 | MVP | venta inmediata local-first durante 24 h |
| RF-014 | Condicionado | sólo con proveedor de pago automático |
| RF-016–023 | MVP | catálogo, presentaciones, precios, stock y libro de movimientos |
| RF-024 | Reducido | alerta por mínimo configurable; sugerencias avanzadas posteriores |
| RF-025 | Reducido | ingreso de mercadería y deuda simple de proveedor |
| RF-026 | Reducido | Excel/CSV y manual con vista previa; OCR posterior |
| RF-027 | MVP | conteo y ajuste auditado |
| RF-028 | Condicionado | sólo modelos de impresora homologados; exportar plantilla como alternativa |
| RF-029 | Posterior | catálogo multisucursal |
| RF-030–033 | MVP | cliente opcional, privacidad y cuenta corriente/fiado |
| RF-034 | Reducido | descuento autorizado y precio por cantidad; cupones/motor general posterior |
| RF-035 | Condicionado | recuperación/recibo por WhatsApp si se elige proveedor; campañas posteriores |
| RF-036 | Reducido | aislamiento multi-comercio obligatorio; consola multisucursal posterior |
| RF-037–040 | MVP | ventas diarias, caja, stock, movimientos, fiado y exportación simple |
| RF-041 | Posterior | asistencia, horarios, sueldos y comisiones |
| RF-042 | Reducido | vistas responsive de reportes/alertas, sin app móvil separada |
| RF-043–044 | MVP | ajustes compensatorios e identidad individual |
| RF-045 | Condicionado | infraestructura preparada; 2FA de administrador antes de comercializar si canal listo |
| RF-046–047 | MVP | recuperación y defensa contra intentos |
| RF-048 | MVP con riesgo | sesión visible y cierre manual; sin autobloqueo por decisión del fundador |
| RF-049–050 | MVP | auditoría, archivo y rectificación inmutable |
| RF-051 | MVP | acceso de soporte temporal si se ofrece soporte remoto |
| RF-052–057 | MVP | exportación, recuperación, sin periféricos y continuidad local |
| RF-058 | Posterior/paralelo | venta de equipos no bloquea software; catálogo homologado separado |
| RF-059–063 | MVP | soporte, PWA, importación, configuración y ayuda |
| RF-064 | Lanzamiento | prueba de 14 días; no necesaria para el spike/corte vertical |
| RF-065–068 | MVP | actualización, telemetría mínima, panel técnico y tickets |
| RF-069 | Reducido | habilitación por plan sin matrices arquitectónicas distintas |
| RF-070–074 | MVP | ticket no fiscal, privacidad, derechos, retención y roles de datos |
| RF-075 | Posterior | campañas comerciales |

## Recortes que protegen el plazo

- No facturación fiscal integrada, OCR, balanza, e-commerce, delivery, fidelización ni multisucursal.
- No prometer compatibilidad con cualquier impresora, lector o navegador.
- No construir local puro, cloud puro y múltiples híbridos: un solo local-first con coordinador.
- No automatizar acreditación de pagos sin proveedor y entorno de prueba elegidos.
- No convertir reportes en un sistema contable o de nómina.
