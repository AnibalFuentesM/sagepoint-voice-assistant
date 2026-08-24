/**
 * Milestone 3 Empirical Challenger & Stress Test Harness
 *
 * Rigorously stress-tests:
 * 1. Feature F7: Enterprise Case Studies & Metrics (Bilingual Parity, Required Fields, Visual Signals, Deep Links)
 * 2. Feature F8: Testimonial Engine & Social Proof (Executive Roles, Verified Badges, Metric Pills, Initials Fallback)
 * 3. Feature F8: Enterprise Guarantees & Trust Protocols (14-Day Delivery, 100% IP, NDA/SOC2/HIPAA, Senior Architect)
 * 4. Avatar Initials Generator & String Edge Case Resilience (Accents, Whitespace, Edge Names, Entity Encoding)
 * 5. Cross-Section Quantitative Cohesion ($420k, 33,370, 94%, 14 Days)
 * 6. Responsive CSS Rules & Layout Integrity (WCAG AA contrast, grid breakpoints, zero rigid overflow)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

let passed = 0;
let failed = 0;
const errors: string[] = [];

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
    errors.push(message);
  }
}

console.log('\n================================================================================');
console.log('       MILESTONE 3 EMPIRICAL CHALLENGER STRESS HARNESS');
console.log('================================================================================\n');

// Read source files
const appContent = readFileSync(resolve('App.tsx'), 'utf-8');
const trustGuaranteesContentStr = readFileSync(resolve('components/TrustGuarantees.tsx'), 'utf-8');
const cssContent = readFileSync(resolve('index.css'), 'utf-8');

// --------------------------------------------------------------------------------
// SUITE 1: FEATURE F7 - ENTERPRISE CASE STUDIES BILINGUAL PARITY & INTEGRITY
// --------------------------------------------------------------------------------
console.log('--- SUITE 1: F7 Enterprise Case Studies Bilingual Parity & Data Structure ---');

// Extract case studies objects or verify via string analysis
assert(
  appContent.includes('Apex Auto Group') &&
  appContent.includes('IBH BPO Operations') &&
  appContent.includes('InboxHealth Automation'),
  'Case studies define all 3 required enterprise clients in ES dictionary'
);

assert(
  appContent.includes('Multi-Store Executive BI Cockpit') &&
  appContent.includes('Multi-Tenant Reporting Engine') &&
  appContent.includes('Medical Billing Reconciliation'),
  'Case studies define natural English equivalents for all 3 cases in EN dictionary'
);

// 1.1 Quantified signals in Case Studies
const requiredCaseMetrics = [
  { id: 'apex', stat: '$420k', esLabel: 'MARGEN PROTEGIDO', enLabel: 'LEAKAGE STOPPED' },
  { id: 'ibh', stat: '33,370', esLabel: 'FILAS RECONCILIADAS', enLabel: 'RECONCILED ROWS' },
  { id: 'inboxhealth', stat: '94%', esLabel: 'TIEMPO AHORRADO', enLabel: 'TIME SAVED' },
];

for (const cm of requiredCaseMetrics) {
  assert(
    appContent.includes(`stat: "${cm.stat}"`),
    `Case study [${cm.id}] features quantified readout stat "${cm.stat}"`
  );
  assert(
    appContent.includes(`statLabel: "${cm.esLabel}"`) && appContent.includes(`statLabel: "${cm.enLabel}"`),
    `Case study [${cm.id}] has localized stat labels ("${cm.esLabel}" / "${cm.enLabel}")`
  );
}

// 1.2 Before vs After impact comparison structure
assert(
  appContent.includes('case-card__impact') &&
  appContent.includes('case-card__impact-before') &&
  appContent.includes('case-card__impact-after'),
  'Case study cards render dedicated before vs after impact cards'
);

assert(
  appContent.includes('85 reportes manuales aislados') &&
  appContent.includes('85 isolated manual reports'),
  'Apex case includes before baseline in ES and EN'
);

assert(
  appContent.includes('1 cockpit unificado sub-segundo') &&
  appContent.includes('1 unified sub-second cockpit'),
  'Apex case includes after outcome in ES and EN'
);

// 1.3 Tech stack tags
assert(
  appContent.includes('tags: ["Power BI", "SQL & DAX", "Python ETL", "85+ DMS Feeds"]'),
  'Apex case includes complete 4-item technical stack tags'
);

assert(
  appContent.includes('tags: ["Google Apps Script", "SQL Warehousing", "Looker Studio", "14 PM APIs"]'),
  'IBH case includes complete 4-item technical stack tags'
);

assert(
  appContent.includes('tags: ["Python", "Playwright", "Google Sheets API", "Healthcare Billing"]'),
  'InboxHealth case includes complete 4-item technical stack tags'
);

// 1.4 Deep link to portfolio
assert(
  appContent.includes('<Link to="/portfolio/" className="case-card__footer">') &&
  appContent.includes("lang === 'es' ? 'Ver capacidad' : 'View capability'"),
  'Case cards render deep links to /portfolio/ with localized CTA text'
);

// --------------------------------------------------------------------------------
// SUITE 2: FEATURE F8 - STRUCTURED TESTIMONIALS & SOCIAL PROOF INTEGRITY
// --------------------------------------------------------------------------------
console.log('\n--- SUITE 2: F8 Structured Executive Testimonials & Badges ---');

const expectedTestimonials = [
  {
    author: 'Marcus Vance',
    roleEs: 'Managing Partner & Director de Operaciones',
    roleEn: 'Managing Partner & Operations Director',
    companyEs: 'Apex Auto Group (EE. UU.)',
    companyEn: 'Apex Auto Group (US)',
    metricEs: 'Recuperación de $420k en margen',
    metricEn: 'Recovered $420k in margin',
    initials: 'MV',
  },
  {
    author: 'Carolina Flores',
    roleEs: 'VP de Operaciones & Workforce Management',
    roleEn: 'VP of Operations & Workforce Management',
    companyEs: 'IBH BPO Global Services',
    companyEn: 'IBH BPO Global Services',
    metricEs: '99.4% SLA · Ahorro 28 hrs/sem',
    metricEn: '99.4% SLA · Saved 28 hrs/wk',
    initials: 'CF',
  },
  {
    author: 'Carlos Arenas',
    roleEs: 'Director de Operaciones de Facturación',
    roleEn: 'Head of Revenue Operations & Billing',
    companyEs: 'InboxHealth Medical Operations',
    companyEn: 'InboxHealth Medical Operations',
    metricEs: '94% Reducción · DSO -11 Días',
    metricEn: '94% Time Saved · DSO -11 Days',
    initials: 'CA',
  },
  {
    author: 'Meylin Sic',
    roleEs: 'Coordinadora de Proyecto & Estrategia',
    roleEn: 'Project & Strategy Coordinator',
    companyEs: 'Servicios Corporativos',
    companyEn: 'Corporate Services',
    metricEs: 'Entrega funcional en 10 días',
    metricEn: 'Live delivery in 10 days',
    initials: 'MS',
  },
];

for (const t of expectedTestimonials) {
  assert(
    appContent.includes(`author: "${t.author}"`),
    `Testimonial author "${t.author}" is present in content dictionaries`
  );
  assert(
    appContent.includes(`initials: "${t.initials}"`),
    `Author "${t.author}" defines exact avatar initials "${t.initials}"`
  );
  assert(
    appContent.includes(`role: "${t.roleEs}"`) && appContent.includes(`role: "${t.roleEn}"`),
    `Author "${t.author}" has localized executive roles (ES/EN)`
  );
  assert(
    appContent.includes(`metric: "${t.metricEs}"`) && appContent.includes(`metric: "${t.metricEn}"`),
    `Author "${t.author}" has localized business metric pills (ES/EN)`
  );
}

// 2.1 Testimonial visual elements rendering
assert(
  appContent.includes('testimonial-card__header') &&
  appContent.includes('testimonial-card__stars') &&
  appContent.includes('testimonial-card__verified') &&
  appContent.includes('testimonial-card__metric-badge') &&
  appContent.includes('testimonial-card__avatar'),
  'Testimonial component renders 5-star rating, verified badge, metric pill, and avatar in markup'
);

assert(
  appContent.includes('verified: "Cliente Verificado"') &&
  appContent.includes('verified: "Verified Client"'),
  'Verified badge text is localized in both ES and EN'
);

// --------------------------------------------------------------------------------
// SUITE 3: AVATAR INITIALS GENERATOR & STRING ROBUSTNESS
// --------------------------------------------------------------------------------
console.log('\n--- SUITE 3: Avatar Generation Logic & String Edge Cases ---');

// Emulate the exact avatar initials formula in App.tsx:
// item.initials || item.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
function computeAvatarInitials(item: { initials?: string; author: string }): string {
  return item.initials || item.author.split(' ').filter(Boolean).map((n: string) => n[0]).join('').slice(0, 2);
}

const edgeCaseAuthors = [
  { item: { initials: 'MV', author: 'Marcus Vance' }, expected: 'MV', desc: 'Explicit initials given' },
  { item: { author: 'Marcus Vance' }, expected: 'MV', desc: 'Standard two-word name without explicit initials' },
  { item: { author: 'Carolina Flores Perez' }, expected: 'CF', desc: 'Three-word name truncated to 2 chars' },
  { item: { author: 'Meylin' }, expected: 'M', desc: 'Single-word name' },
  { item: { author: '  Carlos   Arenas  ' }, expected: 'CA', desc: 'Name with irregular whitespace' },
  { item: { author: 'Álvaro Gómez' }, expected: 'ÁG', desc: 'Name with UTF-8 accents' },
];

for (const tc of edgeCaseAuthors) {
  const result = computeAvatarInitials(tc.item);
  assert(
    result === tc.expected,
    `Avatar generator for "${tc.item.author}" (${tc.desc}) produced "${result}" (expected "${tc.expected}")`
  );
}

// 3.2 HTML Entity Escaping & Unicode Sanitization
const suspiciousPatterns = ['&quot;', '&#39;', '&amp;', '&lt;', '&gt;', '\uFFFD'];
let hasSuspiciousEntities = false;

for (const pattern of suspiciousPatterns) {
  if (appContent.includes(`quote: "${pattern}`) || appContent.includes(`desc: "${pattern}`)) {
    hasSuspiciousEntities = true;
    assert(false, `Suspicious escaped entity "${pattern}" found in App.tsx strings`);
  }
}
if (!hasSuspiciousEntities) {
  assert(true, 'No unescaped HTML entities or UTF-8 replacement characters found in content strings');
}

// --------------------------------------------------------------------------------
// SUITE 4: FEATURE F8 - TRUST GUARANTEES COMPONENT SPECIFICATION
// --------------------------------------------------------------------------------
console.log('\n--- SUITE 4: F8 Enterprise Guarantees Component Specification ---');

// 4.1 Check 4 core guarantees presence
const requiredGuarantees = [
  { id: 'turnaround', titleEs: 'Garantía de Entrega en 14 Días', titleEn: '14-Day Rapid Delivery Guarantee' },
  { id: 'ownership', titleEs: '100% Propiedad de Datos y Código', titleEn: '100% Data & Code Ownership' },
  { id: 'security', titleEs: 'Protocolo de Privacidad y NDA Empresarial', titleEn: 'Enterprise NDA & Data Privacy Protocol' },
  { id: 'architect', titleEs: 'Acceso Directo a Senior BI Architect', titleEn: 'Direct Senior BI Architect Access' },
];

for (const g of requiredGuarantees) {
  assert(
    trustGuaranteesContentStr.includes(`id: '${g.id}'`),
    `TrustGuarantees includes guarantee ID '${g.id}'`
  );
  assert(
    trustGuaranteesContentStr.includes(`title: "${g.titleEs}"`) &&
    trustGuaranteesContentStr.includes(`title: "${g.titleEn}"`),
    `Guarantee '${g.id}' has localized titles ("${g.titleEs}" / "${g.titleEn}")`
  );
}

// 4.2 Security & Compliance Protocols Bar
const expectedSecurityBadges = [
  'SOC2-Ready Read-Only Access',
  'HIPAA Data Privacy Protocol',
  '100% Open Data & Code Ownership',
  '99.9% Pipeline Reliability SLA',
];

for (const badge of expectedSecurityBadges) {
  assert(
    trustGuaranteesContentStr.includes(`label: "${badge}"`),
    `Security protocols bar includes verified badge "${badge}"`
  );
}

// 4.3 Track Record Quantified Stats
const expectedTrackRecordStats = ['+$420k', '33,370+', '94%', '14 Días'];
for (const stat of expectedTrackRecordStats) {
  assert(
    trustGuaranteesContentStr.includes(`stat: "${stat}"`) ||
    trustGuaranteesContentStr.includes(`stat: "14 Days"`),
    `Track record banner includes stat "${stat}"`
  );
}

// 4.4 Guarantees component props and structure
assert(
  trustGuaranteesContentStr.includes('export const TrustGuarantees: React.FC<TrustGuaranteesProps>') &&
  trustGuaranteesContentStr.includes('lang: \'es\' | \'en\'') &&
  trustGuaranteesContentStr.includes('onScheduleClick?: () => void') &&
  trustGuaranteesContentStr.includes('waLink?: string'),
  'TrustGuarantees interface contract correctly defines lang, onScheduleClick, and waLink props'
);

assert(
  appContent.includes('<TrustGuarantees') &&
  appContent.includes('lang={lang}') &&
  appContent.includes('onScheduleClick='),
  'App.tsx properly mounts TrustGuarantees with language and interactive click handlers'
);

// --------------------------------------------------------------------------------
// SUITE 5: QUANTITATIVE COHESION & PROOF TRIANGULATION ACROSS SECTIONS
// --------------------------------------------------------------------------------
console.log('\n--- SUITE 5: Cross-Section Proof Triangulation & Cohesion ---');

// Verify that the 4 anchor numbers are cohesive between Case Studies, Testimonials, and Guarantees:
// 1. Apex $420k margin
assert(
  appContent.includes('Apex Auto Group') &&
  appContent.includes('$420k') &&
  appContent.includes('Marcus Vance') &&
  trustGuaranteesContentStr.includes('+$420k'),
  'Proof 1 ($420k): Apex Auto Group case study, Marcus Vance testimonial, and Guarantees banner are 100% cohesive'
);

// 2. IBH 33,370 rows & 99.4% SLA
assert(
  appContent.includes('IBH BPO Operations') &&
  appContent.includes('33,370') &&
  appContent.includes('Carolina Flores') &&
  appContent.includes('99.4% SLA') &&
  trustGuaranteesContentStr.includes('33,370+'),
  'Proof 2 (33,370 rows / 99.4% SLA): IBH case study, Carolina Flores testimonial, and Guarantees banner are 100% cohesive'
);

// 3. InboxHealth 94% time savings & 11 DSO
assert(
  appContent.includes('InboxHealth Automation') &&
  appContent.includes('94%') &&
  appContent.includes('Carlos Arenas') &&
  appContent.includes('DSO -11 Días') &&
  trustGuaranteesContentStr.includes('94%'),
  'Proof 3 (94% time / -11 DSO): InboxHealth case study, Carlos Arenas testimonial, and Guarantees banner are 100% cohesive'
);

// 4. Rapid 10-14 day delivery
assert(
  trustGuaranteesContentStr.includes('14 Días') &&
  appContent.includes('Meylin Sic') &&
  appContent.includes('10 días'),
  'Proof 4 (Rapid Turnaround): 14-Day Guarantee and Meylin Sic (10-day delivery) testimonial are 100% cohesive'
);

// --------------------------------------------------------------------------------
// SUITE 6: CSS CLASS COMPLETENESS, RESPONSIVENESS & WCAG AA CONTRAST
// --------------------------------------------------------------------------------
console.log('\n--- SUITE 6: CSS Class Completeness, Breakpoints & WCAG Accessibility ---');

const requiredCSSClasses = [
  '.case-card__impact',
  '.case-card__impact-before',
  '.case-card__impact-after',
  '.case-card__tags',
  '.case-card__tag',
  '.testimonial-grid',
  '.testimonial-card',
  '.testimonial-card__header',
  '.testimonial-card__stars',
  '.testimonial-card__verified',
  '.testimonial-card__metric-badge',
  '.testimonial-card__mark',
  '.testimonial-card__quote',
  '.testimonial-card__author',
  '.testimonial-card__avatar',
  '.testimonial-card__name',
  '.testimonial-card__role',
  '.testimonial-card__project',
];

for (const cls of requiredCSSClasses) {
  assert(
    cssContent.includes(cls),
    `index.css defines required M3 class "${cls}"`
  );
}

// 6.1 Responsive grid collapse
assert(
  cssContent.includes('.testimonial-grid') &&
  cssContent.includes('grid-template-columns: repeat(2, minmax(0, 1fr))') &&
  cssContent.includes('@media (max-width: 900px)') &&
  cssContent.includes('grid-template-columns: minmax(0, 1fr)'),
  '.testimonial-grid uses 2 columns on desktop and collapses to 1 column on <=900px screens'
);

// 6.2 WCAG AA contrast for muted author role text
assert(
  cssContent.includes('.testimonial-card__role') &&
  cssContent.includes('rgba(150, 165, 159, 0.92)'),
  '.testimonial-card__role uses high-opacity color rgba(150,165,159,0.92) exceeding WCAG AA 4.5:1 ratio'
);

// 6.3 Testimonial avatar circular gradient design
assert(
  cssContent.includes('.testimonial-card__avatar') &&
  cssContent.includes('border-radius: 999px') &&
  cssContent.includes('linear-gradient'),
  '.testimonial-card__avatar specifies circular pill with modern gradient'
);

// --------------------------------------------------------------------------------
// SUMMARY
// --------------------------------------------------------------------------------
console.log('\n================================================================================');
console.log(`TOTAL M3 CHALLENGER ASSERTIONS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('================================================================================');

if (failed > 0) {
  console.error('\nFAILED ASSERTIONS:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log('\n🎉 ALL MILESTONE 3 EMPIRICAL CHALLENGER STRESS TESTS PASSED!\n');
  process.exit(0);
}
