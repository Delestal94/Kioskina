# Registro de riesgos

- Estado: **Activo**

| ID | Riesgo | Probabilidad | Impacto | Mitigación candidata | Estado |
|---|---|---:|---:|---|---|
| RISK-001 | Pérdida total de datos en un plan local por rotura, robo o corrupción del dispositivo. | Alta | Crítico | Copia local externa y/o respaldo cloud cifrado opcional, prueba de restauración y advertencia contractual. | Abierto |
| RISK-002 | Acceso indebido por sesiones que nunca se bloquean en dispositivos compartidos. | Media | Alto | Bloqueo manual rápido, reautenticación de acciones sensibles y validación de campo. | Abierto |
| RISK-003 | Prometer duración offline configurable sin límites técnicos/fiscales reales. | Alta | Alto | Definir ventana soportada por arquitectura/plan y ensayar sincronización prolongada. | Abierto |
| RISK-004 | Horario de soporte de 12 horas y presencialidad superan la capacidad de un equipo de tres personas. | Alta | Alto | Definir guardias, severidades, SLA, zona geográfica y precio del soporte. | Abierto |
| RISK-005 | Recuperación por WhatsApp/correo permite apropiación de cuentas. | Media | Crítico | Tokens breves, verificación reforzada, avisos multicanal, demoras de seguridad y soporte de recuperación. | Abierto |
| RISK-006 | Vender equipos incorpora costos de garantía, reposición y compatibilidad no contemplados. | Media | Alto | Catálogo reducido y homologado, proveedor/garantía definidos y precio separado. | Abierto |
| RISK-007 | Construir local, cloud y múltiples híbridos desde el inicio triplica matrices de prueba y soporte. | Alta | Crítico | Elegir una modalidad inicial y diseñar interfaces de evolución; ADR antes de implementar. | Abierto |
| RISK-008 | Versiones opcionales fragmentan clientes y dejan vulnerabilidades o incompatibilidades activas. | Alta | Alto | Ventana de soporte, compatibilidad limitada y parches críticos obligatorios/gratuitos. | Abierto |
| RISK-009 | El comercio confunde un ticket interno con comprobante fiscal al quedar ARCA fuera del piloto. | Media | Crítico | Mensajes inequívocos, proceso fiscal externo documentado y revisión profesional antes del piloto. | Abierto |
| RISK-010 | Prueba de dos semanas no permite medir adopción, cierres y confiabilidad suficientes. | Media | Medio | Definir preparación previa y extender observación si los datos son insuficientes. | Abierto |
| RISK-011 | “A la brevedad posible” crea expectativas de soporte imposibles de medir. | Alta | Alto | SLA por severidad con primera respuesta, actualización y restauración objetivo. | Abierto |
| RISK-012 | Retención enteramente configurable elimina datos antes de plazos fiscales/contractuales. | Alta | Crítico | Mínimos por categoría no reducibles y revisión normativa. | Abierto |
| RISK-013 | Dos cajas offline producen balances o precios divergentes al sincronizar. | Alta | Alto | Sincronizar eventos, no saldos; identificadores únicos y reglas de conflicto/precio. | Abierto |
| RISK-014 | Sesiones sin bloqueo ni reautenticación permiten operaciones bajo identidad equivocada. | Alta | Alto | Mostrar usuario activo, cierre manual visible, observación piloto y reconsiderar control. | Aceptado provisionalmente por fundador |
| RISK-015 | Piloto sin especialista fiscal interpreta incorrectamente requisitos de ARCA/provincia. | Alta | Crítico | Proceso fiscal externo confirmado, fuentes oficiales y validación profesional recomendada antes de ventas reales. | Abierto |
| RISK-016 | Bloqueo total al vencer prueba impide acceso/exportación o derechos sobre datos. | Media | Alto | Proceso alternativo autenticado de exportación/derechos y retención publicada. | Abierto |
| RISK-017 | Multi-maestro entre dispositivos convierte el MVP en un sistema distribuido complejo. | Alta | Crítico | Comparar nodo principal/relevo y coordinador antes; prototipo de sincronización como prueba de riesgo. | Abierto |
| RISK-018 | “Precio de cada caja” produce cobros diferentes para el mismo artículo sin intención comercial clara. | Media | Alto | Distinguir precio por caja de conflicto temporal; mostrar alcance y auditar. | Abierto |
| RISK-019 | Sociedad futura sin acuerdo formal deja código, dominio y contratos sin titular claro. | Media | Crítico | Acuerdo de fundadores y cesión/licencia de propiedad intelectual antes de comercializar. | Abierto |
| RISK-020 | Cuotas o limpieza del navegador eliminan datos locales pendientes. | Media | Crítico | Persistencia solicitada, monitoreo de cuota, respaldo/exportación, detección y pruebas por plataforma. | Abierto |
| RISK-021 | Coordinador remoto caído impide convergencia aunque cada caja siga vendiendo. | Media | Alto | Cola durable, reintentos, estado visible, capacidad de 24 h y restauración del coordinador. | Abierto |
| RISK-022 | Diseñar sin entrevistar ni observar usuarios reales consolida supuestos equivocados sobre tareas, lenguaje y accesibilidad. | Alta | Alto | Hipótesis explícitas, telemetría respetuosa de privacidad, pruebas internas de usabilidad y ciclos cortos de corrección durante el piloto. | Aceptado por fundador el 2026-09-20 |
| RISK-023 | Exponer CouchDB directamente al navegador dificulta aislamiento multi-comercio, revocación y control del protocolo. | Media | Crítico | Gateway de sincronización autenticado, base aislada por comercio en piloto y pruebas negativas de autorización. | Abierto |
| RISK-024 | PouchDB está en incubación Apache y una dependencia de sincronización puede perder mantenimiento o introducir incompatibilidades. | Media | Alto | Encapsular el adaptador, fijar versiones, pruebas de exportación y criterio de salida hacia protocolo propio u otra biblioteca. | Abierto |
