# Sagepoint Analytics — Site Audit & Prioritized Plan (2026-07-17)

## What's already strong (keep as is)

The technical SEO foundation is unusually good for a small-business site: canonical + www redirect, OG/Twitter cards, hreflang ES/EN, JSON-LD (Organization, OfferCatalog with all 4 packages, FAQPage), sitemap.xml, robots.txt, llms.txt for AI crawlers, noscript fallback content, and a prerendered /portfolio/ page via postbuild script. The offer copy is clear (deliverable + timeline + price per package), the form preselects packages, WhatsApp CTAs are tracked, and the design is coherent. Improve, don't redesign — confirmed.

## Findings by area

### 1. Measurement (critical — blocks everything else)
- **Production analytics is OFF.** Live site (commit 2588a73) has `GA_MEASUREMENT_ID = ''` — zero data is being collected. You cannot improve conversion without measuring it.
- Local working tree already has the fix (env-var GA4 bootstrap + UTM lead attribution + page_view/select_package/generate_lead events) but it is **uncommitted and not deployed**.
- `VITE_GA_MEASUREMENT_ID` is not set locally nor (apparently) in Vercel.

### 2. Deployment hygiene
- Production deploys from branch `overhaul-productized-offer` (not merged to main).
- ~200 lines of good uncommitted work locally: GA4 attribution, trackPageView, Spline removal (perf win), README updates.

### 3. Conversion copy & lead capture
- **No social proof from humans.** Metrics (80%, 11,327 rows) read as internal; there are no testimonials, client names, or logos. For consulting services this is the single biggest conversion lever.
- Form lacks an optional **WhatsApp/phone field** — in GT/CA, leads expect to be contacted by WhatsApp.
- "Agendar diagnóstico" scrolls to a form; there is **no direct scheduling link** (Calendly/Cal.com). A form reply <24h loses vs. booking a slot now.
- Post-submit success is just a button state for 3s — no confirmation of next steps, no WhatsApp shortcut while you have their attention.
- Data hygiene: industry/country `<option value>` uses translated labels, so the Google Sheet mixes "Comercio / Retail" and "Retail" depending on language.

### 4. SEO / findability
- Only **2 indexable pages** (home, portfolio). Very thin surface for queries like "dashboards para pymes guatemala", "consultor power bi guatemala", "automatización de reportes excel". Content expansion is the biggest long-term traffic lever.
- English version lives at `?lang=en` (acceptable; hreflang is truthful). Not worth restructuring now.
- Off-site: no evidence of Google Business Profile or Search Console — both matter a lot for "guatemala" local intent.

### 5. Performance
- Single JS chunk: 460 KB (146 KB gzip). `/portfolio` (incl. `motion` library) is bundled into the home page load — should be a lazy route.
- `cobe` is a dead dependency (unused).
- Local uncommitted change already removes the Spline 3D runtime. 
- Assets: `public/projects/dicoma.pdf` is 6 MB; `crm.jpg` 200 KB; `logo.png` 94 KB. Only loaded on demand — low priority.
- Fonts: preconnect + display=swap already present. Fine.

### 6. UX / accessibility
- Solid baseline: aria-expanded on FAQ, reduced-motion respected everywhere, alt text on portfolio images, lazy images.
- Mobile nav has no section links (only footer) — minor.

## Prioritized plan

**P0 — Measure & ship (do first)**
1. Set `VITE_GA_MEASUREMENT_ID` (Vercel + .env.local); verify events fire.
2. Commit + push local improvements so production gets attribution, page_view tracking and the Spline removal.
3. Same push: remove `cobe`, lazy-load the portfolio route, stable EN values for industry/country options.

**P1 — Convert more of existing traffic (this week)**
4. Add optional WhatsApp/phone field to the form.
5. Pre-filled WhatsApp deep links per package ("Hola, me interesa el paquete Quick-Win…").
6. Real post-submit confirmation: what happens next + WhatsApp shortcut.
7. Testimonials/social-proof section (needs client quotes or permission to name).
8. Optional: Calendly/Cal.com link on all "Agendar" CTAs.

**P2 — Get found (2–6 weeks)**
9. Google Search Console + Google Business Profile.
10. 3–5 SEO landing pages/articles targeting money keywords (ES first): Power BI Guatemala, automatización de reportes Excel, dashboards para PYMEs, BI para retail/servicios.

**P3 — Polish**
11. Compress heavy portfolio assets (dicoma.pdf 6 MB → <1 MB), webp images.
12. Mobile section nav, minor a11y touches.
