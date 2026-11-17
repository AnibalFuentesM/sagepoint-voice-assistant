# Proyecto: sitio web de Sagepoint Analytics

Sitio bilingüe (EN/ES) de Sagepoint Analytics. Este archivo describe la arquitectura vigente. La guía rápida de "dónde tocar qué" está en [AGENTS.md](./AGENTS.md) y la puesta en marcha en [README.md](./README.md).

## Arquitectura

- **Framework y bundler**: React 19 + Vite 6 + TypeScript.
- **Estilos**: Tailwind CSS v4 (`index.css` define el tema) más un CSS por bloque en `leonardo/*.css`.
- **Ruteo**: React Router DOM v7 en el cliente; cada página fuera de la home se carga en un chunk aparte (`lazy`).
- **Idiomas**: por ruta, no por parámetro. El inglés es el principal.
- **Analítica**: GA4 con atribución de campaña guardada en `localStorage`, y Meta Pixel opcional (`utils/analytics.ts`).
- **Backend**: un Apps Script de Google que guarda los leads en Google Sheets (`constants.ts`, `utils/sheetUtils.ts`). No hay servidor propio.
- **SEO**: `scripts/postbuild-seo.mjs` renderiza cada ruta a HTML estático con sus metadatos, hreflang y datos estructurados, y genera el sitemap.
- **Deploy**: Vercel, con `vercel.json` como única fuente de configuración (build, salida `dist`, redirecciones y 404).

## Rutas

| Página | Inglés | Español |
|---|---|---|
| Home | `/` | `/es/` |
| Portafolio | `/portfolio/` | `/es/portfolio/` |
| Páginas web (tráfico pagado) | `/en/web/` (EE. UU., en dólares) | `/web/` (Guatemala, en quetzales) |
| Hub de servicios | `/en/services/` | `/servicios/` |
| Detalle de servicio | `/en/services/:slug/` | `/servicios/:slug/` |
| Guías | `/en/guides/:slug/` | `/guias/:slug/` |

Las URLs antiguas (`?lang=en`, `/en/`, `/en/portfolio/`) redirigen a las actuales: con 308 en `vercel.json` y, si la SPA recibe una, desde `index.tsx`. La lista de rutas que se prerenderizan es `ALL_ROUTES` en `leonardo/servicesData.ts`. Historial de la migración: [docs/seo-routing.md](docs/seo-routing.md).

## Estructura del código

- `index.tsx`: punto de entrada, rutas y redirecciones de idioma.
- `leonardo/`: la home y las páginas de servicios y guías.
  - `LeonardoHome.tsx`: la home completa y sus metadatos (`HOME_META`).
  - `leonardoEnglish.ts`: diccionario EN de la home. La clave es el texto en español (`translateLeo`).
  - `leonardoData.ts`: galería, casos y cifras de la home.
  - `HeroCockpit.tsx`, `BeforeAfter.tsx`, `DataFlow.tsx`, `RoiEstimator.tsx`, `TrustGrid.tsx`, `PricingEn.tsx`, `CtaReassure.tsx`, `MobileMenu.tsx`: bloques de la home.
  - `BookingModal.tsx`, `booking.ts`: formulario de diagnóstico, paquetes y enlace de agenda.
  - `servicesData.ts`, `ServicesHub.tsx`, `ServicePage.tsx`: páginas de servicios.
  - `ServicesLayout.tsx`: encabezado y pie del sitio (`SiteHeader`, `SiteFooter`) que comparten servicios, guías, portafolio y `/web`.
  - `guidesData.ts`, `GuidePage.tsx`: guías.
- `components/`: `WebPage.tsx` (landing `/web`, con `webSkin.css`), `PortfolioPage.tsx` (portafolio, con `portfolio.css`) y `WhatsAppButton.tsx`.
- `utils/`: `analytics.ts`, `sheetUtils.ts`, `i18nRoutes.ts`.
- `hooks/useDocumentMeta.ts`: título, descripción, canonical y hreflang por ruta en el cliente.
- `scripts/`: prerender SEO (`postbuild-seo.mjs`, `render-pages.tsx`) y bloqueo de material excluido (`check-public-output.mjs`).
- `tests/sales-regressions.test.mjs`: regresiones sobre el envío de leads, el HTML construido, el sitemap y `vercel.json`.
- `public/`: archivos estáticos (imágenes, PDFs de proyectos, `robots.txt`, `llms.txt`).
- `private/`: material excluido de Git y de la publicación.

## Contratos

### Idioma

- `getLangFromPath(pathname)` y `localizedPath(path, lang)` en `utils/i18nRoutes.ts` son la única fuente de verdad del idioma de una ruta.
- En la home, el inglés se obtiene con `translateLeo(lang, textoEnEspañol)`. Un texto sin entrada en el diccionario se muestra en español.

### Analítica (`utils/analytics.ts`)

Eventos que el sitio envía: `page_view`, `select_package`, `lead_form_open`, `lead_submit_attempt`, `generate_lead`, `lead_duplicate`, `lead_delivery_unconfirmed`, `lead_submit_failed`, `schedule_call`, `whatsapp_click`, `linkedin_click`, `view_roi_calc`, `calculate_roi` y `roi_cta_click`.

El ID de GA4 se toma de `VITE_GA_MEASUREMENT_ID`. En producción hay un ID de respaldo; en desarrollo la medición queda apagada salvo configuración explícita.

El Meta Pixel queda apagado hasta que se defina un ID numérico en `VITE_META_PIXEL_ID`. Nunca reenvía campos personales del formulario.

### Envío de leads (`utils/sheetUtils.ts`)

- Un solo `POST` al Apps Script, con 15 segundos de límite. Nunca se reintenta: un error de red no dice si la fila se guardó.
- `submitToGoogleSheet` devuelve `'confirmed'`, `'duplicate'`, `'unconfirmed'` o `false`.
- Solo un JSON con `success: true` o `status: "success"` confirma la recepción. `duplicate: true` significa que el backend reconoció el lead sin escribir otra fila.
- El envío incluye los datos del formulario, el paquete elegido y la atribución (`utm_*`, click IDs, página de entrada y referente).

## Validación

- `npm run build`: revisa tipos (`tsc`), construye, prerenderiza todas las rutas y falla si aparece material excluido en `dist`.
- `npm test`: regresiones sobre el build. Simulan el backend y no crean leads reales.
- Vite preview no reproduce las redirecciones, la caché ni el 404 de Vercel; eso se valida en la plataforma.

## Historial

- Septiembre de 2026: auditoría de publicación ([docs/audit-2026-09-05.md](docs/audit-2026-09-05.md)).
- Rediseño "Leonardo": la home pasó a `leonardo/LeonardoHome.tsx`.
- 14 de octubre de 2026: el inglés pasó a ser el idioma principal ([docs/revision-krug-2026-10-14/](docs/revision-krug-2026-10-14/)).
- Noviembre de 2026: se eliminó la home anterior (`App.tsx`), sus componentes, sus estilos y la suite de pruebas que la cubría. Los documentos de `docs/` anteriores a esa fecha citan esos archivos; siguen en el historial de Git.
