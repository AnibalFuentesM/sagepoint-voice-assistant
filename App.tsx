import React, { useEffect, useState } from 'react';
import VoiceAssistant from './components/VoiceAssistant';
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
        title: "Tus Ventas en Tiempo Real",
        updated: "Actualizado",
        projection: "Proyección de Ingresos (IA)",
        trend: "Tendencia positiva detectada",
        alerts: "Alertas Inteligentes",
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
      title: "Soluciones a la medida de tu negocio.",
      description: "Implementamos tecnología accesible para resolver problemas reales de las empresas: falta de tiempo, datos dispersos y decisiones \"a ciegas\".",
      items: [
        { title: "Dashboard & BI", desc: "Visualiza tus ventas, gastos y KPI clave en un solo lugar. Toma decisiones informadas en tiempo real.", tag: "Control Total" },
        { title: "Automatización Web", desc: "Conecta tus sistemas (CRM, ERP) y ahorra hasta un 80% del tiempo en reportes recurrentes.", tag: "Eficiencia" },
        { title: "Automatización en Excel", desc: "Optimizamos tus hojas de cálculo con Macros (VBA) y Power Query para reducir errores y tiempo manual.", tag: "Productividad" },
        { title: "Modelos Predictivos", desc: "Anticípate al futuro. Usa IA para proyectar ventas y detectar riesgos antes de que ocurran.", tag: "Ventaja Competitiva" },
        { title: "Data Coaching", desc: "Acompañamiento experto. Guiamos a tu equipo paso a paso en su transformación digital.", tag: "Soporte Cercano" }
      ]
    },
    benefits: {
      subtitle: "¿POR QUÉ ELEGIRNOS?",
      title: "Tu aliado estratégico en analítica.",
      description: "Entendemos los desafíos de las empresas medianas. No te vendemos software complicado, te damos soluciones que se pagan solas con el ahorro y el crecimiento que generan.",
      list: [
        { bold: "Tecnología accesible:", text: "Herramientas modernas al alcance de tu presupuesto." },
        { bold: "Resultados rápidos:", text: "Verás mejoras tangibles en los primeros meses." },
        { bold: "Sin jerga técnica:", text: "Hablamos tu idioma de negocios." }
      ],
      cards: [
        { title: "Decisiones con Datos", desc: "Crea una cultura donde cada decisión importante se respalda con hechos, no intuiciones." },
        { title: "Ahorro de Tiempo", desc: "Automatiza tareas repetitivas y reduce errores humanos drásticamente." },
        { title: "Soporte Personalizado", desc: "Nuestro equipo te guía paso a paso, actuando como tu departamento de datos externo." }
      ]
    },
    pricing: {
      subtitle: "PLANES Y PRECIOS",
      title: "Inversión clara, retorno medible.",
      cards: [
        {
          title: "Básico",
          price: "$300",
          period: "/ mes",
          desc: "Ideal para pequeñas empresas que inician.",
          features: ["1 Dashboard personalizado", "Informe mensual de resultados", "Configuración inicial de datos", "Soporte por email"],
          cta: "Elegir Básico"
        },
        {
          title: "Profesional",
          price: "$600",
          period: "/ mes",
          desc: "Para empresas en crecimiento.",
          tag: "Más Popular",
          features: ["Todo en Básico", "3 dashboards al mes", "Informes semanales", "1 Modelo predictivo (Ventas)", "Soporte prioritario"],
          cta: "Elegir Profesional"
        },
        {
          title: "Avanzado",
          price: "A Medida",
          period: "",
          desc: "Soluciones corporativas personalizadas.",
          features: ["Múltiples modelos de IA", "Data Warehouse propio", "Capacitación in-company", "Consultor dedicado"],
          cta: "Cotizar"
        }
      ],
      footer_text: "¿No sabes qué plan te conviene?",
      footer_link: "¡Solicita una asesoría gratuita!"
    },
    contact: {
      subtitle: "CONTACTO",
      title: "Ready to boost your company with the power of your data?",
      description: "Contact us today and get a free initial consultation. Together we will take your company to the next level, making informed decisions.",
      form: {
        name: "Name",
        name_ph: "Your name",
        email: "Work Email",
        email_ph: "you@company.com",
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
        success: "¡Solicitud enviada!",
        note: "We will respond in less than 24 hours.",
        error: "Error de conexión. Revisa constants.ts"
      }
    },
    footer: {
      tagline: "We convert data into growth for modern companies.",
      menu: "Menu",
      legal: "Legal",
      contact: "Contact",
      rights: "© 2024 Sagepoint Analytics. All rights reserved."
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
        title: "Your Real-Time Sales",
        updated: "Updated",
        projection: "Revenue Projection (AI)",
        trend: "Positive trend detected",
        alerts: "Smart Alerts",
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
      title: "Solutions tailored to your business.",
      description: "We implement accessible technology to solve real business problems: lack of time, scattered data, and \"blind\" decisions.",
      items: [
        { title: "Dashboard & BI", desc: "Visualize your sales, expenses, and key KPIs in one place. Make informed decisions in real-time.", tag: "Total Control" },
        { title: "Web Automation", desc: "Connect your systems (CRM, ERP) and save up to 80% of time on recurring reports.", tag: "Efficiency" },
        { title: "Excel Automation", desc: "We optimize your spreadsheets with Macros (VBA) and Power Query to reduce errors and manual time.", tag: "Productivity" },
        { title: "Predictive Models", desc: "Anticipate the future. Use AI to project sales and detect risks before they happen.", tag: "Competitive Advantage" },
        { title: "Data Coaching", desc: "Expert accompaniment. We guide your team step by step in their digital transformation.", tag: "Close Support" }
      ]
    },
    benefits: {
      subtitle: "WHY CHOOSE US?",
      title: "Your strategic ally in analytics.",
      description: "We understand the challenges of medium-sized businesses. We don't sell you complicated software; we give you solutions that pay for themselves with the savings and growth they generate.",
      list: [
        { bold: "Accessible technology:", text: "Modern tools within your budget." },
        { bold: "Fast results:", text: "You will see tangible improvements in the first few months." },
        { bold: "No technical jargon:", text: "We speak your business language." }
      ],
      cards: [
        { title: "Data-Driven Decisions", desc: "Create a culture where every important decision is backed by facts, not intuition." },
        { title: "Time Savings", desc: "Automate repetitive tasks and drastically reduce human errors." },
        { title: "Personalized Support", desc: "Our team guides you step by step, acting as your external data department." }
      ]
    },
    pricing: {
      subtitle: "PLANS AND PRICING",
      title: "Clear investment, measurable return.",
      cards: [
        {
          title: "Basic",
          price: "$300",
          period: "/ month",
          desc: "Ideal for small businesses starting out.",
          features: ["1 Custom Dashboard", "Monthly result report", "Initial data setup", "Email support"],
          cta: "Choose Basic"
        },
        {
          title: "Professional",
          price: "$600",
          period: "/ month",
          desc: "For growing companies.",
          tag: "Most Popular",
          features: ["Everything in Basic", "3 dashboards per month", "Weekly reports", "1 Predictive model (Sales)", "Priority support"],
          cta: "Choose Professional"
        },
        {
          title: "Advanced",
          price: "Custom",
          period: "",
          desc: "Custom corporate solutions.",
          features: ["Multiple AI models", "Own Data Warehouse", "In-company training", "Dedicated consultant"],
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
      form: {
        name: "Name",
        name_ph: "Your name",
        email: "Work Email",
        email_ph: "you@company.com",
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
      rights: "© 2024 Sagepoint Analytics. All rights reserved."
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

    if (serviceValue === 'Solución a Medida' && details) {
      serviceValue += ` | Detalles: ${details}`;
    }

    const data = {
      name: name,
      email: email,
      service: serviceValue,
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

          <div className="relative animate-[floatIn_0.9s_ease-out_0.15s_both]">
            <div className="bg-[#0f191b]/95 border border-slate-300/10 rounded-3xl p-6 shadow-[0_24px_60px_rgba(2,6,7,0.6)] backdrop-blur-sm">
              <div className="flex justify-between items-center text-sm mb-6 border-b border-slate-300/10 pb-4">
                <span className="text-muted">{t.hero.dashboard.title}</span>
                <span className="text-deep-sage font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-deep-sage animate-pulse"></span>
                  {t.hero.dashboard.updated}
                </span>
              </div>
              <div className="space-y-4">
                <div className="bg-mist p-4 rounded-2xl">
                  <h3 className="font-serif text-ink mb-4">{t.hero.dashboard.projection}</h3>
                  {/* Trend text removed */}
                  <div className="flex items-end gap-2 h-20">
                    {[42, 58, 65, 80].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-lg opacity-90 bg-gradient-to-b from-sage to-deep-sage" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
                <div className="bg-mist p-4 rounded-2xl">
                  <h3 className="font-serif text-ink mb-3">{t.hero.dashboard.alerts}</h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-copper"></div>
                      {t.hero.dashboard.stock}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sage"></div>
                      {t.hero.dashboard.goal}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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
                  <a href="https://wa.me/50240464716" target="_blank" rel="noopener noreferrer" className="hover:text-sage transition-colors">
                    📱 +502 40464716
                  </a>
                </p>
                <p>
                  <a href="mailto:info@sagepoint-analytics.com" className="hover:text-sage transition-colors">
                    ✉️ info@sagepoint-analytics.com
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
              <a href="https://wa.me/50240464716" target="_blank" rel="noopener noreferrer" className="text-sm text-sage hover:underline">+502 40464716</a>
              <a href="mailto:info@sagepoint-analytics.com" className="text-sm text-sage hover:underline">info@sagepoint-analytics.com</a>
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