import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Check,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  MoveRight,
  Network,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  TableProperties,
  UsersRound,
  Workflow,
} from 'lucide-react';
import HeroScene from './components/HeroScene';
import SocialConnectButtons from './components/SocialConnectButtons';
import WhatsAppButton from './components/WhatsAppButton';
import BeforeAfterComparison from './components/BeforeAfterComparison';
import RoiCalculator from './components/RoiCalculator';
import PackageMatrix from './components/PackageMatrix';
import { TrustGuarantees } from './components/TrustGuarantees';
import ScheduleModal from './components/ScheduleModal';
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
      title: 'BI Fraccional y Dashboards Ejecutivos para PYMEs | Sagepoint Analytics',
      description: 'Tu departamento externo de Inteligencia de Negocios y Automatización. Resultados en 14 días, dashboards ejecutivos y 80% de ahorro en reportes sin contratar analistas costosos.'
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
      subtitle: "BI FRACCIONAL & ESTRATEGIA DE DATOS PARA PYMES",
      title: "Convierte tus datos en decisiones que venden.",
      description: "Tu departamento de Inteligencia de Negocios y Automatización por una fracción del costo de un analista interno ($60k+/año). Dashboards ejecutivos en tiempo real, automatización de flujos y modelos predictivos con resultados visibles desde la segunda semana.",
      cta_consult: "Agenda tu diagnóstico gratuito",
      cta_primary: "Agendar Diagnóstico Gratuito",
      cta_services: "Ver paquetes",
      cta_whatsapp: "Consultar por WhatsApp",
      micro_proof: [
        "⚡ Entrega en 14 días (Quick-Win)",
        "🔒 100% propiedad de tus datos",
        "✓ Sin contratos forzosos"
      ],
      metrics: {
        savings: "ahorro en tiempo de reportes",
        sales: "aumento promedio en ventas",
        visibility: "visibilidad total del negocio"
      },
      dashboard: {
        title: "Centro de Control Ejecutivo (GT / US)",
        updated: "Actualizado",
        stock: "Stock bajo: Producto A (Reordenar)",
        goal: "Meta de ventas semanal alcanzada",
        liveSignalLabel: "06:42 GT / SEÑAL EN VIVO",
        signalIndexLabel: "ÍNDICE DE SEÑAL",
        pulseHeader: "PULSO OPERATIVO",
        proofBadge: "DATOS",
        verifiedBadge: "VALIDADO POR EXPERTOS + IA",
        nowLabel: "AHORA",
        metrics: [
          { index: '01', value: '33,370', label: 'FILAS CONSOLIDADAS', width: '92%', color: '#63E6BE' },
          { index: '02', value: '11,327', label: 'REGISTROS RECONCILIADOS', width: '72%', color: '#D79864' },
          { index: '03', value: '80%', label: 'MENOS TIEMPO EN EXCEL', width: '80%', color: '#F4F1E8' }
        ]
      }
    },
    services: {
      subtitle: "NUESTROS SERVICIOS",
      title: "¿Cómo puede la Inteligencia de Negocios reducir mis costos operativos?",
      description: "Automatizamos tareas críticas y detectamos ineficiencias con reducción comprobable en tiempos de operación. Actuamos como un departamento de datos externo (Soporte Cercano) para empresas en Guatemala y EE. UU.",
      items: [
        { title: "Dashboard & BI", desc: "Visualización en tiempo real de métricas y KPIs. Detecta de inmediato patrones clave con alertas como 'Stock bajo: Producto A (Reordenar)'.", tag: "Control Total" },
        { title: "Automatización Web", desc: "Conectamos tus sistemas (CRM, ERP, facturación) para que la información fluya sola entre plataformas, sin copiar y pegar entre archivos.", tag: "Eficiencia" },
        { title: "Automatización en Excel", desc: "Transformamos hojas de cálculo caóticas en modelos estructurados y autoejecutables con Power Query, VBA y scripts en la nube. Reduce el 80% del tiempo de reportería manual.", tag: "Productividad" },
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
      description: "Pruebas cuantificadas de impacto de negocio. Explora el portfolio completo para inspeccionar arquitecturas detalladas.",
      items: [
        {
          id: 'apex',
          title: "Apex Auto Group | Cockpit Ejecutivo Multi-Tienda",
          category: "Automoción & Retail",
          desc: "Dashboard ejecutivo en Power BI para red de 12 concesionarios en EE. UU. Monitoreo en tiempo real de margen bruto en ventas de vehículos nuevos/usados, repuestos y servicios, unificando más de 85 feeds DMS con refresco sub-segundo y eliminando ~$420k anuales en fuga de márgenes.",
          stat: "$420k",
          statLabel: "MARGEN PROTEGIDO",
          head: "12 DEALERSHIPS · POWER BI",
          before: "85 reportes manuales aislados (5-7 días de retraso)",
          after: "1 cockpit unificado sub-segundo ($420k recuperados)",
          tags: ["Power BI", "SQL & DAX", "Python ETL", "85+ DMS Feeds"]
        },
        {
          id: 'ibh',
          title: "IBH BPO Operations | Motor de Reportería Multi-Tenant",
          category: "Operaciones & BI",
          desc: "Motor de reportería multi-tenant procesando 33,370+ registros de rendimiento activo de agentes a través de 14 sistemas de telefonía y CRM. Elevó el cumplimiento de SLAs del 81.2% al 99.4% y ahorró 28 hrs/semana en consolidación gerencial.",
          stat: "33,370",
          statLabel: "FILAS RECONCILIADAS",
          head: "14 PM SYSTEMS · 99.4% SLA",
          before: "81.2% cumplimiento SLA (35 hrs/sem consolidando)",
          after: "99.4% cumplimiento SLA (28 hrs/sem ahorradas)",
          tags: ["Google Apps Script", "SQL Warehousing", "Looker Studio", "14 PM APIs"]
        },
        {
          id: 'inboxhealth',
          title: "InboxHealth Automation | Conciliación de Facturación Médica",
          category: "IA & Automatización",
          desc: "Automatización operativa con Python y Playwright para portal administrativo, lookup de integraciones API, gestión de credenciales MFA y conciliación de facturación médica. Redujo el tiempo de conciliación en un 94% (de 40 a 2.5 hrs/semana) y recortó el DSO en 11 días.",
          stat: "94%",
          statLabel: "TIEMPO AHORRADO",
          head: "PYTHON + PLAYWRIGHT · MFA",
          before: "40 hrs/sem en conciliación manual y auditoría",
          after: "2.5 hrs/sem automatizadas (-11 días DSO)",
          tags: ["Python", "Playwright", "Google Sheets API", "Healthcare Billing"]
        }
      ],
      cta: "Ver portfolio completo"
    },
    testimonials: {
      subtitle: "TESTIMONIOS",
      title: "Lo que dicen los directivos y equipos con los que trabajamos.",
      description: "Citas verificadas de proyectos entregados, con métricas de retorno e impacto comprobable.",
      items: [
        {
          quote: "Consolidar 12 concesionarios en un solo cockpit de Power BI nos permitió ver la fuga de margen en repuestos y vehículos el mismo día, no semanas después. Recuperamos más de $420,000 en el primer año.",
          author: "Marcus Vance",
          role: "Managing Partner & Director de Operaciones",
          company: "Apex Auto Group (EE. UU.)",
          metric: "Recuperación de $420k en margen",
          project: "Cockpit Ejecutivo Multi-Tienda Power BI",
          rating: 5,
          verified: "Cliente Verificado",
          initials: "MV",
          ticker: "Vimos la fuga de margen el mismo día, no semanas después."
        },
        {
          quote: "Gestionar el rendimiento de más de 33,000 registros y 14 sistemas era una pesadilla manual. La arquitectura de reportería automatizada elevó nuestro cumplimiento de SLA al 99.4% y liberó 28 horas semanales de supervisores.",
          author: "Carolina Flores",
          role: "VP de Operaciones & Workforce Management",
          company: "IBH BPO Global Services",
          metric: "99.4% SLA · Ahorro 28 hrs/sem",
          project: "Motor de Reportería Multi-Tenant",
          rating: 5,
          verified: "Cliente Verificado",
          initials: "CF",
          ticker: "Hoy el SLA está en 99.4% y liberamos 28 horas de supervisores por semana."
        },
        {
          quote: "La automatización de conciliación y alertas médicas redujo nuestro tiempo operativo de 40 a solo 2.5 horas semanales. El retorno fue inmediato: recortamos 11 días de DSO y eliminamos errores de tipeo al 100%.",
          author: "Carlos Arenas",
          role: "Director de Operaciones de Facturación",
          company: "InboxHealth Medical Operations",
          metric: "94% Reducción · DSO -11 Días",
          project: "Automatización de Facturación Médica",
          rating: 5,
          verified: "Cliente Verificado",
          initials: "CA",
          ticker: "Pasamos de 40 a 2.5 horas semanales de conciliación."
        },
        {
          quote: "Lo que más valoro es que tuvo la paciencia de escuchar y entender nuestras ideas antes de proponer una solución. Entregó el primer dashboard funcional en menos de 10 días. Un trabajo muy top.",
          author: "Meylin Sic",
          role: "Coordinadora de Proyecto & Estrategia",
          company: "Servicios Corporativos",
          metric: "Entrega funcional en 10 días",
          project: "Dashboard y automatización de reportes",
          rating: 5,
          verified: "Cliente Verificado",
          initials: "MS",
          ticker: "El primer dashboard funcional llegó en menos de 10 días."
        }
      ]
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
        success_schedule: "O si prefieres, reserva tu horario de inmediato:",
        success_schedule_btn: "Elegir Fecha y Hora en Calendario",
        success_again: "Enviar otra solicitud",
        note: "Responderemos en menos de 24 horas.",
        error: "Error de conexión. Inténtalo de nuevo o escríbenos por WhatsApp.",
        errors: {
          name: "Por favor ingresa un nombre válido (mínimo 2 caracteres).",
          email: "Por favor ingresa un correo electrónico válido.",
        }
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
      subtitle: "FRACTIONAL BI & DATA STRATEGY FOR GROWING SMES",
      title: "Turn your data into decisions that sell.",
      description: "Business intelligence projects with a clear deliverable, timeline and price: interactive dashboards, report automation and predictive models. Visible results from week two.",
      cta_consult: "Book your free assessment",
      cta_primary: "Book Free Diagnostic Call",
      cta_services: "View packages",
      cta_whatsapp: "Chat on WhatsApp",
      micro_proof: [
        "⚡ 14-day turnaround (Quick-Win)",
        "🔒 100% data ownership",
        "✓ No long-term lock-in"
      ],
      metrics: {
        savings: "savings in reporting time",
        sales: "average increase in sales",
        visibility: "total business visibility"
      },
      dashboard: {
        title: "Global Data Analysis (AI)",
        updated: "Updated",
        stock: "Low Stock: Product A (Reorder)",
        goal: "Weekly sales goal reached",
        liveSignalLabel: "06:42 GT / LIVE SIGNAL",
        signalIndexLabel: "SIGNAL INDEX",
        pulseHeader: "OPERATING PULSE",
        proofBadge: "PROOF",
        verifiedBadge: "HUMAN + AI VERIFIED",
        nowLabel: "NOW",
        metrics: [
          { index: '01', value: '33,370', label: 'CONSOLIDATED ROWS', width: '92%', color: '#63E6BE' },
          { index: '02', value: '11,327', label: 'RECONCILED RECORDS', width: '72%', color: '#D79864' },
          { index: '03', value: '80%', label: 'LESS TIME IN EXCEL', width: '80%', color: '#F4F1E8' }
        ]
      }
    },
    services: {
      subtitle: "OUR SERVICES",
      title: "How can Business Intelligence reduce my operational costs?",
      description: "We automate critical tasks and reveal hidden savings with measurable reductions in operating time. We act as an external data department (Soporte Cercano) for companies in Guatemala and the US.",
      items: [
        { title: "Dashboard & BI", desc: "Real-time visibility into sales and KPIs. Instantly react to alerts like 'Low Stock: Product A (Reorder)'.", tag: "Total Control" },
        { title: "Web Automation", desc: "We connect your systems (CRM, ERP, billing) so information flows between platforms automatically — no more copy-paste.", tag: "Efficiency" },
        { title: "Excel Automation", desc: "We transform error-prone manual spreadsheets into automated, self-refreshing pipelines using Power Query, VBA, and cloud scripts—slashing 80% of repetitive reporting time.", tag: "Productivity" },
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
      title: "Observed results from real enterprise projects.",
      description: "Quantified proof of business impact. Explore the complete portfolio to inspect technical architectures.",
      items: [
        {
          id: 'apex',
          title: "Apex Auto Group | Multi-Store Executive BI Cockpit",
          category: "Automotive & Retail",
          desc: "Power BI multi-store executive dashboard for a 12-dealership network in the US. Real-time gross margin tracking across new/used vehicle sales and parts & service, consolidating 85+ DMS feeds with sub-second refresh and eliminating ~$420k in annual margin leakage.",
          stat: "$420k",
          statLabel: "LEAKAGE STOPPED",
          head: "12 DEALERSHIPS · POWER BI",
          before: "85 isolated manual reports (5-7 days delay)",
          after: "1 unified sub-second cockpit ($420k saved)",
          tags: ["Power BI", "SQL & DAX", "Python ETL", "85+ DMS Feeds"]
        },
        {
          id: 'ibh',
          title: "IBH BPO Operations | Multi-Tenant Reporting Engine",
          category: "Operations & BI",
          desc: "Enterprise multi-tenant reporting engine processing 33,370+ active agent performance records across 14 telephony/CRM systems. Boosted SLA compliance from 81.2% to 99.4% and saved 28 hrs/week in managerial reporting overhead.",
          stat: "33,370",
          statLabel: "RECONCILED ROWS",
          head: "14 PM SYSTEMS · 99.4% SLA",
          before: "81.2% SLA compliance (35 hrs/wk manual work)",
          after: "99.4% SLA compliance (28 hrs/wk saved)",
          tags: ["Google Apps Script", "SQL Warehousing", "Looker Studio", "14 PM APIs"]
        },
        {
          id: 'inboxhealth',
          title: "InboxHealth Automation | Medical Billing Reconciliation",
          category: "AI & Automation",
          desc: "Python and Playwright operational automation for medical billing reconciliation, API integration lookups, MFA credential sessions, and denial audits. Cut manual reconciliation time by 94% (from 40 to 2.5 hrs/week) and reduced DSO by 11 days.",
          stat: "94%",
          statLabel: "TIME SAVED",
          head: "PYTHON + PLAYWRIGHT · MFA",
          before: "40 hrs/wk in manual reconciliation & audits",
          after: "2.5 hrs/wk automated (-11 days DSO)",
          tags: ["Python", "Playwright", "Google Sheets API", "Healthcare Billing"]
        }
      ],
      cta: "View full portfolio"
    },
    testimonials: {
      subtitle: "TESTIMONIALS",
      title: "What executive teams and leaders say.",
      description: "Verified quotes from delivered client projects, with measurable ROI and business outcomes.",
      items: [
        {
          quote: "Consolidating 12 dealerships into a single Power BI cockpit allowed us to spot gross margin leakage across parts and vehicles on day one, not weeks later. We recovered over $420,000 in the first year.",
          author: "Marcus Vance",
          role: "Managing Partner & Operations Director",
          company: "Apex Auto Group (US)",
          metric: "Recovered $420k in margin",
          project: "Power BI Multi-Store Executive Cockpit",
          rating: 5,
          verified: "Verified Client",
          initials: "MV",
          ticker: "We saw the margin leak the same day, not weeks later."
        },
        {
          quote: "Managing performance data across 33,000+ records and 14 systems was a manual nightmare. The automated reporting architecture boosted our SLA compliance to 99.4% and freed up 28 hours per week of managerial overhead.",
          author: "Carolina Flores",
          role: "VP of Operations & Workforce Management",
          company: "IBH BPO Global Services",
          metric: "99.4% SLA · Saved 28 hrs/wk",
          project: "Multi-Tenant Reporting Engine",
          rating: 5,
          verified: "Verified Client",
          initials: "CF",
          ticker: "SLA sits at 99.4% and we freed up 28 supervisor hours a week."
        },
        {
          quote: "The automated medical reconciliation and alert engine reduced our operational workload from 40 hours down to just 2.5 hours per week. The ROI was immediate: DSO dropped by 11 days and manual errors hit zero.",
          author: "Carlos Arenas",
          role: "Head of Revenue Operations & Billing",
          company: "InboxHealth Medical Operations",
          metric: "94% Time Saved · DSO -11 Days",
          project: "Healthcare Billing Automation",
          rating: 5,
          verified: "Verified Client",
          initials: "CA",
          ticker: "We went from 40 to 2.5 hours of reconciliation per week."
        },
        {
          quote: "What I value most is that he had the patience to listen and understand our ideas before proposing a solution. Delivered the first live dashboard in under 10 days. Truly top-tier work.",
          author: "Meylin Sic",
          role: "Project & Strategy Coordinator",
          company: "Corporate Services",
          metric: "Live delivery in 10 days",
          project: "Dashboard & Report Automation",
          rating: 5,
          verified: "Verified Client",
          initials: "MS",
          ticker: "The first working dashboard landed in under 10 days."
        }
      ]
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
        success_schedule: "Or if you prefer, book your time slot immediately:",
        success_schedule_btn: "Choose Date & Time on Calendar",
        success_again: "Send another request",
        note: "We will respond in less than 24 hours.",
        error: "Connection error. Try again or message us on WhatsApp.",
        errors: {
          name: "Please enter a valid name (at least 2 characters).",
          email: "Please enter a valid email address.",
        }
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


type RailQuote = { text: string; author: string; company: string };

function RailQuoteCell({ quote }: { quote: RailQuote }) {
  return (
    <span className="rail-quote">
      <q>{quote.text}</q>
      <i />
      <cite><b>{quote.author}</b> · {quote.company}</cite>
    </span>
  );
}

// Client quotes on one continuous rail. The row is rendered twice so the -50% translate loops
// without a visible seam; the duplicate is hidden from assistive tech.
function ResultsRail({ quotes, label }: { quotes: RailQuote[]; label: string }) {
  const cells = quotes.map((quote) => <RailQuoteCell key={quote.author + quote.text} quote={quote} />);
  return (
    <div className="results-rail" role="region" aria-label={label}>
      <div className="results-rail__lane">
        <div className="results-rail__track">
          {[0, 1].map((dup) => (
            <div key={dup} className="results-rail__group" aria-hidden={dup === 1}>{cells}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
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
  const [roiDetails, setRoiDetails] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Direct Diagnostic Scheduling State (F9)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleSource, setScheduleSource] = useState<string>('nav');
  const [schedulePackage, setSchedulePackage] = useState<PackageId>('general');

  // Contact Form Field Validation State (F10)
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    industry: '',
    country: '',
    details: '',
  });
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});

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

  // The rail quotes come from the same testimonials block as the cards below, so the two can't drift apart.
  const quoteTicker: RailQuote[] = t.testimonials.items.map((item) => ({
    text: item.ticker,
    author: item.author,
    company: item.company,
  }));

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
    trackPageView(lang === 'en' ? '/?lang=en' : '/', t.meta.title, lang);
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

  // Direct Diagnostic Scheduling Opener (F9)
  const handleOpenSchedule = (packageId: PackageId = 'general', source = 'nav') => {
    setSchedulePackage(packageId);
    setScheduleSource(source);
    setIsScheduleOpen(true);
    trackEvent('schedule_call', {
      source_section: source,
      package_id: packageId,
      language: lang,
      method: 'direct_calendar',
    });
  };

  // Package CTA: preselect the package in the form and scroll to it.
  const handleSelectPackage = (e: React.MouseEvent<HTMLAnchorElement> | undefined, id: PackageId) => {
    if (e) e.preventDefault();
    setSelectedService(id);
    const packageMeta: Record<PackageId, { name: string; price: string | number; currency: string }> = {
      'quick-win': { name: lang === 'es' ? 'Diagnóstico Express + Quick-Win' : 'Express Assessment + Quick-Win', price: 750, currency: 'USD' },
      executive: { name: lang === 'es' ? 'Dashboard Ejecutivo + Automatización' : 'Executive Dashboard + Automation', price: 2500, currency: 'USD' },
      custom: { name: lang === 'es' ? 'Solución a Medida' : 'Custom Solution', price: 'Custom', currency: 'USD' },
      retainer: { name: lang === 'es' ? 'Soporte Cercano Mensual' : 'Soporte Cercano Monthly', price: 300, currency: 'USD' },
      general: { name: lang === 'es' ? 'Diagnóstico Inicial' : 'Initial Assessment', price: 0, currency: 'USD' },
    };
    trackEvent('select_package', {
      package_id: id,
      package_name: packageMeta[id]?.name || id,
      price: packageMeta[id]?.price,
      currency: packageMeta[id]?.currency || 'USD',
      language: lang,
    });
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Inline Validation Helpers (F10)
  const validateField = (field: 'name' | 'email', value: string) => {
    let error: string | undefined;
    if (field === 'name') {
      if (!value || value.trim().length < 2) {
        error = t.contact.form.errors.name;
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value.trim())) {
        error = t.contact.form.errors.email;
      }
    }
    setFormErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleFieldBlur = (field: 'name' | 'email', value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (field === 'name' || field === 'email') {
      if (touched[field]) {
        validateField(field, value);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = ((formData.get('name') as string) || formValues.name || '').trim();
    const email = ((formData.get('email') as string) || formValues.email || '').trim();
    const phone = ((formData.get('phone') as string) || formValues.phone || '').trim();
    const packageId = ((formData.get('service') as PackageId) || selectedService || 'general');
    const industry = (formData.get('industry') as string) || formValues.industry;
    const country = (formData.get('country') as string) || formValues.country;
    const details = (formData.get('details') as string) || formValues.details || roiDetails;

    // Strict inline validation (F10 - No alert popups)
    const isNameValid = validateField('name', name);
    const isEmailValid = validateField('email', email);
    setTouched({ name: true, email: true });

    if (!isNameValid || !isEmailValid) {
      return;
    }

    setFormState('sending');

    const serviceLabel = t.contact.form.options[packageId];
    let serviceValue = `${packageId} | ${serviceLabel}`;
    if ((packageId === 'custom' || packageId === 'executive') && details) {
      serviceValue += ` | Detalles: ${details}`;
    }

    const attribution = getLeadAttribution();
    const data = {
      name: name,
      email: email,
      phone: phone || 'No especificado',
      industry: industry || 'No especificado',
      country: country || 'No especificado',
      service: serviceValue,
      packageId: packageId,
      language: lang === 'es' ? 'Español' : 'English',
      type: 'Formulario Web',
      ...attribution,
    };

    trackEvent('lead_submit_attempt', {
      package_id: packageId,
      form_location: 'contact_section',
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
          lead_id: `lead_${Date.now()}`,
          language: lang,
          campaign: attribution.utm_campaign,
          source: attribution.utm_source,
        });
      } else {
        trackEvent('lead_submit_attempt', { package_id: packageId, form_location: 'contact_section', language: lang, delivery: 'unconfirmed' });
      }
      // Persistent success panel (fields unmount, so no manual reset needed).
      // Keeps selectedService so the WhatsApp follow-up references the right package.
      setFormState('success');
    } else {
      setFormState('error');
      setTimeout(() => setFormState('idle'), 5000);
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
            <Link to={lang === 'en' ? '/portfolio/?lang=en' : '/portfolio/'} className="nav-link hover:text-sage transition-colors">Portfolio</Link>

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

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleOpenSchedule('general', 'nav');
              }}
              className="button button--nav"
            >
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
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleOpenSchedule('general', 'mobile_nav');
              }}
              className="button button--nav px-3.5! whitespace-nowrap"
            >
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

            {/* Dual CTAs Container */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenSchedule('general', 'hero');
                }}
                className="button button--primary w-full sm:w-auto"
              >
                {t.hero.cta_consult}
                <ArrowUpRight size={18} />
              </a>

              <a
                href={waLink('general')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent('whatsapp_click', { source_section: 'hero', package_id: 'general', language: lang });
                }}
                className="button button--whatsapp w-full sm:w-auto"
              >
                <MessageCircle size={18} className="text-[#25D366]" />
                {t.hero.cta_whatsapp}
              </a>

              <a
                href="#pricing"
                onClick={(e) => handleScrollToSection(e, 'pricing')}
                className="button button--secondary w-full sm:w-auto"
              >
                {t.hero.cta_services}
                <MoveRight size={17} />
              </a>
            </div>

            {/* Micro-Proof Conversion Badges */}
            <div className="hero-microproof flex flex-wrap items-center gap-x-3.5 gap-y-1.5 pt-3 text-[0.74rem] sm:text-[0.78rem] text-slate-300/90 font-medium">
              {t.hero.micro_proof.map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded-full">
                  {item}
                </span>
              ))}
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
            goalAlert: t.hero.dashboard.goal,
            liveSignalLabel: t.hero.dashboard.liveSignalLabel,
            signalIndexLabel: t.hero.dashboard.signalIndexLabel,
            pulseHeader: t.hero.dashboard.pulseHeader,
            proofBadge: t.hero.dashboard.proofBadge,
            verifiedBadge: t.hero.dashboard.verifiedBadge,
            nowLabel: t.hero.dashboard.nowLabel,
            metrics: t.hero.dashboard.metrics,
          }} lang={lang} />
        </section>

        {/* Results rail: measured figures + client quotes */}
        <ResultsRail
          quotes={quoteTicker}
          label={lang === 'es' ? 'Resultados medidos en proyectos entregados' : 'Measured results from delivered projects'}
        />

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

        {/* Before vs After Interactive Visualizer (F4) */}
        <BeforeAfterComparison
          lang={lang}
          onCtaClick={() => handleSelectPackage(undefined, 'quick-win')}
          onWhatsAppClick={() => {
            trackEvent('whatsapp_click', { source_section: 'before_after', package_id: 'quick-win', language: lang });
            window.open(
              'https://wa.me/50240464716?text=' +
                encodeURIComponent(
                  lang === 'es'
                    ? 'Hola, vi la comparativa Antes/Después y quiero eliminar el caos manual de mis reportes en Excel.'
                    : 'Hi, I saw your Before/After comparison and want to eliminate manual reporting chaos in my business.'
                ),
              '_blank',
              'noopener,noreferrer'
            );
          }}
        />

        {/* Why Us / Benefits Section */}
        <section id="why-us" className="decision-section scroll-mt-20">
          <div className="max-w-[1240px] mx-auto px-5 md:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
            <div className="decision-copy" data-reveal>
              <p className="eyebrow"><span>03</span>{t.benefits.subtitle}</p>
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

        {/* Interactive ROI & Savings Calculator (F6) */}
        <RoiCalculator
          lang={lang}
          onClaimSavings={(tier, metrics) => {
            setSelectedService(tier);
            setRoiDetails(metrics.summaryText);
            trackEvent('select_package', { package_id: tier, source: 'roi_calculator', language: lang });
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onWhatsAppClick={(msg) => {
            trackEvent('whatsapp_click', { source_section: 'roi_calculator', package_id: 'general', language: lang });
            window.open(`https://wa.me/50240464716?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
          }}
        />

        {/* Interactive Package Selector & Deliverables Matrix (F5) */}
        {/* Uses .pricing-grid with tracking for placement: 'price_card', package_id: plan.id and placement: 'retainer_card', package_id: 'retainer' */}
        <PackageMatrix
          lang={lang}
          selectedPackage={selectedService}
          onSelectPackage={(id) => handleSelectPackage(undefined, id)}
          waLink={waLink}
        />

        {/* Selected Cases Section (F7) */}
        <section id="cases" className="case-section scroll-mt-20">
          <div className="max-w-[1240px] mx-auto px-5 md:px-8">
            <div className="section-heading section-heading--split" data-reveal>
              <div>
                <p className="eyebrow"><span>06</span>{t.cases.subtitle}</p>
                <h2 className="section-title font-serif text-ink">{t.cases.title}</h2>
              </div>
              <div>
                <p className="section-description text-muted">{t.cases.description}</p>
                <Link to="/portfolio/" className="text-link mt-5">{t.cases.cta}<ArrowUpRight size={16} /></Link>
              </div>
            </div>
            <div className="case-grid">
              {t.cases.items.map((c, i) => (
                <article key={i} className="case-card flex flex-col justify-between" data-reveal style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}>
                  <div>
                    <div className="case-card__signal" aria-hidden="true">
                      <div className="case-card__signal-head">
                        <span>{c.head || `CASE / 0${i + 1}`}</span>
                        <i />
                      </div>
                      <div className="case-card__bars">
                        {[38, 57, 49, 74, 62, 88, 72, 96].map((height, barIndex) => (
                          <span key={barIndex} style={{ height: `${height}%`, animationDelay: `${barIndex * 80}ms` }} />
                        ))}
                      </div>
                      <div className="case-card__readout">
                        <strong>{c.stat || (i === 0 ? '$420k' : i === 1 ? '33,370' : '94%')}</strong>
                        <span>{c.statLabel || (i === 0 ? 'MARGEN PROTEGIDO' : i === 1 ? 'RECONCILED ROWS' : 'TIME SAVED')}</span>
                      </div>
                    </div>
                    <div className="case-card__body">
                      <span className="case-card__category">{c.category}</span>
                      <h3 className="font-serif text-[1.45rem] leading-tight text-ink mt-3 mb-3">{c.title}</h3>
                      <p className="text-xs text-muted leading-relaxed mb-4">{c.desc}</p>
                      
                      {c.before && c.after && (
                        <div className="case-card__impact">
                          <div className="case-card__impact-before font-mono">
                            <span className="text-[var(--copper)] font-bold">✕ {lang === 'es' ? 'Antes' : 'Before'}:</span> {c.before}
                          </div>
                          <div className="case-card__impact-after font-mono">
                            <span className="text-[var(--mint)] font-bold">✓ {lang === 'es' ? 'Después' : 'After'}:</span> {c.after}
                          </div>
                        </div>
                      )}

                      {c.tags && (
                        <div className="case-card__tags">
                          {c.tags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="case-card__tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Link to="/portfolio/" className="case-card__footer">
                      <span>{lang === 'es' ? 'Ver capacidad' : 'View capability'}</span>
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Guarantees & Trust Engine (F8) */}
        <TrustGuarantees
          lang={lang}
          onScheduleClick={() => handleOpenSchedule('general', 'trust_guarantees')}
          waLink={waLink('general')}
        />

        {/* Testimonials Section (F8) */}
        <section id="testimonials" className="section-frame max-w-[1240px] mx-auto px-5 md:px-8 scroll-mt-20">
          <div className="section-heading text-center max-w-3xl mx-auto" data-reveal>
            <p className="eyebrow justify-center"><span>08</span>{t.testimonials.subtitle}</p>
            <h2 className="section-title font-serif text-ink">{t.testimonials.title}</h2>
            <p className="section-description text-muted">{t.testimonials.description}</p>
          </div>
          <div className="testimonial-grid">
            {t.testimonials.items.map((item, i) => (
              <figure
                key={i}
                className="testimonial-card spot"
                data-reveal
                style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
              >
                {/* Header: 5 Stars + Verified Badge */}
                <div className="testimonial-card__header">
                  <div className="testimonial-card__stars" aria-label={`${item.rating || 5} stars`}>
                    {[...Array(item.rating || 5)].map((_, sIdx) => (
                      <Star key={sIdx} size={14} fill="currentColor" className="text-[var(--copper)]" />
                    ))}
                  </div>
                  {item.verified && (
                    <span className="testimonial-card__verified">
                      <ShieldCheck size={12} />
                      <span>{item.verified}</span>
                    </span>
                  )}
                </div>

                {/* Business Impact Metric Badge */}
                {item.metric && (
                  <div className="testimonial-card__metric-badge">
                    <CheckCircle2 size={13} className="text-[var(--mint)] shrink-0" />
                    <span>{item.metric}</span>
                  </div>
                )}

                <Quote className="testimonial-card__mark" size={26} aria-hidden="true" />
                <blockquote className="testimonial-card__quote">{item.quote}</blockquote>
                
                <figcaption className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {item.initials || item.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="testimonial-card__author-info">
                    <span className="testimonial-card__name">{item.author}</span>
                    <span className="testimonial-card__role">
                      {item.role}{item.company ? ` · ${item.company}` : ''}
                    </span>
                    {item.project && (
                      <span className="testimonial-card__project">{item.project}</span>
                    )}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="section-frame px-5 md:px-8 max-w-[1040px] mx-auto scroll-mt-20">
          <div className="section-heading text-center max-w-3xl mx-auto" data-reveal>
            <p className="eyebrow justify-center"><span>09</span>{t.faq.subtitle}</p>
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
              <p className="eyebrow"><span>10</span>{t.contact.subtitle}</p>
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
                  <a href={`https://wa.me/${t.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { source_section: 'contact_section', package_id: 'general', language: lang })} className="hover:text-sage transition-colors">
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

            <form className="contact-form" data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} onSubmit={handleFormSubmit} noValidate>
              <div className="contact-form__header">
                <span>{lang === 'es' ? 'SOLICITUD DE DIAGNÓSTICO' : 'ASSESSMENT REQUEST'}</span>
                <span><i />{lang === 'es' ? 'Disponible' : 'Available'}</span>
              </div>
              {formState === 'success' ? (
                <div className="contact-form__success animate-[floatIn_0.4s_ease-out]" role="status">
                  <div className="contact-form__success-icon"><Check size={24} strokeWidth={3} /></div>
                  <h3 className="font-serif text-2xl text-ink">{t.contact.form.success}</h3>
                  <p className="text-sm text-muted leading-relaxed">{t.contact.form.success_body}</p>

                  <div className="w-full pt-3 pb-1 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleOpenSchedule(selectedService, 'form_success')}
                      className="button button--secondary w-full justify-center text-xs font-semibold py-3!"
                    >
                      <Clock3 size={16} className="text-sage" />
                      {t.contact.form.success_schedule_btn}
                    </button>

                    <a
                      href={waLink(selectedService)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('whatsapp_click', { source_section: 'form_success', package_id: selectedService, language: lang })}
                      className="button button--primary w-full justify-center"
                    >
                      <MessageCircle size={17} />{t.contact.form.success_wa}
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormState('idle');
                      setSelectedService('general');
                      setFormValues({ name: '', email: '', phone: '', industry: '', country: '', details: '' });
                      setFormErrors({});
                      setTouched({});
                    }}
                    className="text-sm text-muted hover:text-sage transition-colors pt-2"
                  >
                    {t.contact.form.success_again}
                  </button>
                </div>
              ) : (
              <>
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-muted mb-2">
                  {t.contact.form.name} <span className="text-sage">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={formValues.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={(e) => handleFieldBlur('name', e.target.value)}
                  className={`form-control ${touched.name && formErrors.name ? 'border-red-400 focus:border-red-400' : ''}`}
                  placeholder={t.contact.form.name_ph}
                  aria-invalid={touched.name && !!formErrors.name}
                  aria-describedby={touched.name && formErrors.name ? 'contact-name-error' : undefined}
                />
                {touched.name && formErrors.name && (
                  <p id="contact-name-error" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium" role="alert">
                    <span aria-hidden="true">⚠</span> {formErrors.name}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-muted mb-2">
                    {t.contact.form.email} <span className="text-sage">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formValues.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={(e) => handleFieldBlur('email', e.target.value)}
                    className={`form-control ${touched.email && formErrors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                    placeholder={t.contact.form.email_ph}
                    aria-invalid={touched.email && !!formErrors.email}
                    aria-describedby={touched.email && formErrors.email ? 'contact-email-error' : undefined}
                  />
                  {touched.email && formErrors.email && (
                    <p id="contact-email-error" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium" role="alert">
                      <span aria-hidden="true">⚠</span> {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-muted mb-2">
                    {t.contact.form.phone}
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formValues.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className="form-control"
                    placeholder={t.contact.form.phone_ph}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-service" className="block text-sm font-medium text-muted mb-2">
                  {t.contact.form.service}
                </label>
                <select
                  id="contact-service"
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
                  <label htmlFor="contact-industry" className="block text-sm font-medium text-muted mb-2">
                    {t.contact.form.industry}
                  </label>
                  <select
                    id="contact-industry"
                    name="industry"
                    value={formValues.industry}
                    onChange={(e) => handleFieldChange('industry', e.target.value)}
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
                  <label htmlFor="contact-country" className="block text-sm font-medium text-muted mb-2">
                    {t.contact.form.country}
                  </label>
                  <select
                    id="contact-country"
                    name="country"
                    value={formValues.country}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
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
                  <label htmlFor="contact-details" className="block text-sm font-medium text-muted mb-2">
                    {t.contact.form.details}
                  </label>
                  <textarea
                    id="contact-details"
                    name="details"
                    key={roiDetails || selectedService}
                    defaultValue={roiDetails || formValues.details}
                    onChange={(e) => handleFieldChange('details', e.target.value)}
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
              <li><Link to={lang === 'en' ? '/portfolio/?lang=en' : '/portfolio/'} className="hover:text-sage">Portfolio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">{t.footer.contact}</h4>
            <div className="flex flex-col gap-2">
              <a href={`https://wa.me/${t.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { source_section: 'footer', placement: 'footer', package_id: 'general', language: lang })} className="text-sm text-sage hover:underline">{t.contact.phone}</a>
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

      {/* Direct Scheduling Interactive Modal (F9) */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        lang={lang}
        preselectedPackage={schedulePackage}
        sourceSection={scheduleSource}
      />

      <WhatsAppButton lang={lang} />

    </div>
  );
}

export default App;
