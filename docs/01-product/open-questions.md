# Preguntas abiertas

- Estado: **Activo; sólo decisiones pendientes**

Las decisiones ya resueltas se trasladaron a `resolved-decisions.md`. Las respuestas parciales, condicionadas o sujetas a reevaluación permanecen aquí hasta que no requieran seguimiento.

| ID | Pregunta | Impacto | Responsable | Estado |
|---|---|---|---|---|
| Q-001 | ¿Qué localidades y comercios concretos de Tucumán y Jujuy participarán del piloto? | Permite investigar conectividad, fiscalidad, hardware y operación reales. | Fundador | Parcial: región confirmada |
| Q-003 | ¿Qué tamaños y modelos organizativos se atenderán en cada etapa? | Convierte la visión de no excluir negocios por tamaño en una evolución realizable. | Fundador | Parcial: comercio único en piloto; multisucursal posterior |
| Q-005 | ¿Qué hardware e integraciones son obligatorios en el piloto? | Define viabilidad, pruebas y plataforma cliente. | Fundador | Parcial: dispositivo con navegador; periféricos opcionales, modelos pendientes |
| Q-007 | ¿Qué métricas cuantitativas definirán éxito, confiabilidad y adopción en el primer año? | Permite evaluar el producto objetivamente. | Fundador | Abierta |
| Q-008 | ¿Qué comercios y usuarios reales participarán en investigación y piloto? | Reduce el riesgo derivado de la experiencia sectorial limitada. | Fundador | Investigación previa descartada; el equipo hará pruebas internas iniciales; comercio y usuarios externos del piloto aún por identificar |
| Q-009 | ¿Cuál será la matriz mínima de dispositivos, sistemas operativos, navegadores y tamaños soportados? | Convierte “cualquier dispositivo” en una promesa comprobable. | Producto/Técnica | Parcial: Chrome/Edge en Windows/Android son objetivo candidato; el equipo confirma tener equipos disponibles, pero modelos/versiones/navegadores aún no documentados |
| Q-012 | ¿Qué requisitos fiscales y de protección de datos aplican al piloto argentino? | Condiciona comprobantes, almacenamiento e integraciones. | Legal/Contable | Abierta |
| Q-013 | ¿Qué proveedor permitirá verificar transferencias o QR y cómo se concilian estados tardíos? | Define viabilidad y experiencia del cobro automático. | Producto/Técnica | Abierta |
| Q-014 | ¿Cuáles son los campos mínimos y el flujo de revisión para productos creados en caja? | Evita catálogo duplicado o fiscalmente incompleto. | Producto/Comercios piloto | Abierta |
| Q-015 | ¿Qué tipos de comprobante son obligatorios y cuáles opcionales en Argentina para los comercios piloto? | Define integración fiscal y posibilidad real de no entregar comprobante. | Legal/Contable | Abierta |
| Q-016 | ¿Cuánto tiempo y cuántas interacciones son objetivos aceptables para una venta común? | Permite medir la promesa de rapidez y facilidad. | UX/Comercios piloto | Abierta |
| Q-018 | Para el ajuste compensatorio por stock insuficiente, ¿cuándo se advierte, quién autoriza y cómo se revisa? | Define control operativo sin impedir la venta. | Producto/Comercios piloto | Parcial: mecanismo confirmado |
| Q-019 | ¿Qué clasificación impositiva necesita cada producto aunque el usuario no la cargue manualmente? | Condiciona facturación fiscal argentina. | Legal/Contable | Abierta |
| Q-020 | ¿Qué regla de precio prevalece si coinciden sucursal, medio, cliente, cantidad y promoción? | Evita precios ambiguos o incorrectos. | Producto | Abierta |
| Q-021 | ¿Qué formatos y ejemplos reales de listas de proveedores se usarán en el piloto? | Permite limitar y probar importación y OCR. | Comercios piloto/Técnica | Abierta |
| Q-022 | ¿Qué movimientos de inventario y alertas son imprescindibles para el MVP? | Limita un dominio amplio a flujos verificables. | Producto/Comercios piloto | Parcial: ingreso, venta, ajuste/conteo y mínimo; detalle pendiente |
| Q-023 | ¿Qué datos mínimos de cliente son legal y operativamente necesarios para cada flujo? | Evita recolectar información personal innecesaria. | Legal/Producto | Abierta |
| Q-024 | ¿Qué proveedor, consentimiento, plantillas y costos se usarán para WhatsApp? | Define viabilidad de mensajería y cumplimiento. | Producto/Técnica | Abierta |
| Q-025 | ¿Qué tipos de promoción entran al MVP y cómo se comparan/agrupan beneficios? | Limita y hace determinista el motor promocional. | Producto | Abierta |
| Q-026 | ¿Qué reportes y exportaciones forman el conjunto mínimo del piloto? | Evita construir analítica amplia antes de validar operación. | Producto/Comercios piloto/Contador | Abierta |
| Q-028 | ¿Qué mínimo concreto corresponde a cada categoría y qué opciones superiores ofrecerán los planes? | Define cumplimiento, costo y capacidad de investigación. | Legal/Producto | Principio resuelto: nunca por debajo del mínimo |
| Q-029 | ¿Se mantiene la ausencia de bloqueo/reautenticación después de observar el dispositivo compartido? | Reduce exposición de sesiones abiertas sin obstaculizar caja. | Seguridad/UX/Comercios piloto | Riesgo aceptado provisionalmente |
| Q-030 | ¿Qué respaldo mínimo tendrá el plan local y qué pérdida/tiempo de recuperación se acepta por plan? | Evita pérdida crítica y publicidad ambigua. | Producto/Técnica | Abierta |
| Q-031 | ¿Cómo se resolverán los conflictos no acumulables tras una ventana offline de 24 horas? | Bloquea reglas de precio, permisos y configuración. | Técnica/Producto | Parcial: precio manual y eventos resueltos; otras configuraciones pendientes |
| Q-032 | ¿Qué días, zona, SLA y radio geográfico tendrá el soporte de 09:00 a 21:00? | Determina dotación, precio y promesa comercial. | Fundador/Operaciones | Parcial: lun/mié/vie, Argentina, S1 candidato 30 min; radio pendiente |
| Q-033 | ¿Qué modelos reales integrarán la primera matriz de hardware probado? | Limita compatibilidad y permite pruebas reproducibles. | Comercios piloto/Técnica | Abierta |
| Q-034 | ¿Qué obligaciones de garantía y reemplazo asumirá Kioskina al vender equipos? | Define costo y riesgo comercial. | Fundador/Legal/Operaciones | Abierta |
| Q-035 | ¿El prototipo valida clientes autónomos con coordinador remoto conforme ADR-0001? | Confirma topología, sincronización, respaldo y seguridad. | Técnica | ADR-0001 a ADR-0003; prototipo pendiente |
| Q-036 | ¿Qué navegadores, versiones, dispositivos y tamaños exactos se soportarán en el piloto? | Hace comprobable la promesa web. | Técnica/Comercio piloto | Parcial: Chrome/Edge en Windows/Android; equipo disponible, modelos/versiones/navegadores aún no documentados |
| Q-037 | Si los parches críticos no son obligatorios, ¿cuántas versiones se soportan y qué conectividad se restringe por vulnerabilidad/incompatibilidad? | Controla seguridad y costo operativo. | Técnica/Producto | Parcial: gratuitos, no obligatorios |
| Q-038 | ¿Cuáles son los SLA medibles por severidad? | Convierte “a la brevedad” en una promesa sostenible. | Operaciones/Fundador | Abierta |
| Q-039 | ¿Cómo cumplirá el comercio su facturación fiscal mientras Kioskina no la integre? | Evita incumplimiento o confusión del ticket interno. | Fundador/Especialista fiscal | Abierta |
| Q-040 | ¿Qué metas numéricas y duración validarán éxito del piloto? | Permite decidir continuar, corregir o detener. | Equipo fundador | Abierta |
| Q-041 | ¿Qué datos además de productos/precios/stock se importarán realmente en el único piloto y desde qué ejemplos? | Acota migración a fuentes verificables. | Comercio piloto/Producto | Abierta |
| Q-043 | ¿Qué condición tributaria y modalidad de facturación tiene el comercio piloto? | Define el proceso fiscal externo obligatorio. | Comercio piloto | Bloqueante |
| Q-044 | ¿Quién es responsable y quién encargado de datos en cada modalidad local/cloud/híbrida? | Define contratos, avisos, derechos y acceso del soporte. | Legal/Producto/Técnica | Abierta |
| Q-045 | ¿Cómo se formalizarán propiedad intelectual, partes iguales, salida de socios y facultad de firma antes de constituir la sociedad? | Evita disputas y permite contratar/proteger activos. | Fundadores/Legal | Abierta |
| Q-046 | ¿Cómo obtiene una exportación o ejerce derechos el dueño después del bloqueo de prueba? | El bloqueo comercial no puede anular obligaciones sobre datos. | Producto/Legal | Abierta: exportación en UI rechazada |
| Q-047 | ¿PouchDB/CouchDB supera el spike de durabilidad, conflicto, migración y seguridad sin licencias pagas? | Decide si el candidato técnico puede pasar a producción. | Técnica | Abierta; ADR-0002 condicionado |
| Q-048 | ¿Qué RPO/RTO y política de copias se ofrecerán en el piloto? | Define recuperación real y promesas comerciales. | Producto/Técnica | Valores candidatos ratificados por el fundador el 2026-09-26 para la línea base; validar viabilidad, cobertura por plan y evidencia en el spike |

Las preguntas detalladas se mantienen en `../00-discovery/questionnaire.md`. Esta tabla resume sólo las que bloquean decisiones principales.
