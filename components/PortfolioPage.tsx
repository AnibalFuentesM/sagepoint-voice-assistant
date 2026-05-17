import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BarChart2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tall: boolean;
  link: string;
  linkLabel: string;
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-6">
        <PortfolioSection />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-secondary">
            <BarChart2 size={20} strokeWidth={3} />
          </div>
          Sagepoint Analytics
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link to="/portfolio" className="text-sm font-medium text-primary transition-colors">Portfolio</Link>
          <Link to="/" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Inicio</Link>
        </nav>
        <a
          href="mailto:info@sagepoint-analytics.com"
          className="px-5 py-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-secondary transition-all font-medium text-sm flex items-center gap-2"
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

  const filters = ['Todos', 'IA & Automatización', 'Aplicaciones Web', 'Sitios Corporativos', 'Salud & Bienestar', 'Gastronomía'];

  const projects: Project[] = [
    {
      id: 1,
      title: 'GravityClaw',
      category: 'IA & Automatización',
      description:
        'Plataforma de IA con bot de Telegram, publicación automática en Facebook e Instagram, generación de cotizaciones en PDF y dashboard de control en tiempo real con Next.js.',
      image: '/projects/gravityclaw.jpg',
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
      tall: false,
      link: 'https://inmotion-tan.vercel.app/',
      linkLabel: 'Ver Sitio',
    },
  ];

  const filteredProjects =
    activeFilter === 'Todos'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Nuestro Portfolio
        </h1>
        <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
          Una selección de intervenciones estratégicas y soluciones basadas en datos en diversos sectores industriales.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-center gap-4 mb-12"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-text-muted mr-2">
          Filtrar por sector:
        </span>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-surface-light text-text-main border border-white/5 hover:bg-surface hover:border-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              key={project.id}
              className={`group flex flex-col bg-surface rounded-2xl overflow-hidden border border-white/5 hover:border-primary/30 transition-colors duration-300 ${
                project.tall && activeFilter === 'Todos' ? 'lg:row-span-2' : ''
              }`}
            >
              <div
                className={`relative overflow-hidden ${
                  project.tall && activeFilter === 'Todos'
                    ? 'flex-grow min-h-[300px] lg:min-h-[500px]'
                    : 'h-64'
                }`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="p-8 flex flex-col flex-grow bg-surface relative z-10">
                <span className="text-tertiary text-xs font-bold uppercase tracking-widest mb-3 block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:text-tertiary transition-colors mt-auto w-fit"
                >
                  {project.linkLabel}{' '}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-display font-bold text-white text-lg">Sagepoint Analytics.</div>
<div className="text-xs text-text-muted font-mono">
          © {new Date().getFullYear()} Sagepoint Analytics. Data-Driven Excellence.
        </div>
      </div>
    </footer>
  );
}
