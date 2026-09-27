# ADR-0003 — Eventos, sincronización y conflictos

- Estado: **Aceptado en diseño; condicionado al spike**
- Fecha: 2026-09-20
- Requisitos: RF-013, RF-043, RF-049, RF-050, RF-056, RF-057; RN-001, RN-011 a RN-014, RN-020, RN-021, RN-024 a RN-026; RNF-001, RNF-004, RNF-013 a RNF-015

## Contexto

Dos cajas pueden vender y editar ciertos datos durante una partición de 24 horas. Sobrescribir saldos o usar “última escritura gana” perdería ventas, movimientos o decisiones. A la vez, no toda información merece un motor distribuido general.

## Decisión

1. Ventas, cobros, caja, inventario, deuda y auditoría se representan con eventos inmutables identificados globalmente.
2. Cada dispositivo mantiene una secuencia local monotónica y una outbox durable.
3. La sincronización es al menos una vez; la aplicación obtiene efecto exactamente una vez mediante deduplicación e idempotencia.
4. Los saldos son proyecciones reconstruibles. Nunca se sincroniza un saldo final para reemplazar otro.
5. Una venta se confirma en una sola transacción local con todos sus efectos.
6. El coordinador acepta/rechaza por contrato y permisos, conserva recepción y redistribuye eventos autorizados.
7. Datos maestros llevan versión base. Cambios concurrentes incompatibles generan un conflicto de negocio independiente del ganador interno del motor.
8. Precio, permisos y configuración nunca se resuelven silenciosamente. Un administrador elige el valor futuro; ventas pasadas conservan lo aplicado.
9. Resoluciones, reversiones y rectificaciones agregan nuevos registros y no alteran el original.
10. Una migración no puede descartar eventos pendientes; se valida antes de activar la nueva aplicación.
11. El protocolo candidato descarga cambios mediante páginas con cursor opaco del coordinador. El consumidor aplica eventos idempotentemente y persiste el cursor después de completar la página; el motor no define un orden causal global entre dispositivos.

## Estados de sincronización

`local-confirmed` → `queued` → `sent` → `accepted` o `rejected` → `projected`.

Un evento rechazado no desaparece. Queda en una bandeja de resolución con causa entendible y mecanismo seguro de rectificación. La UI no presentará “todo sincronizado” si existen rechazados o conflictos.

## Orden y tiempo

- El orden causal dentro de un agregado usa versión/causación y secuencia de dispositivo.
- No se usa la hora del dispositivo como criterio único para ganar conflictos.
- La recepción central sirve para diagnóstico, no para reescribir el momento informado de la operación.
- Si faltan secuencias, la sincronización solicita reenvío antes de declarar convergencia.
- El spike calcula huecos y secuencias duplicadas sobre los eventos locales conocidos por dispositivo y sucursal. Hasta que exista recuperación automática del emisor, sólo informa la anomalía y no presenta convergencia confirmada; el recálculo tras cada página permite resolver un hueco cuando el evento llega después.

## Seguridad e integridad

- Sobre de evento validado por esquema y alcance de tenant/dispositivo.
- IDs y claves de idempotencia no reutilizables para otro contenido.
- Hash de contenido para detectar corrupción accidental; una cadena o firma criptográfica sólo se incorporará si el modelo de amenazas prueba su necesidad.
- Auditoría de aceptación, rechazo y resolución sin secretos.

## Consecuencias

- Se preservan operaciones aun con duplicados de transporte y particiones.
- Una caída a mitad de página puede repetir escrituras ya aplicadas; deduplicación local por ID evita repetirlas y el cursor no se adelanta. Esta mecánica sigue pendiente de validación en el spike.
- La detección local no recupera por sí sola un evento ausente del coordinador ni detecta secuencias faltantes que nunca se hayan observado; automatizar la solicitud al emisor queda como trabajo futuro.
- Informes y saldos requieren proyectores y reconciliación.
- Algunas pantallas verán datos temporalmente antiguos y deben mostrarlo.
- La resolución de conflictos es parte visible del producto administrativo.

## Pruebas obligatorias

- Doble toque, reintento, replay y entrega fuera de orden.
- Apagado antes/durante/después de cada escritura de venta.
- Dos ventas simultáneas del mismo SKU y ajuste compensatorio exacto.
- Dos precios concurrentes y resolución posterior.
- Evento desconocido o de esquema futuro.
- Evento autorizado al crearse pero revocado antes de llegar.
- Reconstrucción completa de stock, caja, deuda y reportes.
- Comparación determinista de proyecciones en ambos nodos y coordinador.

## Reversión

Si el enfoque no puede validarse, se limita la operación offline simultánea o se adopta un nodo principal/relevo. No se degradará silenciosamente a sobrescritura de saldos.
