import { useEffect, useRef, useState, useCallback } from 'react';
import './beforeAfter.css';
import { type LeoLanguage } from './leonardoEnglish';

type Props = { lang: LeoLanguage };

export default function BeforeAfter({ lang }: Props) {
  const [value, setValue] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const playedDemo = useRef(false);

  const t = {
    title: lang === 'es' ? 'El antes y el después de tus datos' : 'The before and after of your data',
    lede: lang === 'es' 
      ? 'No más hojas de cálculo rotas. Transforma el caos manual en un sistema automatizado y confiable.' 
      : 'No more broken spreadsheets. Transform manual chaos into an automated, reliable system.',
    before: lang === 'es' ? 'Antes: el reporte de cada lunes' : 'Before: the Monday report',
    after: lang === 'es' ? 'Después: tablero automático' : 'After: automated dashboard',
    sample: lang === 'es' ? 'Datos de ejemplo' : 'Sample data',
    tabs: lang === 'es' 
      ? ['Ventas_final_v3', 'Copia de Copia', 'NO BORRAR', 'Hoja7'] 
      : ['Sales_final_v3', 'Copy of Copy', 'DO NOT DELETE', 'Sheet7'],
    branches: lang === 'es'
      ? ['Zona 10', 'Cayalá', 'Roosevelt']
      : ['North Branch', 'South Branch', 'East Branch'],
    comment: lang === 'es' ? '¿quién cambió esto?' : 'who changed this?',
    rev: lang === 'es' ? 'Ventas MTD' : 'MTD Revenue',
    mar: lang === 'es' ? 'Margen' : 'Margin',
    chu: lang === 'es' ? 'Rotación' : 'Churn',
    branch: lang === 'es' ? 'Sucursal' : 'Branch',
    target: lang === 'es' ? 'Meta' : 'Target',
    status: lang === 'es' ? 'Estado' : 'Status',
    risk: lang === 'es' ? 'Riesgo' : 'Risk',
    drag: lang === 'es' ? 'Arrastrar para comparar' : 'Drag to compare',
  };

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setValue(percent);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const step = 5;
    if (e.key === 'ArrowLeft') setValue((v) => Math.max(0, v - step));
    if (e.key === 'ArrowRight') setValue((v) => Math.min(100, v + step));
    if (e.key === 'Home') setValue(0);
    if (e.key === 'End') setValue(100);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let frame: number;
    let isActive = true;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !playedDemo.current) {
        playedDemo.current = true;
        let start: number | null = null;
        const duration = 1200;
        
        const step = (ts: number) => {
          if (!isActive) return;
          if (start === null) start = ts;
          const elapsed = ts - start;
          const p = Math.min(elapsed / duration, 1);
          
          const move = Math.sin(p * Math.PI);
          setValue(50 + move * 20);
          
          if (p < 1) {
            frame = requestAnimationFrame(step);
          } else {
            setValue(50);
          }
        };
        frame = requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    
    observer.observe(el);
    return () => {
      isActive = false;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const excRows = [
    { r: 1, v: ['ID_01', '2023-11-01', '14250', '#REF!', 'ERR', '?', ''] },
    { r: 2, v: ['ID_02', '11/02/2023', '24000', '18000', '25%', 'OK', ''] },
    { r: 3, v: ['ID_03', 'Nov 3', '#N/A', '8000', '#N/A', 'FAIL', ''] },
    { r: 4, v: ['ID_04', '2023-11-04', '35000', '21000', '40%', 'OK', ''] },
    { r: 5, v: ['ID_05', '11/5/23', '12500', '15000', '-20%', 'CHECK', ''] },
    { r: 6, v: ['ID_06', '11-06-2023', '28000', '22000', '21%', 'OK', ''] },
    { r: 7, v: ['ID_07', '11-07', '19000', '19000', '0%', 'OK', ''] },
    { r: 8, v: ['ID_08', '08/11/2023', '0', '#DIV/0!', 'ERR', 'FAIL', ''] },
    { r: 9, v: ['ID_09', '11-09-23', '31000', '25000', '24%', 'OK', ''] },
    { r: 10, v: ['ID_10', 'Nov 10', '15500', '15000', '3%', 'OK', ''] },
    { r: 11, v: ['ID_11', '11/11/23', '42000', '38000', '10%', 'OK', ''] },
    { r: 12, v: ['ID_12', '12-11-2023', '#VALUE!', '10000', 'ERR', '?', ''] },
    { r: 13, v: ['ID_13', '13/11/23', '27500', '20000', '37%', 'OK', ''] },
    { r: 14, v: ['ID_14', '11-14-23', '18000', '18500', '-2%', 'CHECK', ''] },
    { r: 15, v: ['ID_15', '15/11/2023', '22000', '21000', '4%', 'OK', ''] },
    { r: 16, v: ['ID_16', 'Nov 16', '#N/A', '16000', '#N/A', 'FAIL', ''] },
  ];

  return (
    <section id="transformador" className="ba-sec">
      <div className="wrap">
        <div className="sec-head" data-rv>
          <div>
            <p className="eyebrow">{lang === 'es' ? 'Transformación' : 'Transformation'}</p>
            <h2 className="sec-title">{t.title}</h2>
          </div>
          <p className="sec-lede">{t.lede}</p>
        </div>

        <div className="ba-labels-out" data-rv>
          <div className="ba-label-out ba-label-out-before">{t.before}</div>
          <div className="ba-label-out ba-label-out-after">
            {t.after} <span className="ba-sample-tag">{t.sample}</span>
          </div>
        </div>

        <div className="ba-container" ref={containerRef} data-rv>
          
          <div className="ba-layer ba-after">
             <div className="ba-dashboard">
               <div className="ba-kpis">
                 <div className="ba-kpi"><span>{t.rev}</span><b>$142,500</b><i className="pos">+12%</i></div>
                 <div className="ba-kpi"><span>{t.mar}</span><b>24.8%</b><i className="pos">+2.1%</i></div>
                 <div className="ba-kpi"><span>{t.chu}</span><b>1.2%</b><i className="neg">-0.4%</i></div>
               </div>
               <div className="ba-dash-body">
                 <div className="ba-dash-chart">
                   <svg viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
                     <defs>
                       <linearGradient id="ba-grad" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="rgba(99,230,190,0.3)" />
                         <stop offset="100%" stopColor="rgba(99,230,190,0)" />
                       </linearGradient>
                     </defs>
                     <path d="M0,100 L40,80 L80,90 L120,40 L160,50 L200,20 L240,40 L280,10 L320,30 L360,5 L400,15 L400,120 L0,120 Z" fill="url(#ba-grad)" />
                     <path d="M0,100 L40,80 L80,90 L120,40 L160,50 L200,20 L240,40 L280,10 L320,30 L360,5 L400,15" fill="none" stroke="var(--mint)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                   </svg>
                 </div>
                 <div className="ba-dash-table">
                   <div className="ba-dt-row ba-dt-head">
                     <span>{t.branch}</span><span>{t.target}</span><div className="ba-st-wrap"><span>{t.status}</span></div>
                   </div>
                   <div className="ba-dt-row">
                     <span>{t.branches[0]}</span><span>98%</span>
                     <div className="ba-st-wrap"><span className="ba-status ba-st-ok">OK</span></div>
                   </div>
                   <div className="ba-dt-row">
                     <span>{t.branches[1]}</span><span>105%</span>
                     <div className="ba-st-wrap"><span className="ba-status ba-st-ok">OK</span></div>
                   </div>
                   <div className="ba-dt-row">
                     <span>{t.branches[2]}</span><span>74%</span>
                     <div className="ba-st-wrap"><span className="ba-status ba-st-warn">{t.risk}</span></div>
                   </div>
                   <div className="ba-dt-row">
                     <span>Global</span><span>92%</span>
                     <div className="ba-st-wrap"><span className="ba-status ba-st-ok">OK</span></div>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="ba-layer ba-before" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
             <div className="ba-excel" aria-hidden="true">
               <div className="ba-ex-formula-bar">
                 <div className="ba-ex-fx">fx</div>
                 <div className="ba-ex-formula">
                   {lang === 'es' ? '=BUSCARV(D2, \'Copia de Copia\'!A2:F500, 3, FALSO)' : '=VLOOKUP(D2, \'Copy of Copy\'!A2:F500, 3, FALSE)'}
                 </div>
               </div>
               <div className="ba-ex-header">
                 <div className="ba-ex-cell ba-ex-corner"></div>
                 {['A','B','C','D','E','F','G','H'].map(c => <div key={c} className="ba-ex-cell ba-ex-col">{c}</div>)}
               </div>
               <div className="ba-ex-body">
                 {excRows.map((row, i) => (
                   <div key={row.r} className="ba-ex-row">
                     <div className="ba-ex-cell ba-ex-row-num">{row.r}</div>
                     {row.v.map((val, j) => (
                       <div key={j} className={`ba-ex-cell ${val === '#REF!' || val === '#N/A' || val === '#DIV/0!' || val === '#VALUE!' ? 'ba-ex-err' : ''} ${val === 'CHECK' ? 'ba-ex-bg-yellow' : ''} ${val === 'ERR' ? 'ba-ex-bg-red' : ''} ${j === 6 && i === 0 ? 'ba-ex-comment-cell' : ''}`}>
                         {j === 6 && i === 0 && <div className="ba-ex-comment-box">{t.comment}</div>}
                         {val}
                       </div>
                     ))}
                     <div className="ba-ex-cell"></div>
                   </div>
                 ))}
               </div>
               <div className="ba-ex-tabs">
                 {t.tabs.map((tb, i) => <div key={i} className={`ba-ex-tab ${i===0 ? 'active' : ''}`}>{tb}</div>)}
               </div>
             </div>
          </div>

          <div 
            className="ba-handle"
            style={{ left: `${value}%` }}
            role="slider"
            aria-valuenow={Math.round(value)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t.drag}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          >
            <div className="ba-handle-line"></div>
            <div className="ba-handle-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l-6-6 6-6M15 18l6-6-6-6"/>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
