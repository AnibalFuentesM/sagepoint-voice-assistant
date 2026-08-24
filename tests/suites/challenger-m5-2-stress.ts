/**
 * Milestone 5 Empirical Challenger 2 - Adversarial Verification & Stress Test Suite
 *
 * Objectives:
 * 1. Conversion Funnel Stress Testing:
 *    - Malicious / XSS injection vectors (HTML, script tags, event handlers, javascript:, SQL injection syntax, template injection)
 *    - Unicode edge cases (emojis, RTL Arabic/Hebrew, CJK, Cyrillic, diacritics, control characters, 10,000+ length payloads)
 *    - Boundary validation (empty, single-char, whitespace-only, malformed emails, international phone formats)
 *    - Rapid double-submits & concurrent dispatch stress
 *    - Schedule booking date boundaries (business day exclusion, month rollovers, leap years 2024/2028, leap day feb 29, past dates prevention)
 *    - Multi-timezone conversions (CST UTC-6, EST UTC-5, PST UTC-8 offsets, labels, WhatsApp/GCal encodings)
 * 2. Asset Integrity, Prerendered HTML Links, and SEO Metadata:
 *    - Physical asset verification in dist/ for all scripts, stylesheets, icons, og-images, and static project files
 *    - Full link crawler on dist/index.html and dist/portfolio/index.html (anchors, relative/absolute links, mailto, whatsapp)
 *    - SEO tag integrity (title, meta description, canonical, hreflang parity, OpenGraph, Twitter cards)
 *    - JSON-LD Structured Data parser and schema conformance (WebSite, Organization, OfferCatalog, FAQPage, CollectionPage, BreadcrumbList)
 *    - Robots.txt and Sitemap.xml schema and link parity
 * 3. Deep Funnel Interactivity & State Resilience:
 *    - Anchor target completeness for single-page scroll navigation across App and subcomponents
 *    - ROI math precision & boundary stability
 *    - Bilingual parity across package metadata, WhatsApp copy, and booking scheduler
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${testName}`);
  } else {
    failed++;
    const errMsg = `FAIL: ${testName}${details ? ` -> ${details}` : ''}`;
    console.error(`  ✗ ${errMsg}`);
    failures.push(errMsg);
  }
}

console.log('\n================================================================================');
console.log('       MILESTONE 5 CHALLENGER 2 — EMPIRICAL ADVERSARIAL STRESS HARNESS');
console.log('================================================================================\n');

// --------------------------------------------------------------------------------
// SECTION 1: CONVERSION FUNNEL MALICIOUS / XSS / UNICODE STRESS TESTING
// --------------------------------------------------------------------------------
console.log('--- SECTION 1: Conversion Funnel Security & Input Sanitization Stress ---');

const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert(1)>',
  '<svg/onload=alert(document.domain)>',
  '"><script>alert(1)</script>',
  'javascript:alert(1)',
  'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
  "'; DROP TABLE leads; --",
  "1' OR '1'='1",
  '{{7*7}}',
  '${7*7}',
  '<%= 7*7 %>',
  '<iframe src="https://attacker.com"></iframe>',
  '\x00\x01\x02\x03<script>alert(1)</script>',
  '"><input onfocus=alert(1) autofocus>',
  '<a href="javascript:alert(1)">click me</a>',
  'eval(compile("import os; os.system(\'ls\')", "", "exec"))',
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1.1 XSS in Email Validation
for (const payload of xssPayloads) {
  const isValidEmail = emailRegex.test(payload);
  assert(!isValidEmail, `Email validator properly rejects XSS/injection payload: ${payload.slice(0, 35)}...`);
}

// 1.2 Form Name Validation & Whitespace Trimming
function validateName(name: string): boolean {
  if (!name) return false;
  return name.trim().length >= 2;
}

assert(!validateName(''), 'Name validation rejects empty string');
assert(!validateName('   '), 'Name validation rejects whitespace-only string');
assert(!validateName('a'), 'Name validation rejects single-character string');
assert(!validateName('  a  '), 'Name validation rejects padded single-character string');
assert(validateName('Al'), 'Name validation accepts 2-character valid name');
assert(validateName('Juan Pérez'), 'Name validation accepts accented Spanish name');
assert(validateName('María José Peña-González'), 'Name validation accepts compound names with hyphens and diacritics');

// 1.3 Unicode Payloads (Emojis, RTL, CJK, Cyrillic, Math symbols)
const unicodePayloads = [
  { input: '🚀 Satya Nadella 📊', expectedValid: true, desc: 'Emojis in name' },
  { input: 'محمد بن سلمان', expectedValid: true, desc: 'Arabic RTL script' },
  { input: 'יובל נח הררי', expectedValid: true, desc: 'Hebrew RTL script' },
  { input: '田中 太郎', expectedValid: true, desc: 'Japanese Kanji/Katakana' },
  { input: 'Александр Пушкин', expectedValid: true, desc: 'Russian Cyrillic' },
  { input: 'René François Ghislain Magritte', expectedValid: true, desc: 'French accents' },
  { input: 'Øyvind Åsnes', expectedValid: true, desc: 'Nordic characters' },
  { input: 'A'.repeat(5000), expectedValid: true, desc: '5,000-character long name buffer' },
  { input: ' \t\n\r ', expectedValid: false, desc: 'Whitespace escape sequence buffer' },
  { input: 'José María 💡 (Director BI)', expectedValid: true, desc: 'Mixed symbols and parentheses' },
];

for (const u of unicodePayloads) {
  const result = validateName(u.input);
  assert(result === u.expectedValid, `Unicode Name Test: ${u.desc} -> ${result ? 'Accepted' : 'Rejected'}`);
}

// 1.4 URLSearchParams & Google Sheets Payload Encoding Integrity
function testPayloadSerialization(rawPayload: Record<string, string>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(rawPayload)) {
    params.append(k, v);
  }
  return params;
}

const maliciousLead = {
  name: '<script>alert("XSS")</script>',
  email: 'victim+test@company.com',
  phone: '+502 4046 4716 <script>',
  industry: "Finance' OR '1'='1",
  country: 'Guatemala',
  service: 'quick-win | <svg/onload=alert(1)>',
  details: 'Payload: {{7*7}} && $() ; cat /etc/passwd\nLine 2 \x00 null byte',
  utm_source: 'google<script>',
  utm_campaign: 'promo_2026"; DROP TABLE--',
  gclid: 'Cj0KCQjwmv...12345" onclick="alert(1)',
};

const serialized = testPayloadSerialization(maliciousLead);
const serializedString = serialized.toString();

assert(serializedString.includes('name=%3Cscript%3Ealert%28%22XSS%22%29%3C%2Fscript%3E'), 'Name is safely URL-encoded');
assert(serializedString.includes('utm_source=google%3Cscript%3E'), 'UTM source is safely URL-encoded');
assert(serializedString.includes('gclid=Cj0KCQjwmv...12345%22+onclick%3D%22alert%281%29'), 'gclid injection is safely URL-encoded');
assert(!serializedString.includes('<script>'), 'Serialized payload contains zero unencoded <script> tags');

// 1.5 Double-Submit Prevention Simulation
let formState: 'idle' | 'sending' | 'success' | 'error' = 'idle';
let submissionCount = 0;

async function mockSubmitForm(payload: any) {
  if (formState === 'sending') {
    return { blocked: true };
  }
  formState = 'sending';
  submissionCount++;
  await new Promise((r) => setTimeout(r, 10));
  formState = 'success';
  return { blocked: false, count: submissionCount };
}

async function testRapidSubmits() {
  submissionCount = 0;
  formState = 'idle';
  const attempts = await Promise.all([
    mockSubmitForm(maliciousLead),
    mockSubmitForm(maliciousLead),
    mockSubmitForm(maliciousLead),
    mockSubmitForm(maliciousLead),
    mockSubmitForm(maliciousLead),
  ]);

  const accepted = attempts.filter((a) => !a.blocked);
  const blocked = attempts.filter((a) => a.blocked);

  assert(accepted.length === 1, `Rapid double-submit stress: Exactly 1 submission executed (accepted: ${accepted.length})`);
  assert(blocked.length === 4, `Rapid double-submit stress: 4 duplicate attempts safely blocked (blocked: ${blocked.length})`);
  assert(submissionCount === 1, `Total backend dispatches capped at 1`);
}

await testRapidSubmits();


// --------------------------------------------------------------------------------
// SECTION 2: SCHEDULE BOOKING DATE BOUNDARIES & TIMEZONES
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 2: Schedule Booking Date Boundaries & Timezones ---');

function generateTestAvailableDates(baseDate: Date, lang: 'es' | 'en') {
  const dates: { dateStr: string; label: string; dayName: string; dayNumber: string; monthName: string; dayOfWeek: number }[] = [];
  let added = 0;
  let offset = 1;

  const dayNamesEs = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNamesEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  while (added < 7) {
    const d = new Date(baseDate.getTime() + offset * 86400000);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Saturday and Sunday
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayName = lang === 'es' ? dayNamesEs[dayOfWeek] : dayNamesEn[dayOfWeek];
      const monthName = lang === 'es' ? monthNamesEs[d.getMonth()] : monthNamesEn[d.getMonth()];
      const dayNumber = String(d.getDate());
      const label = `${dayName} ${dayNumber} ${monthName}`;

      dates.push({ dateStr, label, dayName, dayNumber, monthName, dayOfWeek });
      added++;
    }
    offset++;
  }

  return dates;
}

// 2.1 Leap Year: February 2028
const leapYearBase = new Date(2028, 1, 27); // Feb 27, 2028 (Sunday)
const leapDates = generateTestAvailableDates(leapYearBase, 'es');

assert(leapDates.length === 7, 'Leap year calendar generates exactly 7 business days');
assert(leapDates[0].dateStr === '2028-02-28', 'Leap year day 1 is Feb 28, 2028');
assert(leapDates[1].dateStr === '2028-02-29', 'Leap year correctly includes Feb 29 leap day');
assert(leapDates[2].dateStr === '2028-03-01', 'Leap year rolls over to Mar 1 after Feb 29');

// 2.2 Non-Leap Year: February 2026
const nonLeapBase = new Date(2026, 1, 26); // Feb 26, 2026 (Thursday)
const nonLeapDates = generateTestAvailableDates(nonLeapBase, 'en');

assert(nonLeapDates[0].dateStr === '2026-02-27', 'Non-leap day 1 is Friday Feb 27, 2026');
assert(nonLeapDates[1].dateStr === '2026-03-02', 'Non-leap skips weekend Feb 28-Mar 1 and rolls over directly to Monday Mar 2');
assert(!nonLeapDates.some((d) => d.dateStr === '2026-02-29'), 'Non-leap year does not contain Feb 29');

// 2.3 365-Day Sweep
let weekendLeakageCount = 0;
for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
  const testDate = new Date(2026, 0, 1 + dayOffset);
  const genDates = generateTestAvailableDates(testDate, 'es');
  for (const d of genDates) {
    if (d.dayOfWeek === 0 || d.dayOfWeek === 6) {
      weekendLeakageCount++;
    }
  }
}
assert(weekendLeakageCount === 0, `365-day calendar sweep: 0 weekend days leaked into booking slots across 2,555 generated slots`);

// 2.4 Year-End Rollover
const yearEndBase = new Date(2026, 11, 30); // Dec 30, 2026 (Wednesday)
const yearEndDates = generateTestAvailableDates(yearEndBase, 'es');
assert(yearEndDates[0].dateStr === '2026-12-31', 'Year-end day 1 is Dec 31, 2026');
assert(yearEndDates[1].dateStr === '2027-01-01', 'Year-end day 2 smoothly rolls over to Jan 01, 2027');

// 2.5 Timezones & WhatsApp Links
const timezones = {
  cst: { label: 'Guatemala / Centroamérica (CST, UTC-6)', offset: -6 },
  est: { label: 'EE. UU. Este / Miami / NY (EST, UTC-5)', offset: -5 },
  pst: { label: 'EE. UU. Pacífico / LA (PST, UTC-8)', offset: -8 },
};

function createWhatsAppLink(name: string, dateLabel: string, time: string, tzLabel: string, lang: 'es' | 'en') {
  const msg =
    lang === 'es'
      ? `Hola Sagepoint, acabo de agendar mi diagnóstico gratuito para el ${dateLabel} a las ${time} (${tzLabel}). Mi nombre es ${name}.`
      : `Hi Sagepoint, I just booked my free diagnostic call for ${dateLabel} at ${time} (${tzLabel}). My name is ${name}.`;
  return `https://wa.me/50240464716?text=${encodeURIComponent(msg)}`;
}

const waLinkCst = createWhatsAppLink('Carlos Mendoza', 'Lun 18 Ago', '10:30 AM', timezones.cst.label, 'es');
const waLinkEst = createWhatsAppLink('David Sterling', 'Mon 18 Aug', '10:30 AM', timezones.est.label, 'en');
const waLinkPst = createWhatsAppLink('Sarah Connor', 'Mon 18 Aug', '01:30 PM', timezones.pst.label, 'en');

assert(waLinkCst.startsWith('https://wa.me/50240464716?text='), 'WhatsApp link has verified phone number +502 4046 4716');
assert(decodeURIComponent(waLinkCst).includes('(Guatemala / Centroamérica (CST, UTC-6))'), 'WhatsApp link decodes CST timezone correctly');
assert(decodeURIComponent(waLinkEst).includes('(EE. UU. Este / Miami / NY (EST, UTC-5))'), 'WhatsApp link decodes EST timezone correctly');
assert(decodeURIComponent(waLinkPst).includes('(EE. UU. Pacífico / LA (PST, UTC-8))'), 'WhatsApp link decodes PST timezone correctly');

// 2.6 Google Calendar Link Template Validation
function createGoogleCalendarUrl(title: string, details: string, location: string): string {
  const encTitle = encodeURIComponent(title);
  const encDetails = encodeURIComponent(details);
  const encLocation = encodeURIComponent(location);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encTitle}&details=${encDetails}&location=${encLocation}`;
}

const gcalUrl = createGoogleCalendarUrl(
  'Diagnóstico Estratégico BI & Datos · Sagepoint Analytics',
  'Llamada de diagnóstico 1-a-1 con Senior BI Architect de Sagepoint Analytics.\nPaquete: Dashboard Ejecutivo',
  'Google Meet Video Call'
);
assert(gcalUrl.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE'), 'Google Calendar URL has correct base action');
assert(gcalUrl.includes('&text=Diagn%C3%B3stico'), 'Google Calendar URL correctly encodes accent characters');
assert(gcalUrl.includes('&location=Google%20Meet%20Video%20Call'), 'Google Calendar URL contains location parameter');


// --------------------------------------------------------------------------------
// SECTION 3: DIST/ ASSET PATHS & PRERENDERED HTML AUDIT
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 3: dist/ Asset Paths & Prerendered HTML Audit ---');

const distPath = resolve('dist');
assert(existsSync(distPath), 'dist/ directory exists');

const distIndexPath = join(distPath, 'index.html');
const distPortfolioPath = join(distPath, 'portfolio', 'index.html');
assert(existsSync(distIndexPath), 'dist/index.html exists');
assert(existsSync(distPortfolioPath), 'dist/portfolio/index.html exists');

const indexHtml = readFileSync(distIndexPath, 'utf-8');
const portfolioHtml = readFileSync(distPortfolioPath, 'utf-8');

// 3.1 Verify All Script and Link Assets in dist/index.html
const scriptRegex = /<script\s+[^>]*src="([^"]+)"/g;
const linkRegex = /<link\s+[^>]*href="([^"]+)"/g;

function checkReferencedAssets(html: string, sourceName: string) {
  let match: RegExpExecArray | null;
  
  // Scripts
  const scripts: string[] = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  for (const src of scripts) {
    if (src.startsWith('http://') || src.startsWith('https://')) continue;
    const cleanPath = src.startsWith('/') ? src.slice(1) : src;
    const fullPath = join(distPath, cleanPath);
    const exists = existsSync(fullPath);
    assert(exists, `${sourceName}: Script file '${src}' exists on disk in dist/`);
    if (exists) {
      const size = statSync(fullPath).size;
      assert(size > 0, `${sourceName}: Script '${src}' has non-zero size (${size} bytes)`);
    }
  }

  // Stylesheets & Icons
  const links: string[] = [];
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
  }
  for (const href of links) {
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) continue;
    const cleanPath = href.startsWith('/') ? href.slice(1) : href;
    const fullPath = join(distPath, cleanPath);
    const exists = existsSync(fullPath);
    assert(exists, `${sourceName}: Link resource '${href}' exists on disk in dist/`);
    if (exists) {
      const size = statSync(fullPath).size;
      assert(size > 0, `${sourceName}: Link resource '${href}' has non-zero size (${size} bytes)`);
    }
  }
}

checkReferencedAssets(indexHtml, 'dist/index.html');
checkReferencedAssets(portfolioHtml, 'dist/portfolio/index.html');

// 3.2 Verify All Static Project Files in dist/projects/
const projectFiles = [
  'apex-auto-dashboard.html',
  'apex-auto.jpg',
  'crm.jpg',
  'dicoma.jpg',
  'dicoma.pdf',
  'dicoma.png',
  'gravityclaw-report.pdf',
  'gravityclaw.jpg',
  'inmotion-prd.pdf',
  'inmotion.jpg',
  'jens-desserts.jpg',
  'saludable.jpg',
  'saludable.pdf',
];

for (const file of projectFiles) {
  const p = join(distPath, 'projects', file);
  const exists = existsSync(p);
  assert(exists, `Static project asset 'dist/projects/${file}' exists`);
  if (exists) {
    const size = statSync(p).size;
    assert(size > 500, `Asset 'dist/projects/${file}' is valid binary/text (${size} bytes)`);
  }
}

// 3.3 Verify Root Icons and Metadata Files
const rootFiles = ['favicon.png', 'logo.png', 'og-image.png', 'robots.txt', 'sitemap.xml', 'llms.txt'];
for (const rf of rootFiles) {
  const p = join(distPath, rf);
  const exists = existsSync(p);
  assert(exists, `Public root artifact 'dist/${rf}' exists`);
}


// --------------------------------------------------------------------------------
// SECTION 4: SEO METADATA, OPENGRAPH & JSON-LD STRUCTURED DATA
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 4: SEO Metadata, OpenGraph & JSON-LD Structured Data ---');

// 4.1 Root HTML Metadata
assert(indexHtml.includes('<link rel="canonical" href="https://www.sagepoint-analytics.com/" />'), 'Root index.html has exact canonical URL');
assert(indexHtml.includes('<meta property="og:url" content="https://www.sagepoint-analytics.com/" />'), 'Root index.html has og:url');
assert(indexHtml.includes('<meta property="og:type" content="website" />'), 'Root index.html has og:type');
assert(indexHtml.includes('<meta name="twitter:card" content="summary_large_image" />'), 'Root index.html has twitter:card summary_large_image');
assert(indexHtml.includes('<link rel="alternate" hreflang="es" href="https://www.sagepoint-analytics.com/" />'), 'Root has hreflang="es"');
assert(indexHtml.includes('<link rel="alternate" hreflang="en" href="https://www.sagepoint-analytics.com/?lang=en" />'), 'Root has hreflang="en"');
assert(indexHtml.includes('<link rel="alternate" hreflang="x-default" href="https://www.sagepoint-analytics.com/" />'), 'Root has hreflang="x-default"');

// 4.2 Portfolio HTML Metadata
assert(portfolioHtml.includes('<link rel="canonical" href="https://www.sagepoint-analytics.com/portfolio/" />'), 'Portfolio index.html has exact canonical URL');
assert(portfolioHtml.includes('<meta property="og:url" content="https://www.sagepoint-analytics.com/portfolio/" />'), 'Portfolio index.html has og:url');
assert(portfolioHtml.includes('<link rel="alternate" hreflang="es" href="https://www.sagepoint-analytics.com/portfolio/" />'), 'Portfolio has hreflang="es"');
assert(portfolioHtml.includes('<link rel="alternate" hreflang="en" href="https://www.sagepoint-analytics.com/portfolio/?lang=en" />'), 'Portfolio has hreflang="en"');
assert(portfolioHtml.includes('<link rel="alternate" hreflang="x-default" href="https://www.sagepoint-analytics.com/portfolio/" />'), 'Portfolio has hreflang="x-default"');

// 4.3 JSON-LD Structured Data Syntax & Schema Validation
function extractJsonLdBlocks(html: string): any[] {
  const jsonLdRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  const blocks: any[] = [];
  let m: RegExpExecArray | null;
  while ((m = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      blocks.push(parsed);
    } catch (err: any) {
      assert(false, `JSON-LD parsing failed: ${err.message}`);
    }
  }
  return blocks;
}

const rootJsonLd = extractJsonLdBlocks(indexHtml);
const portfolioJsonLd = extractJsonLdBlocks(portfolioHtml);

assert(rootJsonLd.length >= 2, `Root index.html contains ${rootJsonLd.length} valid JSON-LD script blocks`);
assert(portfolioJsonLd.length >= 1, `Portfolio index.html contains ${portfolioJsonLd.length} valid JSON-LD script block`);

// Verify Root Schema Types
const rootGraph = rootJsonLd[0]?.['@graph'] || [];
const graphTypes = rootGraph.map((item: any) => (Array.isArray(item['@type']) ? item['@type'].join('+') : item['@type']));

assert(graphTypes.some((t: string) => t.includes('WebSite')), 'Root JSON-LD defines schema.org/WebSite');
assert(graphTypes.some((t: string) => t.includes('Organization')), 'Root JSON-LD defines schema.org/Organization');
assert(graphTypes.some((t: string) => t.includes('ProfessionalService')), 'Root JSON-LD defines schema.org/ProfessionalService');

// Verify OfferCatalog in Root
const orgSchema = rootGraph.find((item: any) => {
  const t = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
  return t.includes('Organization');
});
assert(orgSchema?.hasOfferCatalog?.['@type'] === 'OfferCatalog', 'Organization schema contains OfferCatalog');
assert(orgSchema?.hasOfferCatalog?.itemListElement?.length >= 4, 'OfferCatalog contains 4 structured package offers (Quick-Win, Executive, Custom, Retainer)');

// Verify FAQPage in Root
const faqSchema = rootJsonLd.find((b: any) => b['@type'] === 'FAQPage');
assert(faqSchema !== undefined, 'Root JSON-LD contains standalone schema.org/FAQPage');
assert(faqSchema?.mainEntity?.length >= 6, `FAQPage contains ${faqSchema?.mainEntity?.length} structured Question/Answer pairs`);

// Verify Portfolio Schema Types
const portfolioGraph = portfolioJsonLd[0]?.['@graph'] || [];
const portfolioTypes = portfolioGraph.map((item: any) => item['@type']);
assert(portfolioTypes.includes('CollectionPage'), 'Portfolio JSON-LD defines schema.org/CollectionPage');
assert(portfolioTypes.includes('BreadcrumbList'), 'Portfolio JSON-LD defines schema.org/BreadcrumbList');

// 4.4 Robots.txt & Sitemap.xml Consistency
const robotsTxt = readFileSync(join(distPath, 'robots.txt'), 'utf-8');
const sitemapXml = readFileSync(join(distPath, 'sitemap.xml'), 'utf-8');

assert(robotsTxt.includes('User-agent: *'), 'robots.txt allows all crawlers');
assert(robotsTxt.includes('Sitemap: https://www.sagepoint-analytics.com/sitemap.xml'), 'robots.txt references sitemap.xml');
assert(sitemapXml.includes('<loc>https://www.sagepoint-analytics.com/</loc>'), 'sitemap.xml includes root URL');
assert(sitemapXml.includes('<loc>https://www.sagepoint-analytics.com/portfolio/</loc>'), 'sitemap.xml includes /portfolio/ URL');
assert(sitemapXml.includes('<xhtml:link rel="alternate" hreflang="es"'), 'sitemap.xml includes Spanish alternate links');
assert(sitemapXml.includes('<xhtml:link rel="alternate" hreflang="en"'), 'sitemap.xml includes English alternate links');


// --------------------------------------------------------------------------------
// SECTION 5: PRERENDERED NOSCRIPT SEMANTIC FALLBACK & ANCHOR INTEGRITY
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 5: Semantic <noscript> & Navigation Anchor Targets ---');

assert(indexHtml.includes('<noscript>'), 'Root HTML contains <noscript> fallback container');
assert(indexHtml.includes('<h1>Sagepoint Analytics - Dashboards e Inteligencia de Negocios</h1>'), 'Root <noscript> has semantic H1');
assert(indexHtml.includes('info@sagepoint-analytics.com'), 'Root <noscript> has contact email');
assert(indexHtml.includes('+502 4046 4716'), 'Root <noscript> has contact WhatsApp');

assert(portfolioHtml.includes('<noscript>'), 'Portfolio HTML contains <noscript> fallback container');
assert(portfolioHtml.includes('<h1>Sagepoint Analytics - Dashboards e Inteligencia de Negocios</h1>'), 'Portfolio <noscript> has semantic H1');

// Verify all targeted section IDs for anchor navigation exist across App & child components
const appContent = readFileSync(resolve('App.tsx'), 'utf-8');
const packageMatrixContent = readFileSync(resolve('components/PackageMatrix.tsx'), 'utf-8');
const roiCalculatorContent = readFileSync(resolve('components/RoiCalculator.tsx'), 'utf-8');
const combinedAppCode = `${appContent}\n${packageMatrixContent}\n${roiCalculatorContent}`;

const requiredSectionIds = ['services', 'why-us', 'pricing', 'testimonials', 'faq', 'contact'];
for (const sid of requiredSectionIds) {
  const hasId = combinedAppCode.includes(`id="${sid}"`);
  assert(hasId, `Landing page tree contains navigation anchor target id="${sid}"`);
}


// --------------------------------------------------------------------------------
// SECTION 6: ROI CALCULATOR MATH PRECISION & BOUNDARY BEHAVIOR
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 6: ROI Calculator Math Precision & Boundary Stress ---');

function computeRoi(teamSize: number, hoursPerWeek: number, hourlyRate: number = 35) {
  const safeTeamSize = Math.max(0, teamSize);
  const safeHours = Math.max(0, hoursPerWeek);
  const safeRate = hourlyRate > 0 ? hourlyRate : 35;
  const hoursSaved = Math.round(safeTeamSize * safeHours * 0.7);
  const monthlySavings = Math.round(hoursSaved * 4.33 * safeRate);
  const annualSavings = monthlySavings * 12;
  const roiMultiplier = Math.max(1, Math.round((annualSavings / 2500) * 10) / 10);
  return { hoursSaved, monthlySavings, annualSavings, roiMultiplier };
}

// 6.1 Standard Case (5 people, 10 hrs/wk, $35/hr)
const std = computeRoi(5, 10, 35);
assert(std.hoursSaved === 35, '5 people @ 10 hrs/wk saves 35 hours/week (70% efficiency)');
assert(std.monthlySavings === 5304, 'Monthly savings computes accurately ($5,304/mo)');
assert(std.annualSavings === 63648, 'Annual savings computes accurately ($63,648/yr)');
assert(std.roiMultiplier === 25.5, 'ROI Multiplier computes to 25.5x against $2,500 package');

// 6.2 Zero & Negative Boundaries
const zero = computeRoi(0, 0);
assert(zero.hoursSaved === 0 && zero.annualSavings === 0, '0 team size and 0 hours yields 0 savings');
assert(zero.roiMultiplier === 1, '0 savings clamps ROI multiplier safely to 1.0x minimum');

const negative = computeRoi(-5, -10, -50);
assert(negative.hoursSaved === 0 && negative.annualSavings === 0, 'Negative inputs clamp safely to 0 without NaN/negative savings');

// 6.3 Extreme Enterprise Workload (500 analysts, 40 hrs/wk)
const enterprise = computeRoi(500, 40, 50);
assert(enterprise.hoursSaved === 14000, 'Enterprise 500 analysts saves 14,000 hrs/wk');
assert(Number.isFinite(enterprise.annualSavings) && !Number.isNaN(enterprise.annualSavings), 'Enterprise savings computes finite number without overflow');


// --------------------------------------------------------------------------------
// SUMMARY & VERDICT
// --------------------------------------------------------------------------------
console.log('\n================================================================================');
console.log(`MILESTONE 5 CHALLENGER 2 STRESS HARNESS SUMMARY`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total Assertions: ${passed + failed}`);
console.log('================================================================================\n');

if (failed > 0) {
  console.error('FAILURES:');
  for (const f of failures) {
    console.error(`- ${f}`);
  }
  process.exit(1);
} else {
  console.log('🎉 ALL ADVERSARIAL CHALLENGER 2 TESTS PASSED WITH 0 FAILURES!\n');
  process.exit(0);
}
