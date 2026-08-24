# Project: Sagepoint Analytics Landing Page CRO & Modernization

## Architecture
- **Framework & Bundler**: React 19.2 + Vite 6.2 + TypeScript
- **Styling**: Tailwind CSS v4 + Custom Modern Dark Luxury CSS
- **Routing & State**: React Router DOM v7 (with `?lang=en` sync) + React Context / Component State
- **Analytics & Tracking**: GA4 (`G-F296ZSRJ2Z`) + First-touch UTM & Ad-click Attribution (`localStorage`)
- **Backend Integrations**: Google Apps Script Endpoint (`AKfycbyD5CjQ2bChRogiXhRiYFkKbLmIYumO6zrhMzKeP-WZOFUwqfuQwsRCyb8mvdiqbch4`) + Contextual WhatsApp (`+502 4046 4716`) + Direct Scheduling Integration
- **SEO & Prerendering**: Postbuild script (`scripts/postbuild-seo.mjs`) generating static HTML for root and portfolio pages.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Executive Value Proposition & Copy | High-impact messaging targeting CEOs/CFOs/COOs vs $60k/yr in-house analyst costs | M1 | Survey / R1 |
| F2 | 100% Bilingual Parity (ES/EN) | Full localization of App.tsx, PortfolioPage.tsx, and GlobeDashboard.tsx | M1 | Survey / R1 |
| F3 | Above-the-Fold Hero CTA | Mobile & Desktop hero optimization with instant conversion CTAs | M1 | Survey / R2 |
| F4 | Interactive Before/After Visualizer | "Antes vs Después con Sagepoint" interactive operational comparison | M2 | Survey / R2 |
| F5 | Interactive Package Selector & Matrix | Clear 3-tier package comparison with deliverables, profiles, and pricing | M2 | Survey / R2 |
| F6 | Interactive ROI & Savings Calculator | Interactive tool for estimating hours/money saved based on team size/reports | M2 | Survey / R4 |
| F7 | Enterprise Case Studies & Metrics | 3 high-impact quantified cases (Apex Auto Group, IBH BPO, InboxHealth) | M3 | Survey / R3 |
| F8 | Trust Engine & Guarantees | 3+ structured testimonials, 14-day guarantee, 100% data ownership, NDA security badge | M3 | Survey / R3 |
| F9 | Direct Diagnostic Scheduling | Instant calendar booking integration alongside contact form | M4 | Survey / R4 |
| F10 | Frictionless Accessible Contact Form | Inline validation (no alert popups), htmlFor/id accessibility, autofill support | M4 | Survey / R4 |
| F11 | Full Contextual WhatsApp Routing | Contextual pre-filled WhatsApp links for Hero, Packages, Contact, and Float | M4 | Survey / R4 |
| F12 | Enhanced UTM & Click ID Attribution | First-touch UTM + gclid/fbclid/msclkid capture & transfer to Google Sheets | M4 | Survey / R5 |
| F13 | Complete GA4 Event Instrumentation | Tracking for select_package, generate_lead, whatsapp_click, schedule_call, view_roi_calc, calculate_roi | M5 | Survey / R5 |
| F14 | Mobile Responsiveness & Layout Integrity | Flawless rendering 360px+ without horizontal overflow or typography clipping | M5 | Survey / R5 |
| F15 | Production Build & Pre-rendering | npm run build passes with 0 errors, 0 warnings, fast load, and SEO parity | M5 | Survey / R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Value Proposition, Bilingual Parity & Hero CRO | F1, F2, F3 (Hero, copy, ES/EN dictionary, PortfolioPage i18n, GlobeDashboard i18n) | none | DONE |
| M2 | Interactive Before/After, Package Selector & ROI Calculator | F4, F5, F6 (Interactive comparison, package matrix, ROI estimator) | M1 | DONE |
| M3 | Trust Engine, Enterprise Case Studies & Social Proof | F7, F8 (Case studies, 3+ testimonials, guarantees, security badges) | M1 | DONE |
| M4 | Frictionless Funnel, Direct Scheduling & Attribution | F9, F10, F11, F12 (Direct calendar booking, form validation, WhatsApp, UTM/Ad IDs) | M2, M3 | DONE |
| M5 | Analytics Instrumentation, Performance & E2E Validation | F13, F14, F15 (GA4 events, responsive audit, build integrity, full E2E testing) | M4 | DONE |

## Interface Contracts
### Internationalization (i18n)
- `content: { es: ContentDictionary; en: ContentDictionary }`
- `lang: 'es' | 'en'` passed to all components (`PortfolioPage`, `GlobeDashboard`, `WhatsAppButton`, `Navbar`, `Footer`)
- URL synchronization: `?lang=en` for English, default Spanish for clean URLs.

### Analytics Layer (`utils/analytics.ts`)
- `trackEvent(eventName: string, params?: Record<string, unknown>): void`
- Supported events:
  - `page_view`: `{ page_title, page_location, page_path, language }`
  - `select_package`: `{ package_id, package_name, price, currency, language }`
  - `lead_submit_attempt`: `{ package_id, form_location, language }`
  - `generate_lead`: `{ package_id, lead_id, attribution, language }`
  - `whatsapp_click`: `{ source_section, package_id, language }`
  - `schedule_call`: `{ source_section, package_id, method, language }`
  - `view_roi_calc`: `{ source_section, language }`
  - `calculate_roi`: `{ team_size, hours_per_week, estimated_savings, language }`

### Lead Capture & Attribution (`utils/sheetUtils.ts`)
- Payload structure:
  - `name`, `email`, `whatsapp`, `service`, `industry`, `country`, `details`, `lang`
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`
  - `submitted_at`, `referrer`, `landing_page`

## Code Layout
- `src/App.tsx`: Main landing page, state orchestration, content dictionaries, section composition.
- `src/components/`:
  - `GlobeDashboard.tsx`: Interactive hero 3D decision room dashboard.
  - `PortfolioPage.tsx`: Dedicated case studies / projects showcase (fully localized).
  - `BeforeAfterComparison.tsx`: Interactive before vs after Sagepoint comparison.
  - `RoiCalculator.tsx`: Interactive ROI & time-saving estimator component.
  - `ScheduleModal.tsx`: Direct diagnostic call scheduling modal/embed.
  - `SocialConnectButtons.tsx`: Light social links component.
  - `WhatsAppButton.tsx`: Contextual floating WhatsApp button.
  - `SEOHead.tsx`: Dynamic meta tag and structured data management.
- `src/utils/`:
  - `analytics.ts`: GA4 tracking, UTM & click ID capture.
  - `sheetUtils.ts`: Google Apps Script submission engine with fallback.
- `src/constants.ts`: Global configuration, endpoints, WhatsApp numbers, package metadata.
