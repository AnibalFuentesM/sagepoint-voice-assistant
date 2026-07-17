import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Check,
  Clock3,
  DatabaseZap,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  MoveRight,
  Network,
  Sparkles,
  TableProperties,
  UsersRound,
  Workflow,
} from 'lucide-react';
import HeroScene from './components/HeroScene';
import SocialConnectButtons from './components/SocialConnectButtons';
import WhatsAppButton from './components/WhatsAppButton';
import { submitToGoogleSheet } from './utils/sheetUtils';
import { getLeadAttribution, trackEvent, trackPageView } from './utils/analytics';
import { useDocumentMeta } from './hooks/useDocumentMeta';

// Stable package IDs: used by the form, GA4 events and the Google Sheet.
// Never compare against visible (translated) labels.
export type PackageId = 'quick-win' | 'executive' | 'custom' | 'retainer' | 'general';

// Content Dictionary for Translations
const content = {
  es: {
    meta: {
      title: 'Dashboards e Inteligencia de Negocios para PYMEs en Guatemala | Sagepoint Analytics',
      description: 'Dashboards ejecutivos, automatización de reportes y diagnóstico gratuito para PYMEs en Guatemala y EE. UU. Paquetes con entregable, plazo y precio claros.'
    },
    nav: {
      services: "Servicios",
      benefits: "Beneficios",
      packages: "Paquetes",
      faq: "FAQ",
      schedule: "Agendar diagnóstico",
      schedule_short: "Agendar"
    },
    hero: {
      subtitle: "INTELIGENCIA DE NEGOCIOS PARA EMPRESAS",
      title: "Convierte tus datos en decisiones que venden.",
      description: "Proyectos de inteligencia de negocios con entregable, plazo y precio claros: dashboards interactivos, automatización de reportes y modelos predictivos. Resultados visibles desde la segunda semana.",
      cta_consult: "Agenda tu diagnóstico gratuito",
      cta_services: "Ver paquetes",
      metrics: {
        savings: "ahorro en tiempo de reportes",
        sales: "aumento promedio en ventas",
        visibility: "visibilidad total del negocio"
      },
      dashboard: {
        title: "Actividad en Tiempo Real (IA)",
        updated: "Actualizado",
        stock: "Stock bajo: Producto A (Reordenar)",
        goal: "Meta de ventas semanal alcanzada"
      }
    },
    services: {
      subtitle: "NUESTROS SERVICIOS",
      title: "¿Cómo puede la Inteligencia de Negocios reducir mis costos operativos?",
      description: "Automatizamos tareas críticas y detectamos ineficiencias con reducción comprobable en tiempos de operación. Actuamos como un departamento de datos externo (Soporte Cercano) para empresas en Guatemala y EE. UU.",
      items: [
        { title: "Dashboard & BI", desc: "Visualización en tiempo real de métricas y KPIs. Detecta de inmediato patrones clave con alertas como 'Stock bajo: Producto A (Reordenar)'.", tag: "Control Total" },
        { title: "Automatización Web", desc: "Conectamos tus sistemas (CRM, ERP, facturación) para que la información fluya sola entre plataformas, sin copiar y pegar entre archivos.", tag: "Eficiencia" },
        { title: "Automatización en Excel", desc: "Guía de experto para reducir el tiempo de creación de reportes recurrentes en un 80% utilizando Power Query y VBA.", tag: "Productividad" },
        { title: "Modelos Predictivos", desc: "Casos de éxito: detección anticipada de riesgos y un aumento promedio del 20% en ventas utilizando IA.", tag: "Ventaja Competitiva" },
        { title: "Data Coaching", desc: "Acompañamiento especializado 'Human-in-the-Loop': validamos cada paso de tus datos y capacitamos a tu equipo, en Guatemala y EE. UU.", tag: "Soporte Cercano" }
      ]
    },
    benefits: {
      subtitle: "¿POR QUÉ ELEGIRNOS?",
      title: "¿Por qué el componente humano (Soporte Cercano) supera al software automatizado?",
      description: "La IA por sí sola puede alucinar o carecer de contexto local; nuestros consultores validan cada recomendación con criterio humano ('Human-in-the-Loop'). Reducimos el riesgo tecnológico actuando como estrategas que entienden tu industria, no solo como integradores.",
      list: [
        { bold: "Soporte Cercano comprobado:", text: "Acompañamiento localizado para Guatemala y Estados Unidos." },
        { bold: "Validación humana de IA:", text: "Toda métrica y predicción es validada por un consultor estratégico." },
        { bold: "Alcance y precio claros:", text: "Cada paquete define entregables, plazos y límites por escrito antes de empezar." }
      ],
      cards: [
        { title: "Decisiones Validadas por Expertos", desc: "Cada recomendación analítica es revisada por un consultor para evitar errores u omisiones de algoritmos ciegos." },
        { title: "80% de Ahorro en Reportes", desc: "Automatizamos la generación manual con Power Query y VBA, liberando horas de tu equipo para enfocarse en crecer." },
        { title: "Tu Departamento de Datos Externo", desc: "Nos integramos a tu operación como tus analistas de negocio de confianza, no como un proveedor de software distante." }
      ]
    },
    packages: {
      subtitle: "PAQUETES Y PRECIOS",
      title: "Proyectos con entregable, plazo y precio claros.",
      description: "Sin suscripciones abiertas ni alcances difusos: cada paquete define exactamente qué recibes, cuándo y por cuánto.",
      timeline_label: "Plazo",
      excludes_label: "No incluye",
      cards: [
        {
          id: 'quick-win' as PackageId,
          title: "Diagnóstico Express + Dashboard Quick-Win",
          price: "$750",
          period: "pago único",
          timeline: "2 semanas",
          desc: "La forma más rápida de ver tus datos trabajando: auditoría + un dashboard accionable.",
          features: ["Auditoría de hasta 2 fuentes de datos", "1 dashboard con hasta 8 KPIs clave", "Informe de oportunidades priorizadas", "1 ronda de revisiones"],
          excludes: "Automatización, integraciones y modelos predictivos.",
          cta: "Empezar con el diagnóstico"
        },
        {
          id: 'executive' as PackageId,
          title: "Dashboard Ejecutivo + Automatización",
          pricePrefix: "desde",
          price: "$2,500",
          period: "por proyecto",
          timeline: "4–6 semanas",
          desc: "La suite completa: visibilidad total del negocio y reportes que se generan solos.",
          tag: "Más Popular",
          features: ["Hasta 4 fuentes de datos integradas", "Hasta 3 dashboards ejecutivos", "Automatización de 1 flujo de reportes (−80% de tiempo)", "2 sesiones de capacitación + documentación", "2 rondas de revisiones"],
          excludes: "Data warehouse y modelos IA a medida.",
          cta: "Cotizar mi proyecto"
        },
        {
          id: 'custom' as PackageId,
          title: "Solución a Medida",
          price: "Cotización",
          period: "",
          timeline: "a definir",
          desc: "Modelos IA, integraciones CRM/ERP y data warehouse para necesidades corporativas.",
          features: ["Modelos predictivos dedicados", "Integraciones CRM/ERP", "Data warehouse propio", "Alcance definido en cotización formal"],
          excludes: "",
          cta: "Hablar con un consultor"
        }
      ],
      retainer: {
        id: 'retainer' as PackageId,
        tag: "Add-on mensual",
        title: "Soporte Cercano Mensual",
        price: "$300 / $600 / $1,000",
        period: "/ mes",
        desc: "Continuidad después de tu proyecto: mantenimiento de dashboards, ajustes, coaching y línea directa de WhatsApp prioritaria. Tiers según intensidad de soporte, con horas mensuales definidas y no acumulables.",
        cta: "Agregar Soporte Cercano"
      },
      footer_text: "¿No sabes qué paquete te conviene?",
      footer_link: "El diagnóstico inicial es gratuito — agéndalo aquí."
    },
    cases: {
      subtitle: "CASOS SELECCIONADOS",
      title: "Resultados observados en proyectos reales.",
      description: "Una muestra de nuestro trabajo. Explora el portfolio completo para ver más.",
      items: [
        { title: "InboxHealth Automation", category: "IA & Automatización", desc: "Automatización con Python y Playwright para portal administrativo, lookup de integraciones API, capturas, JSON y exportación a Google Sheets." },
        { title: "Zendesk Talk API Reporting", category: "Operaciones & BI", desc: "Google Apps Script y Sheets conectados a Zendesk Talk para reemplazar exportaciones manuales y validar la API como fuente de verdad." },
        { title: "GravityClaw", category: "IA & Automatización", desc: "Plataforma de IA con bot de Telegram, publicación automática en redes y dashboard de control en tiempo real." }
      ],
      cta: "Ver portfolio completo"
    },
    faq: {
      subtitle: "PREGUNTAS FRECUENTES",
      title: "Lo que las empresas nos preguntan antes de empezar.",
      items: [
        { q: "¿Qué incluye el diagnóstico gratuito?", a: "Una videollamada de 30–45 minutos donde revisamos tus fuentes de datos, tus reportes actuales y tus objetivos. Sales con una recomendación concreta del paquete que te conviene (o con la conclusión honesta de que aún no lo necesitas)." },
        { q: "¿En cuánto tiempo veo resultados?", a: "El paquete Quick-Win entrega un dashboard funcionando en 2 semanas. El Dashboard Ejecutivo + Automatización toma de 4 a 6 semanas según las fuentes de datos." },
        { q: "¿Qué pasa cuando termina el proyecto?", a: "El entregable es tuyo: dashboards, automatizaciones y documentación. Si quieres continuidad, el add-on de Soporte Cercano Mensual cubre mantenimiento, ajustes y coaching." },
        { q: "¿Con qué herramientas trabajan?", a: "Power BI, Looker Studio, Excel (Power Query/VBA), Google Sheets y desarrollos a medida en la nube. Nos adaptamos a las herramientas que tu equipo ya usa." },
        { q: "¿Trabajan fuera de Guatemala?", a: "Sí. Atendemos empresas en Guatemala, Centroamérica, México y Estados Unidos, en español o inglés, de forma remota." },
        { q: "¿Necesito tener mis datos ordenados antes de empezar?", a: "No. Parte del diagnóstico es precisamente evaluar el estado de tus datos. Trabajamos con lo que tengas: Excel dispersos, sistemas contables, CRM o bases de datos." }
      ]
    },
    contact: {
      subtitle: "CONTACTO",
      title: "¿Listo para impulsar tu empresa con el poder de tus datos?",
      description: "Agenda hoy tu diagnóstico gratuito. Te respondemos en menos de 24 horas con una recomendación concreta.",
      phone: "+502 4046 4716",
      email: "info@sagepoint-analytics.com",
      form: {
        name: "Nombre",
        name_ph: "Tu nombre",
        email: "Correo de trabajo",
        email_ph: "tu@empresa.com",
        phone: "WhatsApp (Opcional)",
        phone_ph: "+502 5555 5555",
        industry: "Industria (Opcional)",
        industry_ph: "Selecciona tu industria",
        industry_options: {
          retail: "Comercio / Retail",
          services: "Servicios",
          manufacturing: "Manufactura",
          tech: "Tecnología",
          logistics: "Logística",
          other: "Otro"
        },
        country: "País (Opcional)",
        country_ph: "Selecciona tu país",
        country_options: {
          gt: "Guatemala",
          sv: "El Salvador",
          hn: "Honduras",
          ni: "Nicaragua",
          cr: "Costa Rica",
          pa: "Panamá",
          mx: "México",
          us: "Estados Unidos",
          other: "Otro"
        },
        service: "Me interesa:",
        options: {
          general: "Diagnóstico gratuito / Consultoría general",
          'quick-win': "Diagnóstico Express + Dashboard Quick-Win ($750)",
          executive: "Dashboard Ejecutivo + Automatización (desde $2,500)",
          custom: "Solución a Medida (cotización)",
          retainer: "Soporte Cercano Mensual ($300 / $600 / $1,000/mes)"
        } as Record<PackageId, string>,
        details: "Cuéntanos más detalles",
        details_ph: "Describe tus necesidades específicas (volumen de datos, herramientas actuales, objetivos...)",
        submit: "Agendar mi Diagnóstico Gratuito",
        sending: "Enviando...",
        success: "¡Solicitud enviada!",
        success_body: "Te responderemos en menos de 24 horas con una recomendación concreta. Si prefieres hablar ya, escríbenos por WhatsApp.",
        success_wa: "Continuar por WhatsApp",
        success_again: "Enviar otra solicitud",
        note: "Responderemos en menos de 24 horas.",
        error: "Error de conexión. Inténtalo de nuevo o escríbenos por WhatsApp."
      }
    },
    footer: {
      tagline: "Convertimos datos en crecimiento para empresas modernas.",
      menu: "Menú",
      legal: "Legal",
      contact: "Contacto",
      rights: `© ${new Date().getFullYear()} Sagepoint Analytics. Todos los derechos reservados.`
    }
  },
  en: {
    meta: {
      title: 'Business Intelligence Dashboards for SMEs in Guatemala & the US | Sagepoint Analytics',
      description: 'Executive dashboards, report automation and a free assessment for SMEs in Guatemala and the US. Fixed-scope packages with clear deliverables and pricing.'
    },
    nav: {
      services: "Services",
      benefits: "Benefits",
      packages: "Packages",
      faq: "FAQ",
      schedule: "Book assessment",
      schedule_short: "Book a call"
    },
    hero: {
      subtitle: "BUSINESS INTELLIGENCE FOR COMPANIES",
      title: "Turn your data into decisions that sell.",
      description: "Business intelligence projects with a clear deliverable, timeline and price: interactive dashboards, report automation and predictive models. Visible results from week two.",
      cta_consult: "Book your free assessment",
      cta_services: "View packages",
      metrics: {
        savings: "savings in reporting time",
        sales: "average increase in sales",
        visibility: "total business visibility"
      },
      dashboard: {
        title: "Global Data Analysis (AI)",
        updated: "Updated",
        stock: "Low Stock: Product A (Reorder)",
        goal: "Weekly sales goal reached"
      }
    },
    services: {
      subtitle: "OUR SERVICES",
      title: "How can Business Intelligence reduce my operational costs?",
      description: "We automate critical tasks and reveal hidden savings with measurable reductions in operating time. We act as an external data department (Soporte Cercano) for companies in Guatemala and the US.",
      items: [
        { title: "Dashboard & BI", desc: "Real-time visibility into sales and KPIs. Instantly react to alerts like 'Low Stock: Product A (Reorder)'.", tag: "Total Control" },
        { title: "Web Automation", desc: "We connect your systems (CRM, ERP, billing) so information flows between platforms automatically — no more copy-paste.", tag: "Efficiency" },
        { title: "Excel Automation", desc: "A practitioner's guide to reducing manual reporting time by 80% using Power Query and VBA.", tag: "Productivity" },
        { title: "Predictive Models", desc: "Case study data: anticipate risks and drive an average 20% increase in sales through predictive forecasting.", tag: "Competitive Advantage" },
        { title: "Data Coaching", desc: "Expert Human-in-the-Loop accompaniment. We validate every data step for teams in the US and Guatemala.", tag: "Close Support" }
      ]
    },
    benefits: {
      subtitle: "WHY CHOOSE US?",
      title: "Why does practitioner-led Data Coaching outperform standard AI tools?",
      description: "While AI alone can hallucinate or lack context, our Human-in-the-Loop approach roots every recommendation in verifiable truth. We act as strategists who understand your industry, not just integrators.",
      list: [
        { bold: "Soporte Cercano (Close Support):", text: "Localized, responsive strategic direction for the US and Guatemala." },
        { bold: "Verified Human Logic:", text: "Every model output is validated by a Senior Data Consultant." },
        { bold: "Clear scope and pricing:", text: "Every package defines deliverables, timelines and limits in writing before we start." }
      ],
      cards: [
        { title: "Expert-Validated Decisions", desc: "Empower your team with curated facts instead of unchecked AI predictions, maintaining high data trust." },
        { title: "80% Reporting Time Saved", desc: "We deploy Power Query and VBA to eliminate repetitive spreadsheet work, freeing your team's hours for growth." },
        { title: "Your External Data Department", desc: "We integrate directly, acting as your seasoned BI extension rather than a distant software vendor." }
      ]
    },
    packages: {
      subtitle: "PACKAGES AND PRICING",
      title: "Projects with a clear deliverable, timeline and price.",
      description: "No open-ended subscriptions, no fuzzy scope: every package defines exactly what you get, when, and for how much.",
      timeline_label: "Timeline",
      excludes_label: "Not included",
      cards: [
        {
          id: 'quick-win' as PackageId,
          title: "Express Assessment + Quick-Win Dashboard",
          price: "$750",
          period: "one-time",
          timeline: "2 weeks",
          desc: "The fastest way to see your data working: an audit plus one actionable dashboard.",
          features: ["Audit of up to 2 data sources", "1 dashboard with up to 8 key KPIs", "Prioritized opportunity report", "1 revision round"],
          excludes: "Automation, integrations and predictive models.",
          cta: "Start with the assessment"
        },
        {
          id: 'executive' as PackageId,
          title: "Executive Dashboard + Automation",
          pricePrefix: "from",
          price: "$2,500",
          period: "per project",
          timeline: "4–6 weeks",
          desc: "The full suite: total business visibility and reports that build themselves.",
          tag: "Most Popular",
          features: ["Up to 4 integrated data sources", "Up to 3 executive dashboards", "1 automated reporting flow (−80% time)", "2 training sessions + documentation", "2 revision rounds"],
          excludes: "Data warehouse and custom AI models.",
          cta: "Quote my project"
        },
        {
          id: 'custom' as PackageId,
          title: "Custom Solution",
          price: "Custom quote",
          period: "",
          timeline: "to be defined",
          desc: "AI models, CRM/ERP integrations and data warehouses for corporate needs.",
          features: ["Dedicated predictive models", "CRM/ERP integrations", "Own data warehouse", "Scope defined in a formal quote"],
          excludes: "",
          cta: "Talk to a consultant"
        }
      ],
      retainer: {
        id: 'retainer' as PackageId,
        tag: "Monthly add-on",
        title: "Soporte Cercano Monthly",
        price: "$300 / $600 / $1,000",
        period: "/ month",
        desc: "Continuity after your project: dashboard maintenance, adjustments, coaching and a priority WhatsApp line. Tiers depend on support intensity, with fixed monthly hours that do not roll over.",
        cta: "Add Close Support"
      },
      footer_text: "Not sure which package fits you?",
      footer_link: "The initial assessment is free — book it here."
    },
    cases: {
      subtitle: "SELECTED WORK",
      title: "Observed results from real projects.",
      description: "A sample of our work. Explore the full portfolio to see more.",
      items: [
        { title: "InboxHealth Automation", category: "AI & Automation", desc: "Python and Playwright automation for admin portal workflows, API integration lookup, screenshots, JSON output and Google Sheets export." },
        { title: "Zendesk Talk API Reporting", category: "Operations & BI", desc: "Google Apps Script and Sheets connected to Zendesk Talk to replace manual exports and validate the API as the reporting source of truth." },
        { title: "GravityClaw", category: "AI & Automation", desc: "AI platform with a Telegram bot, automated social publishing and a real-time control dashboard." }
      ],
      cta: "View full portfolio"
    },
    faq: {
      subtitle: "FREQUENTLY ASKED QUESTIONS",
      title: "What companies ask us before getting started.",
      items: [
        { q: "What does the free assessment include?", a: "A 30–45 minute video call where we review your data sources, current reports and goals. You leave with a concrete recommendation of the right package (or the honest conclusion that you don't need one yet)." },
        { q: "How fast will I see results?", a: "The Quick-Win package delivers a working dashboard in 2 weeks. The Executive Dashboard + Automation takes 4 to 6 weeks depending on your data sources." },
        { q: "What happens when the project ends?", a: "The deliverable is yours: dashboards, automations and documentation. If you want continuity, the Soporte Cercano monthly add-on covers maintenance, adjustments and coaching." },
        { q: "Which tools do you work with?", a: "Power BI, Looker Studio, Excel (Power Query/VBA), Google Sheets and custom cloud builds. We adapt to the tools your team already uses." },
        { q: "Do you work outside Guatemala?", a: "Yes. We serve companies in Guatemala, Central America, Mexico and the United States, in Spanish or English, fully remote." },
        { q: "Do I need clean data before starting?", a: "No. Assessing the state of your data is exactly what the diagnosis is for. We work with whatever you have: scattered Excel files, accounting systems, CRMs or databases." }
      ]
    },
    contact: {
      subtitle: "CONTACT",
      title: "Ready to boost your company with the power of your data?",
      description: "Book your free assessment today. We reply within 24 hours with a concrete recommendation.",
      phone: "+502 4046 4716",
      email: "info@sagepoint-analytics.com",
      form: {
        name: "Name",
        name_ph: "Your name",
        email: "Work Email",
        email_ph: "you@company.com",
        phone: "WhatsApp (Optional)",
        phone_ph: "+1 555 123 4567",
        industry: "Industry (Optional)",
        industry_ph: "Select your industry",
        industry_options: {
          retail: "Retail",
          services: "Services",
          manufacturing: "Manufacturing",
          tech: "Technology",
          logistics: "Logistics",
          other: "Other"
        },
        country: "Country (Optional)",
        country_ph: "Select your country",
        country_options: {
          gt: "Guatemala",
          sv: "El Salvador",
          hn: "Honduras",
          ni: "Nicaragua",
          cr: "Costa Rica",
          pa: "Panama",
          mx: "Mexico",
          us: "United States",
          other: "Other"
        },
        service: "I'm interested in:",
        options: {
          general: "Free assessment / General consulting",
          'quick-win': "Express Assessment + Quick-Win Dashboard ($750)",
          executive: "Executive Dashboard + Automation (from $2,500)",
          custom: "Custom Solution (quote)",
          retainer: "Soporte Cercano Monthly ($300 / $600 / $1,000/mo)"
        } as Record<PackageId, string>,
        details: "Tell us more details",
        details_ph: "Describe your specific needs (data volume, current tools, goals...)",
        submit: "Book my Free Assessment",
        sending: "Sending...",
        success: "Request sent!",
        success_body: "We'll reply within 24 hours with a concrete recommendation. Prefer to talk now? Message us on WhatsApp.",
        success_wa: "Continue on WhatsApp",
        success_again: "Send another request",
        note: "We will respond in less than 24 hours.",
        error: "Connection error. Try again or message us on WhatsApp."
      }
    },
    footer: {
      tagline: "We convert data into growth for modern companies.",
      menu: "Menu",
      legal: "Legal",
      contact: "Contact",
      rights: `© ${new Date().getFullYear()} Sagepoint Analytics. All rights reserved.`
    }
  }
};

const FORM_OPTION_IDS: PackageId[] = ['general', 'quick-win', 'executive', 'custom', 'retainer'];

const SERVICE_ICONS = [BarChart3, Workflow, TableProperties, BrainCircuit, UsersRound];

// Decorative stack ticker shown under the proof rail. Not translated on purpose: tool names are proper nouns.
const STACK_TICKER = ['Power BI', 'Looker Studio', 'Excel · Power Query', 'VBA', 'Python', 'Google Sheets', 'Apps Script', 'SQL', 'CRM / ERP APIs', 'Playwright'];

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animated counter for stat values like "80%" or "11,327"; renders the final value for reduced motion.
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/[\d,]+/);
    if (!el || !match || match[0].length === 0 || prefersReducedMotion()) return;

    const target = parseInt(match[0].replace(/,/g, ''), 10);
    const start = value.slice(0, match.index);
    const end = value.slice((match.index ?? 0) + match[0].length);
    const useGrouping = match[0].includes(',');
    let raf = 0;

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 1600);
        const eased = 1 - Math.pow(1 - p, 4);
        const current = Math.round(target * eased);
        el.textContent = start + (useGrouping ? current.toLocaleString('en-US') : String(current)) + end;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref} className="tabular-nums">{value}</span>;
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [selectedService, setSelectedService] = useState<PackageId>('general');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Language state, initialized from the URL (?lang=en) so hreflang alternates are truthful.
  const [searchParams, setSearchParams] = useSearchParams();
  const [lang, setLang] = useState<'es' | 'en'>(searchParams.get('lang') === 'en' ? 'en' : 'es');
  const t = content[lang];
  const heroTitle = lang === 'es'
    ? { lead: 'Convierte tus datos en', emphasis: 'decisiones que venden.' }
    : { lead: 'Turn your data into', emphasis: 'decisions that sell.' };
  const proofRail = lang === 'es'
    ? [
        { value: 'GT + US', label: 'Operación bilingüe', icon: Globe2 },
        { value: '2 semanas', label: 'Primer Quick-Win', icon: Clock3 },
        { value: '<24 horas', label: 'Tiempo de respuesta', icon: MessageCircle },
      ]
    : [
        { value: 'GT + US', label: 'Bilingual delivery', icon: Globe2 },
        { value: '2 weeks', label: 'First Quick-Win', icon: Clock3 },
        { value: '<24 hours', label: 'Response time', icon: MessageCircle },
      ];

  // Pre-filled WhatsApp messages per package: the lowest-friction channel for GT/CA leads.
  const waMessages: Record<PackageId, string> = lang === 'es'
    ? {
        general: 'Hola, quiero agendar el diagnóstico gratuito de Sagepoint Analytics.',
        'quick-win': 'Hola, me interesa el Diagnóstico Express + Dashboard Quick-Win ($750). ¿Podemos agendar el diagnóstico gratuito?',
        executive: 'Hola, me interesa el Dashboard Ejecutivo + Automatización. Quisiera cotizar mi proyecto.',
        custom: 'Hola, necesito una solución a medida (modelos predictivos / integraciones / data warehouse). ¿Podemos hablar?',
        retainer: 'Hola, me interesa el Soporte Cercano Mensual para mantenimiento y coaching.',
      }
    : {
        general: 'Hi, I would like to book the free assessment with Sagepoint Analytics.',
        'quick-win': 'Hi, I am interested in the Express Assessment + Quick-Win Dashboard ($750). Can we book the free assessment?',
        executive: 'Hi, I am interested in the Executive Dashboard + Automation package. I would like a quote for my project.',
        custom: 'Hi, I need a custom solution (predictive models / integrations / data warehouse). Can we talk?',
        retainer: 'Hi, I am interested in the Soporte Cercano monthly support add-on.',
      };
  const waLink = (id: PackageId) => `https://wa.me/50240464716?text=${encodeURIComponent(waMessages[id])}`;

  useDocumentMeta(t.meta.title, t.meta.description, lang === 'en' ? '/?lang=en' : '/');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    trackPageView(lang === 'en' ? '/?lang=en' : '/', t.meta.title);
  }, [lang, t.meta.title]);

  // Scroll to the section hash when arriving from another route (e.g. /portfolio → /#contact).
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, []);

  const switchLang = (next: 'es' | 'en') => {
    setLang(next);
    const params = new URLSearchParams(searchParams);
    if (next === 'en') {
      params.set('lang', 'en');
    } else {
      params.delete('lang');
    }
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-choreographed reveals: [data-reveal] elements animate in the first time they enter the viewport.
  // The reveal is marked with a data attribute (not a class): React rewrites className on re-render
  // (e.g. FAQ items toggling faq-item--open), which would silently strip an observer-added class.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.setAttribute('data-revealed', ''));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Cursor spotlight on .spot cards: track pointer position as CSS vars consumed by ::before.
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const handleMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest?.('.spot') as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    };
    document.addEventListener('pointermove', handleMove, { passive: true });
    return () => document.removeEventListener('pointermove', handleMove);
  }, []);

  // Ambient glow that trails the cursor (desktop pointers only).
  const glowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = glowRef.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion()) return;
    let raf = 0;
    let targetX = 0, targetY = 0, x = 0, y = 0;
    const step = () => {
      x += (targetX - x) * 0.09;
      y += (targetY - y) * 0.09;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.6 ? requestAnimationFrame(step) : 0;
    };
    const handleMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!el.classList.contains('cursor-glow--on')) {
        x = targetX;
        y = targetY;
        el.classList.add('cursor-glow--on');
      }
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Reading progress bar across the top of the page (updates outside React via rAF).
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty('transform', `scaleX(${max > 0 ? window.scrollY / max : 0})`);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      cancelAnimationFrame(raf);
    };
  }, []);

  const heroWords = [
    ...heroTitle.lead.split(' ').map((text) => ({ text, em: false })),
    ...heroTitle.emphasis.split(' ').map((text) => ({ text, em: true })),
  ];

  // Helper for smooth scrolling preventing default navigation
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Package CTA: preselect the package in the form and scroll to it.
  const handleSelectPackage = (e: React.MouseEvent<HTMLAnchorElement>, id: PackageId) => {
    e.preventDefault();
    setSelectedService(id);
    trackEvent('select_package', { package_id: id, language: lang });
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const packageId = (formData.get('service') as PackageId) || 'general';
    const industry = formData.get('industry') as string;
    const country = formData.get('country') as string;
    const details = formData.get('details') as string;

    // Validación manual estricta
    if (!name || name.trim().length < 2) {
      alert(lang === 'es' ? "Por favor ingresa un nombre válido." : "Please enter a valid name.");
      return;
    }

    // Regex simple pero efectivo para email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert(lang === 'es' ? "Por favor ingresa un correo electrónico válido." : "Please enter a valid email address.");
      return;
    }

    setFormState('sending');

    const serviceLabel = t.contact.form.options[packageId];
    let serviceValue = `${packageId} | ${serviceLabel}`;
    if (packageId === 'custom' && details) {
      serviceValue += ` | Detalles: ${details}`;
    }

    const data = {
      name: name,
      email: email,
      phone: phone?.trim() || 'No especificado',
      industry: industry || 'No especificado',
      country: country || 'No especificado',
      service: serviceValue,
      packageId: packageId,
      language: lang === 'es' ? 'Español' : 'English',
      type: 'Formulario Web',
      ...getLeadAttribution(),
    };

    const attribution = getLeadAttribution();
    trackEvent('lead_submit_attempt', {
      package_id: packageId,
      language: lang,
      campaign: attribution.utm_campaign,
      source: attribution.utm_source,
    });

    // Send to Google Sheet
    const result = await submitToGoogleSheet(data);

    if (result) {
      // Only count a confirmed server response as a real conversion;
      // the no-cors fallback cannot verify the row was written.
      if (result === 'confirmed') {
        trackEvent('generate_lead', {
          package_id: packageId,
          language: lang,
          campaign: attribution.utm_campaign,
          source: attribution.utm_source,
        });
      } else {
        trackEvent('lead_submit_attempt', { package_id: packageId, language: lang, delivery: 'unconfirmed' });
      }
      // Persistent success panel (fields unmount, so no manual reset needed).
      // Keeps selectedService so the WhatsApp follow-up references the right package.
      setFormState('success');
    } else {
      setFormState('error');
      setTimeout(() => setFormState('idle'), 4000);
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="site-shell font-sans text-slate-300 min-h-screen relative overflow-x-hidden selection:bg-sage/30 selection:text-sage">

      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />

      {/* Ambient data field */}
      <div className="site-ambient fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="site-ambient__orb site-ambient__orb--one" />
        <div className="site-ambient__orb site-ambient__orb--two" />
        <div className="site-ambient__grid" />
        <div className="site-ambient__noise" />
        <div ref={glowRef} className="cursor-glow" />
      </div>

      {/* Navigation */}
      <header className={`site-header sticky top-0 z-40 border-b transition-all duration-300 ${isScrolled ? 'site-header--scrolled py-3' : 'border-transparent py-5'}`}>
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 flex items-center justify-between">
          <a href="/" onClick={scrollToTop} className="brand-lockup group" aria-label="Sagepoint Analytics">
            <span className="brand-mark"><BarChart3 size={17} strokeWidth={2.2} /></span>
            <span className="font-serif text-[1.45rem] text-ink tracking-tight leading-none">Sagepoint</span>
            <span className="brand-subtitle">Analytics</span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-[0.78rem] font-semibold text-muted">
            <a href="#services" onClick={(e) => handleScrollToSection(e, 'services')} className="nav-link hover:text-sage transition-colors">{t.nav.services}</a>
            <a href="#why-us" onClick={(e) => handleScrollToSection(e, 'why-us')} className="nav-link hover:text-sage transition-colors">{t.nav.benefits}</a>
            <a href="#pricing" onClick={(e) => handleScrollToSection(e, 'pricing')} className="nav-link hover:text-sage transition-colors">{t.nav.packages}</a>
            <a href="#faq" onClick={(e) => handleScrollToSection(e, 'faq')} className="nav-link hover:text-sage transition-colors">{t.nav.faq}</a>
            <Link to="/portfolio/" className="nav-link hover:text-sage transition-colors">Portfolio</Link>

            {/* Language Toggles */}
            <div className="flex items-center gap-1 pl-4 border-l border-white/10">
              <button
                onClick={() => switchLang('es')}
                className={`language-chip ${lang === 'es' ? 'language-chip--active' : ''}`}
                title="Español"
                aria-label="Español"
              >
                ES
              </button>
              <button
                onClick={() => switchLang('en')}
                className={`language-chip ${lang === 'en' ? 'language-chip--active' : ''}`}
                title="English"
                aria-label="English"
              >
                EN
              </button>
            </div>

            <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} className="button button--nav">
              {t.nav.schedule}<ArrowUpRight size={14} />
            </a>
          </nav>

          {/* Mobile: language toggle + main CTA (section links live in the footer) */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => switchLang('es')}
              className={`language-chip ${lang === 'es' ? 'language-chip--active' : ''}`}
              title="Español"
              aria-label="Español"
            >
              ES
            </button>
            <button
              onClick={() => switchLang('en')}
              className={`language-chip mr-1 ${lang === 'en' ? 'language-chip--active' : ''}`}
              title="English"
              aria-label="English"
            >
              EN
            </button>
            <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} className="button button--nav px-3.5! whitespace-nowrap">
              {t.nav.schedule_short}
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* Hero Section */}
        <section className="hero-section px-5 md:px-8 max-w-[1240px] mx-auto">
          <div className="hero-copy animate-[floatIn_0.9s_ease-out]">
            <div className="eyebrow"><span className="eyebrow-dot" />{t.hero.subtitle}</div>
            <h1 key={lang} className="hero-title font-serif text-ink">
              {heroWords.map((word, i) => (
                <React.Fragment key={`${word.text}-${i}`}>
                  <span className="hero-word">
                    <span className="hero-word__inner" style={{ animationDelay: `${140 + i * 85}ms` }}>
                      {word.em ? <em>{word.text}</em> : word.text}
                    </span>
                  </span>
                  {i < heroWords.length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </h1>
            <p className="hero-description text-muted">
              {t.hero.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} className="button button--primary">
                {t.hero.cta_consult}<ArrowUpRight size={18} />
              </a>
              <a href="#pricing" onClick={(e) => handleScrollToSection(e, 'pricing')} className="button button--secondary">
                {t.hero.cta_services}<MoveRight size={17} />
              </a>
            </div>
            <SocialConnectButtons lang={lang} />

            {/* Metrics / Social Proof */}
            <div className="hero-metrics">
              {[
                { value: '80%', label: t.hero.metrics.savings },
                { value: '11,327', label: lang === 'es' ? 'registros reconciliados' : 'records reconciled' },
                { value: '33,370', label: lang === 'es' ? 'filas consolidadas' : 'rows consolidated' },
              ].map((metric) => (
                <div key={metric.value} className="hero-metric">
                  <CountUp value={metric.value} />
                  <p>{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <HeroScene texts={{
            title: t.hero.dashboard.title,
            updated: t.hero.dashboard.updated,
            stockAlert: t.hero.dashboard.stock,
            goalAlert: t.hero.dashboard.goal
          }} />
        </section>

        <section className="proof-rail max-w-[1240px] mx-auto px-5 md:px-8" aria-label={lang === 'es' ? 'Datos clave' : 'Key facts'}>
          <div className="proof-rail__inner" data-reveal>
            <div className="proof-rail__lead">
              <Sparkles size={16} />
              <span>{lang === 'es' ? 'De datos dispersos a claridad operativa.' : 'From scattered data to operational clarity.'}</span>
            </div>
            <div className="proof-rail__facts">
              {proofRail.map(({ value, label, icon: Icon }) => (
                <div key={value} className="proof-fact">
                  <Icon size={16} />
                  <div><strong>{value}</strong><span>{label}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stack ticker */}
        <div className="tool-marquee" aria-hidden="true">
          <div className="tool-marquee__track">
            {[0, 1].map((dup) => (
              <div key={dup} className="tool-marquee__group">
                {STACK_TICKER.map((tool) => (
                  <span key={tool}><i />{tool}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <section id="services" className="section-frame max-w-[1240px] mx-auto px-5 md:px-8 scroll-mt-20">
          <div className="section-heading section-heading--split" data-reveal>
            <div>
              <p className="eyebrow"><span>01</span>{t.services.subtitle}</p>
              <h2 className="section-title font-serif text-ink">{t.services.title}</h2>
            </div>
            <p className="section-description text-muted">
              {t.services.description}
            </p>
          </div>

          <div className="services-grid">
            {t.services.items.map((service, i) => {
              const Icon = SERVICE_ICONS[i];
              return (
                <article key={i} className={`service-card service-card--${i + 1} spot`} data-reveal style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}>
                  <div className="service-card__top">
                    <span className="service-card__number">0{i + 1}</span>
                    <span className="service-card__icon"><Icon size={21} /></span>
                  </div>
                  <div>
                    <h3 className="font-serif text-[1.6rem] leading-tight text-ink mb-3">{service.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{service.desc}</p>
                  </div>
                  <div className="service-card__tag"><span />{service.tag}</div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Why Us / Benefits Section */}
        <section id="why-us" className="decision-section scroll-mt-20">
          <div className="max-w-[1240px] mx-auto px-5 md:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
            <div className="decision-copy" data-reveal>
              <p className="eyebrow"><span>02</span>{t.benefits.subtitle}</p>
              <h2 className="section-title font-serif text-ink mb-6">{t.benefits.title}</h2>
              <p className="section-description text-muted mb-9">
                {t.benefits.description}
              </p>
              <ul className="decision-checks">
                {t.benefits.list.map((item, i) => (
                  <li key={i}>
                    <div className="decision-check"><Check size={14} strokeWidth={3} /></div>
                    <span className="text-slate-300"><strong className="text-ink">{item.bold}</strong> {item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="decision-flow" data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} aria-label={lang === 'es' ? 'Proceso de decisión' : 'Decision process'}>
              <div className="decision-flow__header">
                <span>{lang === 'es' ? 'EL SISTEMA SAGEPOINT' : 'THE SAGEPOINT SYSTEM'}</span>
                <span className="decision-flow__status"><i />{lang === 'es' ? 'Validación activa' : 'Validation active'}</span>
              </div>
              {t.benefits.cards.map((benefit, i) => (
                <div key={i} className="decision-step">
                  <div className="decision-step__index">0{i + 1}</div>
                  <div className="decision-step__icon">
                    {i === 0 ? <DatabaseZap size={21} /> : i === 1 ? <Network size={21} /> : <BrainCircuit size={21} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-serif text-ink mb-2">{benefit.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                  <MoveRight className="decision-step__arrow" size={20} />
                </div>
              ))}
              <div className="decision-flow__footer">
                <span>{lang === 'es' ? 'Datos fragmentados' : 'Fragmented data'}</span>
                <span className="decision-flow__line" />
                <strong>{lang === 'es' ? 'Decisión confiable' : 'Confident decision'}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="pricing" className="section-frame max-w-[1240px] mx-auto px-5 md:px-8 scroll-mt-20">
          <div className="pricing-shell">
            <div className="section-heading text-center max-w-3xl mx-auto" data-reveal>
              <p className="eyebrow justify-center"><span>03</span>{t.packages.subtitle}</p>
              <h2 className="section-title font-serif text-ink mb-5">{t.packages.title}</h2>
              <p className="section-description text-muted mx-auto">{t.packages.description}</p>
            </div>

            <div className="pricing-grid">
              {t.packages.cards.map((plan, i) => {
                const isPopular = 'tag' in plan && !!plan.tag;
                return (
                  <div key={plan.id} className={`price-card spot ${isPopular ? 'price-card--featured' : ''}`} data-reveal style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}>
                    <div className="price-card__topline">
                      <span>0{i + 1}</span>
                      {isPopular ? <span className="price-card__popular"><Sparkles size={12} />{(plan as any).tag}</span> : <span>{lang === 'es' ? 'Proyecto definido' : 'Fixed project'}</span>}
                    </div>
                    <h3 className="font-serif text-[1.65rem] leading-tight text-ink">{plan.title}</h3>
                    <p className="price-card__price text-ink">
                      {'pricePrefix' in plan && (plan as any).pricePrefix ? <><em>{(plan as any).pricePrefix}</em>{' '}</> : null}
                      {plan.price} <span>{plan.period}</span>
                    </p>
                    <p className="price-card__timeline"><Clock3 size={14} />{t.packages.timeline_label}: {plan.timeline}</p>
                    <p className="text-sm text-muted mb-7 leading-relaxed">{plan.desc}</p>
                    <ul className="price-card__features text-muted text-sm mb-7 flex-1">
                      {plan.features.map((feat, j) => (
                        <li key={j} className={isPopular && j === 0 ? 'text-sage font-medium' : ''}><Check size={14} />{feat}</li>
                      ))}
                    </ul>
                    {plan.excludes && (
                      <p className="price-card__excludes"><span>{t.packages.excludes_label}:</span> {plan.excludes}</p>
                    )}
                    <a href="#contact" onClick={(e) => handleSelectPackage(e, plan.id)} className={`button w-full justify-between ${isPopular ? 'button--primary' : 'button--secondary'}`}>
                      {plan.cta}<ArrowUpRight size={17} />
                    </a>
                    <a
                      href={waLink(plan.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('whatsapp_click', { language: lang, placement: 'price_card', package_id: plan.id })}
                      className="price-card__wa"
                    >
                      <MessageCircle size={14} />{lang === 'es' ? 'o cotiza por WhatsApp' : 'or quote via WhatsApp'}
                    </a>
                  </div>
                )
              })}
            </div>

            {/* Retainer add-on */}
            <div className="retainer-card" data-reveal>
              <div className="retainer-card__icon"><UsersRound size={24} /></div>
              <div className="flex-1">
                <span className="retainer-card__tag">{t.packages.retainer.tag}</span>
                <h3 className="font-serif text-[1.7rem] text-ink mb-2">{t.packages.retainer.title}</h3>
                <p className="text-sm text-muted max-w-3xl leading-relaxed">{t.packages.retainer.desc}</p>
              </div>
              <div className="md:text-right shrink-0">
                <p className="retainer-card__price text-ink">{t.packages.retainer.price} <span>{t.packages.retainer.period}</span></p>
                <a href="#contact" onClick={(e) => handleSelectPackage(e, 'retainer')} className="button button--copper">
                  {t.packages.retainer.cta}<ArrowUpRight size={16} />
                </a>
                <a
                  href={waLink('retainer')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { language: lang, placement: 'retainer_card', package_id: 'retainer' })}
                  className="price-card__wa mt-3"
                >
                  <MessageCircle size={14} />{lang === 'es' ? 'o escríbenos por WhatsApp' : 'or message us on WhatsApp'}
                </a>
              </div>
            </div>

            <div className="pricing-footer">
              <p className="text-muted">{t.packages.footer_text}</p>
              <a href="#contact" onClick={(e) => handleSelectPackage(e, 'general')}>{t.packages.footer_link}<MoveRight size={16} /></a>
            </div>
          </div>
        </section>

        {/* Selected Cases Section */}
        <section id="cases" className="case-section scroll-mt-20">
          <div className="max-w-[1240px] mx-auto px-5 md:px-8">
            <div className="section-heading section-heading--split" data-reveal>
              <div>
                <p className="eyebrow"><span>04</span>{t.cases.subtitle}</p>
                <h2 className="section-title font-serif text-ink">{t.cases.title}</h2>
              </div>
              <div>
                <p className="section-description text-muted">{t.cases.description}</p>
                <Link to="/portfolio/" className="text-link mt-5">{t.cases.cta}<ArrowUpRight size={16} /></Link>
              </div>
            </div>
            <div className="case-grid">
              {t.cases.items.map((c, i) => (
                <article key={i} className="case-card" data-reveal style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}>
                  <div className="case-card__signal" aria-hidden="true">
                    <div className="case-card__signal-head"><span>CASE / 0{i + 1}</span><i /></div>
                    <div className="case-card__bars">
                      {[38, 57, 49, 74, 62, 88, 72, 96].map((height, barIndex) => (
                        <span key={barIndex} style={{ height: `${height}%`, animationDelay: `${barIndex * 80}ms` }} />
                      ))}
                    </div>
                    <div className="case-card__readout">
                      <strong>{i === 0 ? 'MFA + API' : i === 1 ? '11,327' : '24/7'}</strong>
                      <span>{i === 0 ? 'AUTOMATION' : i === 1 ? 'RECONCILED' : 'LIVE SIGNAL'}</span>
                    </div>
                  </div>
                  <div className="case-card__body">
                    <span className="case-card__category">{c.category}</span>
                    <h3 className="font-serif text-[1.65rem] leading-tight text-ink mt-3 mb-4">{c.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
                    <Link to="/portfolio/" className="case-card__footer"><span>{lang === 'es' ? 'Ver capacidad' : 'View capability'}</span><ArrowUpRight size={16} /></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="section-frame px-5 md:px-8 max-w-[1040px] mx-auto scroll-mt-20">
          <div className="section-heading text-center max-w-3xl mx-auto" data-reveal>
            <p className="eyebrow justify-center"><span>05</span>{t.faq.subtitle}</p>
            <h2 className="section-title font-serif text-ink">{t.faq.title}</h2>
          </div>
          <div className="faq-list">
            {t.faq.items.map((item, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`} data-reveal style={{ '--reveal-delay': `${i * 55}ms` } as React.CSSProperties}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between gap-5 px-5 md:px-7 py-6 text-left"
                >
                  <span className="flex items-center gap-5"><i>0{i + 1}</i><span className="font-serif text-lg md:text-xl text-ink">{item.q}</span></span>
                  <span className={`faq-toggle ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className="faq-answer" aria-hidden={openFaq !== i}>
                  <div>
                    <p className="px-5 md:px-7 pb-6 md:pl-[5.4rem] text-muted text-sm leading-relaxed max-w-3xl">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section px-5 md:px-8 max-w-[1240px] mx-auto scroll-mt-20">
          <div className="contact-shell">
            <div className="contact-copy" data-reveal>
              <p className="eyebrow"><span>06</span>{t.contact.subtitle}</p>
              <h2 className="contact-title font-serif text-ink">{t.contact.title}</h2>
              <p className="section-description text-muted mb-8">
                {t.contact.description}
              </p>
              <div className="contact-promise">
                <div><Clock3 size={18} /><span><strong>{lang === 'es' ? '<24 horas' : '<24 hours'}</strong>{lang === 'es' ? 'para responder' : 'to respond'}</span></div>
                <div><MapPin size={18} /><span><strong>Guatemala + US</strong>{lang === 'es' ? 'servicio remoto' : 'remote delivery'}</span></div>
              </div>
              <div className="contact-links">
                <p>
                  <a href={`https://wa.me/${t.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { language: lang, placement: 'contact_section' })} className="hover:text-sage transition-colors">
                    <MessageCircle size={16} />{t.contact.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${t.contact.email}`} className="hover:text-sage transition-colors">
                    <Mail size={16} />{t.contact.email}
                  </a>
                </p>
              </div>
            </div>

            <form className="contact-form" data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} onSubmit={handleFormSubmit}>
              <div className="contact-form__header">
                <span>{lang === 'es' ? 'SOLICITUD DE DIAGNÓSTICO' : 'ASSESSMENT REQUEST'}</span>
                <span><i />{lang === 'es' ? 'Disponible' : 'Available'}</span>
              </div>
              {formState === 'success' ? (
                <div className="contact-form__success animate-[floatIn_0.4s_ease-out]" role="status">
                  <div className="contact-form__success-icon"><Check size={24} strokeWidth={3} /></div>
                  <h3 className="font-serif text-2xl text-ink">{t.contact.form.success}</h3>
                  <p className="text-sm text-muted leading-relaxed">{t.contact.form.success_body}</p>
                  <a
                    href={waLink(selectedService)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { language: lang, placement: 'form_success', package_id: selectedService })}
                    className="button button--primary w-full justify-center"
                  >
                    <MessageCircle size={17} />{t.contact.form.success_wa}
                  </a>
                  <button
                    type="button"
                    onClick={() => { setFormState('idle'); setSelectedService('general'); }}
                    className="text-sm text-muted hover:text-sage transition-colors"
                  >
                    {t.contact.form.success_again}
                  </button>
                </div>
              ) : (
              <>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.name}</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="form-control"
                  placeholder={t.contact.form.name_ph}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.email}</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="form-control"
                    placeholder={t.contact.form.email_ph}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.phone}</label>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="form-control"
                    placeholder={t.contact.form.phone_ph}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.service}</label>
                <select
                  name="service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value as PackageId)}
                  className="form-control"
                >
                  {FORM_OPTION_IDS.map((id) => (
                    <option key={id} value={id}>{t.contact.form.options[id]}</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.industry}</label>
                  <select
                    name="industry"
                    className="form-control"
                  >
                    <option value="">{t.contact.form.industry_ph}</option>
                    {/* Value is always the English label so the Google Sheet stays consistent across languages. */}
                    {Object.entries(t.contact.form.industry_options).map(([key, label]) => (
                      <option key={key} value={content.en.contact.form.industry_options[key as keyof typeof content.en.contact.form.industry_options]}>{label as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.country}</label>
                  <select
                    name="country"
                    className="form-control"
                  >
                    <option value="">{t.contact.form.country_ph}</option>
                    {/* Value is always the English label so the Google Sheet stays consistent across languages. */}
                    {Object.entries(t.contact.form.country_options).map(([key, label]) => (
                      <option key={key} value={content.en.contact.form.country_options[key as keyof typeof content.en.contact.form.country_options]}>{label as string}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(selectedService === 'custom' || selectedService === 'executive') && (
                <div className="animate-[floatIn_0.3s_ease-out]">
                  <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.details}</label>
                  <textarea
                    name="details"
                    rows={3}
                    className="form-control resize-none"
                    placeholder={t.contact.form.details_ph}
                  ></textarea>
                </div>
              )}

              <button
                type="submit"
                disabled={formState !== 'idle' && formState !== 'error'}
                className={`button w-full justify-center py-4! font-bold transition-all duration-300
                  ${formState === 'error' ? 'bg-red-500/20 border border-red-500 text-red-400' : ''}
                  ${formState === 'idle' ? 'button--primary' : ''}
                  ${formState === 'sending' ? 'bg-deep-sage/50 text-dark opacity-80 cursor-wait' : ''}
                `}
              >
                {formState === 'idle' && t.contact.form.submit}
                {formState === 'sending' && t.contact.form.sending}
                {formState === 'error' && t.contact.form.error}
              </button>
              <p className="text-xs text-center text-muted/60 flex items-center justify-center gap-2"><Check size={12} />{t.contact.form.note}</p>
              </>
              )}
            </form>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="site-footer pt-16 pb-8 px-5 md:px-8">
        <div className="max-w-[1240px] mx-auto grid md:grid-cols-[1.4fr_0.7fr_0.9fr] gap-12 mb-16">
          <div className="col-span-1">
            <a href="/" onClick={scrollToTop} className="brand-lockup mb-5"><span className="brand-mark"><BarChart3 size={17} /></span><span className="font-serif text-2xl text-ink">Sagepoint</span></a>
            <p className="text-sm text-muted max-w-sm leading-relaxed">{t.footer.tagline}</p>
            <div className="footer-signal"><i />{lang === 'es' ? 'Convirtiendo señales en decisiones.' : 'Turning signals into decisions.'}</div>
          </div>

          <div>
            <h4 className="footer-heading">{t.footer.menu}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#services" onClick={(e) => handleScrollToSection(e, 'services')} className="hover:text-sage">{t.nav.services}</a></li>
              <li><a href="#why-us" onClick={(e) => handleScrollToSection(e, 'why-us')} className="hover:text-sage">{t.nav.benefits}</a></li>
              <li><a href="#pricing" onClick={(e) => handleScrollToSection(e, 'pricing')} className="hover:text-sage">{t.nav.packages}</a></li>
              <li><Link to="/portfolio/" className="hover:text-sage">Portfolio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">{t.footer.contact}</h4>
            <div className="flex flex-col gap-2">
              <a href={`https://wa.me/${t.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { language: lang, placement: 'footer' })} className="text-sm text-sage hover:underline">{t.contact.phone}</a>
              <a href={`mailto:${t.contact.email}`} className="text-sm text-sage hover:underline">{t.contact.email}</a>
            </div>
          </div>
        </div>
        <div className="footer-watermark" aria-hidden="true">SAGEPOINT</div>
        <div className="max-w-[1240px] mx-auto pt-7 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted/50">
          <span>{t.footer.rights}</span>
          <span className="font-mono tracking-wider">DATA / CLARITY / GROWTH</span>
        </div>
      </footer>

      <WhatsAppButton lang={lang} />

    </div>
  );
}

export default App;
