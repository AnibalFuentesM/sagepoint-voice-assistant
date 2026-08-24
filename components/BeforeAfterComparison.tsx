import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Clock,
  ShieldAlert,
  FileSpreadsheet,
  Smartphone,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  MessageCircle,
  SlidersHorizontal,
  FileWarning,
  Activity,
  Check,
  XCircle,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export type BeforeAfterMode = 'split' | 'before' | 'after';

export interface BeforeAfterComparisonProps {
  lang: 'es' | 'en';
  onCtaClick?: () => void;
  onWhatsAppClick?: () => void;
}

export const beforeAfterContent = {
  es: {
    eyebrow: "ANTES VS DESPUÉS",
    title: "¿Cómo cambia tu operación con Sagepoint Analytics?",
    subtitle: "Compara el desgaste del trabajo manual tradicional frente a la certeza y agilidad de un sistema centralizado de Inteligencia de Negocios.",
    slider_label: "Desliza para comparar Antes y Después",
    tab_before: "Antes: Caos Manual",
    tab_after: "Después: Con Sagepoint",
    tab_split: "Comparativa Split",
    badge_before: "CAOS MANUAL · RETRASO 5-7 DÍAS",
    badge_after: "SAGEPOINT BI · TIEMPO REAL 24/7",
    slider_instructions: "Arrastra el control deslizante o usa las flechas del teclado para explorar",
    spreadsheets_title: "Archivos Descoordinados",
    mockup_before: {
      file1: "Ventas_GT_Q2_v3.xlsx",
      file2: "Ventas_US_Consolidado_corregido.xlsx",
      file3: "Backup_julio_copy.xlsx",
      warning: "⚠️ Error de fórmula en C24: #¡REF! | Desfase: 6 días sin actualizar",
      col_item: "Sucursal / Fuente",
      col_sales: "Venta Reportada",
      col_status: "Estado Conciliación",
      row1_item: "Sucursal Central (POS)",
      row1_sales: "$42,850.00",
      row1_status: "⚠️ Inconsistente (v2)",
      row2_item: "E-Commerce LatAm",
      row2_sales: "#¡VALOR!",
      row2_status: "❌ Error de conexión",
      row3_item: "B2B Distribución US",
      row3_sales: "$114,200.00",
      row3_status: "⚠️ Pendiente validar",
      row4_item: "Total Consolidado",
      row4_sales: "#¡REF!",
      row4_status: "❌ Fórmula rota",
      watermark: "DESACTUALIZADO · 5-7 DÍAS RETRASO",
    },
    mockup_after: {
      live_badge: "● LIVE SYNC (06:42 GT)",
      status_label: "PIPELINES ACTIVOS · 0 ERRORES",
      kpi1_value: "$184,250",
      kpi1_label: "Ventas Mes (+18.4% YoY)",
      kpi2_value: "33,370",
      kpi2_label: "Filas Reconciliadas (100% OK)",
      kpi3_value: "80%",
      kpi3_label: "Ahorro de Tiempo",
      alert_text: "⚡ Alerta Proactiva: Inventario Óptimo en Sucursal Central",
      watermark: "AUTOMATIZADO · 100% CONFIABLE",
    },
    dimensions_title: "Comparativa Operativa Detallada",
    dimensions_subtitle: "5 dimensiones críticas donde las PYMEs pierden dinero y cómo Sagepoint las resuelve.",
    dimensions: [
      {
        id: 'speed',
        icon: Clock,
        title: "Velocidad de Reportes",
        before: {
          label: "5 a 7 días de retraso",
          description: "La gerencia espera días a que el equipo compile, limpie y junte múltiples archivos Excel.",
          badge: "Lento"
        },
        after: {
          label: "Tiempo real automatizado",
          description: "Dashboards autoejecutables que sincronizan datos en segundos directamente de tus sistemas.",
          badge: "Inmediato"
        }
      },
      {
        id: 'accuracy',
        icon: ShieldAlert,
        title: "Confiabilidad de Cifras",
        before: {
          label: "Errores humanos y fórmulas rotas",
          description: "Archivos propensos a #REF!, datos desfasados y juntas directivas con números contradictorios.",
          badge: "Alto Riesgo"
        },
        after: {
          label: "0 errores de copiado manual",
          description: "Una única fuente de verdad validada con pipelines automáticos y criterio humano experto.",
          badge: "100% Verificado"
        }
      },
      {
        id: 'workload',
        icon: FileSpreadsheet,
        title: "Carga de Trabajo Operativo",
        before: {
          label: "10 a 25 hrs/semana en reportes",
          description: "Analistas y gerentes perdiendo jornadas enteras copiando y pegando celdas.",
          badge: "Desgaste"
        },
        after: {
          label: "80% de tiempo liberado",
          description: "Procesos que antes tomaban días ahora se resuelven automáticamente con un clic.",
          badge: "Productividad"
        }
      },
      {
        id: 'visibility',
        icon: Smartphone,
        title: "Accesibilidad Ejecutiva",
        before: {
          label: "Archivos pesados solo en PC",
          description: "Sin visibilidad fuera de la oficina; información atrapada en computadoras locales.",
          badge: "A Ciegas"
        },
        after: {
          label: "Control móvil en cualquier lugar",
          description: "Acceso seguro desde smartphone, tablet o navegador con alertas clave en Slack/WhatsApp.",
          badge: "Control Total"
        }
      },
      {
        id: 'cost',
        icon: DollarSign,
        title: "Inversión y Retorno",
        before: {
          label: "Analista interno costoso ($60k+/año)",
          description: "Altos costos fijos, cargas sociales, curva de aprendizaje y riesgo de rotación de personal.",
          badge: "Costo Alto"
        },
        after: {
          label: "Quick-Win en 14 días desde $750",
          description: "Departamento fraccional de datos: resultados tangibles desde la semana 2 con garantía.",
          badge: "Máximo ROI"
        }
      }
    ],
    cta_primary: "Eliminar el caos manual de mi empresa",
    cta_secondary: "Consultar por WhatsApp",
    vs_label: "VS",
  },
  en: {
    eyebrow: "BEFORE VS AFTER",
    title: "How your operations transform with Sagepoint Analytics",
    subtitle: "Compare the friction of manual spreadsheet reporting against the speed, precision, and confidence of Centralized Business Intelligence.",
    slider_label: "Drag to compare Before and After",
    tab_before: "Before: Manual Chaos",
    tab_after: "After: With Sagepoint",
    tab_split: "Split View",
    badge_before: "MANUAL CHAOS · 5-7 DAYS DELAY",
    badge_after: "SAGEPOINT BI · REAL-TIME 24/7",
    slider_instructions: "Drag the slider handle or use keyboard arrows to explore",
    spreadsheets_title: "Uncoordinated Files",
    mockup_before: {
      file1: "Sales_US_Q2_v3.xlsx",
      file2: "Sales_Consolidated_v4_final.xlsx",
      file3: "Backup_july_copy.xlsx",
      warning: "⚠️ Formula error in C24: #REF! | Lag: 6 days unupdated",
      col_item: "Store / Data Source",
      col_sales: "Reported Sales",
      col_status: "Reconciliation Status",
      row1_item: "Main Headquarters (POS)",
      row1_sales: "$42,850.00",
      row1_status: "⚠️ Inconsistent (v2)",
      row2_item: "E-Commerce US / LatAm",
      row2_sales: "#VALUE!",
      row2_status: "❌ Connection timeout",
      row3_item: "B2B Wholesale Channel",
      row3_sales: "$114,200.00",
      row3_status: "⚠️ Pending validation",
      row4_item: "Consolidated Total",
      row4_sales: "#REF!",
      row4_status: "❌ Broken formula",
      watermark: "OUTDATED · 5-7 DAYS DELAY",
    },
    mockup_after: {
      live_badge: "● LIVE SYNC (06:42 GT)",
      status_label: "ACTIVE PIPELINES · 0 ERRORS",
      kpi1_value: "$184,250",
      kpi1_label: "Month Sales (+18.4% YoY)",
      kpi2_value: "33,370",
      kpi2_label: "Reconciled Rows (100% OK)",
      kpi3_value: "80%",
      kpi3_label: "Time Saved on Excel",
      alert_text: "⚡ Proactive Alert: Optimal Inventory at Central Branch",
      watermark: "AUTOMATED · 100% RELIABLE",
    },
    dimensions_title: "Detailed Operational Comparison",
    dimensions_subtitle: "5 critical operational areas where SMEs leak money and how Sagepoint resolves them.",
    dimensions: [
      {
        id: 'speed',
        icon: Clock,
        title: "Reporting Speed",
        before: {
          label: "5 to 7 days reporting lag",
          description: "Executives wait days for teams to manually consolidate, clean, and format multiple spreadsheets.",
          badge: "Slow"
        },
        after: {
          label: "Real-time automated sync",
          description: "Self-refreshing dashboards syncing data in seconds directly from your core systems.",
          badge: "Instant"
        }
      },
      {
        id: 'accuracy',
        icon: ShieldAlert,
        title: "Data Reliability",
        before: {
          label: "Human errors & broken formulas",
          description: "Constant #REF! errors, version mismatches, and board meetings arguing over contradictory numbers.",
          badge: "High Risk"
        },
        after: {
          label: "0 manual copy-paste errors",
          description: "A single source of truth backed by automated pipelines and human practitioner validation.",
          badge: "100% Verified"
        }
      },
      {
        id: 'workload',
        icon: FileSpreadsheet,
        title: "Team Workload",
        before: {
          label: "10 to 25 hrs/week on reports",
          description: "Skilled managers and analysts wasting entire days doing repetitive copy-paste reporting.",
          badge: "Burnout"
        },
        after: {
          label: "80% of reporting time saved",
          description: "Workflows that took days now execute automatically with zero manual spreadsheet fatigue.",
          badge: "High Efficiency"
        }
      },
      {
        id: 'visibility',
        icon: Smartphone,
        title: "Executive Visibility",
        before: {
          label: "Clunky files locked to desktops",
          description: "Zero visibility while traveling or outside the office; data trapped on local hard drives.",
          badge: "Blind Spots"
        },
        after: {
          label: "Mobile cockpit anywhere",
          description: "Secure, executive-ready dashboard on phone, tablet, or browser with proactive alerts.",
          badge: "Total Control"
        }
      },
      {
        id: 'cost',
        icon: DollarSign,
        title: "Investment & Agility",
        before: {
          label: "Expensive in-house analyst ($60k+/yr)",
          description: "High overhead, payroll taxes, lengthy hiring cycles, and turnover risks.",
          badge: "High Cost"
        },
        after: {
          label: "14-day Quick-Win from $750",
          description: "Fractional BI team: proven results in week two with transparent fixed pricing and guarantee.",
          badge: "Max ROI"
        }
      }
    ],
    cta_primary: "Eliminate manual chaos in my business",
    cta_secondary: "Chat on WhatsApp",
    vs_label: "VS",
  }
};

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  lang,
  onCtaClick,
  onWhatsAppClick,
}) => {
  const t = beforeAfterContent[lang] || beforeAfterContent.es;
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<BeforeAfterMode>('split');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      trackEvent('interact_before_after', {
        mode: 'slider',
        position_percent: Math.round(sliderPos),
        language: lang,
      });
    }
  };

  const updateSliderFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(5, Math.min(95, pos));
    setSliderPos(clamped);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let next = sliderPos;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      next = Math.max(0, sliderPos - 5);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      next = Math.min(100, sliderPos + 5);
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = 100;
    } else {
      return;
    }
    e.preventDefault();
    setSliderPos(next);
    trackEvent('interact_before_after', {
      mode: 'keyboard_slider',
      position_percent: Math.round(next),
      language: lang,
    });
  };

  const handleTabChange = (mode: BeforeAfterMode) => {
    setActiveTab(mode);
    if (mode === 'before') setSliderPos(100);
    else if (mode === 'after') setSliderPos(0);
    else setSliderPos(50);
    trackEvent('interact_before_after', {
      mode: `tab_${mode}`,
      language: lang,
    });
  };

  const handleDefaultCta = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCtaClick) {
      onCtaClick();
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDefaultWhatsApp = (e: React.MouseEvent) => {
    if (onWhatsAppClick) {
      e.preventDefault();
      onWhatsAppClick();
    }
  };

  return (
    <section id="before-after" className="section-frame max-w-[1240px] mx-auto px-5 md:px-8 scroll-mt-20">
      {/* Section Header */}
      <div className="section-heading text-center max-w-3xl mx-auto" data-reveal>
        <p className="eyebrow justify-center">
          <span>02</span>
          {t.eyebrow}
        </p>
        <h2 className="section-title font-serif text-ink mb-5">{t.title}</h2>
        <p className="section-description text-muted mx-auto">{t.subtitle}</p>
      </div>

      {/* Segmented Mode Selector for Accessibility & Mobile UX */}
      <div className="flex items-center justify-center gap-2 mb-8" data-reveal>
        <div className="inline-flex p-1 rounded-full bg-surface-raised border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => handleTabChange('before')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'before' || sliderPos > 85
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
            aria-label={t.tab_before}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
            {t.tab_before}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('split')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'split' && sliderPos >= 15 && sliderPos <= 85
                ? 'bg-sage/20 text-sage border border-sage/40 shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
            aria-label={t.tab_split}
          >
            <SlidersHorizontal size={13} className="inline mr-1.5" />
            {t.tab_split}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('after')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'after' || sliderPos < 15
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
            aria-label={t.tab_after}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
            {t.tab_after}
          </button>
        </div>
      </div>

      {/* Interactive Visual Comparison Stage (Draggable Split Screen) */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#060e0c] select-none touch-none aspect-4/3 sm:aspect-16/10 md:aspect-16/9 mb-12"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        data-reveal
      >
        {/* RIGHT LAYER: After - Sagepoint Centralized Executive BI */}
        <div className="absolute inset-0 w-full h-full p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#071714] via-[#091f1a] to-[#040e0b] flex flex-col justify-between overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-sage/20 pb-3 md:pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage/15 border border-sage/30 text-[0.65rem] sm:text-xs font-bold text-sage animate-pulse">
                {t.mockup_after.live_badge}
              </span>
              <span className="text-[0.65rem] sm:text-xs text-slate-400 font-medium hidden sm:inline">
                {t.mockup_after.status_label}
              </span>
            </div>
            <span className="text-[0.65rem] sm:text-xs font-bold tracking-wider px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              {t.badge_after}
            </span>
          </div>

          {/* Core Cockpit KPI Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 my-auto">
            <div className="p-2.5 sm:p-4 rounded-xl bg-white/[0.04] border border-sage/25 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-muted text-[0.6rem] sm:text-xs mb-1">
                <span>VENTAS TOTALES</span>
                <Sparkles size={13} className="text-sage" />
              </div>
              <p className="text-sm sm:text-2xl md:text-3xl font-serif text-ink font-bold tracking-tight">
                {t.mockup_after.kpi1_value}
              </p>
              <p className="text-[0.55rem] sm:text-xs text-sage font-medium mt-0.5">
                {t.mockup_after.kpi1_label}
              </p>
            </div>

            <div className="p-2.5 sm:p-4 rounded-xl bg-white/[0.04] border border-copper/25 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-muted text-[0.6rem] sm:text-xs mb-1">
                <span>RECONCILIACIÓN</span>
                <CheckCircle2 size={13} className="text-copper" />
              </div>
              <p className="text-sm sm:text-2xl md:text-3xl font-serif text-ink font-bold tracking-tight">
                {t.mockup_after.kpi2_value}
              </p>
              <p className="text-[0.55rem] sm:text-xs text-copper font-medium mt-0.5">
                {t.mockup_after.kpi2_label}
              </p>
            </div>

            <div className="p-2.5 sm:p-4 rounded-xl bg-white/[0.04] border border-emerald-500/25 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between text-muted text-[0.6rem] sm:text-xs mb-1">
                <span>EFICIENCIA</span>
                <Activity size={13} className="text-emerald-400" />
              </div>
              <p className="text-sm sm:text-2xl md:text-3xl font-serif text-ink font-bold tracking-tight">
                {t.mockup_after.kpi3_value}
              </p>
              <p className="text-[0.55rem] sm:text-xs text-emerald-300 font-medium mt-0.5">
                {t.mockup_after.kpi3_label}
              </p>
            </div>
          </div>

          {/* Sparkline & Proactive Alert Chip */}
          <div className="space-y-2">
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[0.65rem] sm:text-xs text-emerald-200">
              <span className="font-semibold">{t.mockup_after.alert_text}</span>
              <span className="hidden md:inline-block text-[0.6rem] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                Auto-Trigger 08:00 AM
              </span>
            </div>

            {/* Sparkline visual curve */}
            <div className="h-8 sm:h-12 w-full flex items-end gap-1 sm:gap-1.5 px-2 pt-1 opacity-75">
              {[35, 42, 50, 48, 65, 70, 62, 85, 92, 88, 96, 100].map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-gradient-to-t from-sage/20 to-sage rounded-t transition-all duration-300"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* LEFT LAYER: Before - Excel Spreadsheet Chaos (Clipped via slider position) */}
        <div
          className="absolute inset-0 w-full h-full p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#1a0f0f] via-[#140b0b] to-[#0d0707] flex flex-col justify-between overflow-hidden border-r border-rose-500/40"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          {/* Header Tab Bar with Conflicting Excel Files */}
          <div>
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-2 mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-hidden">
                <span className="px-2 py-1 rounded bg-rose-950/80 border border-rose-500/40 text-[0.6rem] sm:text-xs font-mono text-rose-300 truncate">
                  📑 {t.mockup_before.file1}
                </span>
                <span className="px-2 py-1 rounded bg-rose-950/40 border border-rose-500/20 text-[0.6rem] sm:text-xs font-mono text-rose-400/70 truncate hidden sm:inline">
                  📑 {t.mockup_before.file2}
                </span>
              </div>
              <span className="text-[0.65rem] sm:text-xs font-bold tracking-wider px-2.5 py-1 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 shrink-0">
                {t.badge_before}
              </span>
            </div>

            {/* Error Warning Alert */}
            <div className="p-2 rounded bg-rose-950/90 border border-rose-500/50 text-[0.6rem] sm:text-xs font-mono text-rose-200 flex items-center gap-2 mb-3">
              <AlertTriangle size={13} className="text-rose-400 shrink-0" />
              <span className="truncate">{t.mockup_before.warning}</span>
            </div>
          </div>

          {/* Distorted Broken Spreadsheet Table */}
          <div className="my-auto overflow-hidden rounded-lg border border-rose-500/30 bg-black/40 text-[0.6rem] sm:text-xs font-mono">
            <div className="grid grid-cols-3 bg-rose-950/40 p-2 border-b border-rose-500/20 text-rose-300 font-bold">
              <span>{t.mockup_before.col_item}</span>
              <span>{t.mockup_before.col_sales}</span>
              <span>{t.mockup_before.col_status}</span>
            </div>
            <div className="divide-y divide-rose-500/15 text-slate-300">
              <div className="grid grid-cols-3 p-2 bg-rose-900/10 items-center">
                <span>{t.mockup_before.row1_item}</span>
                <span className="font-semibold text-rose-300">{t.mockup_before.row1_sales}</span>
                <span className="text-amber-400 text-[0.55rem] sm:text-xs">{t.mockup_before.row1_status}</span>
              </div>
              <div className="grid grid-cols-3 p-2 bg-rose-950/30 items-center">
                <span>{t.mockup_before.row2_item}</span>
                <span className="font-bold text-rose-400 bg-rose-950 px-1 py-0.5 rounded inline-block w-fit">
                  {t.mockup_before.row2_sales}
                </span>
                <span className="text-rose-400 text-[0.55rem] sm:text-xs">{t.mockup_before.row2_status}</span>
              </div>
              <div className="grid grid-cols-3 p-2 bg-rose-900/10 items-center">
                <span>{t.mockup_before.row3_item}</span>
                <span>{t.mockup_before.row3_sales}</span>
                <span className="text-amber-400 text-[0.55rem] sm:text-xs">{t.mockup_before.row3_status}</span>
              </div>
              <div className="grid grid-cols-3 p-2 bg-rose-950/60 font-bold border-t border-rose-500/40 items-center">
                <span>{t.mockup_before.row4_item}</span>
                <span className="text-rose-400 bg-rose-950 px-1 rounded animate-pulse">{t.mockup_before.row4_sales}</span>
                <span className="text-rose-300 text-[0.55rem] sm:text-xs">{t.mockup_before.row4_status}</span>
              </div>
            </div>
          </div>

          {/* Footer watermark */}
          <div className="text-right text-[0.6rem] sm:text-xs font-mono text-rose-400/80 pt-2 border-t border-rose-500/20">
            {t.mockup_before.watermark}
          </div>
        </div>

        {/* DRAGGABLE SLIDER DIVIDER LINE & HANDLE */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none transition-transform duration-75"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Vertical Divider Glow Line */}
          <div className="absolute top-0 bottom-0 -left-px w-0.5 bg-gradient-to-b from-rose-500 via-white to-sage shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

          {/* Accessible Draggable Thumb */}
          <div
            role="slider"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPos)}
            aria-label={t.slider_label}
            onKeyDown={handleKeyDown}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900 border-2 border-white shadow-[0_0_20px_rgba(99,230,190,0.5)] flex items-center justify-center pointer-events-auto cursor-ew-resize focus:outline-none focus:ring-4 focus:ring-sage/60 hover:scale-110 active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-center gap-0.5 text-white">
              <span className="text-[0.65rem] font-bold text-rose-400">◀</span>
              <span className="text-[0.65rem] font-bold text-sage">▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Helper Instruction */}
      <p className="text-center text-xs text-muted/80 mb-12 -mt-8 flex items-center justify-center gap-2">
        <SlidersHorizontal size={13} />
        {t.slider_instructions}
      </p>

      {/* 5-Dimension Operational Comparison Cards Grid */}
      <div className="mb-14" data-reveal>
        <div className="text-center mb-8">
          <h3 className="font-serif text-2xl md:text-3xl text-ink mb-2">
            {t.dimensions_title}
          </h3>
          <p className="text-sm text-muted max-w-2xl mx-auto">
            {t.dimensions_subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.dimensions.map((dim, idx) => {
            const Icon = dim.icon;
            return (
              <div
                key={dim.id}
                className={`spot p-6 rounded-2xl bg-surface border border-white/10 hover:border-sage/40 transition-all flex flex-col justify-between ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-sage/15 border border-sage/30 flex items-center justify-center text-sage">
                        <Icon size={17} />
                      </span>
                      <h4 className="font-serif text-lg text-ink font-bold">
                        {dim.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-muted/60">0{idx + 1}</span>
                  </div>

                  {/* Before Segment */}
                  <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20 mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-rose-300 flex items-center gap-1">
                        <XCircle size={13} />
                        {dim.before.badge}
                      </span>
                      <span className="text-[0.65rem] text-rose-400/80 uppercase font-mono">{lang === 'es' ? 'Antes' : 'Before'}</span>
                    </div>
                    <p className="text-xs font-semibold text-rose-200 mb-1">{dim.before.label}</p>
                    <p className="text-xs text-rose-200/70 leading-relaxed">{dim.before.description}</p>
                  </div>

                  {/* After Segment */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        {dim.after.badge}
                      </span>
                      <span className="text-[0.65rem] text-emerald-400/80 uppercase font-mono">{lang === 'es' ? 'Con Sagepoint' : 'With Sagepoint'}</span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-200 mb-1">{dim.after.label}</p>
                    <p className="text-xs text-emerald-200/70 leading-relaxed">{dim.after.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Bottom Conversion CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10" data-reveal>
        <a
          href="#contact"
          onClick={handleDefaultCta}
          className="button button--primary w-full sm:w-auto"
        >
          {t.cta_primary}
          <ArrowUpRight size={17} />
        </a>

        <a
          href={
            lang === 'es'
              ? 'https://wa.me/50240464716?text=' +
                encodeURIComponent('Hola, vi la comparativa Antes/Después y quiero eliminar el caos manual de mis reportes en Excel.')
              : 'https://wa.me/50240464716?text=' +
                encodeURIComponent('Hi, I saw your Before/After comparison and want to eliminate manual reporting chaos in my business.')
          }
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleDefaultWhatsApp}
          className="button button--whatsapp w-full sm:w-auto"
        >
          <MessageCircle size={17} className="text-[#25D366]" />
          {t.cta_secondary}
        </a>
      </div>
    </section>
  );
};

export default BeforeAfterComparison;
