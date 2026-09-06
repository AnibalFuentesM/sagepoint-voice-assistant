# Plan comercial — Sagepoint Analytics

Actualizado: 5 de septiembre de 2026. Propuesta de piloto, sin horarios activados ni publicaciones o mensajes enviados.

## Decisión inicial

Priorizar dashboards ejecutivos y automatización de reportes para PYMEs en Guatemala que consolidan ventas, margen u operación manualmente en Excel, Sheets o un CRM. Comprador inicial: dueño, gerente general, operaciones o finanzas. Es una hipótesis comercial elegida para concentrar el esfuerzo; no representa demanda o conversión ya demostrada.

Oferta de entrada: llamada gratuita de 30–45 minutos para evaluar encaje. Luego, cuando corresponda, Radiografía de Datos de $750: dos fuentes, dashboard de hasta ocho KPIs y dos semanas. Separar la llamada gratis del proyecto pagado. No cambiar precios ni prometer descuentos nuevos.

## Piloto de diez días hábiles

1. Investigar hasta cinco empresas por día con fuentes públicas. Registrar empresa, dominio, URL de evidencia, fecha, sector, rol comprador y señal concreta de necesidad. Señales útiles: varias sucursales, contratación de personal de reportería, crecimiento operativo o uso explícito de varias herramientas. Una señal es una hipótesis, no prueba de un problema interno.
2. Puntuar cada empresa de 0 a 2 en encaje, señal reciente y claridad del comprador. Revisar las dos o tres mejor justificadas. Deduplicar por dominio; descartar señales sin fuente o fuera del segmento.
3. Preparar un borrador personalizado que conecte la señal con una pregunta, sin afirmar conocer datos internos. Si no existe un prospecto bien sustentado, preparar una publicación educativa. No fabricar contactos, correos ni métricas.
4. Revisión humana de exactitud y tono. Los borradores quedan pendientes de autorización de envío/publicación; esta rutina no ejecuta esas acciones.
5. Al cerrar cada semana, comparar señales y sectores que producen conversaciones útiles una vez que se autorice contactar. Ajustar una variable cada vez. No declarar ganador con una muestra mínima.

Búsquedas iniciales sugeridas: empresas con sucursales y equipos comerciales en Guatemala; vacantes públicas relacionadas con Excel, reportes de ventas o control operativo; noticias públicas de expansión. Elegir fuentes antes de registrar contactos. No asumir que una vacante equivale a intención de compra.

## Registro mínimo

Empresa | Dominio | Fuente/fecha | Señal | Rol comprador | Encaje (0–6) | Estado | Próximo paso | Responsable | Campaña | Valor de propuesta | Venta confirmada.

Estados: investigada, calificada, borrador, aprobada, contactada, respondió, reunión solicitada, reunión confirmada, reunión realizada, propuesta, ganada/perdida. No avanzar por un clic del sitio.

## Métricas y denominadores

- Calificación: empresas calificadas / empresas investigadas.
- Respuesta positiva: respuestas positivas / contactos enviados (solo cuando se autoricen envíos).
- Asistencia: reuniones realizadas / reuniones confirmadas.
- Propuesta: propuestas / reuniones realizadas.
- Cierre: ventas ganadas / propuestas decididas; reportar aparte las pendientes.
- Ingresos: ventas confirmadas por fuente y período; definir con el dueño si el registro usa facturado o cobrado antes de comparar.
- Eficiencia: tiempo invertido / conversaciones calificadas. No dividir por cero.
- Sitio: sesiones → `lead_form_open` → `lead_submit_attempt` → `generate_lead` confirmado. Reportar `lead_delivery_unconfirmed` y `lead_submit_failed` aparte. `whatsapp_click` mide intención, no conversación ni venta.

Establecer una línea base antes de fijar objetivos de conversión. Revisar calidad y tiempo invertido, no solo volumen. No hay datos de tráfico, ventas ni ROI disponibles para proyectar resultados.

## Medición existente y pendiente

El código ya incluye GA4 (G-F296ZSRJ2Z); no crear otra propiedad sin comprobar la existente. Falta verificar acceso, recepción de eventos y configuración de eventos clave en la cuenta. Revisar `generate_lead` como evento clave; una apertura de formulario no es una cita. Excluir pruebas internas de los informes.

Usar enlaces con UTM consistentes, por ejemplo `utm_source=linkedin&utm_medium=organic_social&utm_campaign=reportes_piloto&utm_content=post_01`. Registrar esas mismas etiquetas al calificar y cerrar el lead; un clic no demuestra atribución de ingresos.

Después de una publicación autorizada del sitio: revisar dominio canónico, variantes ES/EN, sitemap y recepción real de un lead de prueba coordinado. Search Console debe confirmar indexación; tener HTML renderizado no garantiza posicionamiento. No se comprobó acceso a GA4, Search Console ni la hoja de leads durante esta tarea.

## Prueba social

El propietario confirmó autorización para todos los casos excepto Inbox Health. Se retiraron los casos, imágenes y testimonios asociados de la salida pública local; retirarlos de producción exige un despliegue posterior. La autorización no verifica por sí sola los cálculos.

Para Apex Auto e IBH BPO, reunir fuente, período, fórmula, antes/después y atribución del resultado. No convertir margen protegido en ingreso cobrado ni horas liberadas en ahorro de nómina sin demostrarlo. Las cifras existentes no fueron auditadas contra sistemas del cliente. El siguiente documento contiene el registro pendiente y borradores listos para revisar.

## Backend del formulario

El cliente espera JSON explícito `{"success":true}` o `{"status":"success"}` solo después de guardar el lead. Un error de escritura debe responder `{"success":false,"error":"write_failed"}`. Una respuesta ambigua, error HTTP, CORS o timeout queda como recepción no confirmada; no se reenvía automáticamente para evitar duplicados.

No se encontró el código de Apps Script en este proyecto. Su contrato y la escritura real deben verificarse en la implementación remota. Si hoy devuelve texto libre, el sitio mostrará pendiente hasta adaptar esa respuesta. No se desplegó ni modificó Apps Script.

## Verificación reproducible

Ejecutar `npm run build` y luego `node --test tests/sales-regressions.test.mjs`. El build genera HTML desde los componentes React para `/`, `/portfolio/` y `/web/`, en ES y EN, y genera el sitemap. `vercel.json` selecciona el HTML inglés con `?lang=en`. Estas reglas requieren verificación en Vercel después de un despliegue autorizado.
