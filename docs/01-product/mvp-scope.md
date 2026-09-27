# Alcance candidato del piloto/MVP

- Estado: **Borrador; alcance de alto nivel ratificado por el fundador el 2026-09-26; línea base no aprobada**
- Piloto candidato posterior a pruebas internas: 1 kiosco de barrio, 2 empleados, 2 cajas y aproximadamente 100 ventas diarias. El comercio y la localidad no están seleccionados.
- Duración comercial candidata: prueba gratuita de 2 semanas.
- Modalidad inicial: local-first, con nodo autónomo en cada dispositivo y coordinador remoto por Internet conforme ADR-0001; stack condicionado al spike.
- Ratificación de alcance (2026-09-26): el núcleo prioritario y las exclusiones enumeradas en este documento quedan confirmados para la línea base propuesta; prioridades detalladas y puertas legales/técnicas aún requieren cierre.

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
