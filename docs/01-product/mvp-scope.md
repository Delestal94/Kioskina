# Alcance candidato del piloto/MVP

- Estado: **Línea base de desarrollo interno aprobada el 2026-09-27; piloto comercial y alcance amplio restante en revisión**
- Piloto candidato posterior a pruebas internas: 1 kiosco de barrio, 2 empleados, 2 cajas y aproximadamente 100 ventas diarias. El comercio y la localidad no están seleccionados.
- Duración comercial candidata: prueba gratuita de 2 semanas.
- Modalidad inicial: local-first, con nodo autónomo en cada dispositivo y coordinador remoto por Internet conforme ADR-0001; stack condicionado al spike.
- Ratificación de alcance (2026-09-26): el núcleo prioritario y las exclusiones enumeradas en este documento quedan confirmados para la línea base propuesta; prioridades detalladas y puertas legales/técnicas aún requieren cierre.

## Solicitud de ampliación y cambio de piloto (2026-09-27)

El fundador solicita que el MVP incluya «todas las funcionalidades que puedas», que la primera ejecución sea en una sola computadora Windows y que el producto sea general para drugstores, sin elegir aún un comercio piloto concreto. El 2026-09-27 confirmó pruebas internas con datos ficticios en Chrome y Edge. Esta solicitud abre la revisión del alcance ratificado arriba; no convierte automáticamente las funciones condicionadas o posteriores en requisitos aprobados. Para que la primera entrega sea verificable, falta acordar qué funciones se incluyen, sus criterios de aceptación y qué capacidades externas se excluyen o posponen. La operación inicial en una computadora reduce la necesidad inmediata de sincronizar dos cajas, pero la decisión sobre conservar o reemplazar la arquitectura de ADR-0001 a ADR-0003 requiere revisión explícita. El fundador no prevé un referente contable/legal; los requisitos fiscales y de privacidad para operar con datos o ventas reales siguen sin resolver.

### Propuesta de alcance verificable para la primera entrega interna

Esta propuesta maximiza las funciones autocontenidas que pueden probarse con datos ficticios en una computadora Windows. El fundador autorizó comenzar su desarrollo interno el 2026-09-27; no aprobó con ello una entrega comercial ni declaró implementado todo el alcance. Cada grupo remite a los criterios de aceptación de los RF citados; los que dependan de dos cajas, servicios remotos o datos reales siguen sujetos a revisión.

La implementación inicial cubre venta, turnos/caja, catálogo y stock, clientes/fiado, descuento manual autorizado, reportes diarios, usuarios con tres roles iniciales, auditoría, CSV y copia/restauración JSON. Todavía no cubre variantes y promociones generales, proveedores/deuda, roles configurables, archivo de auditoría, Excel `.xlsx` directo ni soporte comercial. La matriz de trazabilidad y el paquete `../07-delivery/work-packages/primera-entrega-interna-windows.md` registran evidencia y pendientes.

| Grupo | Funciones propuestas para pruebas internas | Requisitos de referencia |
|---|---|---|
| Venta y caja | Carrito, búsqueda y alta rápida, unidades/presentaciones, efectivo/vuelto, registro manual de transferencia/QR, pagos combinados, fiado, turnos, autorizaciones y ticket interno inequívocamente no fiscal. | RF-001 a RF-013, RF-015 |
| Catálogo, precios e inventario | Productos, variantes, precios e historial, stock y movimientos, aviso de insuficiencia, ajuste compensatorio, conteo, alertas de mínimo, ingreso de mercadería y cuenta simple de proveedor. | RF-016 a RF-025, RF-027, RF-043 |
| Clientes y beneficios | Cliente opcional, cuenta corriente, estado de cuenta, descuentos autorizados, precios por cantidad y promociones que puedan resolverse localmente con reglas aprobadas. | RF-030 a RF-034 |
| Control y reportes | Identidades y roles, permisos, auditoría y rectificaciones, reportes de ventas/caja/stock/fiado, alertas, exportación simple e importación revisada de Excel/CSV. | RF-026, RF-037 a RF-040, RF-044, RF-047 a RF-050, RF-052, RF-061 |
| Uso y continuidad local | Instalación web, operación sin periféricos, lector tipo teclado opcional, configuración guiada, ayuda, respaldo/exportación y restauración probada en el equipo de referencia. | RF-053 a RF-057, RF-060, RF-062, RF-063, RF-065 |

**Criterio de entrega propuesto:** ejecutar en Chrome y Edge sobre la computadora Windows de referencia, con datos ficticios, los flujos completos de venta, cierre, stock, fiado, importación/exportación y restauración; aprobar pruebas de permisos, auditoría, accesibilidad, fallas e integridad vinculadas a esos flujos. Versión de Windows/navegadores, volumen de datos y mediciones concretas se fijan antes de aprobar la línea base.

**Dependencias fuera de esta primera entrega interna:** sincronización entre cajas y coordinador; acreditación automática de pagos; facturación fiscal; WhatsApp; impresoras/balanza no identificadas; multisucursal; comercio electrónico y delivery; asistencia y nómina; funciones comerciales por plan y atención de soporte real. Algunas pueden demostrarse posteriormente con simuladores, pero no se considerarán funcionales en operación real sin sus contratos, hardware o validación correspondiente. Los ADR de sincronización permanecen vigentes como diseño candidato para una etapa posterior; cualquier sustitución requiere revisión explícita.

## Núcleo prioritario declarado

1. Venta inmediata.
2. Turnos y caja individual.
3. Productos y búsqueda.
4. Stock y movimientos esenciales.
5. Clientes y fiado.
6. Reportes operativos mínimos.
7. Operación sin conexión durante hasta 24 horas como objetivo verificable: venta en efectivo, movimientos locales esenciales y cierre, sin depender de la otra caja.

## Capacidades habilitadoras obligatorias

- Usuarios, roles y permisos.
- Auditoría y rectificaciones.
- Instalación web y uso táctil.
- Importación inicial controlada.
- Respaldo y recuperación acordes al plan.
- Telemetría técnica, soporte y actualizaciones seguras.
- Accesibilidad y ayuda de autoservicio.

## Fuera del piloto o sujeto a recorte

- Facturación fiscal integrada: fuera del MVP; el comercio deberá usar un mecanismo externo válido y el ticket interno se identificará como no fiscal.
- Fidelización, membresías, e-commerce y delivery: posteriores.
- Integración contable: posterior; exportación simple candidata.
- Sueldos y nómina: fuera.
- Lotes, vencimientos, ubicaciones internas y órdenes de compra formales: fuera.
- Cloud puro e híbridos adicionales: posteriores; la primera versión será local-first, pero puede requerir un servicio remoto de coordinación/respaldo.
- Integraciones de recargas, transporte y pago de servicios: posteriores.
- Verificación automática de transferencia/QR: sólo entra si se elige proveedor y supera pruebas; el piloto admite registro manual auditado.
- OCR de listas o fotos: posterior al importador Excel/CSV/manual validado.

## Condiciones bloqueantes antes de ventas reales

- Mecanismo fiscal externo identificado y probado; ticket interno rotulado como no fiscal.
- Aviso de privacidad, roles de responsable/encargado y proceso de derechos definidos.
- Retención mínima y respaldo definidos por modalidad.
- Estrategia local-first y sincronización entre dos cajas documentada y probada.
- Matriz Chrome/Edge en Windows/Android cerrada.

## Criterios de éxito registrados, pendientes de ratificación de línea base

- 100 % de ventas confirmadas sin pérdida ni duplicación.
- 100 % de cierres conciliables con explicación de diferencias.
- 0 incidentes críticos de aislamiento, integridad o recuperación.
- 99 % de ventas comunes sin pedir soporte durante la operación.
- Mediana de venta en efectivo inferior a 30 segundos después de capacitación.
- Sincronización automática completa dentro de 5 minutos de restablecer conexión bajo la carga del piloto.
- Al menos una restauración y un rollback satisfactorios antes de producción.

La duración, el comercio, la carga exacta y el método de captura de estas métricas siguen pendientes.



