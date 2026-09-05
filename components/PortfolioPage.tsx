import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, BarChart3, Mail } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { trackPageView } from '../utils/analytics';

export type CategoryId = 'all' | 'ai-automation' | 'operations-bi' | 'web-apps' | 'corporate-sites' | 'health-wellness' | 'gastronomy';

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
      title: 'Portfolio — Sagepoint Analytics | Proyectos de BI, IA y Desarrollo Web',
      description: 'Proyectos reales de Sagepoint Analytics: IA aplicada, automatización operativa, dashboards, CRMs, APIs y reportes ejecutivos para empresas en Guatemala y EE. UU.',
    },
    nav: {
      home: 'Inicio',
      portfolio: 'Portfolio',
      contact: 'Contáctanos',
    },
    hero: {
      eyebrow: 'Casos seleccionados',
      title_lead: 'Nuestro portfolio.',
      title_sub: 'Prueba, no promesas.',
      description: 'Una selección de automatizaciones con IA, integraciones API, dashboards y soluciones basadas en datos para operaciones reales.',
      cta_project: 'Iniciar un proyecto',
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
    } as Record<CategoryId, string>,
    projects: [
      {
        id: 7,
        categoryId: 'ai-automation' as CategoryId,
        title: 'Automatización de Portal Administrativo (Salud)',
        category: 'IA & Automatización',
        description:
          'Automatización operativa con Python y Playwright para búsquedas de integraciones API, enlaces de credenciales, capturas, exportación JSON y salida opcional a Google Sheets con manejo de MFA y sesiones persistentes.',
        image: '/projects/gravityclaw.jpg',
        alt: 'Automatización de portal administrativo con flujos de datos, sesiones persistentes y exportación estructurada',
        tall: true,
        link: 'mailto:info@sagepoint-analytics.com?subject=Automatizacion%20Portal%20Administrativo%20Salud',
        linkLabel: 'Solicitar Caso',
      },
      {
        id: 8,
        categoryId: 'operations-bi' as CategoryId,
        title: 'Zendesk Talk API Reporting',
        category: 'Operaciones & BI',
        description:
          'Flujo de Google Apps Script y Google Sheets conectado a Zendesk Talk para reemplazar exportaciones manuales, refrescar reportes por rango de fechas y validar la API como fuente de verdad frente a Explore.',
        image: '/projects/crm.jpg',
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
        image: '/projects/inmotion.jpg',
        alt: 'Workbook ejecutivo de producción BPO con métricas semanales y gráficos sincronizados',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=BPO%20Production%20Reporting',
        linkLabel: 'Solicitar Caso',
      },
      {
        id: 10,
        categoryId: 'ai-automation' as CategoryId,
        title: 'ECW Alert Automation',
        category: 'IA & Automatización',
        description:
          'Workflow en progreso que conecta alertas de Slack, lookup de credenciales en el portal del cliente, logging en Google Sheets y rotación asistida con Playwright para reducir trabajo manual en alertas críticas.',
        image: '/projects/gravityclaw.jpg',
        alt: 'Workflow de alertas con Slack, Google Sheets y automatización asistida por navegador',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=ECW%20Alert%20Automation',
        linkLabel: 'Solicitar Caso',
      },
      {
        id: 11,
        categoryId: 'operations-bi' as CategoryId,
        title: 'Apex Auto Group | Executive Dashboard',
        category: 'Operaciones & BI',
        description:
          'Dashboard ejecutivo en Power BI para una red de 12 concesionarios en EE. UU.: ventas vs. meta, utilidad bruta por región, mezcla de vehículos eléctricos/híbridos e inventario envejecido, con modelo estelar y medidas DAX documentadas.',
        image: '/projects/apex-auto.jpg',
        alt: 'Dashboard ejecutivo de Apex Auto Group con ventas, utilidad, mezcla de powertrain e inventario por concesionario',
        tall: false,
        link: '/projects/apex-auto-dashboard.html',
        linkLabel: 'Ver Dashboard',
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
        id: 5,
        categoryId: 'health-wellness' as CategoryId,
        title: 'Saludable – Nutricionista Maylin Sic',
        category: 'Salud & Bienestar',
        description:
          'Sitio web para nutricionista guatemalteca. Incluye servicios, precios, horarios, agendamiento de citas y branding completo. Diseño cálido y profesional enfocado en familias.',
        image: '/projects/saludable.jpg',
        alt: 'Sitio web de la nutricionista Maylin Sic con agendamiento de citas',
        tall: false,
        link: 'https://saludable-indol.vercel.app/',
        linkLabel: 'Ver Sitio',
      },
      {
        id: 4,
        categoryId: 'web-apps' as CategoryId,
        title: 'InMotion Dance Academy',
        category: 'Aplicaciones Web',
        description:
          'Catálogo interactivo de videos de clases de salsa con panel de administración, integrado con Google Sheets y Google Drive para gestión de contenido.',
        image: '/projects/inmotion.jpg',
        alt: 'Catálogo de videos de clases de salsa de InMotion Dance Academy',
        tall: false,
        link: 'https://inmotion-tan.vercel.app/',
        linkLabel: 'Ver Sitio',
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
      title: 'Portfolio — Sagepoint Analytics | BI, AI & Web Development Projects',
      description: 'Real projects by Sagepoint Analytics: applied AI, operational automation, dashboards, CRMs, APIs, and executive reporting for SMEs in Guatemala & the US.',
    },
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      contact: 'Contact Us',
    },
    hero: {
      eyebrow: 'Selected Work',
      title_lead: 'Our portfolio.',
      title_sub: 'Proof, not promises.',
      description: 'A curated selection of AI automations, API integrations, dashboards, and data-driven solutions for real-world operations.',
      cta_project: 'Start a Project',
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
    } as Record<CategoryId, string>,
    projects: [
      {
        id: 7,
        categoryId: 'ai-automation' as CategoryId,
        title: 'Automatización de Portal Administrativo (Salud)',
        category: 'AI & Automation',
        description:
          'Operational automation using Python and Playwright for API integration lookups, credential link validation, automated screenshots, JSON exports, and Google Sheets sync with MFA session handling.',
        image: '/projects/gravityclaw.jpg',
        alt: 'Admin portal automation with data flows, persistent sessions, and structured export',
        tall: true,
        link: 'mailto:info@sagepoint-analytics.com?subject=Medical%20Billing%20Portal%20Automation%20Case%20Study',
        linkLabel: 'Request Case Study',
      },
      {
        id: 8,
        categoryId: 'operations-bi' as CategoryId,
        title: 'Zendesk Talk API Reporting',
        category: 'Operations & BI',
        description:
          'Google Apps Script & Sheets automated pipeline connected to Zendesk Talk REST API, eliminating manual CSV exports and reconciling 11,327 call records against Explore.',
        image: '/projects/crm.jpg',
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
        image: '/projects/inmotion.jpg',
        alt: 'Executive BPO production workbook with weekly metrics and synchronized charts',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=BPO%20Production%20Reporting%20Case%20Study',
        linkLabel: 'Request Case Study',
      },
      {
        id: 10,
        categoryId: 'ai-automation' as CategoryId,
        title: 'ECW Alert Automation',
        category: 'AI & Automation',
        description:
          'Workflow connecting Slack alerts, client portal credential lookups, Google Sheets audit logging, and Playwright-assisted rotation to eliminate manual intervention in critical billing alerts.',
        image: '/projects/gravityclaw.jpg',
        alt: 'Alert workflow with Slack, Google Sheets, and browser-assisted automation',
        tall: false,
        link: 'mailto:info@sagepoint-analytics.com?subject=ECW%20Alert%20Automation%20Case%20Study',
        linkLabel: 'Request Case Study',
      },
      {
        id: 11,
        categoryId: 'operations-bi' as CategoryId,
        title: 'Apex Auto Group | Executive Dashboard',
        category: 'Operations & BI',
        description:
          'Executive Power BI dashboard for a 12-dealership network in the US: sales vs. targets, gross margin by region, EV/hybrid powertrain mix, and aging inventory tracking with star-schema DAX models.',
        image: '/projects/apex-auto.jpg',
        alt: 'Apex Auto Group executive dashboard with sales, margins, powertrain mix, and dealership inventory',
        tall: false,
        link: '/projects/apex-auto-dashboard.html',
        linkLabel: 'View Dashboard',
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
        id: 4,
        categoryId: 'web-apps' as CategoryId,
        title: 'InMotion Dance Academy',
        category: 'Web Applications',
        description:
          'Interactive video lesson academy platform with admin CMS portal, connected directly to Google Drive & Sheets API for effortless content management.',
        image: '/projects/inmotion.jpg',
        alt: 'Salsa lesson video catalog for InMotion Dance Academy',
        tall: false,
        link: 'https://inmotion-tan.vercel.app/',
        linkLabel: 'Visit Site',
      },
    ],
    cta: {
      eyebrow: 'Your Next Strategic Move',
      title: 'Want measurable results like these for your business?',
      description: "Book a free 30-minute diagnostic session and we'll outline the exact high-ROI package for your business.",
      button: 'Book Free Diagnostic Call',
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
  const [searchParams, setSearchParams] = useSearchParams();
  const lang: 'es' | 'en' = searchParams.get('lang') === 'en' ? 'en' : 'es';
  const t = portfolioContent[lang];

  useDocumentMeta(
    t.meta.title,
    t.meta.description,
    lang === 'en' ? '/portfolio/?lang=en' : '/portfolio/'
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    trackPageView(lang === 'en' ? '/portfolio/?lang=en' : '/portfolio/', t.meta.title, lang);
  }, [lang, t.meta.title]);

  const switchLang = (next: 'es' | 'en') => {
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
        <PortfolioSection lang={lang} />
      </main>
      <Footer lang={lang} />
      <WhatsAppButton lang={lang} />
    </div>
  );
}

function Navbar({ lang, onSwitchLang }: { lang: 'es' | 'en'; onSwitchLang: (next: 'es' | 'en') => void }) {
  const t = portfolioContent[lang];
  const homeLink = lang === 'en' ? '/?lang=en' : '/';
  const portfolioLink = lang === 'en' ? '/portfolio/?lang=en' : '/portfolio/';
  const contactLink = lang === 'en' ? '/?lang=en#contact' : '/#contact';

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
        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] p-1 md:flex" aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}>
          <Link to={homeLink} className="rounded-full px-5 py-2 text-sm font-medium text-muted transition-colors hover:text-ink">{t.nav.home}</Link>
          <Link to={portfolioLink} aria-current="page" className="rounded-full bg-sage/10 px-5 py-2 text-sm font-semibold text-sage">{t.nav.portfolio}</Link>
        </nav>
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
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

          <Link
            to={contactLink}
            className="flex items-center gap-2 rounded-full border border-sage/30 bg-sage/10 px-4 py-2.5 text-sm font-semibold text-sage transition-all duration-300 hover:-translate-y-0.5 hover:border-sage/60 hover:bg-sage hover:text-dark sm:px-5"
          >
            <Mail size={16} />
            <span className="hidden sm:inline">{t.nav.contact}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function PortfolioSection({ lang }: { lang: 'es' | 'en' }) {
  const [activeFilterId, setActiveFilterId] = useState<CategoryId>('all');
  const shouldReduceMotion = useReducedMotion();
  const t = portfolioContent[lang];

  const categoryKeys: CategoryId[] = [
    'all',
    'ai-automation',
    'operations-bi',
    'web-apps',
    'corporate-sites',
    'health-wellness',
    'gastronomy',
  ];

  const projects = t.projects;
  const filteredProjects =
    activeFilterId === 'all'
      ? projects
      : projects.filter((p) => p.categoryId === activeFilterId);

  const sectorCount = new Set(projects.map((project) => project.categoryId)).size;
  const contactLink = lang === 'en' ? '/?lang=en#contact' : '/#contact';

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <motion.section
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-14 border-b border-white/10 pb-16 pt-10 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-20 lg:pt-16"
      >
        <div className="lg:col-span-8">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-2 w-2 rounded-full bg-sage shadow-[0_0_18px_rgba(123,214,180,0.8)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-sage">{t.hero.eyebrow}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-sage/30 to-transparent" />
          </div>
          <h1 className="max-w-5xl font-serif text-5xl font-bold leading-[0.94] tracking-[-0.04em] text-ink sm:text-7xl lg:text-[6.6rem]">
            {t.hero.title_lead}
            <span className="mt-2 block font-normal italic text-sage">{t.hero.title_sub}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {t.hero.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to={contactLink}
              className="group inline-flex items-center gap-3 rounded-full bg-deep-sage px-6 py-3.5 text-sm font-bold text-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(47,176,148,0.28)]"
            >
              {t.hero.cta_project}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a href="#project-grid" className="px-2 py-3 text-sm font-semibold text-muted transition-colors hover:text-ink">
              {t.hero.cta_explore}
            </a>
          </div>
        </div>

        <aside className="border-l border-white/10 pl-6 sm:pl-8 lg:col-span-4 lg:mb-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">{t.aside.archive_label}</span>
            <span className="flex items-center gap-2 text-xs font-semibold text-sage">
              <span className={`h-1.5 w-1.5 rounded-full bg-sage ${shouldReduceMotion ? '' : 'animate-pulse'}`} />
              {t.aside.status_online}
            </span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10 py-7">
            <div className="pr-5">
              <span className="block font-serif text-4xl font-bold text-ink">{String(projects.length).padStart(2, '0')}</span>
              <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-muted">{t.aside.projects_label}</span>
            </div>
            <div className="pl-6">
              <span className="block font-serif text-4xl font-bold text-ink">{String(sectorCount).padStart(2, '0')}</span>
              <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-muted">{t.aside.sectors_label}</span>
            </div>
          </div>
          <p className="pt-6 font-serif text-xl leading-snug text-ink">
            {t.aside.tagline}
          </p>
        </aside>
      </motion.section>

      <motion.section
        aria-label={lang === 'es' ? 'Evidencia operativa' : 'Operational evidence'}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.65, delay: 0.08 }}
        className="grid border-b border-white/10 sm:grid-cols-2 xl:grid-cols-4"
      >
        {t.evidence.map((metric, index) => (
          <div
            key={metric.value}
            className="relative border-t border-white/10 px-0 py-7 sm:px-6 sm:first:pl-0 xl:border-l xl:border-t-0 xl:first:border-l-0 xl:first:pl-0"
          >
            <span className="mb-8 block text-[9px] font-bold tracking-[0.24em] text-muted/60">0{index + 1}</span>
            <div className="font-serif text-2xl font-bold leading-tight text-sage">{metric.value}</div>
            <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-muted">{metric.label}</p>
          </div>
        ))}
      </motion.section>

      <motion.section
        id="project-grid"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.65, delay: 0.12 }}
        className="scroll-mt-28 pt-20"
      >
        <div className="flex flex-col gap-7 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-sage">{t.filterHeader.eyebrow}</span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">{t.filterHeader.title}</h2>
          </div>
          <p className="text-sm text-muted">
            {t.filterHeader.showing} <span className="font-bold text-ink">{filteredProjects.length}</span> {t.filterHeader.of} {projects.length} {t.filterHeader.projectsSuffix}
          </p>
        </div>

        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-3 pt-7 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label={lang === 'es' ? 'Filtrar proyectos por sector' : 'Filter projects by sector'}>
          {categoryKeys.map((catKey) => {
            const filterLabel = t.categories[catKey];
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setActiveFilterId(catKey)}
                aria-pressed={activeFilterId === catKey}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 sm:px-5 cursor-pointer ${
                  activeFilterId === catKey
                    ? 'border-sage bg-sage text-dark shadow-[0_8px_24px_rgba(123,214,180,0.18)]'
                    : 'border-white/10 bg-white/[0.025] text-muted hover:border-white/20 hover:text-ink'
                }`}
              >
                {filterLabel}
              </button>
            );
          })}
        </div>

        <motion.div layout className="mt-8 columns-1 gap-6 md:columns-2 xl:columns-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
            <motion.article
              layout="position"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.48, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
              key={project.id}
              className="group relative mb-6 inline-block w-full break-inside-avoid overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1517] align-top shadow-[0_22px_60px_rgba(2,8,9,0.24)] transition-all duration-500 hover:-translate-y-1 hover:border-sage/35 hover:shadow-[0_28px_75px_rgba(2,8,9,0.45)]"
            >
              <div
                className={`relative overflow-hidden ${
                  project.tall && activeFilterId === 'all'
                    ? 'h-[25rem] sm:h-[30rem]'
                    : 'h-64 sm:h-72'
                }`}
              >
                <img
                  src={project.image}
                  alt={project.alt}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="absolute inset-0 h-full w-full object-cover object-top saturate-[0.88] transition-all duration-700 group-hover:scale-[1.045] group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071012]/80 via-transparent to-[#071012]/20" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                  <span className="rounded-full border border-white/15 bg-[#071012]/70 px-3 py-1.5 text-[9px] font-bold tracking-[0.22em] text-ink backdrop-blur-md">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="max-w-[70%] rounded-full border border-white/15 bg-[#071012]/70 px-3 py-1.5 text-right text-[9px] font-bold uppercase tracking-[0.14em] text-sage backdrop-blur-md">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 bg-[#0b1517] p-6 sm:p-7">
                <h3 className="font-serif text-2xl font-bold leading-tight text-ink transition-colors duration-300 group-hover:text-sage sm:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted/60">{lang === 'es' ? 'Caso' : 'Case'} / {String(project.id).padStart(2, '0')}</span>
                  <a
                    href={project.link}
                    target={project.link.startsWith('mailto:') ? undefined : '_blank'}
                    rel={project.link.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="inline-flex items-center gap-2 text-sm font-bold text-sage transition-colors hover:text-copper"
                  >
                    {project.linkLabel}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      <motion.section
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.65, delay: 0.18 }}
        className="relative mt-24 overflow-hidden rounded-[32px] bg-sage p-8 text-dark sm:p-12 lg:p-14"
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(7,16,18,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(7,16,18,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-dark/60">{t.cta.eyebrow}</span>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {t.cta.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark/70">
              {t.cta.description}
            </p>
          </div>
          <Link
            to={contactLink}
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#071012] px-7 py-4 text-sm font-bold text-ink shadow-[0_18px_40px_rgba(7,16,18,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d1b1c]"
          >
            {t.cta.button}
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

function Footer({ lang }: { lang: 'es' | 'en' }) {
  const t = portfolioContent[lang];
  const homeLink = lang === 'en' ? '/?lang=en' : '/';
  const portfolioLink = lang === 'en' ? '/portfolio/?lang=en' : '/portfolio/';

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
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {t.footer.tagline}
          </p>
        </div>
        <nav className="flex gap-6 text-sm font-semibold" aria-label={lang === 'es' ? 'Navegación del pie de página' : 'Footer navigation'}>
          <Link to={homeLink} className="text-muted transition-colors hover:text-sage">{t.footer.home}</Link>
          <Link to={portfolioLink} className="text-sage">{t.footer.portfolio}</Link>
        </nav>
        <a href="mailto:info@sagepoint-analytics.com" className="text-sm font-semibold text-muted transition-colors hover:text-sage">
          info@sagepoint-analytics.com
        </a>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs font-mono text-muted/60">
        {t.footer.rights}
      </div>
    </footer>
  );
}
