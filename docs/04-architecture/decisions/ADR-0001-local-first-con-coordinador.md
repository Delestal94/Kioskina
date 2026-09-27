# ADR-0001 — Clientes local-first con coordinador de sincronización

- Estado: **Aceptado; condicionado a prototipo exitoso**
- Fecha: 2026-09-20
- Requisitos: RF-013, RF-057, RF-060, RF-073; RNF-004 a RNF-006, RNF-013 a RNF-015

## Contexto

El piloto tendrá dos cajas. Cada una debe vender durante 24 horas sin Internet y continuar si la otra está apagada. La aplicación debe ser web instalable en Chrome/Edge sobre Windows/Android. Las cajas compartirán información mediante Internet cuando exista conexión y se toleran diferencias temporales de precio.

Una PWA en navegador no puede actuar de forma general como servidor entrante tradicional para otros equipos. Hacer que cada navegador sea un servidor multi-maestro requeriría señalización, conexiones entre pares, resolución distribuida de conflictos y soporte específico por plataforma.

## Decisión aceptada, condicionada al prototipo

- Cada dispositivo es un **nodo local autónomo**, no necesariamente un servidor de red.
- Cada nodo conserva los datos operativos necesarios y una cola durable de eventos pendientes.
- Ventas, caja y movimientos se confirman localmente con identificadores globalmente únicos.
- Al existir Internet, todos los nodos sincronizan mediante un coordinador remoto mínimo.
- El coordinador almacena y redistribuye eventos, detecta huecos/conflictos y puede prestar respaldo según plan; no impone un orden global basándose sólo en relojes de dispositivo.
- Las cajas no dependen entre sí ni de conexión continua para vender en efectivo.
- La garantía objetivo de desconexión sin Internet para el piloto es de hasta 24 horas. La independencia respecto de la otra caja no vence a las 24 horas: no debe depender de que la otra caja permanezca encendida; lo que sigue pendiente de validación es la durabilidad y convergencia de una desconexión prolongada.
- Operaciones acumulables se combinan como eventos; nunca se reemplaza un saldo final de stock.
- Si la combinación deja stock negativo, se genera el ajuste compensatorio definido y auditado.
- Cambios concurrentes de valores únicos —precio, permisos, configuración— se detectan como conflictos.
- Las ventas históricas conservan el precio efectivamente cobrado.
- Si dos cajas modifican offline el mismo precio, cada una mantiene temporalmente su valor y un administrador elige el precio futuro compartido al reconectar.

## Interpretación de “cada dispositivo como servidor”

Se preserva el objetivo funcional: cada dispositivo contiene una copia operativa, acepta trabajo local y no depende de otra caja. No se implementará inicialmente que cada navegador acepte conexiones entrantes como servidor, porque no aporta valor demostrado al piloto y aumenta considerablemente el riesgo.

## Consecuencias positivas

- Operación local rápida y tolerante a cortes.
- Cualquier caja sigue trabajando aunque otra se apague.
- Una sola ruta de sincronización, diagnóstico y respaldo.
- Evolución futura hacia cloud completo sin reemplazar la interfaz local-first.

## Consecuencias negativas

- Existe infraestructura remota aunque la operación sea local-first.
- Durante cortes, cajas distintas pueden mostrar precios/stock diferentes.
- La sincronización y migración de esquema son componentes críticos.
- Un nodo nuevo necesita restauración segura desde coordinador, exportación o dispositivo existente.

## Alternativas descartadas provisionalmente

- **Servidor local único:** no satisface independencia si el servidor está apagado.
- **Multi-maestro directo entre navegadores:** complejidad alta y soporte frágil para PWA multiplataforma.
- **Cloud obligatorio en línea:** no satisface operación offline de 24 horas.

## Validación requerida

Un prototipo debe demostrar con dos dispositivos:

1. 24 horas sin Internet.
2. Ventas y cierres independientes.
3. Identificadores sin colisión y reintentos sin duplicación.
4. Sincronización de al menos 1.000 ventas y 2.000 artículos.
5. Ajuste compensatorio correcto.
6. Detección de dos precios concurrentes.
7. Pérdida/apagado de una caja durante sincronización.
8. Reversión segura ante una versión incompatible.
9. Resolución administrativa del conflicto de precio sin alterar ventas históricas.

## Estrategia de reversión

Si el prototipo no converge o supera el costo aceptable, usar nodo principal local con réplica/relevo y limitar la operación simultánea durante particiones.
