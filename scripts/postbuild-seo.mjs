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

function insertAlternateLinks(html, url) {
  const alternates = `    <link rel="alternate" hreflang="es" href="${url}" />\n    <link rel="alternate" hreflang="en" href="${url}?lang=en" />\n    <link rel="alternate" hreflang="x-default" href="${url}" />\n</head>`;
  return html.replace('</head>', alternates);
}

function insertJsonLd(html, graph) {
  const json = JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
  return html.replace('</head>', `<script type="application/ld+json">\n${json}\n</script>\n</head>`);
}

/**
 * Renders one prerendered HTML shell per SPA route so crawlers and social
 * previews get route-specific metadata instead of the home page's.
 */
function renderRoute(baseHtml, { dir, title, description, graph }) {
  const url = `${siteUrl}/${dir}/`;

  let html = baseHtml;
  html = setTitle(html, title);
  html = setMeta(html, 'name=description', description);
  html = setMeta(html, 'property=og:title', title);
  html = setMeta(html, 'property=og:description', description);
  html = setMeta(html, 'property=og:url', url);
  html = setMeta(html, 'name=twitter:title', title);
  html = setMeta(html, 'name=twitter:description', description);
  html = setCanonical(html, url);
  html = stripAlternateLinks(html);
  html = insertAlternateLinks(html, url);
  html = stripJsonLd(html);
  html = insertJsonLd(html, graph(url));

  const outPath = join(distDir, dir, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);

  console.log(`SEO postbuild: generated dist/${dir}/index.html`);
}

const baseHtml = readFileSync(indexPath, 'utf8');

// ---------------------------------------------------------------- /portfolio/
const portfolioTitle = 'Portfolio — Sagepoint Analytics | Proyectos de BI, IA y Desarrollo Web';
const portfolioDescription =
  'Proyectos reales de Sagepoint Analytics: IA aplicada, automatizacion operativa, dashboards, CRMs, APIs y reportes ejecutivos para empresas en Guatemala y EE. UU.';

renderRoute(baseHtml, {
  dir: 'portfolio',
  title: portfolioTitle,
  description: portfolioDescription,
  graph: (url) => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: portfolioTitle,
        description: portfolioDescription,
        inLanguage: ['es-GT', 'en-US'],
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Portfolio', item: url },
        ],
      },
    ],
  }),
});

// ---------------------------------------------------------------------- /web/
const webTitle = 'Páginas Web con Panel de Clientes en Guatemala | Sagepoint Analytics';
const webDescription =
  'Tu pagina web con dominio, hosting y WhatsApp incluidos, mas un panel que te dice cuantos clientes entraron y de donde vinieron. Precio cerrado en quetzales y plazo definido.';

// Keep these in sync with the package cards in components/WebPage.tsx.
const WEB_OFFERS = [
  {
    name: 'Esencial',
    description:
      'Sitio de 1 a 3 paginas con diseno a medida, dominio y hosting del primer ano, WhatsApp y formulario conectados, panel basico de visitas y mensajes. Entrega en 7 dias habiles.',
    price: '4500',
    serviceType: 'Website design and development',
  },
  {
    name: 'Sitio + Panel de Clientes',
    description:
      'Sitio de 4 a 6 paginas, panel de clientes completo con visitas, origen, conversaciones y conversion por pagina, Perfil de Empresa en Google configurado, catalogo de hasta 30 productos y capacitacion. Entrega en 14 dias habiles.',
    price: '8500',
    serviceType: 'Website development with analytics dashboard',
  },
  {
    name: 'Tienda o A Medida',
    description:
      'Tienda en linea con pagos, integraciones con facturacion, inventario o CRM, sitio bilingue espanol e ingles y panel conectado a datos de venta. Alcance definido en cotizacion formal.',
    price: '15000',
    minPrice: true,
    serviceType: 'E-commerce and custom web development',
  },
];

const WEB_FAQ = [
  {
    q: '¿Por que Q8,500 si hay quien lo hace en Q1,350?',
    a: 'Porque no es el mismo producto. En Q1,350 recibes una plantilla con tu logo encima, y en muchos casos el dominio queda a nombre del proveedor. Nuestro precio incluye diseno a medida, SEO local configurado y el panel de clientes.',
  },
  {
    q: '¿El dominio y el hosting quedan a mi nombre?',
    a: 'Si, siempre. La cuenta del dominio y la del hosting se crean con tu correo y tu nombre. Si quieres cambiar de proveedor, te llevas todo sin pedir permiso.',
  },
  {
    q: '¿Cuanto cuesta mantenerlo despues del primer ano?',
    a: 'Alrededor de Q1,200 al ano entre dominio y hosting si lo administras tu. El add-on de Mantenimiento arranca en Q450 al mes e incluye respaldos, cambios de contenido y el reporte del panel.',
  },
  {
    q: '¿Trabajan fuera de la capital?',
    a: 'Si. Todo el proceso es remoto, asi que atendemos igual en Quetzaltenango, Antigua, Escuintla, Coban o Peten, y tambien clientes en Estados Unidos en espanol o ingles.',
  },
  {
    q: '¿Tengo que dejar Facebook?',
    a: 'No. Facebook te sigue trayendo gente; el sitio es donde esa gente encuentra precio, catalogo y un boton para escribirte. El panel te muestra cuanto de tu trafico viene de tus redes.',
  },
  {
    q: '¿Puedo pagar en partes?',
    a: 'Si: 50% para arrancar y 50% contra entrega, sin intereses y sin contrato de permanencia.',
  },
];

renderRoute(baseHtml, {
  dir: 'web',
  title: webTitle,
  description: webDescription,
  graph: (url) => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: webTitle,
        description: webDescription,
        inLanguage: ['es-GT', 'en-US'],
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: 'Diseno y desarrollo de paginas web con panel de clientes',
        serviceType: 'Website design and development',
        description: webDescription,
        provider: { '@id': `${siteUrl}/#organization` },
        areaServed: [
          { '@type': 'Country', name: 'Guatemala' },
          { '@type': 'Country', name: 'United States' },
        ],
        availableLanguage: ['Spanish', 'English'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Paquetes de paginas web',
          itemListElement: WEB_OFFERS.map((offer) => ({
            '@type': 'Offer',
            name: offer.name,
            description: offer.description,
            url,
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              priceCurrency: 'GTQ',
              ...(offer.minPrice ? { minPrice: offer.price } : { price: offer.price }),
            },
            itemOffered: {
              '@type': 'Service',
              name: offer.name,
              serviceType: offer.serviceType,
            },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: WEB_FAQ.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Paginas web', item: url },
        ],
      },
    ],
  }),
});
