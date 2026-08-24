import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
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
import { trackPageView, trackSelectPackage, trackWhatsAppClick } from '../utils/analytics';

const WHATSAPP_PHONE = '50240464716';

export type WebPackageId = 'web-esencial' | 'web-panel' | 'web-custom' | 'web-care' | 'web-general';

/**
 * Prices on this page are quoted in Guatemalan quetzales on purpose: every local
 * competitor that publishes pricing does so in Q, and the landing is aimed at
 * Guatemalan SMBs. The home page keeps its USD BI packages untouched.
 */
export const webContent = {
  es: {
    meta: {
      title: 'Páginas Web con Panel de Clientes en Guatemala | Sagepoint Analytics',
      description:
        'Tu página web con dominio, hosting y WhatsApp incluidos, más un panel que te dice cuántos clientes entraron y de dónde vinieron. Precio cerrado en quetzales y plazo definido.',
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
        'En Guatemala, 61% de las compras se cierran hoy en una página web y solo 14% en redes sociales. Te armamos el sitio —con dominio, hosting y WhatsApp— y te dejamos un panel donde ves cuántos clientes entraron y de dónde vinieron.',
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
      title: 'Websites with a Customer Dashboard in Guatemala | Sagepoint Analytics',
      description:
        'Your website with domain, hosting and WhatsApp included, plus a dashboard that tells you how many customers came in and where they came from. Fixed price, defined timeline.',
    },
    nav: {
      home: 'Home',
      web: 'Websites',
      portfolio: 'Portfolio',
      contact: 'Contact us',
    },
    hero: {
      eyebrow: 'Websites with a customer dashboard · Guatemala',
      title_lead: 'You already have Facebook.',
      title_sub: "What's missing is what closes the sale.",
      description:
        'In Guatemala, 61% of purchases now close on a website and only 14% on social media. We build the site —domain, hosting and WhatsApp included— and hand you a dashboard showing how many customers came in and where from.',
      cta_primary: 'See packages and pricing',
      cta_whatsapp: 'Message us on WhatsApp',
      proof: ['Delivered in 7 business days', 'Fixed price in quetzales', 'The domain stays in your name'],
      card: {
        label: 'Customer dashboard · sample view',
        updated: 'Updated 4 min ago',
        rows: [
          { label: 'Visits this month', value: '1,284', delta: '+18%' },
          { label: 'WhatsApp messages', value: '73', delta: '+31%' },
          { label: 'From Google search', value: '46%', delta: '' },
          { label: 'From Facebook and Instagram', value: '38%', delta: '' },
        ],
        note: 'Sample numbers. Your dashboard is built from your own site data.',
      },
    },
    proof: {
      eyebrow: 'The data that changed the game',
      title: 'In two years, buying moved to the web.',
      description:
        "This isn't our opinion. It's the 7th National E-Commerce Study by the Guatemalan Chamber of Commerce: where Guatemalans closed their last purchase.",
      col_2024: '2024',
      col_2026: '2026',
      rows: [
        { label: 'Own website', a: 36, b: 61, tone: 'up' as const },
        { label: 'Social media', a: 26, b: 14, tone: 'down' as const },
        { label: 'Brand app', a: 20, b: 8, tone: 'down' as const },
      ],
      source:
        '7th National E-Commerce Study, Guatemalan Chamber of Commerce (2026). 748 online surveys and 66 companies. Own website combines mobile (38%) and desktop (23%).',
      kicker: 'Your customer no longer closes the sale where you are waiting for them.',
    },
    diff: {
      eyebrow: 'What nobody else gives you',
      title: 'Everyone sells you a website. We tell you whether it works.',
      description:
        'We are an analytics consultancy that also builds sites, not a design agency that learned to add charts. The dashboard is not an extra: it is the reason to hire us.',
      items: [
        {
          title: 'How many visits and from where',
          desc: 'Google, Facebook, Instagram, WhatsApp or someone typing your address. You know which channel actually brings people.',
        },
        {
          title: 'How many people wrote in',
          desc: 'Every WhatsApp click and every form submission is counted, along with the page it came from.',
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
        'Mobile-first design (75% of purchases in Guatemala are mobile)',
        'Loads in under 2.5 seconds on mobile data',
        'WhatsApp button with a pre-written message per page',
        'Fixed price in writing before we start',
      ],
    },
    packages: {
      eyebrow: 'Packages and pricing',
      title: 'Fixed price, defined timeline, in quetzales.',
      description: 'No "it depends", no inflated quotes and no holding your domain hostage.',
      timeline_label: 'Delivery',
      excludes_label: 'Not included',
      cards: [
        {
          id: 'web-esencial' as WebPackageId,
          title: 'Essential',
          price: 'Q4,500',
          period: 'one-time',
          timeline: '7 business days',
          desc: 'For the business that needs to exist on Google and stop losing the customer who is checking prices.',
          features: [
            '1 to 3 page site with custom design',
            'First year of domain and hosting included',
            'WhatsApp and contact form connected',
            'Optimized for mobile and Google search',
            'Basic dashboard: visits and messages received',
            '1 round of revisions',
          ],
          excludes: 'Online store, blog and English version.',
          cta: 'Start with Essential',
        },
        {
          id: 'web-panel' as WebPackageId,
          title: 'Site + Customer Dashboard',
          price: 'Q8,500',
          period: 'one-time',
          timeline: '14 business days',
          tag: 'Most popular',
          desc: 'The full package: the site that sells and the dashboard that tells you whether it is selling.',
          features: [
            '4 to 6 page site with custom design',
            'Everything in Essential',
            'Full customer dashboard: visits, sources, conversations and per-page conversion',
            'Google Business Profile configured (local SEO)',
            'Catalog or gallery of up to 30 products or services',
            '1 training session for your team',
            '2 rounds of revisions',
          ],
          excludes: 'Online payment gateway and inventory integration.',
          cta: 'I want the site with dashboard',
        },
        {
          id: 'web-custom' as WebPackageId,
          title: 'Store or Custom',
          pricePrefix: 'from',
          price: 'Q15,000',
          period: 'by scope',
          timeline: '4 to 6 weeks',
          desc: 'To sell online, connect to your systems or serve customers in two languages.',
          features: [
            'Online store with online payments',
            'Integrations with billing, inventory or CRM',
            'Bilingual Spanish and English site',
            'Dashboard connected to your real sales data',
            'Scope and price defined in a formal quote',
          ],
          excludes: '',
          cta: 'Quote my project',
        },
      ],
      care: {
        id: 'web-care' as WebPackageId,
        tag: 'Monthly add-on',
        title: 'Maintenance',
        price: 'Q450 / Q900 / Q1,500',
        period: 'per month',
        desc: 'Hosting and domain, backups, content changes, the monthly dashboard report and priority WhatsApp. The three tiers differ by number of monthly changes.',
        cta: 'Add maintenance',
      },
      renewal:
        'After the first year, domain and hosting cost around Q1,200 per year if you manage them yourself. We tell you upfront so it is never a surprise.',
      payment: 'Paid in two parts: 50% to start and 50% on delivery.',
    },
    compare: {
      eyebrow: 'Honest comparison',
      title: 'What about Wix, or just staying on Facebook?',
      description: 'Both are legitimate, and for some businesses they are the right call. Here is the comparison without makeup.',
      headers: ['', 'Facebook only', 'Wix or Shopify (DIY)', 'Sagepoint'],
      rows: [
        { label: 'First year cost', a: 'Q0', b: '~Q3,600 per year', c: 'Q4,500–8,500 once' },
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
        { n: '01', title: '20-minute call', desc: 'We look at your business, what you sell and to whom. Free, no commitment.' },
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
          q: 'Why Q8,500 when someone else does it for Q1,350?',
          a: 'Because it is not the same product. For Q1,350 you get a template with your logo on it, and often the domain ends up registered under the provider. Our price includes custom design, configured local SEO and the customer dashboard, which no provider in Guatemala offers today. If your real budget is Q1,350, buying the template is a sound decision and we will tell you so on the call.',
        },
        {
          q: 'Do the domain and hosting stay in my name?',
          a: 'Always. Both accounts are created with your email and your name. If you want to move to another provider tomorrow, you take everything without asking us.',
        },
        {
          q: 'What does it cost to keep after the first year?',
          a: 'Around Q1,200 per year for domain and hosting if you manage it. If you would rather not, the Maintenance add-on starts at Q450 per month and includes backups, content changes and the dashboard report.',
        },
        {
          q: 'I already have a website. Is any of this useful?',
          a: 'Probably the dashboard. We review your current site at no cost and tell you honestly whether it is worth rebuilding or whether instrumenting it and fixing two or three things is enough.',
        },
        {
          q: 'Do you work outside the capital?',
          a: 'Yes. The whole process is remote, so we serve Quetzaltenango, Antigua, Escuintla, Cobán or Petén the same way. We also work with clients in the United States in Spanish or English.',
        },
        {
          q: 'Do I have to leave Facebook?',
          a: 'No, and it would be a mistake. Facebook keeps bringing you people; the site is where those people find pricing, a catalog and a button to message you. The dashboard also shows how much of your traffic comes from social, which is the best way to know whether the ad spend is worth it.',
        },
        {
          q: 'Can I pay in installments?',
          a: 'Yes: 50% to start and 50% on delivery. No interest and no lock-in contract.',
        },
      ],
    },
    cta: {
      eyebrow: 'Next step',
      title: 'Twenty minutes and you will know.',
      description:
        'Message us on WhatsApp and we will tell you what your business needs, what it would cost and how long it takes. If the honest answer is that you do not need it yet, we will say that too.',
      whatsapp: 'Message on WhatsApp',
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
      'web-esencial': 'Hi, I am interested in the Q4,500 Essential website package.',
      'web-panel': 'Hi, I am interested in the Q8,500 Site + Customer Dashboard package.',
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

export default function WebPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lang: Lang = searchParams.get('lang') === 'en' ? 'en' : 'es';
  const t = webContent[lang];
  const path = lang === 'en' ? '/web/?lang=en' : '/web/';

  useDocumentMeta(t.meta.title, t.meta.description, path);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    trackPageView(path, t.meta.title, lang);
  }, [path, t.meta.title, lang]);

  const switchLang = (next: Lang) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'en') {
      params.set('lang', 'en');
    } else {
      params.delete('lang');
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden bg-[#071012] font-sans text-slate-300 selection:bg-sage/30 selection:text-sage">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-64 -top-64 h-[42rem] w-[42rem] rounded-full bg-sage/10 blur-[120px]" />
        <div className="absolute -bottom-80 -left-72 h-[44rem] w-[44rem] rounded-full bg-copper/5 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,247,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,246,0.025)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>

      <Navbar lang={lang} onSwitchLang={switchLang} />

      <main className="relative z-10 flex-grow pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Hero lang={lang} />
          <ProofSection lang={lang} />
          <DiffSection lang={lang} />
          <PackagesSection lang={lang} />
          <CompareSection lang={lang} />
          <ProcessSection lang={lang} />
          <FaqSection lang={lang} />
          <FinalCta lang={lang} />
        </div>
      </main>

      <Footer lang={lang} />
      <WhatsAppButton lang={lang} />
    </div>
  );
}

function Navbar({ lang, onSwitchLang }: { lang: Lang; onSwitchLang: (next: Lang) => void }) {
  const t = webContent[lang];
  const suffix = lang === 'en' ? '?lang=en' : '';
  const homeLink = lang === 'en' ? '/?lang=en' : '/';

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071012]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link to={homeLink} className="group flex items-center gap-3 text-ink">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0d1b1c] shadow-[0_10px_30px_rgba(2,8,9,0.35)]">
            <BarChart3 size={20} className="text-sage transition-transform duration-300 group-hover:scale-110" strokeWidth={2.4} />
          </span>
          <span className="leading-none">
            <span className="block font-serif text-lg font-bold tracking-tight">Sagepoint</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.28em] text-muted">Analytics</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] p-1 md:flex"
          aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}
        >
          <Link to={homeLink} className="rounded-full px-5 py-2 text-sm font-medium text-muted transition-colors hover:text-ink">
            {t.nav.home}
          </Link>
          <Link to={`/web/${suffix}`} aria-current="page" className="rounded-full bg-sage/10 px-5 py-2 text-sm font-semibold text-sage">
            {t.nav.web}
          </Link>
          <Link to={`/portfolio/${suffix}`} className="rounded-full px-5 py-2 text-sm font-medium text-muted transition-colors hover:text-ink">
            {t.nav.portfolio}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSwitchLang('es')}
              className={`language-chip ${lang === 'es' ? 'language-chip--active' : ''}`}
              title="Español"
              aria-label="Español"
            >
              ES
            </button>
            <button
              onClick={() => onSwitchLang('en')}
              className={`language-chip ${lang === 'en' ? 'language-chip--active' : ''}`}
              title="English"
              aria-label="English"
            >
              EN
            </button>
          </div>

          <a
            href={waHref(lang, 'web-general')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ source_section: 'web_navbar', package_id: 'web-general', language: lang })}
            className="flex items-center gap-2 rounded-full border border-sage/30 bg-sage/10 px-4 py-2.5 text-sm font-semibold text-sage transition-all duration-300 hover:-translate-y-0.5 hover:border-sage/60 hover:bg-sage hover:text-dark sm:px-5"
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">{t.nav.contact}</span>
          </a>
        </div>
      </div>
    </header>
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
            href={waHref(lang, 'web-general')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ source_section: 'web_hero', package_id: 'web-general', language: lang })}
            className="inline-flex items-center gap-3 rounded-full border border-white/15 px-7 py-4 text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-1 hover:border-sage/50 hover:text-sage"
          >
            <MessageCircle size={17} />
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
                href={waHref(lang, card.id)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackSelectPackage({
                    package_id: card.id,
                    package_name: card.title,
                    price: card.price,
                    currency: 'GTQ',
                    language: lang,
                  });
                  trackWhatsAppClick({ source_section: 'web_packages', package_id: card.id, language: lang });
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
            href={waHref(lang, t.care.id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ source_section: 'web_care', package_id: t.care.id, language: lang })}
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
        <table className="w-full min-w-[620px] border-collapse text-center">
          <caption className="sr-only">{t.title}</caption>
          <thead>
            <tr className="border-b border-white/10">
              {t.headers.map((header, i) => (
                <th
                  key={header || `col-${i}`}
                  scope="col"
                  className={`px-5 py-5 text-[10px] font-bold uppercase tracking-[0.18em] ${
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
                <th scope="row" className="px-5 py-4 text-left text-sm font-semibold text-ink">
                  {row.label}
                </th>
                <td className="px-5 py-4">
                  <CompareCell value={row.a} />
                </td>
                <td className="px-5 py-4">
                  <CompareCell value={row.b} />
                </td>
                <td className="bg-sage/[0.04] px-5 py-4">
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
            href={waHref(lang, 'web-general')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ source_section: 'web_final_cta', package_id: 'web-general', language: lang })}
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#071012] px-7 py-4 text-sm font-bold text-ink shadow-[0_18px_40px_rgba(7,16,18,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d1b1c]"
          >
            <MessageCircle size={17} />
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

function Footer({ lang }: { lang: Lang }) {
  const t = webContent[lang].footer;
  const suffix = lang === 'en' ? '?lang=en' : '';
  const homeLink = lang === 'en' ? '/?lang=en' : '/';

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050b0d] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto_auto] md:items-end md:gap-16">
        <div>
          <Link to={homeLink} className="inline-flex items-center gap-3 text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0d1b1c] text-sage">
              <BarChart3 size={18} />
            </span>
            <span className="font-serif text-xl font-bold">Sagepoint Analytics.</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{t.tagline}</p>
        </div>
        <nav className="flex gap-6 text-sm font-semibold" aria-label={lang === 'es' ? 'Navegación del pie de página' : 'Footer navigation'}>
          <Link to={homeLink} className="text-muted transition-colors hover:text-sage">
            {t.home}
          </Link>
          <Link to={`/web/${suffix}`} className="text-sage">
            {t.web}
          </Link>
          <Link to={`/portfolio/${suffix}`} className="text-muted transition-colors hover:text-sage">
            {t.portfolio}
          </Link>
        </nav>
        <a href="mailto:info@sagepoint-analytics.com" className="text-sm font-semibold text-muted transition-colors hover:text-sage">
          info@sagepoint-analytics.com
        </a>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs font-mono text-muted/60">{t.rights}</div>
    </footer>
  );
}
