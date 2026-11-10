import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import { ServicesLayout, ServiceActions } from '../leonardo/ServicesLayout';
import './portfolio.css';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getLangFromPath, localizedPath, pairedAlternates } from '../utils/i18nRoutes';
import { trackPageView } from '../utils/analytics';

export type CategoryId = 'all' | 'ai-automation' | 'operations-bi' | 'web-apps' | 'corporate-sites' | 'health-wellness' | 'gastronomy' | 'retail';

export type Project = {
  id: number;
  categoryId: CategoryId;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  tall: boolean;
  link: string;
  linkLabel: string;
};

export const portfolioContent = {
  es: {
    meta: {
      title: 'Proyectos de dashboards y automatización | Sagepoint',
      description: 'Dashboards, reportes automatizados, apps y páginas web que hemos hecho para clientes en Guatemala y Estados Unidos, con capturas de cada proyecto.',
    },
    nav: {
      home: 'Inicio',
      portfolio: 'Portfolio',
      contact: 'Agendar diagnóstico',
    },
    hero: {
      eyebrow: 'Casos seleccionados',
      title_lead: 'Nuestro portfolio.',
      title_sub: 'Prueba, no promesas.',
      description: 'Dashboards, reportes automatizados, apps y páginas web que hemos hecho para clientes, más un dashboard de demostración con datos de muestra.',
      cta_project: 'Agendar diagnóstico gratuito',
      cta_explore: 'Explorar el archivo ↓',
    },
    aside: {
      archive_label: 'Archivo activo',
      status_online: 'En línea',
      projects_label: 'Proyectos',
      sectors_label: 'Áreas',
      tagline: 'Sistemas útiles, evidencia visible y decisiones con contexto humano.',
    },
    evidence: [
      { value: 'Python + Playwright', label: 'Automatización de portales con MFA, sesiones y capturas.' },
      { value: '11,327', label: 'Call units reconciliadas entre Zendesk Explore y API.' },
      { value: '33,370', label: 'Filas consolidadas en reporting operativo BPO.' },
      { value: 'Slack + Sheets', label: 'Alertas, logging y seguimiento para workflows operativos.' },
    ],
    filterHeader: {
      eyebrow: 'Índice de trabajo',
      title: 'Explora por especialidad.',
      showing: 'Mostrando',
      of: 'de',
      projectsSuffix: 'proyectos',
    },
    categories: {
      all: 'Todos',
      'ai-automation': 'IA & Automatización',
      'operations-bi': 'Operaciones & BI',
      'web-apps': 'Aplicaciones Web',
      'corporate-sites': 'Sitios Corporativos',
      'health-wellness': 'Salud & Bienestar',
      gastronomy: 'Gastronomía',
      retail: 'Comercio & Catálogos',
    } as Record<CategoryId, string>,
    projects: [
      {
        id: 8,
        categoryId: 'operations-bi' as CategoryId,
        title: 'Zendesk Talk API Reporting',
        category: 'Operaciones & BI',
        description:
          'Flujo de Google Apps Script y Google Sheets conectado a Zendesk Talk para reemplazar exportaciones manuales, refrescar reportes por rango de fechas y validar la API como fuente de verdad frente a Explore.',
        image: '/projects/zendesk-talk-reporting.jpg',
        alt: 'Reporte operativo conectado a API de Zendesk Talk en Google Sheets',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Zendesk%20Talk%20API%20Reporting',
        linkLabel: 'Solicitar Caso',
      },
      {
        id: 9,
        categoryId: 'operations-bi' as CategoryId,
        title: 'BPO Production Reporting',
        category: 'Operaciones & BI',
        description:
          'Actualización y estabilización de un workbook ejecutivo con 33,370 filas, 20 meses, 79 semanas de producción, 14 PM systems y sincronización de tablas y gráficos semanales para revisión gerencial.',
        image: '/projects/bpo-production-reporting.jpg',
        alt: 'Workbook ejecutivo de producción BPO con métricas semanales y gráficos sincronizados',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=BPO%20Production%20Reporting',
        linkLabel: 'Solicitar Caso',
      },
      {
        id: 11,
        categoryId: 'operations-bi' as CategoryId,
        title: 'Demo: cockpit para concesionarios',
        category: 'Operaciones & BI',
        description:
          'Demo con datos de muestra de un dashboard ejecutivo en Power BI para una red de 12 concesionarios: ventas vs. meta, utilidad bruta por región, mezcla de vehículos eléctricos/híbridos e inventario envejecido, con modelo estelar y medidas DAX documentadas.',
        image: '/projects/apex-auto.jpg',
        alt: 'Demo de dashboard ejecutivo con datos de muestra: ventas, utilidad, mezcla de powertrain e inventario por concesionario',
        tall: false,
        link: '/projects/apex-auto-dashboard.html',
        linkLabel: 'Ver Dashboard',
      },
      {
        id: 12,
        categoryId: 'retail' as CategoryId,
        title: 'JKS Mobiliario para Oficina',
        category: 'Comercio & Catálogos',
        description:
          'Catálogo en línea para un fabricante guatemalteco de muebles de oficina: 70 productos en 12 categorías, carrito de cotización que envía el pedido completo por WhatsApp, páginas listas para Google y un panel donde el cliente publica sus propios productos.',
        image: '/projects/jks-mobiliario.jpg',
        alt: 'Sitio de JKS Mobiliario para Oficina con catálogo y botón de cotización por WhatsApp',
        tall: false,
        link: 'https://www.muebles-jks.com/',
        linkLabel: 'Ver Sitio',
      },
      {
        id: 4,
        categoryId: 'web-apps' as CategoryId,
        title: 'In Motion Dance Academy',
        category: 'Aplicaciones Web',
        description:
          'Varios proyectos para la misma academia: catálogo de videos de clases conectado a Google Sheets y Google Drive, prototipo de app de gestión (alumnos, pagos, asistencia con QR y portal para encargados), landing del Festival In Motion y un selector de planes.',
        image: '/projects/inmotion-academia.jpg',
        alt: 'Panel de administración de la app de In Motion Dance Academy con datos de demostración',
        tall: false,
        link: 'https://inmotion-tan.vercel.app/',
        linkLabel: 'Ver Sitio',
      },
      {
        id: 13,
        categoryId: 'corporate-sites' as CategoryId,
        title: 'GPPX, S.A.',
        category: 'Sitios Corporativos',
        description:
          'Sitio corporativo para una firma guatemalteca de arquitectura, planificación paramétrica e ingeniería, con animación de entrada a la medida, servicios y portafolio de proyectos.',
        image: '/projects/gppx.jpg',
        alt: 'Página de inicio del sitio de GPPX, firma de arquitectura e ingeniería paramétrica',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Proyecto%20GPPX',
        linkLabel: 'Solicitar Demo',
      },
      {
        id: 14,
        categoryId: 'corporate-sites' as CategoryId,
        title: 'Plomeros Rapi2',
        category: 'Sitios Corporativos',
        description:
          'Rediseño completo del sitio de una empresa de plomería y electricidad 24 horas: 206 páginas reconstruidas con el diseño nuevo sin perder las que ya estaban en Google, botones de llamada y WhatsApp siempre visibles y una sección de emergencias eléctricas.',
        image: '/projects/plomeros-rapi2.jpg',
        alt: 'Sitio de Plomeros Rapi2 con servicios de calentadores, plomería y electricidad 24 horas',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Proyecto%20Plomeros%20Rapi2',
        linkLabel: 'Solicitar Demo',
      },
      {
        id: 1,
        categoryId: 'ai-automation' as CategoryId,
        title: 'GravityClaw',
        category: 'IA & Automatización',
        description:
          'Plataforma de IA con bot de Telegram, publicación automática en Facebook e Instagram, generación de cotizaciones en PDF y dashboard de control en tiempo real con Next.js.',
        image: '/projects/gravityclaw.jpg',
        alt: 'Dashboard de la plataforma de IA GravityClaw con métricas en tiempo real',
        tall: true,
        link: '/projects/gravityclaw-report.pdf',
        linkLabel: 'Ver Reporte',
      },
      {
        id: 2,
        categoryId: 'web-apps' as CategoryId,
        title: 'CRM Empresarial',
        category: 'Aplicaciones Web',
        description:
          'CRM full-stack con tablero Kanban, directorio de 98+ clientes y empresas, reportes de asignaciones por agente y automatización de correos con plantillas. Construido con Next.js, TypeScript y Supabase.',
        image: '/projects/crm.jpg',
        alt: 'Tablero Kanban del CRM empresarial con tarjetas de clientes',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Demostracion%20CRM%20Empresarial',
        linkLabel: 'Solicitar Demo',
      },
      {
        id: 3,
        categoryId: 'corporate-sites' as CategoryId,
        title: 'Dicoma S.A.',
        category: 'Sitios Corporativos',
        description:
          'Sitio web corporativo para empresa guatemalteca de ingeniería eléctrica y energía solar. Diseño oscuro con sistema de grilla de marca.',
        image: '/projects/dicoma.jpg',
        alt: 'Página de inicio del sitio corporativo de Dicoma S.A., empresa de ingeniería eléctrica',
        tall: false,
        link: '/projects/dicoma.pdf',
        linkLabel: 'Ver Presentación',
      },
      {
        id: 15,
        categoryId: 'health-wellness' as CategoryId,
        title: 'Clínica Psicológica Jardín Interior',
        category: 'Salud & Bienestar',
        description:
          'Sitio web para una clínica psicológica que atiende a niños, adolescentes, adultos y familias, en persona y en línea. Presenta sus servicios y lleva a agendar cita por WhatsApp.',
        image: '/projects/jardin-interior.jpg',
        alt: 'Sitio web de la Clínica Psicológica Jardín Interior con botón para agendar cita',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Proyecto%20Jardin%20Interior',
        linkLabel: 'Solicitar Demo',
      },
      {
        id: 5,
        categoryId: 'health-wellness' as CategoryId,
        title: 'Saludable – Nutricionista Meylin Sic',
        category: 'Salud & Bienestar',
        description:
          'Sitio web para nutricionista guatemalteca. Incluye servicios, precios, horarios, agendamiento de citas y branding completo. Diseño cálido y profesional enfocado en familias.',
        image: '/projects/saludable.jpg',
        alt: 'Sitio web de la nutricionista Meylin Sic con agendamiento de citas',
        tall: false,
        link: 'https://saludable-indol.vercel.app/',
        linkLabel: 'Ver Sitio',
      },
      {
        id: 6,
        categoryId: 'gastronomy' as CategoryId,
        title: "Jen's Desserts GT",
        category: 'Gastronomía',
        description:
          'Sitio web para repostería artesanal guatemalteca. Incluye catálogo de especialidades, sección de eventos, contacto por WhatsApp y diseño premium con identidad de marca propia.',
        image: '/projects/jens-desserts.jpg',
        alt: "Sitio web de la repostería artesanal Jen's Desserts GT con catálogo de postres",
        tall: false,
        link: 'https://jens-desserts.vercel.app/',
        linkLabel: 'Ver Sitio',
      },
      {
        id: 16,
        categoryId: 'retail' as CategoryId,
        title: 'Box Sunshine',
        category: 'Comercio & Catálogos',
        description:
          'Catálogo de regalos para una tienda de desayunos sorpresa, globos y flores, con páginas por categoría, modo oscuro y pedidos directos por WhatsApp.',
        image: '/projects/box-sunshine.jpg',
        alt: 'Catálogo web de Box Sunshine con globos, flores y regalos personalizados',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Proyecto%20Box%20Sunshine',
        linkLabel: 'Solicitar Demo',
      },
    ],
    cta: {
      eyebrow: 'Tu próxima decisión',
      title: '¿Quieres un resultado así para tu empresa?',
      description: 'Agenda un diagnóstico gratuito y te diremos exactamente qué paquete encaja con tu negocio.',
      button: 'Agendar diagnóstico gratuito',
    },
    footer: {
      tagline: 'Datos claros, automatización útil y acompañamiento humano para decisiones que sí mueven el negocio.',
      home: 'Inicio',
      portfolio: 'Portfolio',
      rights: `© ${new Date().getFullYear()} Sagepoint Analytics. Todos los derechos reservados.`,
    },
  },

  en: {
    meta: {
      title: 'Dashboard and Automation Projects | Sagepoint',
      description: 'Real dashboards, report automations and websites we have delivered, with screenshots and results. Projects in the United States and Guatemala.',
    },
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      contact: 'Book a free call',
    },
    hero: {
      eyebrow: 'Selected Work',
      title_lead: 'Our portfolio.',
      title_sub: 'Proof, not promises.',
      description: 'Dashboards, automated reports, apps and websites we have built for clients, plus one dashboard demo with sample data.',
      cta_project: 'Book a free call',
      cta_explore: 'Explore the archive ↓',
    },
    aside: {
      archive_label: 'Active Archive',
      status_online: 'Online',
      projects_label: 'Projects',
      sectors_label: 'Sectors',
      tagline: 'Actionable systems, visible evidence, and human-in-the-loop decisions.',
    },
    evidence: [
      { value: 'Python + Playwright', label: 'Portal automation with MFA handling, persistent sessions & screenshots.' },
      { value: '11,327', label: 'Call units reconciled between Zendesk Explore and REST API.' },
      { value: '33,370', label: 'Rows consolidated in executive BPO operational reporting.' },
      { value: 'Slack + Sheets', label: 'Alerts, logging, and audit trails for critical operational workflows.' },
    ],
    filterHeader: {
      eyebrow: 'Work Index',
      title: 'Explore by specialty.',
      showing: 'Showing',
      of: 'of',
      projectsSuffix: 'projects',
    },
    categories: {
      all: 'All',
      'ai-automation': 'AI & Automation',
      'operations-bi': 'Operations & BI',
      'web-apps': 'Web Applications',
      'corporate-sites': 'Corporate Sites',
      'health-wellness': 'Health & Wellness',
      gastronomy: 'Food & Hospitality',
      retail: 'Retail & Catalogs',
    } as Record<CategoryId, string>,
    projects: [
      {
        id: 8,
        categoryId: 'operations-bi' as CategoryId,
        title: 'Zendesk Talk API Reporting',
        category: 'Operations & BI',
        description:
          'Google Apps Script & Sheets automated pipeline connected to Zendesk Talk REST API, eliminating manual CSV exports and reconciling 11,327 call records against Explore.',
        image: '/projects/zendesk-talk-reporting.jpg',
        alt: 'Operational reporting connected to Zendesk Talk API in Google Sheets',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Zendesk%20Talk%20API%20Reporting%20Case%20Study',
        linkLabel: 'Request Case Study',
      },
      {
        id: 9,
        categoryId: 'operations-bi' as CategoryId,
        title: 'BPO Production Reporting',
        category: 'Operations & BI',
        description:
          'Stabilization and overhaul of an executive master workbook with 33,370 rows, 20 months, 79 production weeks, and 14 PM systems with synchronized weekly management KPI charts.',
        image: '/projects/bpo-production-reporting.jpg',
        alt: 'Executive BPO production workbook with weekly metrics and synchronized charts',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=BPO%20Production%20Reporting%20Case%20Study',
        linkLabel: 'Request Case Study',
      },
      {
        id: 11,
        categoryId: 'operations-bi' as CategoryId,
        title: 'Demo: Dealer Group Cockpit',
        category: 'Operations & BI',
        description:
          'Demo built on sample data: an executive Power BI dashboard for a 12-dealership network: sales vs. targets, gross margin by region, EV/hybrid powertrain mix, and aging inventory tracking with star-schema DAX models.',
        image: '/projects/apex-auto.jpg',
        alt: 'Executive dashboard demo with sample data: sales, margins, powertrain mix, and dealership inventory',
        tall: false,
        link: '/projects/apex-auto-dashboard.html',
        linkLabel: 'View Dashboard',
      },
      {
        id: 12,
        categoryId: 'retail' as CategoryId,
        title: 'JKS Office Furniture',
        category: 'Retail & Catalogs',
        description:
          'Online catalog for a Guatemalan office furniture maker: 70 products in 12 categories, a quote cart that sends the whole order through WhatsApp, search-ready product pages and an admin panel where the client publishes their own products.',
        image: '/projects/jks-mobiliario.jpg',
        alt: 'JKS office furniture website with product catalog and WhatsApp quote button',
        tall: false,
        link: 'https://www.muebles-jks.com/',
        linkLabel: 'Visit Site',
      },
      {
        id: 4,
        categoryId: 'web-apps' as CategoryId,
        title: 'In Motion Dance Academy',
        category: 'Web Applications',
        description:
          'Several projects for one dance academy: a class video catalog connected to Google Sheets and Google Drive, a management app prototype (students, payments, QR attendance and a parent portal), the Festival In Motion landing page and a plan picker.',
        image: '/projects/inmotion-academia.jpg',
        alt: 'Admin dashboard of the In Motion Dance Academy app with demo data',
        tall: false,
        link: 'https://inmotion-tan.vercel.app/',
        linkLabel: 'Visit Site',
      },
      {
        id: 13,
        categoryId: 'corporate-sites' as CategoryId,
        title: 'GPPX, S.A.',
        category: 'Corporate Sites',
        description:
          'Corporate website for a Guatemalan architecture, parametric planning and engineering firm, with a custom intro animation, services and a project portfolio.',
        image: '/projects/gppx.jpg',
        alt: 'Homepage of the GPPX architecture and parametric engineering firm website',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=GPPX%20Project',
        linkLabel: 'Request Demo',
      },
      {
        id: 14,
        categoryId: 'corporate-sites' as CategoryId,
        title: 'Plomeros Rapi2',
        category: 'Corporate Sites',
        description:
          'Full redesign for a 24-hour plumbing and electrical company: 206 pages rebuilt in the new design without losing the ones already ranking on Google, call and WhatsApp buttons always in view, and an electrical emergency section.',
        image: '/projects/plomeros-rapi2.jpg',
        alt: 'Plomeros Rapi2 website with water heater, plumbing and 24-hour electrical services',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Plomeros%20Rapi2%20Project',
        linkLabel: 'Request Demo',
      },
      {
        id: 1,
        categoryId: 'ai-automation' as CategoryId,
        title: 'GravityClaw',
        category: 'AI & Automation',
        description:
          'AI operational platform featuring Telegram bot integration, automated social publishing across Meta APIs, dynamic PDF quote generation, and a real-time Next.js command dashboard.',
        image: '/projects/gravityclaw.jpg',
        alt: 'GravityClaw AI platform dashboard with real-time analytics and controls',
        tall: true,
        link: '/projects/gravityclaw-report.pdf',
        linkLabel: 'View Executive Report',
      },
      {
        id: 2,
        categoryId: 'web-apps' as CategoryId,
        title: 'Enterprise CRM Platform',
        category: 'Web Applications',
        description:
          'Full-stack custom CRM with Kanban pipeline, directory of 98+ corporate accounts, agent assignment analytics, and automated templated email dispatch. Built with Next.js, TypeScript & Supabase.',
        image: '/projects/crm.jpg',
        alt: 'Enterprise CRM Kanban board with client deal cards',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Enterprise%20CRM%20Demo%20Request',
        linkLabel: 'Request Demo',
      },
      {
        id: 3,
        categoryId: 'corporate-sites' as CategoryId,
        title: 'Dicoma S.A.',
        category: 'Corporate Sites',
        description:
          'Corporate web platform for a Guatemalan electrical engineering and solar energy leader. Modern dark aesthetic with custom brand grid system and lead generation funnel.',
        image: '/projects/dicoma.jpg',
        alt: 'Homepage of Dicoma S.A. corporate website, electrical engineering firm',
        tall: false,
        link: '/projects/dicoma.pdf',
        linkLabel: 'View Overview',
      },
      {
        id: 15,
        categoryId: 'health-wellness' as CategoryId,
        title: 'Jardín Interior Psychology Clinic',
        category: 'Health & Wellness',
        description:
          'Website for a psychology clinic serving children, teens, adults and families, in person and online. It presents their services and leads to booking an appointment on WhatsApp.',
        image: '/projects/jardin-interior.jpg',
        alt: 'Jardín Interior psychology clinic website with appointment booking button',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Jardin%20Interior%20Project',
        linkLabel: 'Request Demo',
      },
      {
        id: 5,
        categoryId: 'health-wellness' as CategoryId,
        title: 'Saludable – Nutrition Clinic',
        category: 'Health & Wellness',
        description:
          'Clinical website and booking platform for a clinical nutritionist in Guatemala. Includes service tier breakdowns, appointment scheduling, and patient-first branding.',
        image: '/projects/saludable.jpg',
        alt: 'Nutrition clinic website with online appointment scheduling',
        tall: false,
        link: 'https://saludable-indol.vercel.app/',
        linkLabel: 'Visit Site',
      },
      {
        id: 6,
        categoryId: 'gastronomy' as CategoryId,
        title: "Jen's Desserts GT",
        category: 'Food & Hospitality',
        description:
          'E-commerce showcase for a premium artisanal bakery in Guatemala. Features specialty item catalogs, catering/events module, direct WhatsApp checkout, and custom brand identity.',
        image: '/projects/jens-desserts.jpg',
        alt: "Artisanal bakery website for Jen's Desserts GT with pastry catalog",
        tall: false,
        link: 'https://jens-desserts.vercel.app/',
        linkLabel: 'Visit Site',
      },
      {
        id: 16,
        categoryId: 'retail' as CategoryId,
        title: 'Box Sunshine',
        category: 'Retail & Catalogs',
        description:
          'Gift catalog for a surprise breakfast, balloon and flower shop, with category pages, dark mode and direct orders on WhatsApp.',
        image: '/projects/box-sunshine.jpg',
        alt: 'Box Sunshine web catalog with balloons, flowers and custom gifts',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=Box%20Sunshine%20Project',
        linkLabel: 'Request Demo',
      },
    ],
    cta: {
      eyebrow: 'Your Next Strategic Move',
      title: 'Want measurable results like these for your business?',
      description: 'On a free 30 to 45 minute call we look at your numbers and tell you which package fits, with the price in writing.',
      button: 'Book a free call',
    },
    footer: {
      tagline: 'Clear data, high-impact automation, and human expertise for decisions that drive real revenue.',
      home: 'Home',
      portfolio: 'Portfolio',
      rights: `© ${new Date().getFullYear()} Sagepoint Analytics. All rights reserved.`,
    },
  },
};

export default function PortfolioPage() {
  const location = useLocation();
  const lang: 'es' | 'en' = getLangFromPath(location.pathname);
  const t = portfolioContent[lang];
  const [activeFilterId, setActiveFilterId] = useState<CategoryId>('all');

  useDocumentMeta(
    t.meta.title,
    t.meta.description,
    localizedPath('/portfolio/', lang),
    pairedAlternates('/portfolio/')
  );

  useEffect(() => {
    trackPageView(localizedPath('/portfolio/', lang), t.meta.title, lang);
  }, [lang, t.meta.title]);

  const projects = t.projects;
  // Only offer filters that have at least one project, in the order the projects appear.
  const categoryKeys: CategoryId[] = ['all', ...Array.from(new Set(projects.map((project) => project.categoryId)))];
  const filteredProjects = activeFilterId === 'all' ? projects : projects.filter((project) => project.categoryId === activeFilterId);
  const sectorCount = categoryKeys.length - 1;
  const external = (link: string) => !link.startsWith('mailto:') && !link.startsWith('/');

  return (
    <>
      <ServicesLayout lang={lang} source="portfolio" switchPath="/portfolio/">
        <div className="pf">
          <header className="wrap service-hero">
            <nav className="service-breadcrumb" aria-label={lang === 'es' ? 'Ruta de navegación' : 'Breadcrumb'}>
              <Link to={localizedPath('/', lang)}>{t.nav.home}</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">{t.nav.portfolio}</span>
            </nav>
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>
              {t.hero.title_lead} <span className="pf-accent">{t.hero.title_sub}</span>
            </h1>
            <p className="service-lede">{t.hero.description}</p>
            <ServiceActions lang={lang} source="portfolio_hero" />
            <dl className="pf-stats">
              <div>
                <dt>{t.aside.projects_label}</dt>
                <dd>{projects.length}</dd>
              </div>
              <div>
                <dt>{t.aside.sectors_label}</dt>
                <dd>{sectorCount}</dd>
              </div>
            </dl>
          </header>

          <section id="project-grid" className="wrap service-section">
            <p className="eyebrow">{t.filterHeader.eyebrow}</p>
            <h2>{t.filterHeader.title}</h2>
            <div className="pf-filters" role="group" aria-label={lang === 'es' ? 'Filtrar proyectos por sector' : 'Filter projects by sector'}>
              {categoryKeys.map((catKey) => (
                <button key={catKey} type="button" className="pf-chip" onClick={() => setActiveFilterId(catKey)} aria-pressed={activeFilterId === catKey}>
                  {t.categories[catKey]}
                </button>
              ))}
            </div>
            <p className="pf-count" aria-live="polite">
              {t.filterHeader.showing} <b>{filteredProjects.length}</b> {t.filterHeader.of} {projects.length} {t.filterHeader.projectsSuffix}
            </p>
            <div className="pf-grid">
              {filteredProjects.map((project, index) => (
                <article className="pf-card" key={project.id}>
                  <div className="pf-shot">
                    <img src={project.image} alt={project.alt} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
                    <span className="pf-cat">{project.category}</span>
                  </div>
                  <div className="pf-body">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <a
                      className="service-text-link"
                      href={project.link}
                      target={external(project.link) ? '_blank' : undefined}
                      rel={external(project.link) ? 'noopener noreferrer' : undefined}
                    >
                      {project.linkLabel} →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="wrap service-section" aria-label={lang === 'es' ? 'Evidencia operativa' : 'Operational evidence'}>
            <ul className="pf-evidence">
              {t.evidence.map((metric) => (
                <li key={metric.value}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="wrap service-section service-close">
            <p className="eyebrow">{t.cta.eyebrow}</p>
            <h2>{t.cta.title}</h2>
            <p>{t.cta.description}</p>
            <ServiceActions lang={lang} source="portfolio_close" />
          </section>
        </div>
      </ServicesLayout>
      <WhatsAppButton lang={lang} />
    </>
  );
}
