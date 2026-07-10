import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const distDir = new URL('../dist/', import.meta.url).pathname;
const indexPath = join(distDir, 'index.html');
const siteUrl = 'https://www.sagepoint-analytics.com';

function setMeta(html, selector, content) {
  const attrPattern = selector.startsWith('property=') ? 'property' : 'name';
  const key = selector.replace(/^(property|name)=/, '');
  const pattern = new RegExp(`<meta\\s+${attrPattern}="${key}"[\\s\\S]*?content="[^"]*"\\s*\\/>`);

  if (pattern.test(html)) {
    return html.replace(pattern, `<meta ${attrPattern}="${key}" content="${content}" />`);
  }

  return html.replace('</head>', `    <meta ${attrPattern}="${key}" content="${content}" />\n</head>`);
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
}

function setCanonical(html, href) {
  return html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${href}" />`);
}

function stripJsonLd(html) {
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '');
}

function stripAlternateLinks(html) {
  return html.replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n/g, '\n');
}

function insertJsonLd(html, graph) {
  const json = JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
  return html.replace('</head>', `<script type="application/ld+json">\n${json}\n</script>\n</head>`);
}

const baseHtml = readFileSync(indexPath, 'utf8');
const portfolioTitle = 'Portfolio - Sagepoint Analytics | Proyectos de BI, IA y Desarrollo Web';
const portfolioDescription =
  'Proyectos reales de Sagepoint Analytics: IA aplicada, automatizacion operativa, dashboards, CRMs, APIs y reportes ejecutivos para empresas en Guatemala y EE. UU.';
const portfolioUrl = `${siteUrl}/portfolio/`;

let portfolioHtml = baseHtml;
portfolioHtml = setTitle(portfolioHtml, portfolioTitle);
portfolioHtml = setMeta(portfolioHtml, 'name=description', portfolioDescription);
portfolioHtml = setMeta(portfolioHtml, 'property=og:title', portfolioTitle);
portfolioHtml = setMeta(portfolioHtml, 'property=og:description', portfolioDescription);
portfolioHtml = setMeta(portfolioHtml, 'property=og:url', portfolioUrl);
portfolioHtml = setMeta(portfolioHtml, 'name=twitter:title', portfolioTitle);
portfolioHtml = setMeta(portfolioHtml, 'name=twitter:description', portfolioDescription);
portfolioHtml = setCanonical(portfolioHtml, portfolioUrl);
portfolioHtml = stripAlternateLinks(portfolioHtml);
portfolioHtml = stripJsonLd(portfolioHtml);
portfolioHtml = insertJsonLd(portfolioHtml, {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${portfolioUrl}#webpage`,
      url: portfolioUrl,
      name: portfolioTitle,
      description: portfolioDescription,
      inLanguage: 'es-GT',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${portfolioUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: `${siteUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Portfolio',
          item: portfolioUrl,
        },
      ],
    },
  ],
});

const portfolioPath = join(distDir, 'portfolio', 'index.html');
mkdirSync(dirname(portfolioPath), { recursive: true });
writeFileSync(portfolioPath, portfolioHtml);

console.log('SEO postbuild: generated dist/portfolio/index.html');
