import { useEffect, useRef, useState } from 'react';
import type { LeoLanguage } from './leonardoEnglish';
import './dataFlow.css';

type NodeId = 's1' | 's2' | 's3' | 's4' | 'ext' | 'val' | 'o1' | 'o2';
type TipPos = 'top' | 'bottom' | 'left' | 'right';
type Edge = { from: NodeId; to: NodeId };

type NodeDef = {
  id: NodeId;
  label: { es: string; en: string };
  desc: { es: string; en: string };
  type: 'source' | 'process' | 'output';
  deskPos: [number, number];
  deskTip: TipPos;
  mobPos: [number, number];
  mobTip: TipPos;
};

const NODES: NodeDef[] = [
  {
    id: 's1',
    label: { es: 'Excel / Sheets', en: 'Excel / Sheets' },
    desc: { es: 'Datos manuales e históricos.', en: 'Manual and historical data.' },
    type: 'source',
    deskPos: [15, 18],
    deskTip: 'right',
    mobPos: [25, 12],
    mobTip: 'bottom',
  },
  {
    id: 's2',
    label: { es: 'ERP / Ventas', en: 'ERP / Sales' },
    desc: { es: 'Transacciones y facturación.', en: 'Transactions and billing.' },
    type: 'source',
    deskPos: [15, 39],
    deskTip: 'right',
    mobPos: [75, 12],
    mobTip: 'bottom',
  },
  {
    id: 's3',
    label: { es: 'CRM', en: 'CRM' },
    desc: { es: 'Gestión de clientes y leads.', en: 'Customer and lead management.' },
    type: 'source',
    deskPos: [15, 60],
    deskTip: 'right',
    mobPos: [25, 28],
    mobTip: 'top',
  },
  {
    id: 's4',
    label: { es: 'Archivos CSV', en: 'CSV Files' },
    desc: { es: 'Exportaciones de otros sistemas.', en: 'Exports from other systems.' },
    type: 'source',
    deskPos: [15, 81],
    deskTip: 'right',
    mobPos: [75, 28],
    mobTip: 'top',
  },
  {
    id: 'ext',
    label: { es: 'Extracción', en: 'Extraction' },
    desc: {
      es: 'Descarga, unificación y limpieza automática diaria.',
      en: 'Daily automated download, unification and cleaning.',
    },
    type: 'process',
    deskPos: [45, 50],
    deskTip: 'bottom',
    mobPos: [50, 48],
    mobTip: 'bottom',
  },
  {
    id: 'val',
    label: { es: 'Reglas de validación', en: 'Validation rules' },
    desc: {
      es: 'Cuadre de totales y detección de anomalías.',
      en: 'Total reconciliation and anomaly detection.',
    },
    type: 'process',
    deskPos: [72, 50],
    deskTip: 'bottom',
    mobPos: [50, 68],
    mobTip: 'top',
  },
  {
    id: 'o1',
    label: { es: 'Tablero Power BI', en: 'Power BI Dashboard' },
    desc: {
      es: 'Reportes interactivos actualizados.',
      en: 'Up-to-date interactive reports.',
    },
    type: 'output',
    deskPos: [90, 35],
    deskTip: 'left',
    mobPos: [25, 88],
    mobTip: 'top',
  },
  {
    id: 'o2',
    label: { es: 'Alerta WhatsApp', en: 'WhatsApp Alert' },
    desc: {
      es: 'Avisos proactivos cuando se requiere atención.',
      en: 'Proactive notices when attention is needed.',
    },
    type: 'output',
    deskPos: [90, 65],
    deskTip: 'left',
    mobPos: [75, 88],
    mobTip: 'top',
  },
];

const EDGES: Edge[] = [
  { from: 's1', to: 'ext' },
  { from: 's2', to: 'ext' },
  { from: 's3', to: 'ext' },
  { from: 's4', to: 'ext' },
  { from: 'ext', to: 'val' },
  { from: 'val', to: 'o1' },
  { from: 'val', to: 'o2' },
];

const SVGS: Record<NodeId, React.ReactNode> = {
  s1: <path d="M3 3h18v18H3z M3 9h18 M9 3v18" />,
  s2: <path d="M3 5c0 1.1 4 2 9 2s9-.9 9-2-4-2-9-2-9 .9-9 2z M3 5v14c0 1.1 4 2 9 2s9-.9 9-2V5 M3 12c0 1.1 4 2 9 2s9-.9 9-2" />,
  s3: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  s4: <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7" />,
  ext: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />,
  val: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  o1: <path d="M18 20V10 M12 20V4 M6 20v-6 M2 20h20" />,
  o2: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />,
};

type Particle = {
  edge: Edge;
  t: number;
  speed: number;
  size: number;
  color: string;
  isAmber: boolean;
};

const ValIcons = () => (
  <div className="df-val-catch" aria-hidden="true">
    <svg viewBox="0 0 24 24" className="df-icon-alert">
      <path
        fill="var(--amber)"
        d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"
      />
    </svg>
    <svg viewBox="0 0 24 24" className="df-icon-check">
      <path
        fill="var(--mint)"
        d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
      />
    </svg>
  </div>
);

export default function DataFlow({ lang }: { lang: LeoLanguage }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const [activeNode, setActiveNodeState] = useState<NodeId | null>(null);
  const activeNodeRef = useRef<NodeId | null>(null);
  const hoveredNodeRef = useRef<NodeId | null>(null);
  const reduceRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);

  const setActiveNode = (id: NodeId | null) => {
    setActiveNodeState(id);
    activeNodeRef.current = id;
  };

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 560px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const reduceMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceRef.current = reduceMql.matches;
    const handler = (e: MediaQueryListEvent) => {
      reduceRef.current = e.matches;
    };
    reduceMql.addEventListener('change', handler);
    return () => reduceMql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleOutsideInteraction = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveNode(null);
      }
    };
    document.addEventListener('pointerdown', handleOutsideInteraction);
    return () => document.removeEventListener('pointerdown', handleOutsideInteraction);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let pulses: { x: number; y: number; r: number; max: number; a: number; c: string }[] = [];
    let rejects: { x: number; y: number; vx: number; vy: number; a: number }[] = [];
    
    let validCount = 14208;
    let lastTime = performance.now();
    let logicalW = 0;
    let logicalH = 0;
    let isLooping = false;

    const resize = () => {
      if (!canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      logicalW = canvas.parentElement.offsetWidth;
      logicalH = canvas.parentElement.offsetHeight;
      canvas.width = logicalW * dpr;
      canvas.height = logicalH * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${logicalW}px`;
      canvas.style.height = `${logicalH}px`;
    };
    window.addEventListener('resize', resize);
    resize();

    const getPos = (id: NodeId) => {
      const def = NODES.find((n) => n.id === id)!;
      const mob = window.matchMedia('(max-width: 560px)').matches;
      const pos = mob ? def.mobPos : def.deskPos;
      return {
        x: (pos[0] / 100) * logicalW,
        y: (pos[1] / 100) * logicalH,
      };
    };

    const render = (time: number) => {
      if (!isLooping) return;

      const dt = time - lastTime;
      lastTime = time;
      const delta = Math.min(dt, 50) / 16.66;

      ctx.clearRect(0, 0, logicalW, logicalH);

      ctx.lineWidth = 1.5;
      EDGES.forEach((edge) => {
        const hover = hoveredNodeRef.current;
        const active = activeNodeRef.current;
        const isDense =
          hover === edge.from ||
          hover === edge.to ||
          active === edge.from ||
          active === edge.to;

        const p1 = getPos(edge.from);
        const p2 = getPos(edge.to);
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        
        if (isDense) {
          grad.addColorStop(0, 'rgba(99, 230, 190, 0.45)');
          grad.addColorStop(1, 'rgba(99, 230, 190, 0.8)');
        } else {
          grad.addColorStop(0, 'rgba(99, 230, 190, 0.25)');
          grad.addColorStop(1, 'rgba(99, 230, 190, 0.45)');
        }
        
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      if (!reduceRef.current) {
        EDGES.forEach((edge) => {
          const hover = hoveredNodeRef.current;
          const active = activeNodeRef.current;
          const isDense =
            hover === edge.from ||
            hover === edge.to ||
            active === edge.from ||
            active === edge.to;
          const spawnChance = (isDense ? 0.15 : 0.03) * delta;

          if (Math.random() < spawnChance) {
            let isAmber = false;
            if (edge.to === 'val' && Math.random() < 0.25) {
              isAmber = true;
            }

            particles.push({
              edge,
              t: 0,
              speed: isDense
                ? 0.005 + Math.random() * 0.003
                : 0.002 + Math.random() * 0.002,
              size: Math.random() * 1.5 + 1.2,
              color: isAmber ? '#ffc53d' : '#63e6be',
              isAmber
            });
          }
        });

        particles.forEach((p) => {
          p.t += p.speed * delta;
          const p1 = getPos(p.edge.from);
          const p2 = getPos(p.edge.to);
          const x = p1.x + (p2.x - p1.x) * p.t;
          const y = p1.y + (p2.y - p1.y) * p.t;
          
          const trailLength = 0.08; 
          const tailT = Math.max(0, p.t - trailLength);
          const tailX = p1.x + (p2.x - p1.x) * tailT;
          const tailY = p1.y + (p2.y - p1.y) * tailT;

          ctx.shadowBlur = p.isAmber ? 12 : 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(x, y);
          ctx.lineWidth = p.size * 2;
          ctx.strokeStyle = p.color;
          ctx.lineCap = 'round';
          ctx.stroke();
        });

        ctx.shadowBlur = 0;
        particles = particles.filter((p) => {
          if (p.t >= 1) {
            const p2 = getPos(p.edge.to);
            if (p.isAmber && p.edge.to === 'val') {
              pulses.push({ x: p2.x, y: p2.y, r: 0, max: 45, a: 1, c: '255, 197, 61' });
              rejects.push({ x: p2.x, y: p2.y, vx: (Math.random() - 0.5) * 6, vy: Math.random() * -4 - 2, a: 1 });
            } else if (p.edge.to === 'o1' || p.edge.to === 'o2') {
              validCount += 1;
              if (counterRef.current) {
                counterRef.current.innerText = validCount.toLocaleString();
              }
            }
            return false;
          }
          return true;
        });

        pulses.forEach((p) => {
          p.r += 1.5 * delta;
          p.a = 1 - (p.r / p.max);
          if (p.a > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${p.c}, ${p.a})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
        pulses = pulses.filter(p => p.a > 0);

        rejects.forEach((r) => {
          r.x += r.vx * delta;
          r.y += r.vy * delta;
          r.vy += 0.3 * delta; 
          r.a -= 0.02 * delta;
          if (r.a > 0) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffc53d';
            ctx.beginPath();
            ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 197, 61, ${r.a})`;
            ctx.fill();
          }
        });
        ctx.shadowBlur = 0;
        rejects = rejects.filter(r => r.a > 0);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLooping) {
          isLooping = true;
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(render);
        } else if (!entry.isIntersecting) {
          isLooping = false;
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="df-wrapper" data-rv ref={containerRef}>
      <canvas className="df-canvas" ref={canvasRef} aria-hidden="true" />
      
      <div className="df-counter-widget">
        <div className="df-cw-num" ref={counterRef}>14,208</div>
        <div className="df-cw-label">
          {lang === 'es' ? 'Registros validados' : 'Validated records'}
          <span className="df-cw-tag">{lang === 'es' ? 'Ejemplo' : 'Sample'}</span>
        </div>
      </div>

      <div className="df-nodes">
        {NODES.map((node) => {
          const pos = isMobile ? node.mobPos : node.deskPos;
          const tipDir = isMobile ? node.mobTip : node.deskTip;
          const isActive = activeNode === node.id;

          return (
            <div
              className={`df-node ${isActive ? 'is-active' : ''}`}
              style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
              key={node.id}
              onPointerEnter={() => {
                hoveredNodeRef.current = node.id;
              }}
              onPointerLeave={() => {
                hoveredNodeRef.current = null;
              }}
            >
              <button
                className="df-node-btn"
                aria-expanded={isActive}
                aria-describedby={`df-tip-${node.id}`}
                onClick={() => setActiveNode(isActive ? null : node.id)}
                onFocus={() => {
                  hoveredNodeRef.current = node.id;
                  setActiveNode(node.id);
                }}
                onBlur={() => {
                  hoveredNodeRef.current = null;
                  setActiveNode(null);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="df-node-icon">
                  {SVGS[node.id]}
                </svg>
                <span>{node.label[lang]}</span>
                {node.id === 'val' && <ValIcons />}
              </button>

              <div
                id={`df-tip-${node.id}`}
                role="tooltip"
                className={`df-tooltip df-tip--${tipDir} ${
                  isActive ? 'is-visible' : ''
                }`}
              >
                {node.desc[lang]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
