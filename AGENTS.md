# AGENTS.md — Sagepoint Analytics Web (`sagepoint-voice-assistant`)

Contexto para agentes de IA (Gemini, Claude, Antigravity). Consulta también [PROJECT.md](./PROJECT.md) y [README.md](./README.md).

## Qué es

> **Nota importante sobre el nombre de la carpeta:** Aunque el directorio local se llama `sagepoint-voice-assistant`, este repositorio contiene la **Landing Page y Sitio Web Oficial Bilingüe (ES/EN) de Sagepoint Analytics** (consultoría y paquetes productizados de Business Intelligence para PYMEs en Guatemala y EE. UU.), además de subcarpetas con activos y videos promocionales (`anuncios/`, `sagepoint-brand-promo/`, `invoice-to-spreadsheet-video/`, `promo-*`).

## Dónde tocar qué

| Quiero cambiar… | Archivo / Carpeta |
| :--- | :--- |
| Página principal, diccionarios bilingües (ES/EN) y secciones | `App.tsx` |
| Configuración global, WhatsApp, URL de Apps Script y paquetes | `constants.ts` |
| Componentes interactivos (Calculadora ROI, Antes/Después, Portafolio, Globo 3D, Modal de agenda) | `components/` (`RoiCalculator.tsx`, `BeforeAfterComparison.tsx`, `PortfolioPage.tsx`, `GlobeDashboard.tsx`, `ScheduleModal.tsx`) |
| Medición GA4 y captura de atribución UTM / Click IDs | `utils/analytics.ts` |
| Envío de leads a Google Sheets vía Apps Script | `utils/sheetUtils.ts` |
| Pre-renderizado SEO poscompilación y validaciones de salida | `scripts/postbuild-seo.mjs`, `scripts/check-public-output.mjs` |
| Reglas de ruteo e idioma en producción | `vercel.json` |
| Tests de regresión comercial | `tests/sales-regressions.test.mjs` |
| Proyectos de video promocional (Remotion / animaciones) | `sagepoint-brand-promo/`, `invoice-to-spreadsheet-video/`, `promo-bottleneck-video/`, `promo-margin-video/` |

## Cómo ejecutar y validar

1. **Desarrollo local:** `npm install && npm run dev` (abre en `http://localhost:3000`).
2. **Build de producción + SEO prerender:** `npm run build` (genera `dist/` y valida que no se filtren recursos privados).
3. **Tests:** `npm test` o `node --test tests/sales-regressions.test.mjs`.

## Reglas para agentes

- Mantén siempre la **paridad bilingüe 100% (ES/EN)** cuando edites textos o componentes.
- No modifiques `vercel.json` sin verificar las rutas en inglés (`?lang=en`) y las reglas de `dist`.
- El formulario de contacto envía un único POST y confirma solo con JSON explícito (`success: true` o `status: "success"`).
