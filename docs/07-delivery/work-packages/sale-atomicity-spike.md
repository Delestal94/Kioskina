# Paquete — Spike descartable de venta en efectivo atómica

## Identificación

- Responsable/revisor: implementación por agente; revisión del equipo pendiente.
- Estado: Implementado en spike; revisión del equipo pendiente; no producción.
- Tipo: Spike técnico delimitado por ADR-0001 a ADR-0003.
- Requisitos y reglas relacionados: RF-001, RF-006, RF-013, RF-056, RN-001, RN-011, RN-021; RNF-004, RNF-013 a RNF-015.
- ADR: ADR-0001, ADR-0002, ADR-0003.

## Objetivo

Retirar parte del riesgo de integridad local: explorar si una venta sintética de efectivo puede validarse y persistirse offline como un único evento durable, y sincronizarse con idempotencia entre dos nodos. No constituye la implementación del flujo comercial del MVP.

## Incluye / no incluye

- Incluye: prototipo visual de una venta de una línea, datos ingresados al momento, moneda/región configurables, importes en unidad mínima, cálculo de vuelto, persistencia local y replicación del evento.
- No incluye: catálogo real, carrito de varias líneas, descuentos, roles/permisos comerciales, turnos, movimientos de caja separados, stock/proyecciones, pagos no efectivo, clientes/fiado, tickets ni cumplimiento fiscal.

## Criterios de aceptación

1. Precio y efectivo recibido aceptan como máximo dos decimales y se representan en enteros de unidad mínima; cantidad es un entero positivo.
2. Una venta con importe insuficiente, valores no representables o contenido inválido no se guarda.
3. El evento conserva el snapshot de una línea, total, moneda, efectivo recibido y vuelto; importes inconsistentes se rechazan en el contrato.
4. La confirmación produce un único documento/evento local. Repetir la misma clave con el mismo contenido devuelve el evento previo; cambiar contenido con esa clave se rechaza sin crear una segunda venta.
5. Dos nodos pueden sincronizar el evento sin duplicar su identidad.
6. La interfaz identifica el flujo como prueba sintética y avisa que no reemplaza catálogo, caja, stock ni comprobante fiscal.

## Matriz de comportamiento

| Aspecto | Decisión/caso esperado |
|---|---|
| Permisos | Usa identidad técnica configurada del spike; no demuestra roles comerciales. |
| Auditoría | Evento inmutable con actor, dispositivo, secuencia e ID; sin datos personales reales. |
| Offline y sincronización | Guarda localmente; outbox se replica al recuperar gateway; idempotencia por eventId. |
| Recuperación ante fallo | Documento individual; reintento con mismo ID devuelve lo guardado; contenido conflictivo se rechaza. No demuestra atomicidad de varias proyecciones/documentos. |
| Accesibilidad | Controles con etiquetas, navegación por teclado, mensajes anunciados y objetivos táctiles. |
| Hardware/navegadores | Comprobado sólo en el navegador local disponible; matriz Windows/Android pendiente. |
| Privacidad/retención | Datos sintéticos ingresados durante la prueba; limpieza de la base de prueba a cargo del entorno local. |

## Diseño técnico

- Componentes: `spike-domain` valida importes y construye el evento; `event-contracts` valida snapshots e invariantes; `local-store` guarda con idempotencia; gateway replica el sobre; UI expone el ejercicio.
- Datos/migración: moneda y configuración regional llegan desde `.env`; no se declara un modelo de producto aprobado.
- Riesgos/reversión: implementación aislada y descartable. Un evento unitario no demuestra transacción de venta con cobros, caja, inventario y auditoría separados ni sincronización/backup a 24 h.

## Pruebas

| ID | Nivel | Caso | Resultado |
|---|---|---|---|
| T-SALE-003 | Dominio/contrato | Importe en unidad mínima, vuelto, pago insuficiente y representación inválida | Aprobada con datos sintéticos |
| T-SALE-004 | Persistencia/idempotencia | Evento durable; reintento idéntico y reutilización conflictiva del ID | Aprobada con base local simulada |
| T-SYNC-009 | Integración de spike | Replicar una venta entre dos nodos sin duplicados | Aprobada con coordinador en memoria; CouchDB real pendiente |

## Evidencia y documentación

- Documentos afectados: `test-strategy.md`, `traceability.md` y este paquete.
- Evidencia: `npm run test:sync` — 13 pruebas aprobadas; typechecks de cliente/gateway/pruebas y builds de cliente/gateway aprobados. Se requirió ajuste temporal y restaurado en `node_modules/tsx` por el fallo ambiental de `os.userInfo()` en Windows.
- Puerta: no promover el formulario, el evento ni su modelo de persistencia al producto antes de aprobar la línea base y revisar ADR/modelo de datos.
- Riesgos abiertos: venta multifila y atomicidad de sus efectos, catálogo, descuentos, turnos/caja, stock, permisos, pagos, comprobante fiscal y validación en dispositivos reales.
