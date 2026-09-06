import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'vite';

const dist = new URL('../dist/', import.meta.url).pathname;
const site = 'https://www.sagepoint-analytics.com';
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const blocks = [...template.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const org = blocks[0]['@graph'].find(item => item['@id'] === `${site}/#organization`);
// Page copy already carries full scope and pricing. Keep a single consistent organization identity.
const { hasOfferCatalog, ...organization } = org;
const faq = blocks.find(item => item['@type'] === 'FAQPage');
const paths = ['/', '/portfolio/', '/web/'];
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', ssr: { resolve: { externalConditions: ['module-sync', 'node'] } } });
try {
  const { renderPage, translateLeo } = await vite.ssrLoadModule('/scripts/render-pages.tsx');
  for (const path of paths) for (const language of ['es', 'en']) {
    const url = `${site}${path}${language === 'en' ? '?lang=en' : ''}`;
    const { markup, meta } = renderPage(path, language);
    const graph = [
      organization,
      { '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: 'Sagepoint Analytics', publisher: { '@id': `${site}/#organization` } },
      { '@type': path === '/portfolio/' ? 'CollectionPage' : 'WebPage', '@id': `${url}#webpage`, url, name: meta.title, description: meta.description, inLanguage: language, isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#organization` } },
    ];
    if (path === '/') graph.push({ ...faq, mainEntity: faq.mainEntity.map(q => ({ ...q, name: translateLeo(language, q.name), acceptedAnswer: { ...q.acceptedAnswer, text: translateLeo(language, q.acceptedAnswer.text) } })) });
    let html = template
      .replace(/<html lang="[^"]+"/, `<html lang="${language}"`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
      .replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
      .replace(/<link rel="(?:canonical|alternate)"[^>]*>/g, '');
    for (const [attr, key, value] of [
      ['name', 'description', meta.description], ['property', 'og:title', meta.title],
      ['property', 'og:description', meta.description], ['property', 'og:url', url],
      ['property', 'og:locale', language === 'en' ? 'en_US' : 'es_GT'],
      ['property', 'og:locale:alternate', language === 'en' ? 'es_GT' : 'en_US'],
      ['name', 'twitter:title', meta.title], ['name', 'twitter:description', meta.description],
    ]) html = html.replace(new RegExp(`<meta\\s+${attr}="${key}"[\\s\\S]*?\\/>`), `<meta ${attr}="${key}" content="${escape(value)}" />`);
    const head = `<link rel="canonical" href="${url}" />
<link rel="alternate" hreflang="es" href="${site}${path}" />
<link rel="alternate" hreflang="en" href="${site}${path}?lang=en" />
<link rel="alternate" hreflang="x-default" href="${site}${path}" />
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>
<noscript><style>.leo [data-rv],#root [style*="opacity:0"]{opacity:1!important;transform:none!important}</style></noscript>`;
    html = html.replace('</head>', `${head}\n</head>`).replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`);
    const dir = language === 'en' ? join(dist, '_localized', 'en', path) : join(dist, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
    console.log(`SEO: rendered ${path} (${language}) from React components`);
  }
} finally {
  await vite.close();
}
// Do not fabricate lastmod on each build: changes to content, not build time, determine freshness.
const entries = paths.flatMap(path => ['es', 'en'].map(language => `<url><loc>${site}${path}${language === 'en' ? '?lang=en' : ''}</loc><xhtml:link rel="alternate" hreflang="es" href="${site}${path}"/><xhtml:link rel="alternate" hreflang="en" href="${site}${path}?lang=en"/><xhtml:link rel="alternate" hreflang="x-default" href="${site}${path}"/></url>`));
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('\n')}</urlset>`);
