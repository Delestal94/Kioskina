# Paquete — Validación continua del monorepo

## Identificación

- Fecha: 2026-09-27
- Responsable/revisor: implementación por agente; revisión del equipo pendiente.
- Estado: Preparado para ejecutar en GitHub Actions; validación remota pendiente.
- Tipo: Infraestructura técnica descartable del spike.
- Referencias: RNF-011, RNF-016; ADR-0002; `sync-reliability.md`.

## Objetivo

Ejecutar de manera repetible los chequeos de tipos y builds en cada cambio de `main` y pull request. El workflow no despliega, publica artefactos ni utiliza credenciales comerciales.

## Incluye / no incluye

- Incluye: workflow GitHub Actions para Node 24, instalación reproducible desde `package-lock.json`, chequeos de tipos y builds.
- No incluye: despliegue, CouchDB real, validación Windows/Android, publicación de release, reglas de protección de rama ni cambios a las pruebas existentes.

## Criterios de aceptación

1. El workflow se activa en push a `main`, pull request y ejecución manual.
2. Cada acción externa queda fijada a un commit SHA y el token del job tiene sólo `contents: read`.
3. El cliente se compila con IDs sintéticos definidos en el workflow; no lee credenciales del repositorio ni revela valores de `.env`.
4. Se ejecutan typechecks, build del gateway y build del cliente.
5. Una falla en cualquier comando falla el job; no hay pasos de deploy, upload, release o permisos de escritura.
6. README y estrategia de calidad explican qué valida la CI y qué evidencia queda fuera.

## Matriz de comportamiento

| Aspecto | Decisión/caso esperado |
|---|---|
| Permisos | Token de workflow de sólo lectura al contenido; checkout no persiste credenciales Git |
| Auditoría | GitHub Actions conserva resultado por commit/PR; no se imprimen tokens ni datos reales |
| Offline y sincronización | Sólo compila; no ejecuta la suite ni simula ni garantiza 24 h de desconexión real |
| Recuperación ante fallo | Cualquier paso fallido produce job fallido; ejecución cancelable y repetible |
| Accesibilidad | No modifica la interfaz ni reemplaza pruebas de accesibilidad |
| Hardware/navegadores | Runner Ubuntu; no certifica Chrome/Edge en Windows/Android |
| Privacidad/retención | Sin secretos; usa identidad runtime `*-ci`; los registros son los de GitHub Actions |

## Diseño técnico

- Componentes afectados: `.github/workflows/ci.yml`, instrucciones README, estrategia de calidad.
- Datos/migración: no aplica; el job crea un `.env` temporal no rastreado desde `.env.example` y compila con identidad sintética.
- Motivo: no había automatización del monorepo; repetir comandos locales deja fallas sin señal por commit. Alternativa de no agregar CI preserva cero dependencia de plataforma pero no da feedback continuo. GitHub-hosted runner integra con el repositorio existente; consecuencia: ejecución y logs dependen de disponibilidad/políticas de GitHub, y no sustituyen servicios ni equipos reales.
- Referencias de implementación: [GitHub Actions: Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs), [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1) y [setup-node v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0). Las acciones se fijan a sus SHA completos publicados para evitar seguir tags mutables.
- Reversión: quitar el workflow y su sección README; no cambia código runtime ni datos.

## Pruebas

| ID | Nivel | Caso | Resultado |
|---|---|---|---|
| T-CI-001 | GitHub Actions | Pull request y push a `main` ejecutan typechecks/builds; fallo impide verde | Pendiente de primera ejecución remota |
| T-CI-002 | Seguridad estática | Revisar permisos mínimos, acciones fijadas por SHA, entorno sintético y ausencia de publicación | Inspección de workflow pendiente de revisión final |

## Evidencia y documentación

- Comandos/resultados: no se ejecuta la suite de pruebas en esta tarea; el job realizará typechecks/builds al subir el workflow. La suite `npm run test:sync` permanece fuera de CI hasta una tarea autorizada específica.
- Documentos: README, estrategia de calidad y este paquete.
- Límites: un resultado verde sólo prueba compilación del scaffold en Linux; no ejecuta pruebas de comportamiento ni aprueba arquitectura, release, CouchDB, Windows/Android ni rama protegida.
