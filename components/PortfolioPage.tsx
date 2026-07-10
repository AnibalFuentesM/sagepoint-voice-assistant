import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, BarChart3, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { trackPageView } from '../utils/analytics';

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  tall: boolean;
  link: string;
  linkLabel: string;
};

export default function PortfolioPage() {
  useDocumentMeta(
    'Portfolio — Sagepoint Analytics | Proyectos de BI, IA y Desarrollo Web',
    'Proyectos reales de Sagepoint Analytics: IA aplicada, automatización operativa, dashboards, CRMs, APIs y reportes ejecutivos para empresas en Guatemala y EE. UU.',
    '/portfolio/'
  );

  useEffect(() => {
    trackPageView('/portfolio', 'Portfolio — Sagepoint Analytics');
  }, []);

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden bg-[#071012] font-sans text-slate-300 selection:bg-sage/30 selection:text-sage">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-64 -top-64 h-[42rem] w-[42rem] rounded-full bg-sage/10 blur-[120px]" />
        <div className="absolute -bottom-80 -left-72 h-[44rem] w-[44rem] rounded-full bg-copper/5 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,247,246,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,246,0.025)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>
      <Navbar />
      <main className="relative z-10 flex-grow pt-28 pb-24">
        <PortfolioSection />
      </main>
      <Footer />
      <WhatsAppButton lang="es" />
    </div>
  );
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071012]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3 text-ink">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#0d1b1c] shadow-[0_10px_30px_rgba(2,8,9,0.35)]">
            <BarChart3 size={20} className="text-sage transition-transform duration-300 group-hover:scale-110" strokeWidth={2.4} />
          </span>
          <span className="leading-none">
            <span className="block font-serif text-lg font-bold tracking-tight">Sagepoint</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.28em] text-muted">Analytics</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] p-1 md:flex" aria-label="Navegación principal">
          <Link to="/" className="rounded-full px-5 py-2 text-sm font-medium text-muted transition-colors hover:text-ink">Inicio</Link>
          <Link to="/portfolio/" aria-current="page" className="rounded-full bg-sage/10 px-5 py-2 text-sm font-semibold text-sage">Portfolio</Link>
        </nav>
        <a
          href="mailto:info@sagepoint-analytics.com"
          className="flex items-center gap-2 rounded-full border border-sage/30 bg-sage/10 px-4 py-2.5 text-sm font-semibold text-sage transition-all duration-300 hover:-translate-y-0.5 hover:border-sage/60 hover:bg-sage hover:text-dark sm:px-5"
        >
          <Mail size={16} />
          <span className="hidden sm:inline">Contáctanos</span>
        </a>
      </div>
    </header>
  );
}

function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const shouldReduceMotion = useReducedMotion();

  const filters = ['Todos', 'IA & Automatización', 'Operaciones & BI', 'Aplicaciones Web', 'Sitios Corporativos', 'Salud & Bienestar', 'Gastronomía'];

  const projects: Project[] = [
    {
      id: 7,
      title: 'InboxHealth Admin Portal Automation',
      category: 'IA & Automatización',
      description:
        'Automatización operativa con Python y Playwright para búsquedas de integraciones API, enlaces de credenciales, capturas, exportación JSON y salida opcional a Google Sheets con manejo de MFA y sesiones persistentes.',
      image: '/projects/gravityclaw.jpg',
      alt: 'Automatización de portal administrativo con flujos de datos, sesiones persistentes y exportación estructurada',
      tall: true,
      link: 'mailto:info@sagepoint-analytics.com?subject=InboxHealth%20Admin%20Portal%20Automation',
      linkLabel: 'Solicitar Caso',
    },
    {
      id: 8,
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
      title: 'IBH BPO Production Reporting',
      category: 'Operaciones & BI',
      description:
        'Actualización y estabilización de un workbook ejecutivo con 33,370 filas, 20 meses, 79 semanas de producción, 14 PM systems y sincronización de tablas y gráficos semanales para revisión gerencial.',
      image: '/projects/inmotion.jpg',
      alt: 'Workbook ejecutivo de producción BPO con métricas semanales y gráficos sincronizados',
      tall: false,
      link: 'mailto:info@sagepoint-analytics.com?subject=IBH%20BPO%20Production%20Reporting',
      linkLabel: 'Solicitar Caso',
    },
    {
      id: 10,
      title: 'ECW Alert Automation',
      category: 'IA & Automatización',
      description:
        'Workflow en progreso que conecta alertas de Slack, lookup de credenciales en Inbox Health, logging en Google Sheets y rotación asistida con Playwright para reducir trabajo manual en alertas críticas.',
      image: '/projects/gravityclaw.jpg',
      alt: 'Workflow de alertas con Slack, Google Sheets y automatización asistida por navegador',
      tall: false,
      link: 'mailto:info@sagepoint-analytics.com?subject=ECW%20Alert%20Automation',
      linkLabel: 'Solicitar Caso',
    },
    {
      id: 1,
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
      title: 'CRM Empresarial',
      category: 'Aplicaciones Web',
      description:
        'CRM full-stack con tablero Kanban, directorio de 98+ clientes y empresas, reportes de asignaciones por agente y automatización de correos con plantillas. Construido con Next.js, TypeScript y Supabase.',
      image: '/projects/crm.jpg',
      alt: 'Tablero Kanban del CRM empresarial con tarjetas de clientes',
      tall: false,
      link: 'mailto:info@sagepoint-analytics.com',
      linkLabel: 'Solicitar Demo',
    },
    {
      id: 3,
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
  ];

  const filteredProjects =
    activeFilter === 'Todos'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const evidence = [
    { value: 'Python + Playwright', label: 'Automatización de portales con MFA, sesiones y capturas.' },
    { value: '11,327', label: 'Call units reconciliadas entre Zendesk Explore y API.' },
    { value: '33,370', label: 'Filas consolidadas en reporting operativo BPO.' },
    { value: 'Slack + Sheets', label: 'Alertas, logging y seguimiento para workflows operativos.' },
  ];

  const sectorCount = new Set(projects.map((project) => project.category)).size;

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
            <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-sage">Casos seleccionados</span>
            <span className="h-px flex-1 bg-gradient-to-r from-sage/30 to-transparent" />
          </div>
          <h1 className="max-w-5xl font-serif text-5xl font-bold leading-[0.94] tracking-[-0.04em] text-ink sm:text-7xl lg:text-[6.6rem]">
            Nuestro portfolio.
            <span className="mt-2 block font-normal italic text-sage">Prueba, no promesas.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Una selección de automatizaciones con IA, integraciones API, dashboards y soluciones basadas en datos para operaciones reales.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-deep-sage px-6 py-3.5 text-sm font-bold text-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(47,176,148,0.28)]"
            >
              Iniciar un proyecto
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a href="#project-grid" className="px-2 py-3 text-sm font-semibold text-muted transition-colors hover:text-ink">
              Explorar el archivo ↓
            </a>
          </div>
        </div>

        <aside className="border-l border-white/10 pl-6 sm:pl-8 lg:col-span-4 lg:mb-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">Archivo activo</span>
            <span className="flex items-center gap-2 text-xs font-semibold text-sage">
              <span className={`h-1.5 w-1.5 rounded-full bg-sage ${shouldReduceMotion ? '' : 'animate-pulse'}`} />
              En línea
            </span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10 py-7">
            <div className="pr-5">
              <span className="block font-serif text-4xl font-bold text-ink">{String(projects.length).padStart(2, '0')}</span>
              <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-muted">Proyectos</span>
            </div>
            <div className="pl-6">
              <span className="block font-serif text-4xl font-bold text-ink">{String(sectorCount).padStart(2, '0')}</span>
              <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-muted">Áreas</span>
            </div>
          </div>
          <p className="pt-6 font-serif text-xl leading-snug text-ink">
            Sistemas útiles, evidencia visible y decisiones con contexto humano.
          </p>
        </aside>
      </motion.section>

      <motion.section
        aria-label="Evidencia operativa"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.65, delay: 0.08 }}
        className="grid border-b border-white/10 sm:grid-cols-2 xl:grid-cols-4"
      >
        {evidence.map((metric, index) => (
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
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-sage">Índice de trabajo</span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">Explora por especialidad.</h2>
          </div>
          <p className="text-sm text-muted">
            Mostrando <span className="font-bold text-ink">{filteredProjects.length}</span> de {projects.length} proyectos
          </p>
        </div>

        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-3 pt-7 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Filtrar proyectos por sector">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 sm:px-5 ${
                activeFilter === filter
                  ? 'border-sage bg-sage text-dark shadow-[0_8px_24px_rgba(123,214,180,0.18)]'
                  : 'border-white/10 bg-white/[0.025] text-muted hover:border-white/20 hover:text-ink'
              }`}
            >
              {filter}
            </button>
          ))}
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
                  project.tall && activeFilter === 'Todos'
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
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted/60">Caso / {String(project.id).padStart(2, '0')}</span>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
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
            <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-dark/60">Tu próxima decisión</span>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              ¿Quieres un resultado así para tu empresa?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark/70">
              Agenda un diagnóstico gratuito y te diremos exactamente qué paquete encaja con tu negocio.
            </p>
          </div>
          <Link
            to="/#contact"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#071012] px-7 py-4 text-sm font-bold text-ink shadow-[0_18px_40px_rgba(7,16,18,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0d1b1c]"
          >
            Agendar diagnóstico gratuito
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050b0d] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto_auto] md:items-end md:gap-16">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0d1b1c] text-sage">
              <BarChart3 size={18} />
            </span>
            <span className="font-serif text-xl font-bold">Sagepoint Analytics.</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Datos claros, automatización útil y acompañamiento humano para decisiones que sí mueven el negocio.
          </p>
        </div>
        <nav className="flex gap-6 text-sm font-semibold" aria-label="Navegación del pie de página">
          <Link to="/" className="text-muted transition-colors hover:text-sage">Inicio</Link>
          <Link to="/portfolio/" className="text-sage">Portfolio</Link>
        </nav>
        <a href="mailto:info@sagepoint-analytics.com" className="text-sm font-semibold text-muted transition-colors hover:text-sage">
          info@sagepoint-analytics.com
        </a>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs font-mono text-muted/60">
        © {new Date().getFullYear()} Sagepoint Analytics. Data-Driven Excellence.
      </div>
    </footer>
  );
}
