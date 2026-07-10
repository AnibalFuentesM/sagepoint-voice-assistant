# Plan de marketing y medición — Sagepoint Analytics

Pasos manuales que solo el dueño puede hacer, ordenados por impacto. Los pasos 1–3
son los que desbloquean todo lo demás: hoy el sitio en producción es una versión
vieja y no mide absolutamente nada.

---

## 1. Desplegar la versión nueva del sitio (impacto: crítico, 10 min)

Lo que está en producción (www.sagepoint-analytics.com) es una versión anterior:
sin paquetes con precios, sin FAQ, sin datos estructurados, con `/portfolio/` dando
404 y con Tailwind por CDN. Todo lo bueno ya está en este repo, solo falta publicarlo.

```bash
cd ~/Desktop/NewWebpage/sagepoint-web
npm run build          # verifica que el build pasa (ya probado el 2026-07-02)
git add -A
git commit -m "Nueva versión: paquetes, FAQ, SEO, analytics y Tailwind compilado"
git push origin main   # Vercel despliega automáticamente
```

Después del deploy, verificar en el navegador:
- https://www.sagepoint-analytics.com/ muestra la sección "Paquetes y Precios".
- https://www.sagepoint-analytics.com/portfolio/ ya no da 404.
- https://sagepoint-analytics.com/ redirige a www con 308 (permanente).

## 2. Crear la propiedad de Google Analytics 4 (impacto: crítico, 15 min)

El sitio ya tiene todos los eventos instrumentados (`select_package`,
`lead_submit_attempt`, `generate_lead`, `whatsapp_click`, `page_view`), pero el ID
de medición está vacío, así que hoy no se registra nada.

1. Entra a https://analytics.google.com con la cuenta de Google del negocio.
2. Admin → Crear propiedad → nombre "Sagepoint Analytics", zona horaria Guatemala, moneda USD.
3. Crea un flujo de datos Web con la URL `https://www.sagepoint-analytics.com`.
4. Copia el ID de medición (formato `G-XXXXXXXXXX`).
5. Pégalo en [index.html](../index.html) en la línea `const GA_MEASUREMENT_ID = '';`
   → `const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';`
6. Rebuild + deploy (paso 1).
7. En GA4, marca `generate_lead` como conversión (Admin → Eventos → marcar como conversión).

## 3. Google Search Console (impacto: alto, 15 min)

1. Entra a https://search.google.com/search-console y agrega la propiedad
   de dominio `sagepoint-analytics.com` (verificación por DNS; el registrador
   del dominio te da la opción de pegar el registro TXT).
2. Envía el sitemap: `https://www.sagepoint-analytics.com/sitemap.xml`.
3. En "Inspección de URLs", pide indexación de `/` y `/portfolio/`.
4. Revisa una vez por semana: consultas que traen impresiones, y errores de indexación.

## 4. Perfil de LinkedIn de empresa (impacto: alto para B2B, 30 min)

El cliente objetivo (PYMEs y gerentes en Guatemala/EE. UU.) busca proveedores B2B
en LinkedIn más que en cualquier otra red.

1. Crea la página de empresa "Sagepoint Analytics" con el logo y la descripción del sitio.
2. Enlaza el sitio web y agrega los servicios (Business Intelligence, dashboards, automatización).
3. Publica 1 vez por semana: un caso del portfolio, un tip de datos, o un resultado medible.
4. Verifica que los botones sociales del sitio apunten a los perfiles reales
   (revisar `components/SocialConnectButtons.tsx`).

## 5. WhatsApp Business (impacto: medio, 20 min)

El número +502 4046 4716 recibe los clics del botón flotante y del pie de página.

1. Instala WhatsApp Business en ese número.
2. Configura el perfil de negocio: nombre, logo, sitio web, horario.
3. Crea un mensaje de bienvenida y respuestas rápidas para las preguntas del FAQ
   (qué incluye el diagnóstico, precios, tiempos).

## 6. Testimonios reales (impacto: alto, continuo)

El sitio muestra casos reales pero no tiene citas de clientes. **No se deben
inventar.** Pide a 2–3 clientes pasados (InboxHealth, proyectos BPO, etc.) una
frase corta con nombre y cargo, o una reseña en LinkedIn. Cuando existan,
agregarlos como sección de testimonios en la página principal.

## 7. Google Business Profile (impacto: medio si hay presencia local)

Si el negocio atiende clientes en Guatemala con área de servicio definida:
https://business.google.com → crear perfil "Sagepoint Analytics", categoría
"Consultor de datos" / "Consultoría informática", área de servicio Guatemala,
enlazar el sitio y el WhatsApp.

---

## Checklist de seguimiento (una vez por semana, 10 min)

| Métrica | Dónde verla | Qué buscar |
|---|---|---|
| Leads del formulario | Google Sheet de leads + evento `generate_lead` en GA4 | ¿Cuántos por semana? ¿De qué paquete? |
| Clics a WhatsApp | GA4 → evento `whatsapp_click` | ¿Crece al publicar en redes? |
| Paquete más consultado | GA4 → evento `select_package` | Ajustar el orden/precio de paquetes |
| Impresiones y clics en Google | Search Console → Rendimiento | Qué búsquedas traen tráfico |
| Visitas por página | GA4 → Informes → Páginas | ¿El portfolio convence o se van? |

## Notas técnicas

- El PDF del caso Dicoma se comprimió de 14.3 MB a 6.3 MB (2026-07-02). El original
  está en el historial de git.
- Cada vez que cambien los paquetes o precios: actualizar `App.tsx` (contenido ES/EN),
  el JSON-LD de `index.html` (OfferCatalog), el bloque `<noscript>` de `index.html`
  y `public/llms.txt`. Luego `npm run build` y deploy.
- Tailwind ahora se compila en el build (`index.css` con `@theme`); no volver a
  agregar el `<script src="https://cdn.tailwindcss.com">`.
