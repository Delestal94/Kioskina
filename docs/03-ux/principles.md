# Principios iniciales de experiencia y accesibilidad

- Estado: **Borrador; pendiente de pruebas con usuarios**

1. La venta cotidiana debe mostrar sólo las decisiones necesarias en ese momento.
2. Los objetivos táctiles deben ser grandes, estar separados y funcionar sin precisión fina.
3. Los flujos esenciales deben completarse sin teclado ni lector de códigos.
4. El texto, los iconos y los estados deben ser claros; el significado no dependerá sólo del color.
5. Las acciones riesgosas deben explicar su consecuencia y ofrecer prevención, confirmación o recuperación proporcional al riesgo.
6. Las funciones complejas se revelarán progresivamente según tarea y permiso.
7. Los errores deberán decir qué ocurrió, qué se conservó y cómo continuar.
8. La interfaz se preparará para traducciones sin texto incrustado ni diseños dependientes de una longitud fija.
9. La accesibilidad se validará con personas mayores y usuarios con baja experiencia digital, no sólo mediante revisión técnica.
10. El sistema deberá tolerar interrupciones y evitar que una pulsación repetida duplique ventas o cobros.

## Aplicación en la interfaz actual

El spike local usa una pantalla principal enfocada en la tarea visible, un estado breve de conexión y una sección desplegable para diagnóstico, notas sintéticas y sincronización. Esta composición es una decisión de presentación del spike; no sustituye validación de tareas reales ni define todavía la navegación completa del POS. Los IDs de tenant, sucursal y dispositivo se mantienen en configuración y diagnóstico, no como contenido principal para quien opera la caja.

La paleta se concentra en tokens CSS semánticos; los valores de tema de la app pueden sobrescribir acento y fondo desde la configuración pública del dispositivo. Componentes y estados deben consumir tokens, no repetir colores sueltos.
