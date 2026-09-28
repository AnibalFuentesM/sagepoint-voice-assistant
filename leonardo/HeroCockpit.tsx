import { useState, useEffect, useRef } from 'react';
import './heroCockpit.css';

type Period = 'week' | 'month' | 'quarter';
type Branch = 'all' | 'norte' | 'sur' | 'digital';

type DataMockSet = {
  s: number; sp: number; m: number; mp: number; o: number; op: number;
  c: number[]; cp: number[]; target: number;
  labels: { es: string[]; en: string[] };
  sm: number[]; so: number[];
};

const LBL_WEEK = { es: ['LUN','MAR','MIE','JUE','VIE','SAB','DOM'], en: ['MON','TUE','WED','THU','FRI','SAT','SUN'] };
const LBL_MONTH = { es: ['SEM 1','SEM 2','SEM 3','SEM 4'], en: ['WK 1','WK 2','WK 3','WK 4'] };
const LBL_QTR = { es: ['MES 1','MES 2','MES 3'], en: ['MTH 1','MTH 2','MTH 3'] };

const DATA_MOCK: Record<Period, Record<Branch, DataMockSet>> = {
  week: {
    all: { s: 124500, sp: 112000, m: 42.5, mp: 41.0, o: 15300, op: 18200, c: [15000, 18000, 14500, 22000, 19000, 24000, 12000], cp: [14000, 17000, 15000, 20000, 18000, 21000, 11000], target: 20000, labels: LBL_WEEK, sm: [41,41.2,41.5,41.8,42,42.2,42.5], so: [18.2,17.8,17.2,16.5,16,15.6,15.3] },
    norte: { s: 45000, sp: 42000, m: 40.1, mp: 40.5, o: 5000, op: 6000, c: [5000, 6000, 7000, 6500, 8000, 7500, 5000], cp: [4500, 5500, 6500, 6000, 7500, 7000, 5000], target: 7000, labels: LBL_WEEK, sm: [40.5,40.4,40.3,40.2,40.1,40.1,40.1], so: [6,5.8,5.6,5.4,5.2,5.1,5] },
    sur: { s: 52000, sp: 50000, m: 45.0, mp: 43.2, o: 8000, op: 9000, c: [8000, 7500, 6000, 9500, 7000, 8500, 5500], cp: [7500, 7000, 5500, 9000, 6500, 8000, 6500], target: 8000, labels: LBL_WEEK, sm: [43.2,43.5,44,44.2,44.5,44.8,45], so: [9,8.8,8.5,8.3,8.2,8.1,8] },
    digital: { s: 27500, sp: 20000, m: 41.5, mp: 38.0, o: 2300, op: 3200, c: [2000, 4500, 1500, 6000, 4000, 8000, 1500], cp: [1500, 3000, 1000, 5000, 3500, 5000, 1000], target: 5000, labels: LBL_WEEK, sm: [38,39,39.5,40,40.5,41,41.5], so: [3.2,3,2.8,2.7,2.5,2.4,2.3] }
  },
  month: {
    all: { s: 512000, sp: 480000, m: 43.1, mp: 42.5, o: 42000, op: 45000, c: [110000, 125000, 142000, 135000], cp: [105000, 120000, 130000, 125000], target: 130000, labels: LBL_MONTH, sm: [42.5,42.8,43,43.1], so: [45,44,43,42] },
    norte: { s: 185000, sp: 175000, m: 41.0, mp: 41.2, o: 15000, op: 14000, c: [40000, 45000, 52000, 48000], cp: [38000, 42000, 50000, 45000], target: 45000, labels: LBL_MONTH, sm: [41.2,41.2,41.1,41.0], so: [14,14.2,14.5,15] },
    sur: { s: 215000, sp: 210000, m: 45.2, mp: 44.8, o: 22000, op: 25000, c: [50000, 52000, 58000, 55000], cp: [48000, 50000, 55000, 57000], target: 55000, labels: LBL_MONTH, sm: [44.8,44.9,45,45.2], so: [25,24,23,22] },
    digital: { s: 112000, sp: 95000, m: 42.5, mp: 40.0, o: 5000, op: 6000, c: [20000, 28000, 32000, 32000], cp: [15000, 20000, 25000, 35000], target: 25000, labels: LBL_MONTH, sm: [40,41,41.5,42.5], so: [6,5.8,5.4,5] }
  },
  quarter: {
    all: { s: 1580000, sp: 1420000, m: 43.8, mp: 42.1, o: 38000, op: 55000, c: [480000, 512000, 588000], cp: [450000, 470000, 500000], target: 500000, labels: LBL_QTR, sm: [42.1,43,43.8], so: [55,45,38] },
    norte: { s: 575000, sp: 530000, m: 41.5, mp: 40.8, o: 14000, op: 18000, c: [175000, 185000, 215000], cp: [160000, 170000, 200000], target: 180000, labels: LBL_QTR, sm: [40.8,41,41.5], so: [18,16,14] },
    sur: { s: 650000, sp: 610000, m: 45.5, mp: 44.2, o: 19000, op: 28000, c: [210000, 215000, 225000], cp: [200000, 200000, 210000], target: 210000, labels: LBL_QTR, sm: [44.2,44.8,45.5], so: [28,24,19] },
    digital: { s: 355000, sp: 280000, m: 44.2, mp: 39.5, o: 5000, op: 9000, c: [95000, 112000, 148000], cp: [90000, 90000, 100000], target: 100000, labels: LBL_QTR, sm: [39.5,42,44.2], so: [9,7,5] }
  }
};

const TEXTS = {
  es: {
    title: 'Cockpit ejecutivo',
    sample: 'Datos de ejemplo',
    sales: 'Ventas netas',
    margin: 'Margen global',
    overdue: 'Cartera vencida',
    week: 'Semana',
    month: 'Mes',
    quarter: 'Trimestre',
    all: 'Todas las sucursales',
    norte: 'Norte',
    sur: 'Sur',
    digital: 'Digital',
    vs: 'vs ant.',
    vsLong: 'vs periodo anterior',
    branchFilter: 'Filtro de sucursal',
    period: 'Periodo',
    target: 'Meta'
  },
  en: {
    title: 'Executive cockpit',
    sample: 'Sample data',
    sales: 'Net Sales',
    margin: 'Gross Margin',
    overdue: 'Overdue Accounts',
    week: 'Week',
    month: 'Month',
    quarter: 'Quarter',
    all: 'All Branches',
    norte: 'North',
    sur: 'South',
    digital: 'Digital',
    vs: 'vs prev.',
    vsLong: 'vs previous period',
    branchFilter: 'Branch filter',
    period: 'Period',
    target: 'Target'
  }
};

const easeOutExpo = (x: number): number => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x));

function AnimatedCounter({ value, isCurrency, isPercent, sym }: { value: number; isCurrency?: boolean; isPercent?: boolean; sym: string }) {
  const [display, setDisplay] = useState(value);
  const valRef = useRef(value);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      valRef.current = value;
      return;
    }

    const startVal = valRef.current;
    if (startVal === value) return;

    const startTime = performance.now();
    const duration = 600;
    let frame: number;

    const tick = (now: number) => {
      let progress = (now - startTime) / duration;
      if (progress >= 1) {
        setDisplay(value);
        valRef.current = value;
        return;
      }
      
      const ease = easeOutExpo(progress);
      setDisplay(startVal + (value - startVal) * ease);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const rounded = isPercent ? display : Math.round(display);
  let text = '';
  if (isCurrency) {
    text = sym + Math.round(rounded).toLocaleString('en-US');
  } else if (isPercent) {
    text = rounded.toFixed(1) + '%';
  } else {
    text = rounded.toLocaleString('en-US');
  }

  return (
    <>
      <span aria-hidden="true">{text}</span>
      <span className="vh">{isCurrency ? sym + rounded : isPercent ? rounded + '%' : rounded}</span>
    </>
  );
}

function KpiBox({ label, value, prev, spark, isCurrency, isPercent, tVs, tVsLong, sym, lang }: { label: string; value: number; prev: number; spark: number[]; isCurrency?: boolean; isPercent?: boolean; tVs: string; tVsLong: string; sym: string; lang: 'es' | 'en' }) {
  const diff = value - prev;
  let pos = diff >= 0;
  
  if (label.toLowerCase().includes('vencid') || label.toLowerCase().includes('overdue')) {
    pos = diff <= 0;
  }

  const pct = Math.abs(diff / prev) * 100;
  const arrow = diff >= 0 ? '↑' : '↓';
  
  const srAction = diff >= 0 
    ? (lang === 'en' ? 'Increase of' : 'Incremento de') 
    : (lang === 'en' ? 'Decrease of' : 'Decremento de');

  const generateSparkline = (data: number[], w: number, h: number) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = w / Math.max(1, data.length - 1);
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`).join(' ');
  };
  const sparkPath = generateSparkline(spark, 60, 20);

  return (
    <div className="leo-cockpit-kpi">
      <div className="leo-cockpit-kpi-lbl">{label}</div>
      <div className="leo-cockpit-kpi-val">
        <AnimatedCounter value={value} isCurrency={isCurrency} isPercent={isPercent} sym={sym} />
      </div>
      <div className="leo-cockpit-kpi-bot">
        <div className="leo-cockpit-kpi-var" data-pos={pos}>
          <span aria-hidden="true">{arrow} {pct.toFixed(1)}%</span>
          <span className="vh">{srAction} {pct.toFixed(1)}% {tVsLong}</span>
          <span aria-hidden="true">{tVs}</span>
        </div>
        <svg width="60" height="20" viewBox="0 0 60 20" className="leo-cockpit-spark" data-pos={pos} aria-hidden="true">
           <path d={sparkPath} />
        </svg>
      </div>
    </div>
  );
}

function SvgChart({ d, lang, sym, t }: { d: DataMockSet; lang: 'es' | 'en'; sym: string; t: Record<string, string> }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  
  const { c, cp, target, labels } = d;
  const lbls = labels[lang];
  
  const maxVal = Math.max(...c, ...cp, target);
  const order = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const step = order / 2;
  const yMax = Math.ceil((maxVal * 1.05) / step) * step;

  const w = 500;
  const h = 150;
  const padL = 40;
  const padB = 25;
  const padT = 15;
  const padR = 15;
  
  const drawW = w - padL - padR;
  const drawH = h - padT - padB;
  
  const barW = (drawW / c.length) * 0.55;
  const stepX = drawW / c.length;
  
  const getY = (val: number) => padT + drawH - (val / yMax) * drawH;
  
  const gridLines = [0, yMax / 2, yMax];
  
  const prevPoints = cp.map((v: number, i: number) => `${padL + (i + 0.5) * stepX},${getY(v)}`).join(' ');
  const fmtK = (v: number) => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v;
  
  return (
    <div className="leo-cockpit-chart-wrap" onMouseLeave={() => setHoverIdx(null)}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="leo-cockpit-svg" role="group" aria-label={lang === 'en' ? 'Bar chart' : 'Gráfico de barras'}>
        {gridLines.map((v, i) => (
          <g key={`grid-${i}`}>
            <line x1={padL} y1={getY(v)} x2={w - padR} y2={getY(v)} className="leo-cockpit-grid" />
            <text x={padL - 6} y={getY(v) + 3} className="leo-cockpit-y-lbl">{sym}{fmtK(v)}</text>
          </g>
        ))}
        
        <polyline points={prevPoints} className="leo-cockpit-prev-line" />
        
        {c.map((v: number, i: number) => {
          const x = padL + i * stepX + (stepX - barW) / 2;
          const y = getY(v);
          const height = (v / yMax) * drawH;
          const isLast = i === c.length - 1;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={height}
              rx={4}
              className={`leo-cockpit-rect ${isLast ? 'active' : ''}`}
              role="graphics-symbol"
              aria-label={`${sym}${Math.round(v).toLocaleString('en-US')}`}
              tabIndex={0}
              onPointerEnter={() => setHoverIdx(i)}
              onPointerLeave={() => setHoverIdx(null)}
              onFocus={() => setHoverIdx(i)}
              onBlur={() => setHoverIdx(null)}
            />
          );
        })}
        
        <line x1={padL} y1={getY(target)} x2={w - padR} y2={getY(target)} className="leo-cockpit-tgt-line" />
        <text x={w - padR} y={getY(target) - 5} className="leo-cockpit-tgt-lbl">{t.target}</text>

        {lbls.map((l: string, i: number) => (
          <text key={`lbl-${i}`} x={padL + (i + 0.5) * stepX} y={h - 5} className="leo-cockpit-x-lbl">{l}</text>
        ))}
      </svg>
      {hoverIdx !== null && (
        <div 
          className="leo-cockpit-tooltip"
          aria-hidden="true"
          style={{
            left: `${(padL + (hoverIdx + 0.5) * stepX) / w * 100}%`,
            top: `${getY(c[hoverIdx]) / h * 100}%`
          }}
        >
          {sym}{Math.round(c[hoverIdx]).toLocaleString('en-US')}
          <div className="leo-cockpit-tt-vs">{t.vs} {sym}{Math.round(cp[hoverIdx]).toLocaleString('en-US')}</div>
        </div>
      )}
    </div>
  );
}

export default function HeroCockpit({ lang }: { lang: 'es' | 'en' }) {
  const [period, setPeriod] = useState<Period>('week');
  const [branch, setBranch] = useState<Branch>('all');

  const t = TEXTS[lang];
  const d = DATA_MOCK[period][branch];
  const sym = lang === 'es' ? 'Q' : '$';

  return (
    <div className="leo-cockpit">
      <div className="leo-cockpit-top">
        <div className="leo-cockpit-title-grp">
          <h2 className="leo-cockpit-title">{t.title}</h2>
          <span className="leo-cockpit-badge">{t.sample}</span>
        </div>
        
        <div className="leo-cockpit-filters">
           <div className="leo-cockpit-tabs" role="group" aria-label={t.period}>
              <button type="button" onClick={() => setPeriod('week')} aria-pressed={period === 'week'}>{t.week}</button>
              <button type="button" onClick={() => setPeriod('month')} aria-pressed={period === 'month'}>{t.month}</button>
              <button type="button" onClick={() => setPeriod('quarter')} aria-pressed={period === 'quarter'}>{t.quarter}</button>
           </div>
           <div className="leo-cockpit-branch">
              <select value={branch} onChange={(e) => setBranch(e.target.value as Branch)} aria-label={t.branchFilter}>
                <option value="all">{t.all}</option>
                <option value="norte">{t.norte}</option>
                <option value="sur">{t.sur}</option>
                <option value="digital">{t.digital}</option>
              </select>
           </div>
        </div>
      </div>

      <div className="leo-cockpit-kpis">
         <KpiBox label={t.sales} value={d.s} prev={d.sp} spark={d.c} isCurrency sym={sym} tVs={t.vs} tVsLong={t.vsLong} lang={lang} />
         <KpiBox label={t.margin} value={d.m} prev={d.mp} spark={d.sm} isPercent sym={sym} tVs={t.vs} tVsLong={t.vsLong} lang={lang} />
         <KpiBox label={t.overdue} value={d.o} prev={d.op} spark={d.so} isCurrency sym={sym} tVs={t.vs} tVsLong={t.vsLong} lang={lang} />
      </div>

      <SvgChart d={d} lang={lang} sym={sym} t={t} />
    </div>
  );
}
