import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'vite';

const dist = new URL('../dist/', import.meta.url).pathname;
const site = 'https://www.sagepoint-analytics.com';
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const blocks = [...template.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const org = blocks[0]['@graph'].find(item => item['@id'] === `${site}/#organization`);
const { hasOfferCatalog, ...organization } = org;
const homeFaq = blocks.find(item => item['@type'] === 'FAQPage');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const paired = path => {
  if (path === '/' || path === '/en/') return [{ lang: 'es', path: '/' }, { lang: 'en', path: '/en/' }, { lang: 'x-default', path: '/' }];
  for (const segment of ['portfolio', 'web']) if (path === `/${segment}/` || path === `/en/${segment}/`) return [{ lang: 'es', path: `/${segment}/` }, { lang: 'en', path: `/en/${segment}/` }, { lang: 'x-default', path: `/${segment}/` }];
  if (path === '/servicios/' || path === '/en/services/') return [{ lang: 'es', path: '/servicios/' }, { lang: 'en', path: '/en/services/' }];
  return [{ lang: path.startsWith('/en/') ? 'en' : 'es', path }];
};
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', ssr: { resolve: { externalConditions: ['module-sync', 'node'] } } });
let paths;
try {
  const { renderPage, translateLeo, ALL_ROUTES } = await vite.ssrLoadModule('/scripts/render-pages.tsx');
  const { serviceGraph } = await vite.ssrLoadModule('/leonardo/ServicePage.tsx');
  paths = ALL_ROUTES;
  for (const path of paths) {
    const language = path.startsWith('/en/') ? 'en' : 'es';
    const url = `${site}${path}`;
    const { markup, meta, service } = renderPage(path);
    const graph = [
      organization,
      { '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: 'Sagepoint Analytics', publisher: { '@id': `${site}/#organization` } },
      { '@type': path.includes('/portfolio/') ? 'CollectionPage' : 'WebPage', '@id': `${url}#webpage`, url, name: meta.title, description: meta.description, inLanguage: language, isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#organization` } },
    ];
    if (path === '/' || path === '/en/') graph.push({ ...homeFaq, mainEntity: homeFaq.mainEntity.map(q => ({ ...q, name: translateLeo(language, q.name), acceptedAnswer: { ...q.acceptedAnswer, text: translateLeo(language, q.acceptedAnswer.text) } })) });
    if (service) graph.push(...serviceGraph(service));
    if (path === '/servicios/' || path === '/en/services/') graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: language === 'es' ? 'Inicio' : 'Home', item: `${site}${language === 'es' ? '/' : '/en/'}` },
      { '@type': 'ListItem', position: 2, name: language === 'es' ? 'Servicios' : 'Services', item: url },
    ] });
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
    const alternates = paired(path).map(item => `<link rel="alternate" hreflang="${item.lang}" href="${site}${item.path}" />`).join('\n');
    const head = `<link rel="canonical" href="${url}" />\n${alternates}\n<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>\n<noscript><style>.leo [data-rv],#root [style*="opacity:0"]{opacity:1!important;transform:none!important}</style></noscript>`;
    html = html.replace('</head>', `${head}\n</head>`).replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`);
    const dir = join(dist, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
    console.log(`SEO: rendered ${path}`);
  }
} finally {
  await vite.close();
}
const entries = paths.map(path => `<url><loc>${site}${path}</loc>${paired(path).map(item => `<xhtml:link rel="alternate" hreflang="${item.lang}" href="${site}${item.path}"/>`).join('')}</url>`);
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('\n')}</urlset>`);
