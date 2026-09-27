# Paquete — Build instalable de revisión interna

## Identificación

- Responsable/revisor: implementación por agente; revisión del equipo pendiente.
- Estado: Implementado; validación visual del equipo pendiente. No es release de producto.
- Tipo: Spike de distribución y revisión local.
- Referencias: RF-060, RF-065; RNF-010, RNF-011; ADR-0002; T-PWA-001.

## Objetivo

Generar un build estático reproducible de la interfaz actual y revisarlo localmente con Service Worker activo, sin desplegarlo ni presentarlo como POS terminado.

## Incluye / no incluye

- Incluye: configuración pública externa, build del cliente, servidor de vista previa en host/puerto configurables y comprobación del shell/cache offline.
- No incluye: despliegue remoto, dominio/TLS, autenticación comercial, coordinador CouchDB activo, tiendas de aplicaciones ni habilitación para operar comercios.

## Criterios de aceptación

1. `npm run build:client` genera el artefacto estático y runtime config con valores públicos.
2. `npm run preview:client` sirve ese artefacto en la dirección local configurada.
3. El bundle/runtime config no contiene contraseña de CouchDB ni token del gateway.
4. Con el Service Worker instalado, la interfaz vuelve a cargar desde caché cuando el servidor de vista previa no está disponible; la app muestra el coordinador como no disponible.
5. La documentación declara explícitamente que el artefacto sigue siendo un spike y no una release del POS.
6. La vista principal prioriza una tarea, reduce el estado técnico a una franja compacta y oculta las herramientas de spike en una sección desplegable; los controles siguen etiquetados y utilizables en móvil y escritorio.
7. Colores de componentes y estados consumen tokens semánticos centralizados; los valores de tema inyectados por runtime conservan la personalización prevista.

## Matriz de comportamiento

| Aspecto | Caso esperado |
|---|---|
| Permisos/auditoría | Sólo sesión local de revisión; sin identidad comercial ni operaciones reales. |
| Offline | Shell y assets distribuidos en caché; APIs no se guardan ni simulan disponibilidad. |
| Recuperación | El contenido visible vuelve al cachear el build; sincronización depende del gateway/CouchDB. |
| Accesibilidad | Mantener etiquetas/estados accesibles existentes; no declara auditoría WCAG completa. |
| Hardware | Sólo el navegador local disponible; sin promesa de matriz. |
| Privacidad | Usar `.env` sintético e ignorado; el preview no expone credenciales server-side. |

## Diseño técnico

- Vite compila a `apps/client/dist`; `preview:client` usa host y puerto definidos en `.env` (`VITE_CLIENT_HOST`, `VITE_CLIENT_PREVIEW_PORT`).
- No agrega dependencias ni cambia contratos persistentes.
- Reversión: quitar los scripts/instrucciones de preview; el artefacto es regenerable y no publicado.

## Pruebas

| ID | Nivel | Caso | Resultado |
|---|---|---|---|
| T-PWA-001 | Manual/browser | Confirmar que el Service Worker controla la página, apagar preview y recargar; reconectar y actualizar el shell cacheado | Aprobado en v2: tras abrir el build nuevo, detener el preview y recargar mostró la interfaz actual cacheada y el servidor no disponible. Preview restaurado en `4173` |
| T-CONFIG-001 | Build/config | Validar configuración y ausencia de secretos del gateway | Build generado; runtime sintético inspeccionado, sin credenciales de gateway |
| T-UX-001 | Manual/browser | Revisar la jerarquía, estados comprensibles, formulario de venta y disclosure de herramientas en escritorio y ventana móvil | Escritorio: revisado visualmente y árbol accesible confirmado; móvil: breakpoint de una columna inspeccionado en CSS, prueba real pendiente |
| T-THEME-001 | Inspección/build | Verificar que los colores de componentes usan tokens semánticos y que Vite genera el build con el tema | Build aprobado; valores cromáticos concentrados en tokens `:root`, componentes referencian variables; runtime config sintético inspeccionado |

## Evidencia y documentación

- Documentos: README del repositorio, este paquete y estrategia de pruebas.
- Evidencia ejecutada: `npm run typecheck:client` y `npm run build:client` aprobados; `T-PWA-001` aprobado con recarga offline de la interfaz actual; vista local restaurada en `http://127.0.0.1:4173/`.
- No habilita: aprobación de línea base, piloto real ni publicación de release.
