# Síntesis de investigación — descubrimiento fundador

- Método: entrevistas iterativas de requisitos
- Participantes: 1 equipo fundador representado en la conversación
- Período: 2026-09-20
- Estado: **Síntesis del fundador; investigación de usuarios omitida por decisión**

## Resumen ejecutivo

Kioskina busca digitalizar kioscos pequeños que trabajan con papel o sistemas antiguos, con una interfaz táctil y simple, y crecer luego hacia comercios de cualquier tamaño. El piloto está acotado a un comercio, dos empleados, dos cajas y unas 100 ventas diarias, pero el alcance funcional pretendido sigue siendo amplio. La mayor tensión está entre sencillez comercial/operativa y configurabilidad casi total, especialmente en despliegue local distribuido, seguridad, promociones y conservación. El fundador decidió no realizar investigación de campo antes del desarrollo; por ello, la arquitectura y los flujos se basarán inicialmente en hipótesis explícitas y deberán medirse durante el piloto.

## Temas principales

### 1. Adopción sencilla por comercios poco digitalizados

- Prevalencia: constante en las 10 rondas.
- Evidencia: “botones grandes, pocas opciones visibles y todas las ayudas posibles”.
- Implicación: tiempo de venta, onboarding y recuperación ante errores son requisitos de producto centrales, no sólo estética.

### 2. Configurabilidad como propuesta de valor

- Prevalencia: aparece en roles, permisos, precios, stock, alertas, seguridad, conservación, actualizaciones y planes.
- Evidencia: “debe ser configurable todo lo que pueda ver”.
- Implicación: conviene configurar políticas de negocio dentro de límites seguros; hacer configurable cada conducta multiplicaría pruebas y soporte.

### 3. Continuidad local y autonomía del comercio

- Prevalencia: reiterada en offline, planes y arquitectura.
- Evidencia: “hagamos local en primera instancia” y “cada dispositivo ... funcionará como servidor”.
- Implicación: la sincronización es parte del núcleo, no una mejora posterior. Se necesita delimitar si es nodo principal con relevo o multi-maestro real.

### 4. Trazabilidad por encima de bloqueo operativo

- Prevalencia: ventas con stock insuficiente, caja individual, rectificaciones y soporte.
- Evidencia: vender normalmente y advertir “posterior a la venta”.
- Implicación: el sistema debe permitir continuidad, registrar excepciones y ofrecer revisión posterior, sin ocultar diferencias.

### 5. Ambición amplia frente a piloto pequeño

- Prevalencia: “todas las opciones posibles” en medios, dispositivos, importaciones y modelos.
- Implicación: una arquitectura evolutiva importa, pero el MVP necesita exclusiones explícitas para obtener evidencia real.

## Hallazgos y oportunidades

| Hallazgo | Oportunidad | Impacto | Esfuerzo |
|---|---|---:|---:|
| Comercio piloto pequeño y accesible | Observar ventas, cierre y reposición antes de prototipar | Alto | Bajo |
| Configurabilidad extensa | Crear perfiles simples y un modo avanzado oculto | Alto | Medio |
| Stock físico prevalece sobre saldo digital | Libro de movimientos con ajustes auditados | Alto | Medio |
| Intermitencia prevista | Diseño local-first con pruebas de 24 horas | Alto | Alto |
| Soporte de tres personas | Automatizar diagnóstico, respaldo y onboarding | Alto | Alto |
| Facturación fiscal fuera | Integración externa inequívoca y roadmap ARCA | Crítico | Medio/alto |

## Segmentos identificados

| Segmento | Características | Necesidades | Evidencia |
|---|---|---|---|
| Kiosco pequeño de barrio | 500–2.000 artículos, pocos empleados, procesos manuales | Venta rápida, caja, stock, fiado, bajo aprendizaje | Segmento piloto declarado |
| Dueño-operador | Administra y también puede vender | Visión móvil, reportes, alertas, configuración | Hipótesis del fundador |
| Cajero con baja experiencia digital | Cuenta individual, interfaz táctil | Pocos pasos, objetivos grandes, errores recuperables | Hipótesis; validar en campo |
| Organización multisucursal | Catálogo común y stock/precio por sucursal | Herencia, aislamiento, escala y consolidación | Visión posterior, sin evidencia de campo |

## Recomendaciones

1. Instrumentar el piloto para medir flujos, errores y tiempos que no serán validados previamente mediante observación.
2. Resolver la topología local/sincronización con una comparación técnica y prototipo de riesgo.
3. Mantener sólo descuentos autorizados y precio por cantidad en el piloto.
4. Tratar seguridad, respaldo, fiscalidad y mínimos de retención como límites no reducibles por plan.
5. Ensayar dos cajas desconectadas durante 24 horas con ventas, precios, cierres y reconexión.
6. Formalizar sociedad y propiedad intelectual antes de comercializar.

## Limitaciones metodológicas

- Toda la evidencia proviene del equipo fundador, cuya experiencia directa sectorial fue declarada como baja.
- No habrá entrevistas ni observación de usuarios antes del desarrollo por decisión del fundador.
- Varias respuestas expresan aspiraciones amplias, no prioridades verificadas.
- Las métricas del piloto serán la primera evidencia directa de uso; esto aumenta el costo probable de correcciones tardías.
