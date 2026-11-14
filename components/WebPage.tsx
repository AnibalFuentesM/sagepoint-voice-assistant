import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Globe,
  LineChart,
  Mail,
  MessageCircle,
  Minus,
  Smartphone,
  X,
} from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getLangFromPath, localizedPath, pairedAlternates } from '../utils/i18nRoutes';
import { trackPageView, trackScheduleCall, trackSelectPackage, trackWhatsAppClick } from '../utils/analytics';
import { getEnglishBookingUrl } from '../leonardo/booking';
import { SiteHeader, SiteFooter } from '../leonardo/ServicesLayout';
import './webSkin.css';

const WHATSAPP_PHONE = '50240464716';

export type WebPackageId = 'web-esencial' | 'web-panel' | 'web-custom' | 'web-care' | 'web-general';

/**
 * US website prices (English page). PROPOSED on Nov 10 2026, pending Mariano's approval:
 * change them here and every mention on the page follows.
 */
export const US_WEB_PRICES = {
  essential: '$1,200',
  dashboard: '$2,400',
  custom: '$4,500',
  care: '$75 / $150 / $250',
  renewal: '$150',
};

/**
 * Two audiences on purpose. Spanish (/web/) is aimed at Guatemalan SMBs and quotes
 * quetzales, like every local competitor that publishes pricing. English (/en/web/)
 * is aimed at US small businesses: US dollars, "Book a free call" as the action and
 * no Guatemala-only statistics.
 */
export const webContent = {
  es: {
    meta: {
      title: 'Páginas web con panel de clientes | Sagepoint',
      description:
        'Páginas web para negocios en Guatemala con dominio, hosting, WhatsApp y un panel para medir visitas y contactos. Precio y plazo definidos.',
    },
    nav: {
      home: 'Inicio',
      web: 'Páginas web',
      portfolio: 'Portfolio',
      contact: 'Contáctanos',
    },
    hero: {
      eyebrow: 'Páginas web con panel de clientes · Guatemala',
      title_lead: 'Ya tienes Facebook.',
      title_sub: 'Te falta lo que cierra la venta.',
      description:
        'En Guatemala, 61% de los compradores en línea cerró su última compra en una página web y solo 14% en redes sociales. Te armamos el sitio —con dominio, hosting y WhatsApp— y te dejamos un panel donde ves cuántos clientes entraron y de dónde vinieron.',
      cta_primary: 'Ver paquetes y precios',
      cta_whatsapp: 'Escríbenos por WhatsApp',
      proof: [
        'Entrega desde 7 días hábiles',
        'Precio cerrado en quetzales',
        'El dominio queda a tu nombre',
      ],
      card: {
        label: 'Panel de clientes · vista de ejemplo',
        updated: 'Actualizado hace 4 min',
        rows: [
          { label: 'Visitas este mes', value: '1,284', delta: '+18%' },
          { label: 'Mensajes de WhatsApp', value: '73', delta: '+31%' },
          { label: 'De búsqueda en Google', value: '46%', delta: '' },
          { label: 'De Facebook e Instagram', value: '38%', delta: '' },
        ],
        note: 'Números de ejemplo. Tu panel se arma con los datos reales de tu sitio.',
      },
    },
    proof: {
      eyebrow: 'El dato que cambió el juego',
      title: 'En dos años, la compra se mudó a la web.',
      description:
        'Esto no es opinión nuestra. Es el 7º Estudio Nacional de Comercio Electrónico de la Cámara de Comercio de Guatemala: dónde el guatemalteco cerró su última compra.',
      col_2024: '2024',
      col_2026: '2026',
      rows: [
        { label: 'Página web propia', a: 36, b: 61, tone: 'up' as const },
        { label: 'Redes sociales', a: 26, b: 14, tone: 'down' as const },
        { label: 'App de la marca', a: 20, b: 8, tone: 'down' as const },
      ],
      source:
        'Fuente: 7º Estudio Nacional de Comercio Electrónico, Cámara de Comercio de Guatemala (2026). 748 encuestas en línea y 66 empresas. Web propia suma móvil (38%) y escritorio (23%).',
      kicker: 'Tu cliente ya no cierra la compra donde lo estás esperando.',
    },
    diff: {
      eyebrow: 'Lo que nadie más te da',
      title: 'Todos te venden una página. Nosotros te decimos si está funcionando.',
      description:
        'Somos una consultora de analítica que también construye sitios, no una agencia de diseño que aprendió a poner gráficas. El panel no es un extra: es la razón de contratarnos.',
      items: [
        {
          title: 'Cuántas visitas y de dónde',
          desc: 'Google, Facebook, Instagram, WhatsApp o alguien que escribió tu dirección. Sabes qué canal te está trayendo gente de verdad.',
        },
        {
          title: 'Cuántos escribieron',
          desc: 'Cada clic al botón de WhatsApp y cada formulario enviado queda contado, con la página desde donde salió.',
        },
        {
          title: 'Qué página convierte y cuál no',
          desc: 'Si tu página de servicios recibe 400 visitas y genera 2 mensajes, hay algo que arreglar. El panel te lo muestra.',
        },
        {
          title: 'Reporte mensual a tu correo',
          desc: 'Un resumen en español, sin jerga, con lo que cambió respecto al mes anterior y qué recomendamos hacer.',
        },
      ],
    },
    always: {
      title: 'Esto va incluido en todos los paquetes',
      items: [
        'El dominio y el hosting quedan a tu nombre, no al nuestro',
        'Certificado SSL y correo con tu propio dominio',
        'Diseñado primero para celular (75% de las compras en Guatemala son móviles)',
        'Carga en menos de 2.5 segundos en datos móviles',
        'Botón de WhatsApp con mensaje preescrito según la página',
        'Precio cerrado y por escrito antes de empezar',
      ],
    },
    packages: {
      eyebrow: 'Paquetes y precios',
      title: 'Precio cerrado, plazo definido, en quetzales.',
      description:
        'Sin “depende”, sin cotizaciones infladas y sin amarrarte el dominio. Lo que ves es lo que cuesta.',
      timeline_label: 'Entrega',
      excludes_label: 'No incluye',
      cards: [
        {
          id: 'web-esencial' as WebPackageId,
          title: 'Esencial',
          price: 'Q4,500',
          period: 'pago único',
          timeline: '7 días hábiles',
          desc: 'Para el negocio que necesita existir en Google y dejar de perder al cliente que busca precio.',
          features: [
            'Sitio de 1 a 3 páginas con diseño a medida',
            'Dominio y hosting del primer año incluidos',
            'WhatsApp y formulario de contacto conectados',
            'Optimizado para celular y para búsquedas en Google',
            'Panel básico: visitas y mensajes recibidos',
            '1 ronda de cambios',
          ],
          excludes: 'Tienda en línea, blog y versión en inglés.',
          cta: 'Empezar con el Esencial',
        },
        {
          id: 'web-panel' as WebPackageId,
          title: 'Sitio + Panel de Clientes',
          price: 'Q8,500',
          period: 'pago único',
          timeline: '14 días hábiles',
          tag: 'Más popular',
          desc: 'El paquete completo: el sitio que vende y el panel que te dice si está vendiendo.',
          features: [
            'Sitio de 4 a 6 páginas con diseño a medida',
            'Todo lo del paquete Esencial',
            'Panel de clientes completo: visitas, origen, conversaciones y conversión por página',
            'Perfil de Empresa en Google configurado (SEO local)',
            'Catálogo o galería de hasta 30 productos o servicios',
            '1 sesión de capacitación para tu equipo',
            '2 rondas de cambios',
          ],
          excludes: 'Pasarela de pago en línea e integración con inventario.',
          cta: 'Quiero el sitio con panel',
        },
        {
          id: 'web-custom' as WebPackageId,
          title: 'Tienda o A Medida',
          pricePrefix: 'desde',
          price: 'Q15,000',
          period: 'según alcance',
          timeline: '4 a 6 semanas',
          desc: 'Para vender en línea, conectar con tus sistemas o atender clientes en dos idiomas.',
          features: [
            'Tienda en línea con pagos en línea',
            'Integraciones con facturación, inventario o CRM',
            'Sitio bilingüe español e inglés',
            'Panel conectado a tus datos de venta reales',
            'Alcance y precio definidos en cotización formal',
          ],
          excludes: '',
          cta: 'Cotizar mi proyecto',
        },
      ],
      care: {
        id: 'web-care' as WebPackageId,
        tag: 'Add-on mensual',
        title: 'Mantenimiento',
        price: 'Q450 / Q900 / Q1,500',
        period: 'al mes',
        desc: 'Hosting y dominio, respaldos, cambios de contenido, el reporte mensual del panel y WhatsApp prioritario. Los tres niveles se diferencian por cantidad de cambios al mes.',
        cta: 'Agregar mantenimiento',
      },
      renewal:
        'Después del primer año, dominio y hosting cuestan alrededor de Q1,200 al año si lo manejas tú. Te lo decimos desde el principio para que no sea sorpresa.',
      payment: 'Pago en dos partes: 50% para empezar y 50% contra entrega.',
    },
    compare: {
      eyebrow: 'Comparación honesta',
      title: '¿Y si mejor uso Wix o me quedo solo en Facebook?',
      description:
        'Son opciones legítimas y para algunos negocios son la correcta. Esta es la comparación sin maquillaje.',
      headers: ['', 'Solo Facebook', 'Wix o Shopify (tú lo armas)', 'Sagepoint'],
      rows: [
        { label: 'Costo del primer año', a: 'Q0', b: '~Q3,600 al año', c: 'Q4,500–8,500 una vez' },
        { label: 'Tu tiempo invertido', a: 'Constante', b: '20 a 40 horas', c: '2 reuniones' },
        { label: 'Aparece en búsquedas de Google', a: 'no', b: 'si lo configuras', c: 'yes' },
        { label: 'Te dice cuántos clientes entraron', a: 'no', b: 'parcial', c: 'yes' },
        { label: 'El dominio es tuyo', a: 'no aplica', b: 'yes', c: 'yes' },
        { label: 'Sigues necesitando Facebook', a: '—', b: 'yes', c: 'yes' },
      ],
      kicker:
        'Un sitio propio no reemplaza tus redes: hace que el tráfico que ya generas termine en una venta en vez de en un comentario sin responder.',
    },
    process: {
      eyebrow: 'Cómo trabajamos',
      title: 'Cuatro pasos, sin misterio.',
      steps: [
        { n: '01', title: 'Llamada de 20 minutos', desc: 'Vemos tu negocio, qué vendes y a quién. Sin costo y sin compromiso.' },
        { n: '02', title: 'Propuesta con precio cerrado', desc: 'Te mandamos por escrito qué incluye, cuánto cuesta y cuándo se entrega.' },
        { n: '03', title: 'Construcción', desc: 'Nos das textos, fotos y logo. Nosotros hacemos el resto y te mostramos avances.' },
        { n: '04', title: 'Entrega y capacitación', desc: 'Sitio en línea, panel funcionando y tu equipo capacitado para actualizarlo.' },
      ],
    },
    faq: {
      eyebrow: 'Preguntas frecuentes',
      title: 'Lo que nos preguntan antes de decidir.',
      items: [
        {
          q: '¿Por qué Q8,500 si hay quien lo hace en Q1,350?',
          a: 'Porque no es el mismo producto. En Q1,350 recibes una plantilla con tu logo encima, y en muchos casos el dominio queda a nombre del proveedor. Nuestro precio incluye diseño a medida, SEO local configurado y el panel de clientes, que ningún proveedor en Guatemala está ofreciendo hoy. Si tu presupuesto real es Q1,350, contratar la plantilla es una decisión correcta y te lo vamos a decir en la llamada.',
        },
        {
          q: '¿El dominio y el hosting quedan a mi nombre?',
          a: 'Sí, siempre. La cuenta del dominio y la del hosting se crean con tu correo y tu nombre. Si mañana quieres irte con otro proveedor, te llevas todo sin pedirnos permiso.',
        },
        {
          q: '¿Cuánto cuesta mantenerlo después del primer año?',
          a: 'Alrededor de Q1,200 al año entre dominio y hosting si lo administras tú. Si prefieres no ocuparte, el add-on de Mantenimiento arranca en Q450 al mes e incluye respaldos, cambios de contenido y el reporte del panel.',
        },
        {
          q: 'Ya tengo página web. ¿Me sirve algo de esto?',
          a: 'Probablemente el panel. Revisamos tu sitio actual sin costo y te decimos con honestidad si vale la pena rehacerlo o si con instrumentarlo y arreglar dos o tres cosas es suficiente.',
        },
        {
          q: '¿Trabajan fuera de la capital?',
          a: 'Sí. Todo el proceso es remoto, así que atendemos igual en Quetzaltenango, Antigua, Escuintla, Cobán o Petén. También trabajamos con clientes en Estados Unidos en español o inglés.',
        },
        {
          q: '¿Tengo que dejar Facebook?',
          a: 'No, y sería un error. Facebook te sigue trayendo gente; el sitio es donde esa gente encuentra precio, catálogo y un botón para escribirte. El panel además te muestra cuánto de tu tráfico viene de tus redes, que es la mejor forma de saber si vale la pena la pauta.',
        },
        {
          q: '¿Puedo pagar en partes?',
          a: 'Sí: 50% para arrancar y 50% contra entrega. Sin intereses y sin contrato de permanencia.',
        },
      ],
    },
    cta: {
      eyebrow: 'Siguiente paso',
      title: 'Veinte minutos y sabes si te conviene.',
      description:
        'Escríbenos por WhatsApp y te decimos qué necesita tu negocio, cuánto costaría y en cuánto tiempo. Si la respuesta honesta es que todavía no lo necesitas, también te la damos.',
      whatsapp: 'Escribir por WhatsApp',
      email: 'Escribir un correo',
    },
    footer: {
      tagline: 'Sistemas útiles, evidencia visible y decisiones con contexto humano.',
      home: 'Inicio',
      web: 'Páginas web',
      portfolio: 'Portfolio',
      rights: '© 2026 Sagepoint Analytics. Guatemala y Estados Unidos.',
    },
    wa_messages: {
      'web-general': 'Hola, vi la página de sitios web y me interesa saber más.',
      'web-esencial': 'Hola, me interesa el paquete Esencial de Q4,500 para mi página web.',
      'web-panel': 'Hola, me interesa el paquete Sitio + Panel de Clientes de Q8,500.',
      'web-custom': 'Hola, necesito una tienda en línea o un sitio a medida. ¿Me pueden cotizar?',
      'web-care': 'Hola, me interesa el mantenimiento mensual para mi sitio web.',
    } as Record<WebPackageId, string>,
  },

  en: {
    meta: {
      title: 'Small Business Websites with a Dashboard | Sagepoint',
      description:
        'Small business websites with domain, hosting and a dashboard that shows visits and leads. Live in 7 business days, fixed price in US dollars.',
    },
    nav: {
      home: 'Home',
      web: 'Websites',
      portfolio: 'Portfolio',
      contact: 'Book a free call',
    },
    hero: {
      eyebrow: 'Websites with a customer dashboard · US small businesses',
      title_lead: 'A website that brings customers,',
      title_sub: 'and tells you if it is working.',
      description:
        'Most small business websites get built and then nobody knows whether they work. We build yours with domain, hosting and contact buttons included, and hand you a dashboard that shows how many people visited, where they came from and how many contacted you.',
      cta_primary: 'See packages and pricing',
      cta_whatsapp: 'Book a free call',
      proof: ['Live in 7 business days', 'Fixed price in US dollars', 'The domain stays in your name'],
      card: {
        label: 'Customer dashboard · sample view',
        updated: 'Updated 4 min ago',
        rows: [
          { label: 'Visits this month', value: '1,284', delta: '+18%' },
          { label: 'Calls and messages', value: '73', delta: '+31%' },
          { label: 'From Google search', value: '46%', delta: '' },
          { label: 'From Facebook and Instagram', value: '38%', delta: '' },
        ],
        note: 'Sample numbers. Your dashboard is built from your own site data.',
      },
    },
    /** The Spanish page shows a Guatemalan e-commerce study here. There is no verified US equivalent, so the English page skips the section. */
    proof: null,
    diff: {
      eyebrow: 'What nobody else gives you',
      title: 'Everyone sells you a website. We tell you whether it works.',
      description:
        'We are an analytics firm that also builds sites, not a design agency that learned to add charts. The dashboard is not an extra: it is the reason to hire us.',
      items: [
        {
          title: 'How many visits and from where',
          desc: 'Google, Facebook, Instagram or someone typing your address. You know which channel actually brings people.',
        },
        {
          title: 'How many people contacted you',
          desc: 'Every tap on your phone number and every form submission is counted, along with the page it came from.',
        },
        {
          title: 'Which page converts and which does not',
          desc: 'If your services page gets 400 visits and produces 2 messages, something needs fixing. The dashboard shows it.',
        },
        {
          title: 'Monthly report to your inbox',
          desc: 'A plain-language summary of what changed since last month and what we recommend doing about it.',
        },
      ],
    },
    always: {
      title: 'Included in every package',
      items: [
        'Domain and hosting stay in your name, not ours',
        'SSL certificate and email on your own domain',
        'Mobile-first design',
        'Loads in under 2.5 seconds on mobile data',
        'Click-to-call button and contact form on every page',
        'Fixed price in writing before we start',
      ],
    },
    packages: {
      eyebrow: 'Packages and pricing',
      title: 'Fixed price, defined timeline, in US dollars.',
      description: 'No "it depends", no inflated quotes and no holding your domain hostage.',
      timeline_label: 'Delivery',
      excludes_label: 'Not included',
      cards: [
        {
          id: 'web-esencial' as WebPackageId,
          title: 'Essential',
          price: US_WEB_PRICES.essential,
          period: 'one-time',
          timeline: '7 business days',
          desc: 'For the business that needs to show up on Google and stop losing the customer who is comparing options.',
          features: [
            '1 to 3 page site with custom design',
            'First year of domain and hosting included',
            'Click-to-call button and contact form connected',
            'Optimized for mobile and Google search',
            'Basic dashboard: visits and contacts received',
            '1 round of revisions',
          ],
          excludes: 'Online store, blog and Spanish version.',
          cta: 'Start with Essential',
        },
        {
          id: 'web-panel' as WebPackageId,
          title: 'Site + Customer Dashboard',
          price: US_WEB_PRICES.dashboard,
          period: 'one-time',
          timeline: '14 business days',
          tag: 'Most popular',
          desc: 'The full package: the site that sells and the dashboard that tells you whether it is selling.',
          features: [
            '4 to 6 page site with custom design',
            'Everything in Essential',
            'Full customer dashboard: visits, sources, contacts and per-page conversion',
            'Google Business Profile configured (local SEO)',
            'Catalog or gallery of up to 30 products or services',
            '1 training session for your team',
            '2 rounds of revisions',
          ],
          excludes: 'Online payments and inventory integration.',
          cta: 'I want the site with dashboard',
        },
        {
          id: 'web-custom' as WebPackageId,
          title: 'Store or Custom',
          pricePrefix: 'from',
          price: US_WEB_PRICES.custom,
          period: 'by scope',
          timeline: '4 to 6 weeks',
          desc: 'To sell online, connect to your systems or serve customers in two languages.',
          features: [
            'Online store with online payments',
            'Integrations with billing, inventory or CRM',
            'Bilingual English and Spanish site',
            'Dashboard connected to your real sales data',
            'Scope and price defined in a written quote',
          ],
          excludes: '',
          cta: 'Quote my project',
        },
      ],
      care: {
        id: 'web-care' as WebPackageId,
        tag: 'Monthly add-on',
        title: 'Maintenance',
        price: US_WEB_PRICES.care,
        period: 'per month',
        desc: 'Hosting and domain, backups, content changes, the monthly dashboard report and priority replies. The three tiers differ by number of monthly changes.',
        cta: 'Add maintenance',
      },
      renewal:
        `After the first year, domain and hosting cost around ${US_WEB_PRICES.renewal} per year if you manage them yourself. We tell you upfront so it is never a surprise.`,
      payment: 'Paid in two parts: 50% to start and 50% on delivery.',
    },
    compare: {
      eyebrow: 'Honest comparison',
      title: 'What about Wix, or just staying on Facebook?',
      description: 'Both are legitimate, and for some businesses they are the right call. Here is the comparison without makeup.',
      headers: ['', 'Facebook only', 'Wix or Squarespace (DIY)', 'Sagepoint'],
      rows: [
        { label: 'First year cost', a: '$0', b: 'A monthly plan, every year', c: `${US_WEB_PRICES.essential}–${US_WEB_PRICES.dashboard.replace('$', '')} once` },
        { label: 'Your time invested', a: 'Constant', b: '20 to 40 hours', c: '2 meetings' },
        { label: 'Shows up in Google search', a: 'no', b: 'if you configure it', c: 'yes' },
        { label: 'Tells you how many customers came in', a: 'no', b: 'partial', c: 'yes' },
        { label: 'You own the domain', a: 'n/a', b: 'yes', c: 'yes' },
        { label: 'You still need Facebook', a: '—', b: 'yes', c: 'yes' },
      ],
      kicker:
        'Your own site does not replace social media: it makes the traffic you already generate end in a sale instead of an unanswered comment.',
    },
    process: {
      eyebrow: 'How we work',
      title: 'Four steps, no mystery.',
      steps: [
        { n: '01', title: 'Free call', desc: 'We look at your business, what you sell and to whom. No commitment.' },
        { n: '02', title: 'Proposal with fixed price', desc: 'You get in writing what is included, what it costs and when it ships.' },
        { n: '03', title: 'Build', desc: 'You give us copy, photos and logo. We do the rest and show you progress.' },
        { n: '04', title: 'Delivery and training', desc: 'Site live, dashboard running and your team trained to update it.' },
      ],
    },
    faq: {
      eyebrow: 'Frequently asked',
      title: 'What people ask before deciding.',
      items: [
        {
          q: `Why ${US_WEB_PRICES.dashboard} when a template site costs a few hundred dollars?`,
          a: 'Because it is not the same product. A template gives you a standard layout with your logo on it, and you set up the rest yourself. Our price includes custom design, your Google Business Profile configured and the customer dashboard that shows whether the site brings you customers. If a template is all your business needs right now, we will tell you so on the call.',
        },
        {
          q: 'Do the domain and hosting stay in my name?',
          a: 'Always. Both accounts are created with your email and your name. If you want to move to another provider tomorrow, you take everything without asking us.',
        },
        {
          q: 'What does it cost to keep after the first year?',
          a: `Around ${US_WEB_PRICES.renewal} per year for domain and hosting if you manage it. If you would rather not, the Maintenance add-on starts at ${US_WEB_PRICES.care.split(' / ')[0]} per month and includes backups, content changes and the dashboard report.`,
        },
        {
          q: 'I already have a website. Is any of this useful?',
          a: 'Probably the dashboard. We review your current site at no cost and tell you honestly whether it is worth rebuilding or whether adding tracking and fixing two or three things is enough.',
        },
        {
          q: 'Where are you based, and do you work with businesses anywhere in the US?',
          a: 'We are based in Guatemala and work remotely, in English or Spanish, with businesses in any state. Our workday overlaps US business hours, calls happen on video and you approve every step in writing.',
        },
        {
          q: 'Do I have to leave Facebook?',
          a: 'No, and it would be a mistake. Facebook keeps bringing you people; the site is where those people find pricing, a catalog and a way to contact you. The dashboard also shows how much of your traffic comes from social media, which is the best way to know whether the ad spend is worth it.',
        },
        {
          q: 'Can I pay in installments?',
          a: 'Yes: 50% to start and 50% on delivery. No interest and no lock-in contract.',
        },
      ],
    },
    cta: {
      eyebrow: 'Next step',
      title: 'One call and you will know.',
      description:
        'Book a free call and we will tell you what your business needs, what it would cost and how long it takes. If the honest answer is that you do not need it yet, we will say that too.',
      whatsapp: 'Book a free call',
      email: 'Send an email',
    },
    footer: {
      tagline: 'Useful systems, visible evidence and decisions with human context.',
      home: 'Home',
      web: 'Websites',
      portfolio: 'Portfolio',
      rights: '© 2026 Sagepoint Analytics. Guatemala and United States.',
    },
    wa_messages: {
      'web-general': 'Hi, I saw the websites page and would like to know more.',
      'web-esencial': 'Hi, I am interested in the Essential website package.',
      'web-panel': 'Hi, I am interested in the Site + Customer Dashboard package.',
      'web-custom': 'Hi, I need an online store or a custom site. Can you quote it?',
      'web-care': 'Hi, I am interested in monthly maintenance for my website.',
    } as Record<WebPackageId, string>,
  },
};

type Lang = 'es' | 'en';

const DIFF_ICONS = [Globe, MessageCircle, LineChart, Mail];

function waHref(lang: Lang, pkg: WebPackageId) {
  const message = webContent[lang].wa_messages[pkg];
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/** English visitors book on the calendar, like the rest of the English site; Spanish visitors write on WhatsApp. */
function contactHref(lang: Lang, pkg: WebPackageId) {
  return getEnglishBookingUrl(lang) ?? waHref(lang, pkg);
}

function trackContact(lang: Lang, section: string, pkg: WebPackageId) {
  if (getEnglishBookingUrl(lang)) trackScheduleCall({ source_section: section, package_id: pkg, method: 'booking_link', language: lang });
  else trackWhatsAppClick({ source_section: section, package_id: pkg, language: lang });
}

export default function WebPage() {
  const location = useLocation();
  const lang: Lang = getLangFromPath(location.pathname);
  const t = webContent[lang];
  const path = localizedPath('/web/', lang);

  useDocumentMeta(t.meta.title, t.meta.description, path, pairedAlternates('/web/'));

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    trackPageView(path, t.meta.title, lang);
  }, [path, t.meta.title, lang]);

  return (
    <div className="web-skin relative isolate flex min-h-screen flex-col overflow-x-hidden bg-black font-sans text-slate-300 selection:bg-sage/30 selection:text-sage">
      <div className="leo service-site leo-chrome relative z-20">
        <a className="skip" href="#content">{lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
        <SiteHeader lang={lang} source="web" switchPath="/web/" />
      </div>

      <main id="content" className="relative z-10 flex-grow pt-12 pb-24 sm:pt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Hero lang={lang} />
          <ProofSection lang={lang} />
          <DiffSection lang={lang} />
          <ExamplesSection lang={lang} />
          <PackagesSection lang={lang} />
          <CompareSection lang={lang} />
          <ProcessSection lang={lang} />
          <FaqSection lang={lang} />
          <FinalCta lang={lang} />
        </div>
      </main>

      <div className="leo service-site leo-chrome relative z-10">
        <SiteFooter lang={lang} />
      </div>
      <WhatsAppButton lang={lang} />
    </div>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-sage">{eyebrow}</span>
      <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-base leading-relaxed text-muted">{description}</p> : null}
    </div>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const t = webContent[lang].hero;

  return (
    <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-sage/25 bg-sage/[0.07] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-sage">
          <Smartphone size={12} />
          {t.eyebrow}
        </span>

        <h1 className="mt-7 font-serif text-4xl font-bold leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
          <span className="block text-muted">{t.title_lead}</span>
          <span className="block">{t.title_sub}</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{t.description}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#paquetes"
            className="group inline-flex items-center gap-3 rounded-full bg-sage px-7 py-4 text-sm font-bold text-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(99,230,190,0.25)]"
          >
            {t.cta_primary}
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href={contactHref(lang, 'web-general')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContact(lang, 'web_hero', 'web-general')}
            className="inline-flex items-center gap-3 rounded-full border border-white/15 px-7 py-4 text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-1 hover:border-sage/50 hover:text-sage"
          >
            {lang === 'en' ? <CalendarDays size={17} /> : <MessageCircle size={17} />}
            {t.cta_whatsapp}
          </a>
        </div>

        <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
          {t.proof.map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs font-semibold text-muted">
              <Check size={14} className="text-sage" strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Sample dashboard card: the differentiator, shown rather than described. */}
      <div className="relative rounded-[28px] border border-white/10 bg-[#0a1714]/80 p-6 shadow-[0_30px_80px_rgba(2,8,9,0.5)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted">{t.card.label}</span>
          <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-sage">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            {t.card.updated}
          </span>
        </div>

        <dl className="mt-6 space-y-3">
          {t.card.rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
              <dt className="text-xs font-medium text-muted">{row.label}</dt>
              <dd className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-ink">{row.value}</span>
                {row.delta ? <span className="text-[10px] font-bold text-sage">{row.delta}</span> : null}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 text-[10px] leading-relaxed text-muted/60">{t.card.note}</p>
      </div>
    </section>
  );
}

function ProofSection({ lang }: { lang: Lang }) {
  const t = webContent[lang].proof;
  if (!t) return null;

  return (
    <section className="mt-28 sm:mt-36">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-[#0a1714]/60">
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-white/10 px-6 py-4 sm:px-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted">
            {lang === 'es' ? 'Canal de la última compra' : 'Channel of last purchase'}
          </span>
          <span className="flex gap-6 text-[9px] font-bold uppercase tracking-[0.22em] text-muted">
            <span className="w-10 text-right">{t.col_2024}</span>
            <span className="w-10 text-right text-sage">{t.col_2026}</span>
          </span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {t.rows.map((row) => (
            <div key={row.label} className="px-6 py-5 sm:px-8">
              <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <span className="text-sm font-semibold text-ink">{row.label}</span>
                <span className="flex gap-6 font-mono text-sm">
                  <span className="w-10 text-right text-muted">{row.a}%</span>
                  <span className={`w-10 text-right font-bold ${row.tone === 'up' ? 'text-sage' : 'text-copper'}`}>{row.b}%</span>
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-white/20" style={{ width: `${row.a}%` }} />
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${row.tone === 'up' ? 'bg-sage' : 'bg-copper'}`}
                    style={{ width: `${row.b}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 bg-white/[0.015] px-6 py-5 sm:px-8">
          <p className="font-serif text-lg font-bold text-ink sm:text-xl">{t.kicker}</p>
          <p className="mt-3 text-[10px] leading-relaxed text-muted/70">{t.source}</p>
        </div>
      </div>
    </section>
  );
}

/** Real client sites, so a visitor can see our work before reading the prices. */
const exampleSites = [
  {
    name: 'JKS Mobiliario',
    url: 'https://www.muebles-jks.com/',
    host: 'muebles-jks.com',
    image: '/projects/jks-mobiliario.jpg',
    es: 'Catálogo de 70 productos con cotización por WhatsApp y un panel para publicar productos.',
    en: '70-product catalog with WhatsApp quotes and a panel to publish new products.',
    tag: { es: 'Fabricante de muebles', en: 'Furniture maker' },
  },
  {
    name: 'Plomeros Rapi2',
    url: 'https://plomerosrapid2.com.gt/',
    host: 'plomerosrapid2.com.gt',
    image: '/projects/plomeros-rapi2.jpg',
    es: 'Rediseño de 206 páginas sin perder posiciones en Google, con llamada y WhatsApp siempre a la vista.',
    en: '206-page redesign that kept its Google rankings, with call and WhatsApp buttons always in view.',
    tag: { es: 'Servicios 24 horas', en: '24-hour home services' },
  },
  {
    name: "Jen's Desserts",
    url: 'https://jens-desserts.vercel.app/',
    host: 'jens-desserts.vercel.app',
    image: '/projects/jens-desserts.jpg',
    es: 'Vitrina de pasteles personalizados con pedidos directos por WhatsApp.',
    en: 'Custom cake showcase with orders sent straight to WhatsApp.',
    tag: { es: 'Pastelería', en: 'Bakery' },
  },
  {
    name: 'Saludable',
    url: 'https://saludable-indol.vercel.app/',
    host: 'saludable-indol.vercel.app',
    image: '/projects/saludable.jpg',
    es: 'Sitio para una nutricionista con servicios, precios y citas por WhatsApp.',
    en: 'Site for a nutritionist with services, pricing and WhatsApp booking.',
    tag: { es: 'Clínica de nutrición', en: 'Nutrition clinic' },
  },
];

function ExamplesSection({ lang }: { lang: Lang }) {
  const es = lang === 'es';
  return (
    <section id="ejemplos" className="mt-28 scroll-mt-24 sm:mt-36">
      <SectionHeader
        eyebrow={es ? 'Sitios que ya hicimos' : 'Sites we have built'}
        title={es ? 'Míralos funcionando antes de decidir.' : 'See them live before you decide.'}
        description={
          es
            ? 'Cuatro sitios reales de clientes. Ábrelos en tu teléfono: así se verá el tuyo.'
            : 'Four real client sites. Open them on your phone: that is how yours will look and feel.'
        }
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {exampleSites.map((site) => (
          <a
            key={site.url}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] transition-colors hover:border-sage/40"
          >
            <div className="aspect-[16/9] overflow-hidden border-b border-white/10 bg-white/[0.03]">
              <img
                src={site.image}
                alt={es ? `Sitio web de ${site.name}` : `${site.name} website`}
                loading="lazy"
                width={1280}
                height={720}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-6">
              <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-sage">{site.tag[lang]}</span>
              <h3 className="mt-2 text-lg font-bold text-ink">{site.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{es ? site.es : site.en}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sage">
                {es ? 'Ver sitio' : 'Visit site'} <span aria-hidden="true">↗</span>
                <span className="font-normal text-muted/70">· {site.host}</span>
              </span>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        <Link to={localizedPath('/portfolio/', lang)} className="font-semibold text-sage underline-offset-4 hover:underline">
          {es ? 'Ver el portafolio completo →' : 'See the full portfolio →'}
        </Link>
      </p>
    </section>
  );
}

function DiffSection({ lang }: { lang: Lang }) {
  const t = webContent[lang].diff;
  const always = webContent[lang].always;

  return (
    <section className="mt-28 sm:mt-36">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {t.items.map((item, i) => {
          const Icon = DIFF_ICONS[i % DIFF_ICONS.length];
          return (
            <div
              key={item.title}
              className="rounded-[24px] border border-white/10 bg-[#0a1714]/60 p-7 transition-colors duration-300 hover:border-sage/30"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0d1b1c] text-sage">
                <Icon size={18} />
              </span>
              <h3 className="mt-5 font-serif text-xl font-bold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-[24px] border border-sage/20 bg-sage/[0.04] p-7 sm:p-8">
        <h3 className="font-serif text-xl font-bold text-ink">{always.title}</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {always.items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
              <Check size={16} className="mt-0.5 shrink-0 text-sage" strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PackagesSection({ lang }: { lang: Lang }) {
  const t = webContent[lang].packages;

  return (
    <section id="paquetes" className="mt-28 scroll-mt-24 sm:mt-36">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {t.cards.map((card) => {
          const featured = 'tag' in card && Boolean(card.tag);
          return (
            <div
              key={card.id}
              className={`relative flex flex-col rounded-[28px] border p-7 sm:p-8 ${
                featured ? 'border-sage/40 bg-sage/[0.05] shadow-[0_24px_60px_rgba(99,230,190,0.08)]' : 'border-white/10 bg-[#0a1714]/60'
              }`}
            >
              {featured ? (
                <span className="absolute -top-3 left-7 rounded-full bg-sage px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-dark">
                  {(card as { tag: string }).tag}
                </span>
              ) : null}

              <h3 className="font-serif text-2xl font-bold text-ink">{card.title}</h3>

              <div className="mt-5 flex items-baseline gap-2">
                {'pricePrefix' in card && card.pricePrefix ? (
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">{card.pricePrefix}</span>
                ) : null}
                <span className="font-serif text-4xl font-bold text-ink">{card.price}</span>
                <span className="text-xs font-medium text-muted">{card.period}</span>
              </div>

              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sage">
                {t.timeline_label}: {card.timeline}
              </p>

              <p className="mt-5 text-sm leading-relaxed text-muted">{card.desc}</p>

              <ul className="mt-6 flex-grow space-y-3">
                {card.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                    <Check size={15} className="mt-0.5 shrink-0 text-sage" strokeWidth={3} />
                    {feature}
                  </li>
                ))}
              </ul>

              {card.excludes ? (
                <p className="mt-6 border-t border-white/[0.08] pt-4 text-xs leading-relaxed text-muted/70">
                  <span className="font-bold uppercase tracking-wider">{t.excludes_label}:</span> {card.excludes}
                </p>
              ) : null}

              <a
                href={contactHref(lang, card.id)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackSelectPackage({
                    package_id: card.id,
                    package_name: card.title,
                    price: card.price,
                    currency: lang === 'en' ? 'USD' : 'GTQ',
                    language: lang,
                  });
                  trackContact(lang, 'web_packages', card.id);
                }}
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                  featured
                    ? 'bg-sage text-dark hover:shadow-[0_16px_36px_rgba(99,230,190,0.28)]'
                    : 'border border-white/15 text-ink hover:border-sage/50 hover:text-sage'
                }`}
              >
                {card.cta}
                <ArrowRight size={16} />
              </a>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[28px] border border-white/10 bg-[#0a1714]/60 p-7 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="rounded-full border border-copper/30 bg-copper/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-copper">
                {t.care.tag}
              </span>
              <h3 className="mt-4 font-serif text-2xl font-bold text-ink">{t.care.title}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-ink">{t.care.price}</span>
              <span className="text-xs font-medium text-muted">{t.care.period}</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">{t.care.desc}</p>
          <a
            href={contactHref(lang, t.care.id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContact(lang, 'web_care', t.care.id)}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sage transition-colors hover:text-ink"
          >
            {t.care.cta}
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/[0.015] p-7 sm:p-8">
          <p className="text-sm leading-relaxed text-muted">{t.renewal}</p>
          <p className="border-t border-white/[0.08] pt-4 text-sm font-semibold leading-relaxed text-ink">{t.payment}</p>
        </div>
      </div>
    </section>
  );
}

function CompareCell({ value }: { value: string }) {
  if (value === 'yes') {
    return <Check size={17} className="mx-auto text-sage" strokeWidth={3} aria-label="Sí" />;
  }
  if (value === 'no') {
    return <X size={17} className="mx-auto text-copper" strokeWidth={3} aria-label="No" />;
  }
  if (value === '—') {
    return <Minus size={17} className="mx-auto text-muted/50" strokeWidth={3} aria-hidden="true" />;
  }
  return <span className="text-xs font-semibold text-slate-300">{value}</span>;
}

function CompareSection({ lang }: { lang: Lang }) {
  const t = webContent[lang].compare;

  return (
    <section className="mt-28 sm:mt-36">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

      <div className="mt-12 overflow-x-auto rounded-[28px] border border-white/10 bg-[#0a1714]/60">
        <table className="w-full sm:min-w-[620px] border-collapse text-center">
          <caption className="sr-only">{t.title}</caption>
          <thead>
            <tr className="border-b border-white/10">
              {t.headers.map((header, i) => (
                <th
                  key={header || `col-${i}`}
                  scope="col"
                  className={`px-2 py-4 text-[9px] font-bold uppercase tracking-[0.12em] sm:px-5 sm:py-5 sm:text-[10px] sm:tracking-[0.18em] ${
                    i === 3 ? 'text-sage' : 'text-muted'
                  } ${i === 0 ? 'text-left' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {t.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="px-3 py-4 text-left text-[13px] font-semibold text-ink sm:px-5 sm:text-sm">
                  {row.label}
                </th>
                <td className="px-2 py-4 sm:px-5">
                  <CompareCell value={row.a} />
                </td>
                <td className="px-2 py-4 sm:px-5">
                  <CompareCell value={row.b} />
                </td>
                <td className="bg-sage/[0.04] px-2 py-4 sm:px-5">
                  <CompareCell value={row.c} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{t.kicker}</p>
    </section>
  );
}

function ProcessSection({ lang }: { lang: Lang }) {
  const t = webContent[lang].process;

  return (
    <section className="mt-28 sm:mt-36">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} />

      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.steps.map((step) => (
          <li key={step.n} className="rounded-[24px] border border-white/10 bg-[#0a1714]/60 p-7">
            <span className="font-mono text-xs font-bold text-sage">{step.n}</span>
            <h3 className="mt-4 font-serif text-lg font-bold leading-snug text-ink">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{step.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FaqSection({ lang }: { lang: Lang }) {
  const t = webContent[lang].faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-28 sm:mt-36">
      <SectionHeader eyebrow={t.eyebrow} title={t.title} />

      <div className="mt-12 max-w-3xl divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {t.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`web-faq-panel-${i}`}
                  id={`web-faq-trigger-${i}`}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-serif text-lg font-bold text-ink sm:text-xl">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-sage transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </h3>
              <div
                id={`web-faq-panel-${i}`}
                role="region"
                aria-labelledby={`web-faq-trigger-${i}`}
                hidden={!isOpen}
                className="pb-7"
              >
                <p className="max-w-2xl text-sm leading-relaxed text-muted">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCta({ lang }: { lang: Lang }) {
  const t = webContent[lang].cta;

  return (
    <section className="relative mt-28 overflow-hidden rounded-[32px] bg-sage p-8 text-dark sm:mt-36 sm:p-12 lg:p-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(7,16,18,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(7,16,18,0.08)_1px,transparent_1px)] [background-size:40px_40px]"
      />
      <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-dark/60">{t.eyebrow}</span>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{t.title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark/70">{t.description}</p>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href={contactHref(lang, 'web-general')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContact(lang, 'web_final_cta', 'web-general')}
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#071012] px-7 py-4 text-sm font-bold text-ink shadow-[0_18px_40px_rgba(7,16,18,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d1b1c]"
          >
            {lang === 'en' ? <CalendarDays size={17} /> : <MessageCircle size={17} />}
            {t.whatsapp}
          </a>
          <a
            href="mailto:info@sagepoint-analytics.com"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-dark/20 px-7 py-4 text-sm font-bold text-dark transition-all duration-300 hover:-translate-y-1 hover:border-dark/50"
          >
            <Mail size={17} />
            {t.email}
          </a>
        </div>
      </div>
    </section>
  );
}
