# AGENTS.md — Sagepoint Analytics Web (`sagepoint-voice-assistant`)

Contexto para agentes de IA (Gemini, Claude, Antigravity). Consulta también [PROJECT.md](./PROJECT.md) y [README.md](./README.md).

## Qué es

> **Nota importante sobre el nombre de la carpeta:** Aunque el directorio local se llama `sagepoint-voice-assistant`, este repositorio contiene la **Landing Page y Sitio Web Oficial Bilingüe (ES/EN) de Sagepoint Analytics** (consultoría y paquetes productizados de Business Intelligence para PYMEs en Guatemala y EE. UU.), además de subcarpetas con activos y videos promocionales (`anuncios/`, `sagepoint-brand-promo/`, `invoice-to-spreadsheet-video/`, `promo-*`). Esas subcarpetas no están versionadas ni forman parte del sitio.

## Dónde tocar qué

| Quiero cambiar… | Archivo / Carpeta |
| :--- | :--- |
| Rutas del sitio y carga diferida por página | `index.tsx` |
| Home (secciones, textos en español, metadatos) | `leonardo/LeonardoHome.tsx` |
| Textos en inglés de la home | `leonardo/leonardoEnglish.ts` (la clave es el texto en español) |
| Datos de la home (galería, casos, cifras) | `leonardo/leonardoData.ts` |
| Bloques de la home: cockpit del hero, antes/después, flujo de datos, ROI, confianza, precios EN | `leonardo/HeroCockpit.tsx`, `BeforeAfter.tsx`, `DataFlow.tsx`, `RoiEstimator.tsx`, `TrustGrid.tsx`, `PricingEn.tsx` |
| Formulario de diagnóstico y paquetes que se envían al Sheet | `leonardo/BookingModal.tsx` |
| Enlace de agenda, LinkedIn y foto del fundador | `leonardo/booking.ts` |
| Páginas de servicios (hub y detalle) y la lista de rutas prerenderizadas (`ALL_ROUTES`) | `leonardo/servicesData.ts`, `ServicesHub.tsx`, `ServicePage.tsx` |
| Encabezado y pie compartidos por servicios, guías, portafolio y `/web` | `leonardo/ServicesLayout.tsx` |
| Guías (ES en `/guias/`, EN en `/en/guides/`) | `leonardo/guidesData.ts`, `GuidePage.tsx` |
| Landing de páginas web (`/web` en quetzales, `/en/web` en dólares) | `components/WebPage.tsx`, `components/webSkin.css` |
| Portafolio | `components/PortfolioPage.tsx`, `components/portfolio.css` |
| Botón flotante de WhatsApp | `components/WhatsAppButton.tsx` |
| URL del Apps Script que recibe los leads | `constants.ts` |
| Medición GA4, Meta Pixel y captura de atribución UTM / Click IDs | `utils/analytics.ts` |
| Envío de leads a Google Sheets vía Apps Script | `utils/sheetUtils.ts` |
| Rutas por idioma (`/`, `/es/`, `/en/…`) | `utils/i18nRoutes.ts` |
| Título, descripción, canonical y hreflang por ruta | `hooks/useDocumentMeta.ts` |
| Pre-renderizado SEO poscompilación y validaciones de salida | `scripts/postbuild-seo.mjs`, `scripts/render-pages.tsx`, `scripts/check-public-output.mjs` |
| Redirecciones y reglas de ruteo en producción | `vercel.json` |
| Estilos globales (tema Tailwind, botones base) | `index.css`; cada bloque de la home tiene su CSS en `leonardo/*.css` |
| Tests de regresión comercial | `tests/sales-regressions.test.mjs` |

## Cómo ejecutar y validar

1. **Desarrollo local:** `npm install && npm run dev` (abre en `http://localhost:3000`).
2. **Build de producción + SEO prerender:** `npm run build` (revisa tipos, genera `dist/` y valida que no se filtren recursos privados).
3. **Tests:** `npm test`. Leen `dist/`, así que corre `npm run build` antes.

## Reglas para agentes

- Mantén siempre la **paridad bilingüe 100% (ES/EN)** cuando edites textos o componentes. En la home, si cambias un texto en español cambia también su clave en `leonardo/leonardoEnglish.ts`; si no, la versión en inglés muestra español.
- El inglés es el idioma principal: la home vive en `/` (EN) y `/es/` (ES). No modifiques `vercel.json` sin verificar las redirecciones de las URLs antiguas (`?lang=en`, `/en/`) y que cada ruta de `ALL_ROUTES` tenga su regla.
- Una ruta nueva se agrega en tres lugares: `index.tsx`, `ALL_ROUTES` y `vercel.json`. Los tests comprueban que cada ruta de `ALL_ROUTES` tenga su HTML y su regla en `vercel.json`; que esté en `index.tsx` no lo comprueba nadie.
- El formulario de contacto envía un único POST y confirma solo con JSON explícito (`success: true` o `status: "success"`). Nunca reenvía automáticamente.
- `private/` y el material de clientes excluido no deben llegar a `dist`; `scripts/check-public-output.mjs` bloquea el build si aparecen.
