import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  Clock3,
  ArrowUpRight,
  MessageCircle,
  MoveRight,
  ShieldCheck,
  Zap,
  FileCheck,
  UsersRound,
  Layers,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export type PackageId = 'quick-win' | 'executive' | 'custom' | 'retainer' | 'general';
export type PersonaPreset = 'starter' | 'growth' | 'enterprise' | 'retainer';

export interface PackageMatrixProps {
  lang: 'es' | 'en';
  selectedPackage: PackageId;
  onSelectPackage: (id: PackageId) => void;
  waLink: (id: PackageId) => string;
}

export const packageMatrixContent = {
  es: {
    eyebrow: "PAQUETES Y PRECIOS TRANSPARENTES",
    title: "Proyectos con entregable, plazo y precio claros.",
    subtitle: "Sin suscripciones abiertas ni alcances difusos: cada paquete define exactamente qué recibes, cuándo y por cuánto.",
    timeline_label: "Plazo",
    excludes_label: "No incluye",
    persona_filter_label: "¿Cuál es el perfil de tu empresa?",
    personas: [
      {
        id: 'starter' as PersonaPreset,
        label: "PYME en Crecimiento",
        match: "Recomendado: Quick-Win",
        desc: "5–25 empleados · Reportes en Excel · Necesidad de KPIs rápidos",
        targetTier: 'quick-win' as PackageId,
      },
      {
        id: 'growth' as PersonaPreset,
        label: "Empresa en Expansión",
        match: "Recomendado: Ejecutivo",
        desc: "20–150 empleados · Múltiples fuentes (ERP/CRM) · Automatización",
        targetTier: 'executive' as PackageId,
      },
      {
        id: 'enterprise' as PersonaPreset,
        label: "Corporativo / Medida",
        match: "Recomendado: Custom",
        desc: "150+ empleados · Data Warehouse · Modelos IA predictivos",
        targetTier: 'custom' as PackageId,
      },
      {
        id: 'retainer' as PersonaPreset,
        label: "Mantenimiento Continuo",
        match: "Recomendado: Retainer",
        desc: "Soporte mensual · Coaching · Nuevos reportes y ajustes",
        targetTier: 'retainer' as PackageId,
      },
    ],
    guarantees: [
      {
        icon: Zap,
        title: "Garantía 14 Días",
        desc: "Tu primer dashboard Quick-Win entregado en 2 semanas o ajustamos sin costo.",
      },
      {
        icon: ShieldCheck,
        title: "100% Propiedad de Datos",
        desc: "Todo el código, dashboards y pipelines pertenecen a tu empresa.",
      },
      {
        icon: FileCheck,
        title: "Sin Contratos Forzosos",
        desc: "Proyectos por entregable cerrado. Continúas solo si ves valor real.",
      },
    ],
    cards: [
      {
        id: 'quick-win' as PackageId,
        title: "Diagnóstico Express + Dashboard Quick-Win",
        price: "$750",
        period: "pago único",
        timeline: "2 semanas",
        desc: "La forma más rápida de ver tus datos trabajando: auditoría + un dashboard accionable.",
        features: [
          "Auditoría de hasta 2 fuentes de datos",
          "1 dashboard con hasta 8 KPIs clave",
          "Informe de oportunidades priorizadas",
          "1 ronda de revisiones",
        ],
        excludes: "Automatización, integraciones y modelos predictivos.",
        cta: "Empezar con el diagnóstico",
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
        features: [
          "Hasta 4 fuentes de datos integradas",
          "Hasta 3 dashboards ejecutivos",
          "Automatización de 1 flujo de reportes (−80% de tiempo)",
          "2 sesiones de capacitación + documentación",
          "2 rondas de revisiones",
        ],
        excludes: "Data warehouse y modelos IA a medida.",
        cta: "Cotizar mi proyecto",
      },
      {
        id: 'custom' as PackageId,
        title: "Solución a Medida",
        price: "Cotización",
        period: "",
        timeline: "a definir",
        desc: "Modelos IA, integraciones CRM/ERP y data warehouse para necesidades corporativas.",
        features: [
          "Modelos predictivos dedicados",
          "Integraciones CRM/ERP",
          "Data warehouse propio",
          "Alcance definido en cotización formal",
        ],
        excludes: "",
        cta: "Hablar con un consultor",
      },
    ],
    retainer: {
      id: 'retainer' as PackageId,
      tag: "Add-on mensual",
      title: "Soporte Cercano Mensual",
      price: "$300 / $600 / $1,000",
      period: "/ mes",
      desc: "Continuidad después de tu proyecto: mantenimiento de dashboards, ajustes, coaching y línea directa de WhatsApp prioritaria. Tiers según intensidad de soporte, con horas mensuales definidas y no acumulables.",
      cta: "Agregar Soporte Cercano",
    },
    matrix_title: "Comparativa Completa de Entregables",
    matrix_headers: {
      deliverable: "Entregable / Alcance",
      quick_win: "Quick-Win ($750)",
      executive: "Ejecutivo ($2,500+) ⭐",
      custom: "Solución a Medida",
      retainer: "Soporte Mensual",
    },
    matrix_rows: [
      {
        label: "Plazo de Entrega Garantizado",
        quick_win: "14 días (2 semanas)",
        executive: "4 a 6 semanas",
        custom: "Según alcance técnico",
        retainer: "Recurrente mensual",
      },
      {
        label: "Fuentes de Datos Integradas",
        quick_win: "Hasta 2 fuentes (Excel/Sheets)",
        executive: "Hasta 4 fuentes (ERP/CRM/POS)",
        custom: "Ilimitadas / Multi-cloud",
        retainer: "Mantenimiento existentes",
      },
      {
        label: "Dashboards Ejecutivos",
        quick_win: "1 dashboard (hasta 8 KPIs)",
        executive: "Hasta 3 dashboards completos",
        custom: "Ilimitados a medida",
        retainer: "Nuevas vistas y ajustes",
      },
      {
        label: "Automatización de Reportes",
        quick_win: "Auditoría de oportunidades",
        executive: "1 flujo clave (−80% tiempo)",
        custom: "Pipelines complejos + IA",
        retainer: "Optimización continua",
      },
      {
        label: "Capacitación & Documentación",
        quick_win: "Informe ejecutivo",
        executive: "2 sesiones en vivo + guías",
        custom: "Plan de adopción completo",
        retainer: "Coaching mensual 1 a 1",
      },
      {
        label: "Rondas de Revisiones",
        quick_win: "1 ronda incluida",
        executive: "2 rondas incluidas",
        custom: "Iteraciones continuas",
        retainer: "Ajustes mensuales",
      },
      {
        label: "Propiedad de Código y Datos",
        quick_win: "100% de tu empresa",
        executive: "100% de tu empresa",
        custom: "100% de tu empresa",
        retainer: "100% de tu empresa",
      },
      {
        label: "Soporte por WhatsApp",
        quick_win: "Durante el proyecto",
        executive: "Durante el proyecto",
        custom: "Dedicado prioritario",
        retainer: "Línea directa mensual",
      },
    ],
    footer_text: "¿No sabes qué paquete te conviene?",
    footer_link: "El diagnóstico inicial es gratuito — agéndalo aquí.",
  },
  en: {
    eyebrow: "TRANSPARENT PACKAGES & PRICING",
    title: "Projects with a clear deliverable, timeline, and price.",
    subtitle: "No open-ended subscriptions or fuzzy scopes: each package specifies exactly what you receive, when, and for how much.",
    timeline_label: "Timeline",
    excludes_label: "Does not include",
    persona_filter_label: "What is your company profile?",
    personas: [
      {
        id: 'starter' as PersonaPreset,
        label: "Growing SME",
        match: "Recommended: Quick-Win",
        desc: "5–25 team · Excel reporting · Fast KPI visibility without risk",
        targetTier: 'quick-win' as PackageId,
      },
      {
        id: 'growth' as PersonaPreset,
        label: "Expanding Business",
        match: "Recommended: Executive",
        desc: "20–150 team · Multi-source (ERP/CRM) · Report automation",
        targetTier: 'executive' as PackageId,
      },
      {
        id: 'enterprise' as PersonaPreset,
        label: "Enterprise Scale",
        match: "Recommended: Custom",
        desc: "150+ team · Data Warehouse · Dedicated predictive AI",
        targetTier: 'custom' as PackageId,
      },
      {
        id: 'retainer' as PersonaPreset,
        label: "Ongoing Continuity",
        match: "Recommended: Retainer",
        desc: "Monthly support · Coaching · Adjustments & new metrics",
        targetTier: 'retainer' as PackageId,
      },
    ],
    guarantees: [
      {
        icon: Zap,
        title: "14-Day Turnaround",
        desc: "First Quick-Win dashboard deployed in 2 weeks or revised at no cost.",
      },
      {
        icon: ShieldCheck,
        title: "100% Data Ownership",
        desc: "All code, dashboards, and automated pipelines belong entirely to you.",
      },
      {
        icon: FileCheck,
        title: "No Long-Term Lock-in",
        desc: "Fixed-scope deliverables. Retain us only because you see tangible ROI.",
      },
    ],
    cards: [
      {
        id: 'quick-win' as PackageId,
        title: "Express Assessment + Quick-Win Dashboard",
        price: "$750",
        period: "one-time payment",
        timeline: "2 weeks",
        desc: "The fastest way to see your data working: audit + an actionable dashboard.",
        features: [
          "Audit of up to 2 data sources",
          "1 dashboard with up to 8 key KPIs",
          "Prioritized opportunities report",
          "1 round of revisions",
        ],
        excludes: "Automation, integrations and predictive models.",
        cta: "Start with assessment",
      },
      {
        id: 'executive' as PackageId,
        title: "Executive Dashboard + Automation",
        pricePrefix: "from",
        price: "$2,500",
        period: "per project",
        timeline: "4–6 weeks",
        desc: "The full suite: complete business visibility and self-generating reports.",
        tag: "Most Popular",
        features: [
          "Up to 4 integrated data sources",
          "Up to 3 executive dashboards",
          "Automation of 1 reporting flow (−80% time)",
          "2 live training sessions + documentation",
          "2 rounds of revisions",
        ],
        excludes: "Data warehouse and custom AI models.",
        cta: "Request a quote",
      },
      {
        id: 'custom' as PackageId,
        title: "Custom Solution",
        price: "Quote",
        period: "",
        timeline: "to define",
        desc: "AI models, CRM/ERP integrations, and dedicated data warehouse for enterprise needs.",
        features: [
          "Dedicated predictive models",
          "CRM/ERP integrations",
          "Custom data warehouse",
          "Scope defined in formal quote",
        ],
        excludes: "",
        cta: "Talk to a consultant",
      },
    ],
    retainer: {
      id: 'retainer' as PackageId,
      tag: "Monthly add-on",
      title: "Soporte Cercano Monthly Support",
      price: "$300 / $600 / $1,000",
      period: "/ month",
      desc: "Post-project continuity: dashboard maintenance, adjustments, coaching, and priority WhatsApp line. Tiers based on support intensity with defined, non-cumulative monthly hours.",
      cta: "Add Soporte Cercano",
    },
    matrix_title: "Full Deliverables & Features Matrix",
    matrix_headers: {
      deliverable: "Deliverable / Scope",
      quick_win: "Quick-Win ($750)",
      executive: "Executive ($2,500+) ⭐",
      custom: "Custom Solution",
      retainer: "Monthly Retainer",
    },
    matrix_rows: [
      {
        label: "Guaranteed Turnaround",
        quick_win: "14 days (2 weeks)",
        executive: "4 to 6 weeks",
        custom: "Based on scope",
        retainer: "Monthly ongoing",
      },
      {
        label: "Integrated Data Sources",
        quick_win: "Up to 2 sources (Excel/Sheets)",
        executive: "Up to 4 sources (ERP/CRM/POS)",
        custom: "Unlimited / Multi-cloud",
        retainer: "Existing maintenance",
      },
      {
        label: "Executive Dashboards",
        quick_win: "1 dashboard (up to 8 KPIs)",
        executive: "Up to 3 full dashboards",
        custom: "Unlimited custom views",
        retainer: "New KPIs & adjustments",
      },
      {
        label: "Reporting Automation",
        quick_win: "Opportunity audit report",
        executive: "1 core flow (−80% time)",
        custom: "Complex pipelines + AI",
        retainer: "Continuous optimization",
      },
      {
        label: "Training & Documentation",
        quick_win: "Executive report",
        executive: "2 live sessions + video guides",
        custom: "Full adoption plan",
        retainer: "1-on-1 monthly coaching",
      },
      {
        label: "Revision Rounds",
        quick_win: "1 round included",
        executive: "2 rounds included",
        custom: "Continuous iterations",
        retainer: "Monthly adjustments",
      },
      {
        label: "Code & Data Ownership",
        quick_win: "100% yours",
        executive: "100% yours",
        custom: "100% yours",
        retainer: "100% yours",
      },
      {
        label: "WhatsApp Support Line",
        quick_win: "During project",
        executive: "During project",
        custom: "24/7 dedicated line",
        retainer: "Direct monthly access",
      },
    ],
    footer_text: "Not sure which package fits you best?",
    footer_link: "The initial assessment is free — book it here.",
  },
};

export const PackageMatrix: React.FC<PackageMatrixProps> = ({
  lang,
  selectedPackage,
  onSelectPackage,
  waLink,
}) => {
  const t = packageMatrixContent[lang] || packageMatrixContent.es;
  const [activePersona, setActivePersona] = useState<PersonaPreset>('growth');
  const [showMatrixTable, setShowMatrixTable] = useState<boolean>(true);

  const handlePersonaSelect = (persona: PersonaPreset, targetTier: PackageId) => {
    setActivePersona(persona);
    trackEvent('select_package', {
      package_id: targetTier,
      recommendation_preset: persona,
      source: 'package_persona_tab',
      language: lang,
    });
  };

  const handlePackageClick = (e: React.MouseEvent, id: PackageId) => {
    e.preventDefault();
    onSelectPackage(id);
  };

  return (
    <section id="pricing" className="section-frame max-w-[1240px] mx-auto px-5 md:px-8 scroll-mt-20">
      <div className="pricing-shell">
        {/* Section Header */}
        <div className="section-heading text-center max-w-3xl mx-auto" data-reveal>
          <p className="eyebrow justify-center">
            <span>05</span>
            {t.eyebrow}
          </p>
          <h2 className="section-title font-serif text-ink mb-5">{t.title}</h2>
          <p className="section-description text-muted mx-auto">{t.subtitle}</p>
        </div>

        {/* Persona Recommendation Filter Tabs */}
        <div className="mb-10 max-w-4xl mx-auto" data-reveal>
          <p className="text-center text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            {t.persona_filter_label}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-surface-raised border border-white/10 shadow-lg">
            {t.personas.map((persona) => {
              const isActive = activePersona === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handlePersonaSelect(persona.id, persona.targetTier)}
                  className={`p-3 rounded-xl text-left transition-all relative ${
                    isActive
                      ? 'bg-sage/15 border border-sage/50 shadow-md text-ink'
                      : 'hover:bg-white/[0.04] text-muted hover:text-slate-200 border border-transparent'
                  }`}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sage shadow-[0_0_8px_#63e6be]" />
                  )}
                  <span className="block text-xs font-bold text-ink leading-tight mb-1">
                    {persona.label}
                  </span>
                  <span className="block text-[0.65rem] font-semibold text-sage">
                    {persona.match}
                  </span>
                  <span className="block text-[0.6rem] text-muted/80 line-clamp-2 mt-0.5">
                    {persona.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Main Pricing Cards Grid */}
        <div className="pricing-grid mb-10">
          {t.cards.map((plan, i) => {
            const isPopular = 'tag' in plan && !!plan.tag;
            const isPersonaRecommended =
              t.personas.find((p) => p.id === activePersona)?.targetTier === plan.id;

            return (
              <div
                key={plan.id}
                className={`price-card spot ${
                  isPopular || isPersonaRecommended ? 'price-card--featured' : ''
                }`}
                data-reveal
                style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
              >
                <div className="price-card__topline">
                  <span>0{i + 1}</span>
                  {isPersonaRecommended ? (
                    <span className="price-card__popular bg-sage/20 text-sage border border-sage/40">
                      <Sparkles size={12} />
                      {lang === 'es' ? 'Sugerido para ti' : 'Recommended for you'}
                    </span>
                  ) : isPopular ? (
                    <span className="price-card__popular">
                      <Sparkles size={12} />
                      {(plan as any).tag}
                    </span>
                  ) : (
                    <span>{lang === 'es' ? 'Proyecto definido' : 'Fixed project'}</span>
                  )}
                </div>

                <h3 className="font-serif text-[1.65rem] leading-tight text-ink">{plan.title}</h3>

                <p className="price-card__price text-ink">
                  {'pricePrefix' in plan && (plan as any).pricePrefix ? (
                    <>
                      <em>{(plan as any).pricePrefix}</em>{' '}
                    </>
                  ) : null}
                  {plan.price} <span>{plan.period}</span>
                </p>

                <p className="price-card__timeline">
                  <Clock3 size={14} />
                  {t.timeline_label}: {plan.timeline}
                </p>

                <p className="text-sm text-muted mb-7 leading-relaxed">{plan.desc}</p>

                <ul className="price-card__features text-muted text-sm mb-7 flex-1">
                  {plan.features.map((feat, j) => (
                    <li
                      key={j}
                      className={
                        (isPopular || isPersonaRecommended) && j === 0
                          ? 'text-sage font-medium'
                          : ''
                      }
                    >
                      <Check size={14} />
                      {feat}
                    </li>
                  ))}
                </ul>

                {plan.excludes && (
                  <p className="price-card__excludes">
                    <span>{t.excludes_label}:</span> {plan.excludes}
                  </p>
                )}

                <a
                  href="#contact"
                  onClick={(e) => handlePackageClick(e, plan.id)}
                  className={`button w-full justify-between ${
                    isPopular || isPersonaRecommended ? 'button--primary' : 'button--secondary'
                  }`}
                >
                  {plan.cta}
                  <ArrowUpRight size={17} />
                </a>

                <a
                  href={waLink(plan.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('whatsapp_click', {
                      language: lang,
                      placement: 'price_card',
                      package_id: plan.id,
                    })
                  }
                  className="price-card__wa"
                >
                  <MessageCircle size={14} />
                  {lang === 'es' ? 'o cotiza por WhatsApp' : 'or quote via WhatsApp'}
                </a>
              </div>
            );
          })}
        </div>

        {/* Retainer Add-on Card */}
        <div
          className={`retainer-card mb-12 ${
            activePersona === 'retainer' ? 'border-copper/60 shadow-lg shadow-copper/10' : ''
          }`}
          data-reveal
        >
          <div className="retainer-card__icon">
            <UsersRound size={24} />
          </div>
          <div className="flex-1">
            <span className="retainer-card__tag">{t.retainer.tag}</span>
            <h3 className="font-serif text-[1.7rem] text-ink mb-2">{t.retainer.title}</h3>
            <p className="text-sm text-muted max-w-3xl leading-relaxed">{t.retainer.desc}</p>
          </div>
          <div className="md:text-right shrink-0">
            <p className="retainer-card__price text-ink">
              {t.retainer.price} <span>{t.retainer.period}</span>
            </p>
            <a
              href="#contact"
              onClick={(e) => handlePackageClick(e, 'retainer')}
              className="button button--copper"
            >
              {t.retainer.cta}
              <ArrowUpRight size={16} />
            </a>
            <a
              href={waLink('retainer')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('whatsapp_click', {
                  language: lang,
                  placement: 'retainer_card',
                  package_id: 'retainer',
                })
              }
              className="price-card__wa mt-3"
            >
              <MessageCircle size={14} />
              {lang === 'es' ? 'o escríbenos por WhatsApp' : 'or message us on WhatsApp'}
            </a>
          </div>
        </div>

        {/* 3 Trust & Guarantee Badges */}
        <div className="grid md:grid-cols-3 gap-4 mb-12" data-reveal>
          {t.guarantees.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface border border-white/10 flex items-start gap-3.5 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-sage/10 border border-sage/30 flex items-center justify-center text-sage shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink mb-1">{g.title}</h4>
                  <p className="text-xs text-muted leading-relaxed">{g.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Deliverables Matrix Table */}
        <div className="mb-10" data-reveal>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-2xl text-ink font-bold flex items-center gap-2">
              <Layers size={20} className="text-sage" />
              {t.matrix_title}
            </h3>
            <button
              type="button"
              onClick={() => setShowMatrixTable((prev) => !prev)}
              className="text-xs text-sage font-semibold hover:underline"
            >
              {showMatrixTable
                ? lang === 'es'
                  ? 'Ocultar matriz'
                  : 'Hide table'
                : lang === 'es'
                ? 'Ver matriz completa'
                : 'Show full table'}
            </button>
          </div>

          {showMatrixTable && (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#06100d] shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-4 font-bold text-ink min-w-[200px]">
                      {t.matrix_headers.deliverable}
                    </th>
                    <th className="p-4 font-bold text-slate-200 min-w-[150px]">
                      {t.matrix_headers.quick_win}
                    </th>
                    <th className="p-4 font-bold text-sage min-w-[170px] bg-sage/5">
                      {t.matrix_headers.executive}
                    </th>
                    <th className="p-4 font-bold text-slate-200 min-w-[150px]">
                      {t.matrix_headers.custom}
                    </th>
                    <th className="p-4 font-bold text-copper min-w-[150px]">
                      {t.matrix_headers.retainer}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-muted">
                  {t.matrix_rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-semibold text-slate-300">
                        {row.label}
                      </td>
                      <td className="p-4">{row.quick_win}</td>
                      <td className="p-4 text-slate-200 font-medium bg-sage/5">
                        {row.executive}
                      </td>
                      <td className="p-4">{row.custom}</td>
                      <td className="p-4 text-copper/90">{row.retainer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pricing Footer Diagnostic Prompt */}
        <div className="pricing-footer" data-reveal>
          <p className="text-muted">{t.footer_text}</p>
          <a href="#contact" onClick={(e) => handlePackageClick(e, 'general')}>
            {t.footer_link}
            <MoveRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PackageMatrix;
