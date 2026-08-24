import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export type PackageId = 'quick-win' | 'executive' | 'custom' | 'retainer' | 'general';

export interface RoiMetrics {
  teamSize: number;
  hoursPerWeek: number;
  hourlyRate: number;
  annualHoursSaved: number;
  monthlyHoursSaved: number;
  weeklyHoursSaved: number;
  annualDollarSavings: number;
  investmentCost: number;
  netAnnualBenefit: number;
  roiPercentage: number;
  paybackPeriodWeeks: number;
  recommendedPackage: PackageId;
}

export interface RoiCalculatorProps {
  lang: 'es' | 'en';
  onClaimSavings?: (
    tier: PackageId,
    metrics: {
      teamSize: number;
      hoursPerWeek: number;
      hourlyRate: number;
      annualSavings: number;
      hoursSaved: number;
      summaryText: string;
    }
  ) => void;
  onWhatsAppClick?: (message: string) => void;
}

export const roiCalculatorContent = {
  es: {
    eyebrow: "CALCULADORA DE RETORNO DE INVERSIÓN (ROI)",
    title: "¿Cuánto dinero y tiempo pierde tu empresa en reportes manuales?",
    subtitle: "Mueve los controles para estimar el costo real de las tareas repetitivas en Excel y cuánto puedes ahorrar al automatizar con Sagepoint.",
    sliders: {
      team_size: {
        label: "Personas en tu equipo generando reportes:",
        unit: "personas",
        hint: "Analistas, coordinadores o gerentes dedicados a consolidar datos."
      },
      hours_week: {
        label: "Horas semanales dedicadas a reportes por persona:",
        unit: "hrs/semana",
        hint: "Tiempo invertido en descargar CSVs, cruzar tablas y formatear archivos."
      },
      hourly_rate: {
        label: "Costo laboral promedio por hora ($ USD):",
        unit: "USD/hr",
        hint: "Salario + cargas promedio (referencia PYME: $25 - $45 USD/hr)."
      }
    },
    results: {
      title: "Tu Estimación de Ahorro con Sagepoint:",
      annual_savings: "Ahorro Anual Estimado",
      annual_savings_badge: "80% reducción de trabajo manual",
      hours_saved: "Horas Liberadas al Año",
      hours_weekly: "horas/semana devueltas a tu equipo",
      payback: "Recuperación de Inversión en",
      payback_unit: "semanas",
      roi_rate: "Retorno de Inversión (ROI)",
      recommended_tier_label: "Paquete sugerido para tu escala:",
      tiers: {
        'quick-win': "Diagnóstico Express + Quick-Win ($750 USD)",
        executive: "Dashboard Ejecutivo + Automatización ($2,500 USD)",
        custom: "Solución a Medida Corporativa"
      },
      cta_claim: "Reclamar mi Ahorro y Agendar Diagnóstico",
      cta_wa: "Enviar este cálculo por WhatsApp",
      methodology_note: "*Cálculo basado en una reducción del 80% en horas de reportería manual mediante automatización con Power Query, Python y Dashboards centralizados."
    }
  },
  en: {
    eyebrow: "RETURN ON INVESTMENT (ROI) CALCULATOR",
    title: "How much time and money is manual reporting costing your team?",
    subtitle: "Adjust the sliders below to estimate the real cost of spreadsheet grunt work and see your projected savings with Sagepoint BI.",
    sliders: {
      team_size: {
        label: "Team members creating manual reports:",
        unit: "people",
        hint: "Analysts, managers, or coordinators consolidating spreadsheets."
      },
      hours_week: {
        label: "Weekly hours spent reporting per person:",
        unit: "hrs/week",
        hint: "Time spent downloading CSVs, matching tables, and formatting files."
      },
      hourly_rate: {
        label: "Average hourly labor rate ($ USD):",
        unit: "USD/hr",
        hint: "Blended salary + overhead (SME benchmark: $25 - $45 USD/hr)."
      }
    },
    results: {
      title: "Your Projected Savings with Sagepoint:",
      annual_savings: "Estimated Annual Savings",
      annual_savings_badge: "80% reduction in manual effort",
      hours_saved: "Hours Liberated per Year",
      hours_weekly: "hours/week returned to your team",
      payback: "Investment Payback Period",
      payback_unit: "weeks",
      roi_rate: "Projected ROI",
      recommended_tier_label: "Recommended package for your scale:",
      tiers: {
        'quick-win': "Express Assessment + Quick-Win ($750 USD)",
        executive: "Executive Dashboard + Automation ($2,500 USD)",
        custom: "Custom Enterprise Solution"
      },
      cta_claim: "Claim my Savings & Book Free Assessment",
      cta_wa: "Send this calculation on WhatsApp",
      methodology_note: "*Calculated based on an 80% automated reduction in manual reporting time using Power Query, Python workflows, and centralized BI dashboards."
    }
  }
};

export function computeRoiMetrics(teamSize: number, hoursPerWeek: number, hourlyRate: number): RoiMetrics {
  const safeTeamSize = Math.max(0, teamSize);
  const safeHours = Math.max(0, hoursPerWeek);
  const safeRate = hourlyRate > 0 ? hourlyRate : 35;

  // Sagepoint CRO standard: 80% automated reduction in manual reporting time
  const efficiencyRate = 0.8;
  const annualTotalHoursSpent = safeTeamSize * safeHours * 52;
  const annualHoursSaved = Math.round(annualTotalHoursSpent * efficiencyRate);
  const monthlyHoursSaved = Math.round(annualHoursSaved / 12);
  const weeklyHoursSaved = Math.round((safeTeamSize * safeHours * efficiencyRate) * 10) / 10;
  const annualDollarSavings = annualHoursSaved * safeRate;

  // Dynamic recommendation heuristic
  let recommendedPackage: PackageId = 'executive';
  if (safeTeamSize <= 2 && safeHours <= 8) {
    recommendedPackage = 'quick-win';
  } else if (safeTeamSize > 15 || annualDollarSavings > 100000) {
    recommendedPackage = 'custom';
  }

  const packageCosts: Record<string, number> = {
    'quick-win': 750,
    executive: 2500,
    custom: 5000,
  };
  const investmentCost = packageCosts[recommendedPackage] || 2500;
  const netAnnualBenefit = Math.max(0, annualDollarSavings - investmentCost);
  const roiPercentage =
    annualDollarSavings > 0 && investmentCost > 0
      ? Math.round((netAnnualBenefit / investmentCost) * 100)
      : 0;

  const weeklyDollarSavings = annualDollarSavings / 52;
  const paybackPeriodWeeks =
    weeklyDollarSavings > 0 ? Number((investmentCost / weeklyDollarSavings).toFixed(1)) : 0;

  return {
    teamSize: safeTeamSize,
    hoursPerWeek: safeHours,
    hourlyRate: safeRate,
    annualHoursSaved,
    monthlyHoursSaved,
    weeklyHoursSaved,
    annualDollarSavings,
    investmentCost,
    netAnnualBenefit,
    roiPercentage,
    paybackPeriodWeeks,
    recommendedPackage,
  };
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({
  lang,
  onClaimSavings,
  onWhatsAppClick,
}) => {
  const t = roiCalculatorContent[lang] || roiCalculatorContent.es;
  const [teamSize, setTeamSize] = useState<number>(4);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(8);
  const [hourlyRate, setHourlyRate] = useState<number>(35);
  const hasTrackedViewRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const metrics = useMemo(() => {
    return computeRoiMetrics(teamSize, hoursPerWeek, hourlyRate);
  }, [teamSize, hoursPerWeek, hourlyRate]);

  // Viewport tracking for GA4 view_roi_calc
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTrackedViewRef.current) {
          hasTrackedViewRef.current = true;
          trackEvent('view_roi_calc', { source_section: 'roi_calculator', language: lang });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lang]);

  // Debounced GA4 tracking for calculate_roi on slider change
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      trackEvent('calculate_roi', {
        team_size: teamSize,
        hours_per_week: hoursPerWeek,
        hourly_rate: hourlyRate,
        estimated_savings: metrics.annualDollarSavings,
        hours_saved: metrics.annualHoursSaved,
        payback_weeks: metrics.paybackPeriodWeeks,
        recommended_package: metrics.recommendedPackage,
        language: lang,
      });
    }, 800);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [teamSize, hoursPerWeek, hourlyRate, metrics, lang]);

  const formattedAnnualSavings = `$${metrics.annualDollarSavings.toLocaleString()}`;
  const formattedAnnualHours = metrics.annualHoursSaved.toLocaleString();

  const waMessage =
    lang === 'es'
      ? `Hola, calculé un ahorro anual de ${formattedAnnualSavings} USD (${metrics.weeklyHoursSaved} hrs/semana) en mi equipo de ${teamSize} personas con su calculadora. Me gustaría agendar el diagnóstico gratuito.`
      : `Hi, I calculated an annual savings of ${formattedAnnualSavings} USD (${metrics.weeklyHoursSaved} hrs/week) for my ${teamSize}-person team with your ROI calculator. I would like to book the free assessment.`;

  const handleClaim = (e: React.MouseEvent) => {
    e.preventDefault();
    const summaryText =
      lang === 'es'
        ? `Cálculo ROI: Equipo de ${teamSize} personas, ${hoursPerWeek} hrs/sem en reportes manuales. Ahorro estimado: ${formattedAnnualSavings} USD/año (${formattedAnnualHours} hrs/año).`
        : `ROI Calculation: Team of ${teamSize} people, ${hoursPerWeek} hrs/week in manual reporting. Estimated savings: ${formattedAnnualSavings} USD/yr (${formattedAnnualHours} hrs/yr).`;

    if (onClaimSavings) {
      onClaimSavings(metrics.recommendedPackage, {
        teamSize,
        hoursPerWeek,
        hourlyRate,
        annualSavings: metrics.annualDollarSavings,
        hoursSaved: metrics.annualHoursSaved,
        summaryText,
      });
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    if (onWhatsAppClick) {
      e.preventDefault();
      onWhatsAppClick(waMessage);
    }
  };

  return (
    <section
      id="roi-calculator"
      ref={sectionRef}
      className="section-frame max-w-[1240px] mx-auto px-5 md:px-8 scroll-mt-20"
    >
      {/* Section Header */}
      <div className="section-heading text-center max-w-3xl mx-auto" data-reveal>
        <p className="eyebrow justify-center">
          <Calculator size={14} className="inline mr-1 text-sage" />
          <span>04</span>
          {t.eyebrow}
        </p>
        <h2 className="section-title font-serif text-ink mb-5">{t.title}</h2>
        <p className="section-description text-muted mx-auto">{t.subtitle}</p>
      </div>

      {/* Main Interactive Calculator Grid */}
      <div
        className="grid lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 md:p-10 rounded-3xl bg-[#091512] border border-white/10 shadow-2xl relative overflow-hidden"
        data-reveal
      >
        {/* Subtle decorative background glow */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 bg-sage/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 bg-copper/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* LEFT COLUMN: Interactive Sliders Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-8 relative z-10">
          {/* SLIDER 1: Team Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="roi-team-size" className="text-sm font-semibold text-ink flex items-center gap-2">
                <Users size={16} className="text-sage" />
                {t.sliders.team_size.label}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTeamSize((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-muted hover:text-ink flex items-center justify-center text-sm font-bold transition"
                  aria-label="Decrease team size"
                >
                  -
                </button>
                <span className="font-mono text-base font-bold text-sage bg-sage/10 px-3 py-0.5 rounded-md border border-sage/30 min-w-[3.5rem] text-center">
                  {teamSize} {t.sliders.team_size.unit}
                </span>
                <button
                  type="button"
                  onClick={() => setTeamSize((prev) => Math.min(100, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-muted hover:text-ink flex items-center justify-center text-sm font-bold transition"
                  aria-label="Increase team size"
                >
                  +
                </button>
              </div>
            </div>

            <div className="relative pt-1">
              <input
                id="roi-team-size"
                type="range"
                min={1}
                max={50}
                step={1}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="roi-slider w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sage focus:outline-none focus:ring-2 focus:ring-sage"
                aria-valuemin={1}
                aria-valuemax={50}
                aria-valuenow={teamSize}
                aria-label={t.sliders.team_size.label}
              />
              <div className="flex justify-between text-[0.65rem] font-mono text-muted/60 pt-1">
                <span>1 {t.sliders.team_size.unit}</span>
                <span>25</span>
                <span>50+ {t.sliders.team_size.unit}</span>
              </div>
            </div>
            <p className="text-xs text-muted/80">{t.sliders.team_size.hint}</p>
          </div>

          {/* SLIDER 2: Hours Per Week */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="roi-hours-week" className="text-sm font-semibold text-ink flex items-center gap-2">
                <Clock size={16} className="text-copper" />
                {t.sliders.hours_week.label}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHoursPerWeek((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-muted hover:text-ink flex items-center justify-center text-sm font-bold transition"
                  aria-label="Decrease hours per week"
                >
                  -
                </button>
                <span className="font-mono text-base font-bold text-copper bg-copper/10 px-3 py-0.5 rounded-md border border-copper/30 min-w-[4.2rem] text-center">
                  {hoursPerWeek} {t.sliders.hours_week.unit}
                </span>
                <button
                  type="button"
                  onClick={() => setHoursPerWeek((prev) => Math.min(40, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-muted hover:text-ink flex items-center justify-center text-sm font-bold transition"
                  aria-label="Increase hours per week"
                >
                  +
                </button>
              </div>
            </div>

            <div className="relative pt-1">
              <input
                id="roi-hours-week"
                type="range"
                min={1}
                max={40}
                step={1}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="roi-slider w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#f2a65a] focus:outline-none focus:ring-2 focus:ring-copper"
                aria-valuemin={1}
                aria-valuemax={40}
                aria-valuenow={hoursPerWeek}
                aria-label={t.sliders.hours_week.label}
              />
              <div className="flex justify-between text-[0.65rem] font-mono text-muted/60 pt-1">
                <span>1 hr/sem</span>
                <span>20 hrs</span>
                <span>40 hrs/sem</span>
              </div>
            </div>
            <p className="text-xs text-muted/80">{t.sliders.hours_week.hint}</p>
          </div>

          {/* SLIDER 3: Hourly Labor Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="roi-hourly-rate" className="text-sm font-semibold text-ink flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-400" />
                {t.sliders.hourly_rate.label}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHourlyRate((prev) => Math.max(15, prev - 5))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-muted hover:text-ink flex items-center justify-center text-sm font-bold transition"
                  aria-label="Decrease hourly rate"
                >
                  -
                </button>
                <span className="font-mono text-base font-bold text-emerald-300 bg-emerald-950/60 px-3 py-0.5 rounded-md border border-emerald-500/30 min-w-[4.5rem] text-center">
                  ${hourlyRate} {t.sliders.hourly_rate.unit}
                </span>
                <button
                  type="button"
                  onClick={() => setHourlyRate((prev) => Math.min(150, prev + 5))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-muted hover:text-ink flex items-center justify-center text-sm font-bold transition"
                  aria-label="Increase hourly rate"
                >
                  +
                </button>
              </div>
            </div>

            <div className="relative pt-1">
              <input
                id="roi-hourly-rate"
                type="range"
                min={15}
                max={150}
                step={5}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="roi-slider w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-valuemin={15}
                aria-valuemax={150}
                aria-valuenow={hourlyRate}
                aria-label={t.sliders.hourly_rate.label}
              />
              <div className="flex justify-between text-[0.65rem] font-mono text-muted/60 pt-1">
                <span>$15 / hr</span>
                <span>$75</span>
                <span>$150+ / hr</span>
              </div>
            </div>
            <p className="text-xs text-muted/80">{t.sliders.hourly_rate.hint}</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-time Calculated ROI Results Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#06100d] border border-sage/30 shadow-xl relative z-10">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-sage" />
                {t.results.title}
              </span>
              <span className="px-2 py-0.5 rounded bg-sage/20 border border-sage/40 text-[0.65rem] font-mono font-bold text-sage">
                {t.results.annual_savings_badge}
              </span>
            </div>

            {/* Huge Headline Annual Savings */}
            <div className="mb-6">
              <span className="text-xs text-muted font-medium block mb-1">
                {t.results.annual_savings}
              </span>
              <div className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-sage tracking-tight flex items-baseline gap-2">
                <span>{formattedAnnualSavings}</span>
                <span className="text-xs font-sans text-muted font-normal">USD / año</span>
              </div>
            </div>

            {/* 3 Secondary Metric Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[0.65rem] text-muted block mb-0.5">
                  {t.results.hours_saved}
                </span>
                <span className="text-lg font-serif font-bold text-ink">
                  {formattedAnnualHours} hrs
                </span>
                <span className="text-[0.6rem] text-sage block mt-0.5">
                  ~{metrics.weeklyHoursSaved} {t.results.hours_weekly}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[0.65rem] text-muted block mb-0.5">
                  {t.results.payback}
                </span>
                <span className="text-lg font-serif font-bold text-copper">
                  ~{metrics.paybackPeriodWeeks} {t.results.payback_unit}
                </span>
                <span className="text-[0.6rem] text-emerald-400 block mt-0.5">
                  +{metrics.roiPercentage}% {t.results.roi_rate}
                </span>
              </div>
            </div>

            {/* Recommended Tier Card */}
            <div className="p-3.5 rounded-xl bg-sage/10 border border-sage/30 mb-6 flex items-start gap-3">
              <Zap size={18} className="text-sage shrink-0 mt-0.5" />
              <div>
                <span className="text-[0.65rem] text-muted font-medium block">
                  {t.results.recommended_tier_label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-ink">
                  {t.results.tiers[metrics.recommendedPackage as 'quick-win' | 'executive' | 'custom']}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <a
              href="#contact"
              onClick={handleClaim}
              className="button button--primary w-full justify-between text-xs sm:text-sm"
            >
              <span>{t.results.cta_claim}</span>
              <ArrowUpRight size={16} />
            </a>

            <a
              href={`https://wa.me/50240464716?text=${encodeURIComponent(waMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
              className="button button--whatsapp w-full justify-center text-xs"
            >
              <MessageCircle size={15} className="text-[#25D366]" />
              <span>{t.results.cta_wa}</span>
            </a>

            <p className="text-[0.65rem] text-muted/60 text-center leading-relaxed pt-1">
              {t.results.methodology_note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoiCalculator;
