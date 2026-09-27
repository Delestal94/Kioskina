# Contratos y límites de integración

- Estado: **Borrador**
- Fecha: 2026-09-20

## Principio

Toda integración externa se encuentra detrás de un adaptador. El dominio registra solicitud, resultado, fuente, referencia, momento e idempotencia, pero no adopta como propio el modelo de un proveedor. Ninguna integración futura está comprometida por existir en esta lista.

| Integración | MVP | Comportamiento sin conexión | Incógnita bloqueante |
|---|---:|---|---|
| Lector código tipo teclado | Sí, opcional | Disponible | Modelos y navegadores de prueba |
| Impresora de ticket | Opcional | Disponible si el SO/navegador lo permite | Modelos, ancho y método de impresión |
| Transferencia/QR manual | Sí | Puede registrarse como manual según permiso; no afirmar acreditación automática | Política y evidencia del comercio |
| Verificación automática de transferencia/QR | Condicionada | No disponible; estado pendiente/desconocido | Proveedor, API, webhooks, costos y conciliación |
| WhatsApp para recuperación/recibos | Condicionada | Se encola o se ofrece alternativa | Proveedor, consentimiento y plantillas |
| Correo | Condicionada | Se encola | Proveedor y dominio |
| Facturación fiscal ARCA | No | Proceso externo al producto | Situación tributaria del piloto |
| Excel/CSV | Sí para importación/exportación acotada | Disponible | Archivos reales y mapeo |
| OCR de listas/fotos | Posterior al flujo manual | No garantizado | Proveedor/costo/precisión y revisión humana |

## Reglas comunes

- Cada solicitud externa tiene `integration_request_id` estable para reintentos.
- Webhooks se autentican, deduplican y conservan cuerpo mínimo necesario.
- Estado desconocido no se presenta como éxito o rechazo.
- Timeout no implica fracaso definitivo; se concilia antes de repetir cobros.
- Credenciales se guardan sólo en infraestructura segura, nunca en PWA o documentación.
- Fallar una integración no debe corromper venta, caja ni stock.
