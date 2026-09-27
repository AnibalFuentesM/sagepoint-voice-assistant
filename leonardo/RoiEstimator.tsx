import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { trackEvent } from '../utils/analytics';
import type { LeoLanguage } from './leonardoEnglish';
import './roi.css';

type PackageId = 'quick-win' | 'executive';

type Props = {
  lang: LeoLanguage;
  onBook: (event: MouseEvent<HTMLButtonElement>, packageId: PackageId) => void;
};

const copy = {
  es: {
    eyebrow: 'Estimador de retorno',
    title: 'Ponle número al trabajo manual.',
    intro: 'Ajusta tres datos de tu equipo para estimar el tiempo y el costo de preparar reportes.',
    team: 'Personas que preparan reportes',
    teamUnit: 'personas',
    hours: 'Horas por persona a la semana',
    hoursUnit: 'horas',
    rate: 'Costo laboral por hora',
    rateUnit: 'por hora',
    rateHint: 'Salario + prestaciones ÷ horas trabajadas.',
    results: 'Tu estimación anual',
    annualHours: 'Horas dedicadas a reportes manuales',
    annualCost: 'Costo de ese tiempo',
    recoverable: 'Valor recuperable estimado',
    method: 'Estimación: 75% del tiempo dedicado a reportes se automatiza. El valor recuperable representa horas liberadas multiplicadas por tu costo laboral; no es dinero garantizado. La llamada de diagnóstico confirma qué parte es viable recuperar.',
    recommended: 'Punto de partida sugerido',
    assessment: 'Radiografía de Datos',
    cockpit: 'Cockpit Ejecutivo',
    from: 'desde',
    payback: 'Recuperación estimada del precio de entrada',
    weeks: 'semanas',
    longPayback: 'más de 2 años',
    complex: 'Si tu operación conecta varios sistemas, podría necesitar Sala de Control (desde US$12,000). Lo definimos en el diagnóstico.',
    cta: 'Solicitar diagnóstico con esta estimación',
  },
  en: {
    eyebrow: 'ROI estimator',
    title: 'Put a number on manual reporting.',
    intro: 'Adjust three team inputs to estimate the time and cost of preparing reports.',
    team: 'People who build reports',
    teamUnit: 'people',
    hours: 'Hours per person each week',
    hoursUnit: 'hours',
    rate: 'Loaded hourly cost',
    rateUnit: 'per hour',
    rateHint: 'Salary + benefits ÷ hours worked.',
    results: 'Your annual estimate',
    annualHours: 'Hours spent on manual reporting',
    annualCost: 'Cost of that time',
    recoverable: 'Estimated recoverable value',
    method: 'Estimate: 75% of reporting time is automated. Recoverable value is hours freed multiplied by your loaded hourly cost; it is not guaranteed cash savings. The diagnostic call confirms what can be recovered.',
    recommended: 'Suggested starting point',
    assessment: 'Data Assessment',
    cockpit: 'Executive Cockpit',
    from: 'from',
    payback: 'Estimated payback on the entry price',
    weeks: 'weeks',
    longPayback: 'over 2 years',
    complex: 'Operations spanning multiple systems may need Control Room (from US$12,000). We will confirm that in the diagnostic.',
    cta: 'Book a diagnostic with this estimate',
  },
} as const;

export default function RoiEstimator({ lang, onBook }: Props) {
  const t = copy[lang];
  const [teamSize, setTeamSize] = useState(3);
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(lang === 'es' ? 10 : 30);
  const [edited, setEdited] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);

  const annualHours = teamSize * hoursPerWeek * 52;
  const annualCost = annualHours * hourlyRate;
  const estimatedSavings = annualCost * 0.75;
  const packageId: PackageId = estimatedSavings < 10000 ? 'quick-win' : 'executive';
  const entryPrice = packageId === 'quick-win' ? 750 : 2500;
  const paybackWeeks = entryPrice / (estimatedSavings / 52);
  const number = new Intl.NumberFormat(lang === 'es' ? 'es-GT' : 'en-US');
  const decimal = new Intl.NumberFormat(lang === 'es' ? 'es-GT' : 'en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const dollars = (value: number) => `US$${number.format(value)}`;

  useEffect(() => {
    if (!edited) setHourlyRate(lang === 'es' ? 10 : 30);
  }, [lang, edited]);

  useEffect(() => {
    const section = rootRef.current?.closest('section');
    if (!section || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !viewed.current) {
        viewed.current = true;
        trackEvent('view_roi_calc', { source_section: 'roi_calculator', language: lang });
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [lang]);

  useEffect(() => {
    if (!edited) return;
    const timer = window.setTimeout(() => {
      trackEvent('calculate_roi', {
        team_size: teamSize,
        hours_per_week: hoursPerWeek,
        hourly_rate: hourlyRate,
        estimated_savings: estimatedSavings,
        language: lang,
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [edited, teamSize, hoursPerWeek, hourlyRate, estimatedSavings, lang]);

  const slider = (
    id: string,
    label: string,
    value: number,
    unit: string,
    min: number,
    max: number,
    onChange: (value: number) => void,
    hint?: string,
  ) => (
    <div className="roi-field">
      <div className="roi-field-head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{id === 'roi-rate' ? dollars(value) : number.format(value)} <span>{unit}</span></output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        aria-valuetext={`${id === 'roi-rate' ? dollars(value) : number.format(value)} ${unit}`}
        onChange={(event) => { onChange(Number(event.target.value)); setEdited(true); }}
      />
      {hint && <p className="roi-hint">{hint}</p>}
    </div>
  );

  return (
    <div className="wrap roi-estimator" ref={rootRef}>
      <div className="roi-heading">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className="sec-title">{t.title}</h2>
        <p className="sec-lede">{t.intro}</p>
      </div>
      <div className="roi-grid">
        <div className="roi-inputs">
          {slider('roi-team', t.team, teamSize, t.teamUnit, 1, 20, setTeamSize)}
          {slider('roi-hours', t.hours, hoursPerWeek, t.hoursUnit, 1, 30, setHoursPerWeek)}
          {slider('roi-rate', t.rate, hourlyRate, t.rateUnit, 3, 120, setHourlyRate, t.rateHint)}
        </div>
        <div className="roi-results">
          <p className="roi-kicker">{t.results}</p>
          <dl className="roi-metrics" aria-live="polite">
            <div><dt>{t.annualHours}</dt><dd>{number.format(annualHours)}</dd></div>
            <div><dt>{t.annualCost}</dt><dd>{dollars(annualCost)}</dd></div>
            <div className="roi-metric-main"><dt>{t.recoverable}</dt><dd>{dollars(estimatedSavings)}</dd></div>
          </dl>
          <p className="roi-method">{t.method}</p>
          <div className="roi-recommendation">
            <p className="roi-kicker">{t.recommended}</p>
            <p className="roi-package">{packageId === 'quick-win' ? t.assessment : t.cockpit} <span>· {packageId === 'quick-win' ? dollars(entryPrice) : `${t.from} ${dollars(entryPrice)}`}</span></p>
            <p className="roi-payback">{t.payback}: <strong>{paybackWeeks > 104 ? t.longPayback : `${decimal.format(paybackWeeks)} ${t.weeks}`}</strong></p>
          </div>
          <p className="roi-complex">{t.complex}</p>
          <button
            className="pill pill--mint roi-cta"
            type="button"
            onClick={(event) => {
              trackEvent('roi_cta_click', { package_id: packageId, estimated_savings: estimatedSavings, language: lang });
              onBook(event, packageId);
            }}
          >{t.cta} <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </div>
  );
}
