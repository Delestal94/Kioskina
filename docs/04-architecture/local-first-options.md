# Opciones de arquitectura local-first

- Estado: **Análisis; no es un ADR aprobado**
- Necesidad: dos cajas, operación offline 24 horas, aplicación web instalable y sincronización por Internet.

## Opción A — nodo principal local con relevo

Un dispositivo actúa como autoridad local y los demás se conectan a él. Otro conserva réplica y puede tomar el rol si falla.

- Ventajas: una sola decisión inmediata para precios, permisos y saldos; menor complejidad de conflicto.
- Desventajas: elección de líder, failover y conectividad local; el principal debe estar disponible.
- Internet: opcional para operación interna; necesario para respaldo/soporte/sincronización externa.

## Opción B — multi-maestro entre pares

Cada dispositivo acepta cambios y replica eventos con todos los demás.

- Ventajas: cualquier caja sigue operando si otra cae; cada una tiene copia completa.
- Desventajas: conflictos de precio/configuración, orden de eventos, dispositivos perdidos, revocaciones, seguridad, convergencia y actualizaciones son considerablemente más complejos.
- Internet: para pares en redes distintas se necesita normalmente un servicio de descubrimiento/relay o conexiones especialmente configuradas.

## Opción C — nodos locales con coordinador de sincronización

Cada caja conserva datos y opera localmente; un servicio remoto recibe eventos, determina orden y redistribuye cambios.

- Ventajas: combina offline con coordinación y respaldo; facilita acceso móvil.
- Desventajas: incluye infraestructura cloud aunque la operación sea local-first; los conflictos todavía necesitan reglas.

## Recomendación para prototipo

Comparar A y C. No comenzar con multi-maestro puro hasta demostrar que una necesidad del piloto justifica su costo. En cualquier opción:

- sincronizar eventos inmutables con identificadores globales, no sobrescribir saldos;
- separar operaciones acumulables —ventas/movimientos— de valores únicos —precio vigente/permiso—;
- probar 24 horas desconectado, doble caja y reconexión;
- cifrar y autenticar nodos;
- definir incorporación, revocación y pérdida de dispositivos.

## Decisiones pendientes

- Si las cajas estarán en la misma red local o sólo se comunicarán por Internet.
- Si un comercio puede operar cuando todos los demás dispositivos están apagados.
- Si los precios son realmente distintos por caja.
- Qué dispositivo arbitra conflictos y cómo se elige/reemplaza.
- Cómo se restaura un dispositivo nuevo y se revoca uno robado.
