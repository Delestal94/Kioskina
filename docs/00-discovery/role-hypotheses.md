# Hipótesis iniciales de roles

- Estado: **Borrador del fundador; se validará recién durante el piloto**
- Importante: los roles son conjuntos configurables de permisos; una persona puede tener uno o más.

| Rol predeterminado | Objetivo | Capacidades candidatas |
|---|---|---|
| Propietario/administrador | Control integral del comercio | Configuración, usuarios, roles, precios, reportes, cierres, integraciones y facturación del servicio |
| Encargado | Operar una sucursal y resolver excepciones | Supervisar turnos, autorizar descuentos/devoluciones, movimientos de caja, inventario y reportes de sucursal |
| Cajero | Realizar ventas con rapidez y seguridad | Abrir turno, vender, cobrar, emitir comprobantes y consultar productos; excepciones según permiso |
| Repositor/inventario | Mantener existencias correctas | Recepciones, conteos, transferencias, mermas, vencimientos y etiquetas |
| Comprador | Abastecer el comercio | Proveedores, costos, sugerencias y órdenes de compra |
| Contador/auditor | Controlar información sin operar la caja | Consultas, cierres, impuestos, auditoría y exportaciones autorizadas |
| Soporte técnico | Diagnosticar con autorización y alcance temporal | Estado técnico, registros y asistencia; sin acceso comercial innecesario |

## Reglas candidatas para validar

- Cada persona utiliza una identidad individual; no se comparten credenciales.
- Los permisos se asignan por acción y alcance, por ejemplo comercio, sucursal o caja.
- Los roles predeterminados pueden duplicarse y adaptarse.
- Acciones sensibles pueden requerir PIN/reautenticación, motivo obligatorio o aprobación de otra persona.
- Siempre debe existir al menos un administrador recuperable.
- El soporte no obtiene acceso permanente a datos del cliente por defecto.
