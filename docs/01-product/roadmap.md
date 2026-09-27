# Roadmap de descubrimiento a piloto

- Estado: **Propuesto; sin fechas comprometidas**
- Fecha: 2026-09-20

El roadmap usa puertas de evidencia, no fechas arbitrarias. No implica construir todas las capacidades de visión.

## Fase 0 — Cerrar línea base

Resultado: alcance, riesgos, arquitectura y condiciones de piloto aprobados.

- Revisar ADR-0001 a ADR-0003.
- Aprobar recortes del MVP, métricas y objetivos de recuperación.
- Identificar comercio y mecanismo fiscal externo.
- Formalizar responsables de producto/técnica/ventas-soporte y custodia de activos.
- Resolver preguntas bloqueantes Q-043, Q-046, Q-048 y matriz de hardware.

Puerta: `discovery-status.md` cambia a línea base aprobada por decisión de los tres fundadores.

## Fase 1 — Spike local-first

Resultado: evidencia para aceptar o rechazar PouchDB/CouchDB.

- Construir sólo harness técnico, dominio mínimo de venta/eventos y dos nodos.
- Ejecutar ADR-0001/0002/0003 y T-SYNC/T-SALE/T-STOCK/T-TENANT/T-MIG.
- Medir rendimiento, espacio, recuperación, migración y complejidad.
- Registrar decisión final o reemplazo del stack.

Puerta: cero pérdida/duplicación y estrategia de salida demostrada.

## Fase 2 — Corte vertical operable

Resultado: venta en efectivo completa en una caja.

- Identidad, roles mínimos, comercio/dispositivo y turno.
- Catálogo/búsqueda, carrito, efectivo/vuelto.
- Movimientos de stock/caja, auditoría y ticket interno no fiscal.
- UX táctil, accesibilidad base y actualización segura.

Puerta: suite crítica local aprobada en matriz mínima.

## Fase 3 — Piloto funcional de dos cajas

Resultado: núcleo MVP sincronizado.

- Dos cajas, conflictos y estado de sincronización.
- Ingresos de mercadería, conteo/ajustes y alertas mínimas.
- Clientes/fiado, rectificaciones y reportes mínimos.
- Importación Excel/CSV revisada; exportación operativa.
- Transferencia/QR registrada manualmente. Verificación automática sólo si hay proveedor elegido y contrato probado.
- Recuperación, respaldo, soporte y observabilidad.

Puerta: pruebas de calidad para instalación, proceso fiscal externo y recuperación ensayada.

## Fase 4 — Piloto comercial de 14 días

Resultado: primera evidencia real de uso.

- Capacitar según plan y registrar incidencias/tickets.
- Medir ventas, cierres, errores, sincronización, tiempos y necesidad de ayuda.
- Corregir defectos críticos; no ampliar alcance durante la observación salvo seguridad/cumplimiento.
- Evaluar continuidad, cambios o extensión del piloto si 14 días son insuficientes.

Puerta: revisión conjunta de métricas y decisión continuar/corregir/detener.

## Fase 5 — Endurecimiento y expansión

Sólo después del piloto: pagos verificados, WhatsApp, OCR, periféricos adicionales, facturación fiscal, multi-sucursal, nube/híbridos adicionales, fidelización, e-commerce y verticales. Cada incorporación requiere evidencia, requisito, ADR cuando corresponda y pruebas.

## Métricas registradas para la línea base propuesta

- 100 % de ventas confirmadas sin pérdida ni duplicación.
- 100 % de cierres conciliables con explicación de diferencias.
- 0 incidentes críticos de aislamiento, integridad o recuperación.
- 99 % de ventas comunes sin pedir soporte durante la operación.
- Mediana de venta en efectivo menor a 30 segundos después de capacitación.
- Sincronización automática completa dentro de 5 minutos de restablecer conexión, bajo carga piloto.
- Al menos un restore y un rollback satisfactorios antes de producción.

El fundador aceptó estas metas como objetivos de la línea base propuesta. Aún requieren ratificación de la línea base por los tres fundadores, método de medición, comercio y duración final; no constituyen una promesa comercial.
