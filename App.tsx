import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VoiceAssistant from './components/VoiceAssistant';
import GlobeDashboard from './components/GlobeDashboard';
import SocialConnectButtons from './components/SocialConnectButtons';
import { submitToGoogleSheet } from './utils/sheetUtils';

// Content Dictionary for Translations
const content = {
  es: {
    nav: {
      services: "Servicios",
      benefits: "Beneficios",
      testimonials: "Testimonios",
      pricing: "Precios",
      schedule: "Agendar consultoría"
    },
    hero: {
      subtitle: "INTELIGENCIA DE NEGOCIOS PARA EMPRESAS",
      title: "Tus datos, el impulso.",
      description: "Descubre oportunidades ocultas en tu negocio mediante dashboards interactivos y predicciones basadas en IA. Aumenta tus ingresos y optimiza costos hoy mismo.",
      cta_consult: "Solicita una Consultoría Gratuita",
      cta_services: "Ver Servicios",
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
    testimonials: {
      quote: "\"Gracias al equipo de Sagepoint, nuestras ventas crecieron un 20% en solo 6 meses. Ahora entendemos mejor a nuestros clientes y optimizamos el inventario cada semana.\"",
      role: "Director de Operaciones, Distribuidora XYZ"
    },
    services: {
      subtitle: "NUESTROS SERVICIOS",
      title: "¿Cómo puede la Inteligencia de Negocios reducir mis costos operativos?",
      description: "Nuestros servicios automatizan tareas críticas y detectan ineficiencias, garantizando una reducción comprobable en tiempos de operación. Actuamos como un departamento de datos externo (Soporte Cercano) para empresas en Guatemala y EE. UU., asegurando una transformación accionable.",
      items: [
        { title: "Dashboard & BI", desc: "Visualización en tiempo real de métricas y KPIs. Detecta de inmediato patrones clave con alertas como 'Stock bajo: Producto A (Reordenar)'.", tag: "Control Total" },
        { title: "Automatización Web", desc: "Integración de sistemas (CRM, ERP) con tiempos de carga rápidos y latencia optimizada para interacciones fluidas.", tag: "Eficiencia" },
        { title: "Automatización en Excel", desc: "Guía de experto para reducir el tiempo de creación de reportes recurrentes en un 80% utilizando Power Query y VBA.", tag: "Productividad" },
        { title: "Modelos Predictivos", desc: "Casos de éxito: Detección anticipada de riesgos y hasta un 20% de aumento promedio en ventas utilizando IA.", tag: "Ventaja Competitiva" },
        { title: "Data Coaching", desc: "Acompañamiento especializado 'Human-in-the-Loop'. Validamos y estructuramos a tu equipo en Guatemala y EE. UU.", tag: "Soporte Cercano" }
      ]
    },
    benefits: {
      subtitle: "¿POR QUÉ ELEGIRNOS?",
      title: "¿Por qué el componente humano (Soporte Cercano) supera al software automatizado?",
      description: "La IA a menudo puede alucinar o carecer de contexto local, pero nuestros consultores proveen asesoramiento comprobado, 'Human-in-the-Loop'. Reducimos el riesgo tecnológico actuando como estrategas que entienden tu industria, no solo como integradores.",
      list: [
        { bold: "Soporte Cercano comprobado:", text: "Acompañamiento localizado para Guatemala y Estados Unidos." },
        { bold: "Validación humana de IA:", text: "Toda métrica y predicción es validada por un consultor estratégico." },
        { bold: "Impacto garantizado de 20%:", text: "Nuestros dashboards y procesos apuntan sistemáticamente al crecimiento comercial." }
      ],
      cards: [
        { title: "Decisiones Validadas (EEAT)", desc: "Expertise demostrable donde cada recomendación analítica es curada para evitar errores u omisiones de algoritmos ciegos." },
        { title: "80% de Ahorro con VBA", desc: "Automatiza la generación manual sistemáticamente, liberando horas hombre enfocadas al crecimiento." },
        { title: "Integración In-Company", desc: "Nuestro equipo se fusiona con tus objetivos asumiendo el rol de analistas de negocio líderes de tu empresa." }
      ]
    },
    pricing: {
      subtitle: "PLANES Y PRECIOS",
      title: "¿Qué plan de Inteligencia de Negocios garantiza el mejor ROI?",
      cards: [
        {
          title: "Básico (300)",
          price: "$300",
          period: "/ mes",
          desc: "Plan fundamental para consolidar datos clave y reducir la operatividad manual.",
          features: ["1 Dashboard personalizado", "Auditoría de datos rápida", "Data Coaching inicial", "Soporte por email"],
          cta: "Elegir Básico (300)"
        },
        {
          title: "Profesional (600)",
          price: "$600",
          period: "/ mes",
          desc: "Plan corporativo avanzado con Modelos Predictivos y Soporte Cercano extendido.",
          tag: "Más Popular",
          features: ["Modelos IA Predictivos (Ventas)", "Reportes y alertas semanales", "Reducción +80% VBA/PowerQuery", "Soporte VIP Latam/US"],
          cta: "Elegir Profesional (600)"
        },
        {
          title: "Avanzado",
          price: "A Medida",
          period: "",
          desc: "Soluciones corporativas de gran escala e integración total Human-in-the-Loop.",
          features: ["Data Warehouse propio", "Algoritmos IA dedicados", "Capacitación a largo plazo", "Consultor Estratégico asignado"],
          cta: "Cotizar"
        }
      ],
      footer_text: "¿No sabes qué plan te conviene?",
      footer_link: "¡Solicita una asesoría gratuita!"
    },
    contact: {
      subtitle: "CONTACTO",
      title: "¿Listo para impulsar tu empresa con el poder de tus datos?",
      description: "Contáctanos hoy y obtén una consultoría inicial gratuita. Juntos llevaremos tu empresa al siguiente nivel, tomando decisiones informadas.",
      phone: "+502 40464716",
      email: "info@sagepoint-analytics.com",
      form: {
        name: "Nombre",
        name_ph: "Tu nombre",
        email: "Correo de trabajo",
        email_ph: "tu@empresa.com",
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
          general: "Consultoría General",
          basic: "Plan Básico ($300)",
          pro: "Plan Profesional ($600)",
          custom: "Solución a Medida"
        },
        details: "Cuéntanos más detalles",
        details_ph: "Describe tus necesidades específicas (volumen de datos, herramientas actuales, objetivos...)",
        submit: "Agendar mi Consultoría Gratuita",
        sending: "Enviando...",
        success: "¡Solicitud enviada!",
        note: "Responderemos en menos de 24 horas.",
        error: "Error de conexión. Revisa constants.ts"
      }
    },
    footer: {
      tagline: "We convert data into growth for modern companies.",
      menu: "Menu",
      legal: "Legal",
      contact: "Contact",
      rights: `© ${new Date().getFullYear()} Sagepoint Analytics. All rights reserved.`
    }
  },
  en: {
    nav: {
      services: "Services",
      benefits: "Benefits",
      testimonials: "Testimonials",
      pricing: "Pricing",
      schedule: "Schedule Consultation"
    },
    hero: {
      subtitle: "BUSINESS INTELLIGENCE FOR COMPANIES",
      title: "Your data, the momentum.",
      description: "Discover hidden opportunities in your business through interactive dashboards and AI-based predictions. Increase your revenue and optimize costs today.",
      cta_consult: "Request Free Consultation",
      cta_services: "View Services",
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
    testimonials: {
      quote: "\"Thanks to the Sagepoint team, our sales grew by 20% in just 6 months. Now we understand our customers better and optimize inventory every week.\"",
      role: "Director of Operations, XYZ Distributor"
    },
    services: {
      subtitle: "OUR SERVICES",
      title: "How can Business Intelligence reduce my operational costs?",
      description: "Our Business Intelligence services actively automate critical tasks and reveal guaranteed hidden savings. We act as an external data department (Soporte Cercano) for companies in Guatemala and the US, providing human-in-the-loop insights over blind software algorithms.",
      items: [
        { title: "Dashboard & BI", desc: "Real-time visibility into sales and KPIs. Instantly react to alerts like 'Low Stock: Product A (Reorder)'.", tag: "Total Control" },
        { title: "Web Automation", desc: "Seamless system integration (CRM, ERP) guaranteeing minimal interaction latency for dynamic elements.", tag: "Efficiency" },
        { title: "Excel Automation", desc: "A practitioner's guide to reducing manual reporting time by 80% using Power Query and VBA.", tag: "Productivity" },
        { title: "Predictive Models", desc: "Case Study Data: Anticipate risks and drive an average of 20% in sales increases through predictive forecasting.", tag: "Competitive Advantage" },
        { title: "Data Coaching", desc: "Expert Human-in-the-Loop accompaniment. We validate every data step for teams in the US and Guatemala.", tag: "Close Support" }
      ]
    },
    benefits: {
      subtitle: "WHY CHOOSE US?",
      title: "Why does practitioner-led Data Coaching out-perform standard AI tools?",
      description: "While AI alone can hallucinate or lack context, our Human-in-the-Loop approach roots every recommendation in verifiable truth. We guarantee accurate data implementation leveraging proven successes, unlike purely software-led solutions.",
      list: [
        { bold: "Soporte Cercano (Close Support):", text: "Localized, responsive strategic direction for the US and Guatemala." },
        { bold: "Verified Human Logic:", text: "Every model output is validated by a Senior Data Consultant." },
        { bold: "Documented Achievements:", text: "Our systems have driven verified 80% time reductions and 20% sales bumps." }
      ],
      cards: [
        { title: "Authoritative Decisions (EEAT)", desc: "Empower your team with curated facts instead of unchecked AI predictions, maintaining high data trust." },
        { title: "Reporting Time Solved", desc: "We deploy Power Query and VBA to eliminate repetitive 80% spreadsheet drag, unlocking growth time." },
        { title: "External Data Branch", desc: "We integrate directly, acting as your seasoned BI extension rather than a distant software vendor." }
      ]
    },
    pricing: {
      subtitle: "PLANS AND PRICING",
      title: "Which Business Intelligence tier guarantees the most immediate ROI?",
      cards: [
        {
          title: "Basic (300)",
          price: "$300",
          period: "/ month",
          desc: "Fundamental package designed to secure fast baseline data visibility.",
          features: ["1 Custom Visualization Dashboard", "Initial Data Audit Setup", "Baseline Data Coaching", "Standard Email routing"],
          cta: "Choose Basic (300)"
        },
        {
          title: "Professional (600)",
          price: "$600",
          period: "/ month",
          desc: "Optimized corporate plan providing predictive edge and extended Soporte Cercano.",
          tag: "Most Popular",
          features: ["Predictive Models for Sales", "80% reporting time optimization", "Priority Close Support (Latam/US)", "Weekly real-time alerts"],
          cta: "Choose Professional (600)"
        },
        {
          title: "Advanced",
          price: "Custom",
          period: "",
          desc: "Full-scale corporate infrastructure and permanent Human-in-the-loop transformation.",
          features: ["Dedicated Data Warehouse", "Multiple Custom AI Models", "Full-Company Data Coaching", "Dedicated Senior Consultant"],
          cta: "Get Quote"
        }
      ],
      footer_text: "Don't know which plan suits you?",
      footer_link: "Request a free advisory!"
    },
    contact: {
      subtitle: "CONTACT",
      title: "Ready to boost your company with the power of your data?",
      description: "Contact us today and get a free initial consultation. Together we will take your company to the next level, making informed decisions.",
      phone: "+502 40464716",
      email: "info@sagepoint-analytics.com",
      form: {
        name: "Name",
        name_ph: "Your name",
        email: "Work Email",
        email_ph: "you@company.com",
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
          general: "General Consultation",
          basic: "Basic Plan ($300)",
          pro: "Professional Plan ($600)",
          custom: "Custom Solution"
        },
        details: "Tell us more details",
        details_ph: "Describe your specific needs (data volume, current tools, goals...)",
        submit: "Schedule my Free Consultation",
        sending: "Sending...",
        success: "Request sent!",
        note: "We will respond in less than 24 hours.",
        error: "Connection error. Check constants.ts"
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

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [selectedService, setSelectedService] = useState('Consultoría General');

  // Language State
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const t = content[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper for smooth scrolling preventing default navigation
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    let serviceValue = formData.get('service') as string;
    const industry = formData.get('industry') as string;
    const country = formData.get('country') as string;
    const details = formData.get('details') as string; // Fix: Define details

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

    if (serviceValue === 'Solución a Medida' && details) {
      serviceValue += ` | Detalles: ${details}`;
    }

    const data = {
      name: name,
      email: email,
      industry: industry || 'No especificado',
      country: country || 'No especificado',
      service: serviceValue,
      language: lang === 'es' ? 'Español' : 'English',
      type: 'Formulario Web'
    };

    // Send to Google Sheet
    const success = await submitToGoogleSheet(data);

    if (success) {
      setFormState('success');
      // Reset after a delay
      setTimeout(() => {
        setFormState('idle');
        setSelectedService(t.contact.form.options.general); // Reset selection
        (e.target as HTMLFormElement).reset();
      }, 3000);
    } else {
      setFormState('error');
      // alert("Error: No se pudo conectar con la hoja de cálculo. Verifica la URL en 'constants.ts'.");
      setTimeout(() => setFormState('idle'), 4000);
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-slate-300 min-h-screen relative overflow-x-hidden selection:bg-sage/30 selection:text-sage">

      {/* Background Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[520px] h-[520px] bg-sage/35 rounded-full blur-[100px] -bottom-44 -left-32 opacity-50" />
        <div className="absolute w-[300px] h-[300px] bg-deep-sage/30 rounded-full blur-[80px] top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(240,248,246,0.06)_1px,transparent_1px)] [background-size:26px_26px] opacity-40" />
      </div>

      {/* Navigation */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${isScrolled ? 'bg-[#070d0e]/90 border-slate-300/10 py-3' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="/" onClick={scrollToTop} className="font-serif text-2xl font-bold text-ink tracking-tight">Sagepoint</a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a href="#services" onClick={(e) => handleScrollToSection(e, 'services')} className="hover:text-sage transition-colors">{t.nav.services}</a>
            <a href="#why-us" onClick={(e) => handleScrollToSection(e, 'why-us')} className="hover:text-sage transition-colors">{t.nav.benefits}</a>
            <a href="#pricing" onClick={(e) => handleScrollToSection(e, 'pricing')} className="hover:text-sage transition-colors">{t.nav.pricing}</a>
            <Link to="/portfolio" className="hover:text-sage transition-colors">Portfolio</Link>

            {/* Language Toggles */}
            <div className="flex items-center gap-2 px-2 border-l border-slate-700/50">
              <button
                onClick={() => setLang('es')}
                className={`text-xl hover:scale-110 transition-transform ${lang === 'es' ? 'opacity-100' : 'opacity-40 grayscale'}`}
                title="Español"
              >
                🇬🇹
              </button>
              <button
                onClick={() => setLang('en')}
                className={`text-xl hover:scale-110 transition-transform ${lang === 'en' ? 'opacity-100' : 'opacity-40 grayscale'}`}
                title="English"
              >
                🇺🇸
              </button>
            </div>

            <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} className="px-5 py-2.5 rounded-full border border-sage/40 text-sage bg-[#0f1a1c]/80 hover:bg-[#0f1a1c] hover:-translate-y-px hover:shadow-[0_8px_22px_rgba(47,176,148,0.35)] transition-all duration-200">
              {t.nav.schedule}
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">

        {/* Hero Section */}
        <section className="pt-24 pb-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-[floatIn_0.9s_ease-out]">
            <p className="text-xs font-bold tracking-[0.14em] text-deep-sage uppercase">{t.hero.subtitle}</p>
            <h1 className="font-serif text-5xl md:text-6xl text-ink leading-[1.1]">
              {t.hero.title}
            </h1>
            <p className="text-lg text-muted max-w-lg leading-relaxed">
              {t.hero.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} className="px-6 py-3 rounded-full font-semibold bg-deep-sage text-dark hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(47,176,148,0.35)] transition-all">
                {t.hero.cta_consult}
              </a>
              <a href="#services" onClick={(e) => handleScrollToSection(e, 'services')} className="px-6 py-3 rounded-full font-semibold border border-slate-300/20 text-ink bg-[#0f1a1c]/85 hover:-translate-y-1 transition-transform">
                {t.hero.cta_services}
              </a>
            </div>
            <SocialConnectButtons lang={lang} />

            {/* Metrics / Social Proof */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-300/10">
              <div>
                <span className="block text-xl font-bold text-ink">80%</span>
                <p className="text-sm text-muted">{t.hero.metrics.savings}</p>
              </div>
              <div>
                <span className="block text-xl font-bold text-ink">+20%</span>
                <p className="text-sm text-muted">{t.hero.metrics.sales}</p>
              </div>
              <div>
                <span className="block text-xl font-bold text-ink">24/7</span>
                <p className="text-sm text-muted">{t.hero.metrics.visibility}</p>
              </div>
            </div>
          </div>

          <GlobeDashboard texts={{
            title: t.hero.dashboard.title,
            updated: t.hero.dashboard.updated,
            stockAlert: t.hero.dashboard.stock,
            goalAlert: t.hero.dashboard.goal
          }} />
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-20">
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-bold tracking-widest text-deep-sage uppercase mb-3">{t.services.subtitle}</p>
            <h2 className="font-serif text-4xl text-ink mb-4">{t.services.title}</h2>
            <p className="text-lg text-muted">
              {t.services.description}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {t.services.items.map((service, i) => (
              <article key={i} className="bg-[#0f191b]/80 border border-slate-300/10 p-6 rounded-[18px] hover:bg-[#0f191b] hover:translate-y-[-4px] transition-all duration-300 shadow-xl flex-1 min-w-[280px] max-w-[400px]">
                <h3 className="font-serif text-xl text-ink mb-3">{service.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-6">{service.desc}</p>
                <span className="text-xs font-bold text-deep-sage uppercase tracking-wider">{service.tag}</span>
              </article>
            ))}
          </div>
        </section>

        {/* Why Us / Benefits Section (Formerly Automation) */}
        <section id="why-us" className="py-24 px-6 bg-[#0d1719]/50 border-y border-slate-300/5 scroll-mt-20">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest text-deep-sage uppercase mb-3">{t.benefits.subtitle}</p>
              <h2 className="font-serif text-4xl text-ink mb-6">{t.benefits.title}</h2>
              <p className="text-lg text-muted mb-8">
                {t.benefits.description}
              </p>
              <ul className="space-y-4">
                {t.benefits.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-sage/20 text-sage flex items-center justify-center text-xs">✓</div>
                    <span className="text-slate-300"><strong className="text-ink">{item.bold}</strong> {item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {t.benefits.cards.map((benefit, i) => (
                <div key={i} className="flex gap-6 p-6 bg-[#0e181a] border-l-4 border-sage rounded-r-2xl shadow-lg hover:shadow-sage/10 transition-shadow">
                  <div className="pt-1">
                    <div className="w-8 h-8 rounded-full bg-sage/20 text-sage flex items-center justify-center font-bold font-serif">{i + 1}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-ink mb-1">{benefit.title}</h3>
                    <p className="text-muted text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-20">
          <div className="bg-gradient-to-br from-sage/10 to-copper/5 rounded-[32px] p-8 md:p-12 lg:p-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold tracking-widest text-deep-sage uppercase mb-3">{t.pricing.subtitle}</p>
              <h2 className="font-serif text-4xl text-ink">{t.pricing.title}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {t.pricing.cards.map((plan, i) => {
                const isPro = i === 1;
                return (
                  <div key={i} className={`bg-dark p-8 rounded-3xl shadow-xl flex flex-col transition-all duration-300 ${isPro ? 'border-2 border-deep-sage relative transform md:-translate-y-4 shadow-2xl' : 'border border-slate-300/10 hover:border-slate-300/30'}`}>
                    {isPro && <div className="absolute top-4 right-4 bg-deep-sage text-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{plan.tag}</div>}
                    <h3 className="font-serif text-2xl text-ink">{plan.title}</h3>
                    <p className="text-3xl font-bold text-ink mt-4 mb-6">{plan.price} <span className="text-lg font-normal text-muted">{plan.period}</span></p>
                    <p className="text-sm text-muted mb-6 italic">{plan.desc}</p>
                    <ul className="space-y-3 text-muted text-sm mb-8 flex-1">
                      {plan.features.map((feat, j) => (
                        <li key={j} className={isPro && j === 0 ? 'text-sage font-medium' : ''}>• {feat}</li>
                      ))}
                    </ul>
                    <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} className={`w-full py-3 rounded-full text-center font-semibold transition-all ${isPro ? 'bg-deep-sage text-dark font-bold hover:shadow-lg hover:-translate-y-1' : 'border border-slate-300/20 text-ink hover:bg-slate-800'}`}>
                      {plan.cta}
                    </a>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted mb-4">{t.pricing.footer_text}</p>
              <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')} className="text-sage font-bold hover:underline">{t.pricing.footer_link}</a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="pb-24 px-6 max-w-6xl mx-auto scroll-mt-20">
          <div className="bg-[#0d1719]/95 border border-slate-300/10 rounded-[28px] p-8 md:p-12 shadow-[0_24px_60px_rgba(2,6,7,0.6)] grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest text-deep-sage uppercase mb-3">{t.contact.subtitle}</p>
              <h2 className="font-serif text-4xl text-ink mb-6">{t.contact.title}</h2>
              <p className="text-muted text-lg mb-6">
                {t.contact.description}
              </p>
              <div className="space-y-2 text-sm text-slate-400">
                <p>
                  <a href={`https://wa.me/${t.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-sage transition-colors">
                    📱 {t.contact.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${t.contact.email}`} className="hover:text-sage transition-colors">
                    ✉️ {t.contact.email}
                  </a>
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.name}</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-[#080f10] border border-slate-300/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors"
                  placeholder={t.contact.form.name_ph}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.email}</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-[#080f10] border border-slate-300/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors"
                  placeholder={t.contact.form.email_ph}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.service}</label>
                <select
                  name="service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-[#080f10] border border-slate-300/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors"
                >
                  <option value="Consultoría General">{t.contact.form.options.general}</option>
                  <option value="Plan Básico">{t.contact.form.options.basic}</option>
                  <option value="Plan Profesional">{t.contact.form.options.pro}</option>
                  <option value="Solución a Medida">{t.contact.form.options.custom}</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.industry}</label>
                  <select
                    name="industry"
                    className="w-full bg-[#080f10] border border-slate-300/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors"
                  >
                    <option value="">{t.contact.form.industry_ph}</option>
                    {Object.entries(t.contact.form.industry_options).map(([key, label]) => (
                      <option key={key} value={label as string}>{label as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.country}</label>
                  <select
                    name="country"
                    className="w-full bg-[#080f10] border border-slate-300/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors"
                  >
                    <option value="">{t.contact.form.country_ph}</option>
                    {Object.entries(t.contact.form.country_options).map(([key, label]) => (
                      <option key={key} value={label as string}>{label as string}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedService === 'Solución a Medida' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-muted mb-2">{t.contact.form.details}</label>
                  <textarea
                    name="details"
                    rows={3}
                    className="w-full bg-[#080f10] border border-slate-300/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper transition-colors placeholder:text-muted/40"
                    placeholder={t.contact.form.details_ph}
                  ></textarea>
                </div>
              )}

              <button
                type="submit"
                disabled={formState !== 'idle' && formState !== 'error'}
                className={`w-full py-4 rounded-full font-bold transition-all duration-300 
                  ${formState === 'success' ? 'bg-green-500 text-white' : ''}
                  ${formState === 'error' ? 'bg-red-500/20 border border-red-500 text-red-400' : ''}
                  ${formState === 'idle' ? 'bg-deep-sage text-dark hover:shadow-[0_10px_25px_rgba(47,176,148,0.25)] hover:-translate-y-1' : ''}
                  ${formState === 'sending' ? 'bg-deep-sage/50 text-dark opacity-80 cursor-wait' : ''}
                `}
              >
                {formState === 'idle' && t.contact.form.submit}
                {formState === 'sending' && t.contact.form.sending}
                {formState === 'success' && t.contact.form.success}
                {formState === 'error' && t.contact.form.error}
              </button>
              <p className="text-xs text-center text-muted/60">{t.contact.form.note}</p>
            </form>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-300/5 bg-[#070d0e] pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1">
            <a href="/" onClick={scrollToTop} className="font-serif text-2xl font-bold text-ink tracking-tight mb-4 block">Sagepoint</a>
            <p className="text-sm text-muted">{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className="font-bold text-ink mb-4">{t.footer.menu}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#services" onClick={(e) => handleScrollToSection(e, 'services')} className="hover:text-sage">{t.nav.services}</a></li>
              <li><a href="#why-us" onClick={(e) => handleScrollToSection(e, 'why-us')} className="hover:text-sage">{t.nav.benefits}</a></li>
              <li><a href="#pricing" onClick={(e) => handleScrollToSection(e, 'pricing')} className="hover:text-sage">{t.nav.pricing}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-ink mb-4">{t.footer.contact}</h4>
            <div className="flex flex-col gap-2">
              <a href={`https://wa.me/${t.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-sage hover:underline">{t.contact.phone}</a>
              <a href={`mailto:${t.contact.email}`} className="text-sm text-sage hover:underline">{t.contact.email}</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center text-xs text-muted/40">
          {t.footer.rights}
        </div>
      </footer>

      <VoiceAssistant lang={lang} />

    </div>
  );
}

export default App;
