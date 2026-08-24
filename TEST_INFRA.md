# E2E Test Infra: Sagepoint Analytics Landing Page

## Test Philosophy
- Opaque-box, requirement-driven verification covering functional CRO flows, bilingual parity, accessibility, UTM transfer, and build integrity.
- 4-Tier verification approach: Feature Coverage (Tier 1), Boundary & Corner Cases (Tier 2), Cross-Feature Combinations (Tier 3), and Real-World Workload Scenarios (Tier 4).

## Feature Inventory & Test Mapping
| # | Feature | Requirement | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Cross) | Tier 4 (Scenario) |
|---|---------|-------------|:----------------:|:-----------------:|:--------------:|:-----------------:|
| F1 | Executive Value Proposition & Copy | R1 | ≥5 | ≥5 | ✓ | ✓ |
| F2 | 100% Bilingual Parity (ES/EN) | R1 | ≥5 | ≥5 | ✓ | ✓ |
| F3 | Above-the-Fold Hero CTA | R2 | ≥5 | ≥5 | ✓ | ✓ |
| F4 | Interactive Before/After Visualizer | R2 | ≥5 | ≥5 | ✓ | ✓ |
| F5 | Interactive Package Selector & Matrix | R2 | ≥5 | ≥5 | ✓ | ✓ |
| F6 | Interactive ROI & Savings Calculator | R4 | ≥5 | ≥5 | ✓ | ✓ |
| F7 | Enterprise Case Studies & Metrics | R3 | ≥5 | ≥5 | ✓ | ✓ |
| F8 | Trust Engine & Guarantees | R3 | ≥5 | ≥5 | ✓ | ✓ |
| F9 | Direct Diagnostic Scheduling | R4 | ≥5 | ≥5 | ✓ | ✓ |
| F10 | Frictionless Accessible Contact Form | R4 | ≥5 | ≥5 | ✓ | ✓ |
| F11 | Full Contextual WhatsApp Routing | R4 | ≥5 | ≥5 | ✓ | ✓ |
| F12 | Enhanced UTM & Click ID Attribution | R5 | ≥5 | ≥5 | ✓ | ✓ |
| F13 | Complete GA4 Event Instrumentation | R5 | ≥5 | ≥5 | ✓ | ✓ |
| F14 | Mobile Responsiveness & Layout Integrity | R5 | ≥5 | ≥5 | ✓ | ✓ |
| F15 | Production Build & Pre-rendering | R5 | ≥5 | ≥5 | ✓ | ✓ |

## Test Architecture
- **Test Runner & Harness**: Automated test suites in `tests/e2e-verification.ts` executable via node/tsx/vitest + TypeScript compiler verification (`tsc --noEmit`) + Vite build verification (`npm run build`).
- **Pass/Fail Semantics**: All test suites must exit with code 0.
- **Coverage Tiers**:
  - **Tier 1 (Feature Coverage)**: Validates each feature in isolation (e.g. Hero renders CTAs, language toggle switches all text, packages show prices and deliverables, form accepts valid inputs, ROI calculator computes savings).
  - **Tier 2 (Boundary & Corner Cases)**: Empty inputs, invalid email format, missing phone number, extreme ROI slider values (0 hours, 100+ analysts), lang param manipulation (`?lang=invalid`), deep link navigation.
  - **Tier 3 (Cross-Feature Combinations)**: Selecting a package and switching language retains selected package; changing language updates WhatsApp prefilled text dynamically; submitting form preserves captured UTM parameters; clicking schedule opens modal with selected package context.
  - **Tier 4 (Real-World Application Scenarios)**:
    1. US CEO arrives via Google Ads (`?utm_source=google&utm_medium=cpc&gclid=12345&lang=en`), views Hero value prop, calculates ROI for 50-person company, selects Executive Package, and books diagnostic call.
    2. Guatemalan CFO arrives organically, switches between Spanish and English, inspects Apex Auto Group case study, selects Quick-Win package, and clicks contextual WhatsApp button.
    3. Operations Director fills out contact form with edge-case characters, verifies inline validation, and triggers confirmed Google Sheets payload with full UTM attribution.
    4. Mobile user (375px viewport) scrolls from Hero to Before/After comparison to pricing cards without horizontal scroll or truncated text.

## Coverage Thresholds
- Tier 1: ≥75 test assertions (≥5 per feature across 15 features)
- Tier 2: ≥75 boundary test assertions
- Tier 3: ≥15 pairwise interaction assertions
- Tier 4: ≥5 end-to-end user scenario assertions
- **Total: ≥170 test assertions**
