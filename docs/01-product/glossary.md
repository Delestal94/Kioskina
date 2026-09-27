# Glosario

- Estado: **Borrador**

| Término | Definición de trabajo | Estado |
|---|---|---|
| Kiosco | Comercio minorista de conveniencia; su alcance exacto depende del país. | Por validar |
| Drugstore | Formato comercial cuyo significado y surtido varían por región. | Por validar |
| Maxikiosco | Kiosco de mayor superficie o surtido; límites exactos aún no definidos. | Por validar |
| Comercio | Unidad cliente que opera uno o más puntos de venta. | Por validar |
| Sucursal | Ubicación operativa perteneciente o asociada a una organización. | Por validar |
| Caja | Punto lógico y/o físico desde el que se registran cobros y movimientos. | Por validar |
| POS | Sistema de punto de venta. No implica todavía una arquitectura concreta. | Provisional |
| MVP | Primera versión útil y validable; su contenido aún no está definido. | Provisional |
| Rol | Conjunto reutilizable y configurable de permisos; una persona puede tener más de uno. | Provisional |
| Permiso | Autorización para realizar una acción sobre un alcance determinado. | Provisional |
| Usuario | Identidad individual atribuible a una persona; no equivale necesariamente a un rol. | Provisional |
| Modo sin conexión | Capacidad de ejecutar determinadas operaciones sin comunicación con servicios centrales y sincronizarlas posteriormente. | Por definir |
| Turno de caja | Período operativo atribuible a un usuario, una caja y sus movimientos. | Provisional |
| Pago combinado | Pago cuyo total se distribuye entre dos o más medios. | Provisional |
| Estado incierto de pago | Situación en la que todavía no puede determinarse de forma confiable si un proveedor acreditó o rechazó el pago. | Provisional |
| Fiado/cuenta corriente | Deuda registrada a nombre de un cliente para cobro posterior. | Provisional |
| SKU/artículo vendible | Unidad identificable del catálogo con código, precio y stock propios. | Provisional |
| Variante | Artículo vendible relacionado con otros por una característica como sabor, tamaño o presentación. | Provisional |
| Stock teórico | Existencia calculada a partir de movimientos registrados. | Provisional |
| Ajuste de inventario | Movimiento explícito que corrige una diferencia entre existencia física y teórica. | Provisional |
| Ajuste compensatorio | Entrada automática por el faltante exacto que permite registrar una venta sin dejar stock negativo; permanece vinculada y auditada. | Confirmado; detalles abiertos |
| Comercio independiente | Ámbito aislado de datos, configuración y permisos que puede compartir propietario con otros comercios sin mezclar información. | Provisional |
| Promoción válida | Beneficio cuyas condiciones de producto, cantidad, cliente, sucursal, medio y vigencia se cumplen. | Provisional |
| Archivo de auditoría | Segmento cerrado y consultable de eventos que conserva integridad después de su período activo. | Provisional |
| Rectificación | Nuevo registro que corrige o reemplaza el efecto de otro sin modificar el original. | Provisional |
| RPO | Pérdida máxima de datos aceptable expresada como tiempo entre el último estado recuperable y una falla. | Por definir por plan |
| RTO | Tiempo objetivo para recuperar el servicio después de una falla. | Por definir por plan |
| Nodo local | Instalación en un dispositivo que conserva datos operativos y confirma operaciones sin conexión continua. | Provisional ADR-0001 |
| Coordinador de sincronización | Servicio que recibe, ordena y redistribuye eventos entre nodos sin ser necesario para cada venta local. | Provisional ADR-0001 |
| Convergencia | Estado en que todos los nodos que procesaron los mismos eventos producen los mismos resultados. | Provisional |
| Conflicto no acumulable | Dos cambios concurrentes sobre un valor único, como el precio vigente, que no pueden sumarse. | Provisional |

Todo término fiscal, comercial o operativo ambiguo deberá añadirse antes de usarlo como requisito.
