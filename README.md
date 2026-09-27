# Kioskina

Plataforma de gestión para kioscos, drugstores y maxikioscos, concebida para abarcar desde un único comercio pequeño hasta organizaciones con múltiples sucursales.

## Estado

La primera versión interna de una caja Windows está en desarrollo y puede probarse con datos ficticios. La autorización de esta entrega está en `docs/00-discovery/discovery-status.md` y el alcance en `docs/01-product/mvp-scope.md`. La operación con ventas o datos reales, la sincronización entre cajas y la comercialización no están aprobadas.

## Ejecutar localmente

Requiere Node.js compatible con Vite y npm. En esta etapa se probó con Node.js 24, Chrome y Edge instalados en Windows.

```powershell
npm ci
npm run dev
```

Abrir la dirección local que indique Vite. En el primer ingreso, crear el comercio ficticio y la cuenta de dueño. Cada navegador tiene almacenamiento independiente: los datos creados en Chrome no aparecen automáticamente en Edge. Para probar la versión compilada:

```powershell
npm run build
npm run preview
```

La instalación web sin conexión se prepara al abrir la versión compilada mientras hay conexión al servidor local. El servidor que entrega la aplicación debe seguir disponible para nuevas instalaciones y actualizaciones. `npm test` ejecuta las pruebas del dominio, CSV y persistencia local.

## Funciones disponibles en esta entrega

- Venta en efectivo, transferencia/QR manual y fiado, con pagos combinados y descuento autorizado.
- Turnos, arqueo de efectivo, stock y ajustes, catálogo, clientes, cobro de fiado y reportes diarios.
- Usuarios con roles iniciales, auditoría, importación/exportación de productos CSV, copia JSON y restauración.
- Interfaz en español, adaptable y utilizable sin periféricos.

La información se guarda en IndexedDB del navegador. Descargar copias regularmente y conservarlas fuera de esa computadora. La copia JSON contiene los datos y los hashes de las credenciales; sólo se debe usar con datos ficticios en esta etapa. No hay sincronización entre navegadores ni dispositivos.

## Próximas puertas

Completar pruebas manuales en Chrome y Edge del equipo de referencia, simulacro de restauración y revisión de accesibilidad. Antes de una segunda caja se ejecuta el spike de ADR-0001 a ADR-0003. Antes de cualquier venta o dato real se cierran las decisiones fiscales, de privacidad, seguridad y operación indicadas en `docs/00-discovery/discovery-closure-checklist.md`.

Toda persona o agente de IA debe comenzar leyendo `AGENTS.md` y `docs/README.md`.
