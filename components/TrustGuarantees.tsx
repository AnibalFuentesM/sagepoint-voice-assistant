import React from 'react';
import {
  Zap,
  ShieldCheck,
  Lock,
  UserCheck,
  CheckCircle2,
  FileCode2,
  Database,
  ArrowUpRight,
  ShieldAlert,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export interface TrustGuaranteesProps {
  lang: 'es' | 'en';
  onScheduleClick?: () => void;
  waLink?: string;
}

export const trustGuaranteesContent = {
  es: {
    eyebrow: "GARANTÍAS Y MOTOR DE CONFIANZA",
    title: "Cero riesgo técnico. Cero candados. 100% certeza de negocio.",
    description:
      "Eliminamos la fricción de implementar analítica avanzada: contratos con entregable cerrado, propiedad total de tu propiedad intelectual, acuerdos de confidencialidad estrictos y entrega rápida garantizada.",
    cta_schedule: "Agendar diagnóstico sin costo",
    cta_whatsapp: "Consultar por WhatsApp",
    guarantees: [
      {
        id: 'turnaround',
        icon: Zap,
        badge: "14 DÍAS MÁXIMO",
        title: "Garantía de Entrega en 14 Días",
        subtitle: "Primer dashboard productivo rápido",
        description:
          "Tu primer dashboard ejecutivo funcionando en producción en 14 días o menos. Si no cumplimos el plazo acordado, continuamos el desarrollo sin costo adicional hasta tu total satisfacción.",
        highlights: [
          "Prototipo validado en los primeros 5 días hábiles",
          "Despliegue productivo final antes del día 14",
          "Compromiso de cumplimiento por escrito",
        ],
      },
      {
        id: 'ownership',
        icon: FileCode2,
        badge: "100% PROPIEDAD TOTAL",
        title: "100% Propiedad de Datos y Código",
        subtitle: "Cero retención de código o vendor lock-in",
        description:
          "Propiedad intelectual absoluta: todos los archivos Power BI (.pbix), consultas SQL, medidas DAX, scripts de Python ETL y dashboards pertenecen 100% a tu empresa.",
        highlights: [
          "Archivos fuente abiertos (.pbix, .sql, .py) transferidos",
          "Sin suscripciones obligatorias ni dependencias forzosas",
          "Documentación completa para la autonomía de tu equipo",
        ],
      },
      {
        id: 'security',
        icon: Lock,
        badge: "SOC2 & HIPAA READY",
        title: "Protocolo de Privacidad y NDA Empresarial",
        subtitle: "Confidencialidad y seguridad estricta",
        description:
          "Acuerdos de confidencialidad bilaterales (NDA) antes de iniciar. Conexiones de solo lectura a bases de datos, credenciales cifradas y cero entrenamiento de modelos IA con tus datos privados.",
        highlights: [
          "NDA formal firmado previo al acceso a datos",
          "Conexiones de base de datos de solo lectura y túneles seguros",
          "Cero transmisión a terceros ni almacenamiento innecesario",
        ],
      },
      {
        id: 'architect',
        icon: UserCheck,
        badge: "SENIOR ARCHITECTS",
        title: "Acceso Directo a Senior BI Architect",
        subtitle: "Sin intermediarios junior ni pérdida de contexto",
        description:
          "Trabajas directamente con ingenieros y consultores senior de Business Intelligence de principio a fin. Quien diagnostica tu necesidad es quien programa y optimiza tu infraestructura.",
        highlights: [
          "Comunicación fluida vía videollamada y WhatsApp directo",
          "Arquitectura de datos validada con mejores prácticas globales",
          "Resolución inmediata de bloqueos técnicos y de negocio",
        ],
      },
    ],
    badges_bar_title: "Estándares y Protocolos de Seguridad Verificados",
    security_badges: [
      { label: "SOC2-Ready Read-Only Access", desc: "Conexiones de solo lectura y credenciales cifradas" },
      { label: "HIPAA Data Privacy Protocol", desc: "Segregación estricta de PHI y datos sensibles" },
      { label: "100% Open Data & Code Ownership", desc: "Archivos .pbix, SQL y scripts transferidos" },
      { label: "99.9% Pipeline Reliability SLA", desc: "Monitoreo continuo y alertas automáticas" },
    ],
    track_record: [
      { stat: "+$420k", label: "Margen Bruto Protegido", sub: "Fuga anual eliminada en clientes" },
      { stat: "33,370+", label: "Registros Sincronizados en Vivo", sub: "Filas de producción multi-sistema" },
      { stat: "94%", label: "Reducción en Tiempo Operativo", sub: "De 40 hrs a 2.5 hrs semanales" },
      { stat: "14 Días", label: "Tiempo de Entrega Garantizado", sub: "Primer dashboard en producción" },
    ],
  },
  en: {
    eyebrow: "ENTERPRISE GUARANTEES & TRUST PROTOCOL",
    title: "Zero technical risk. Zero lock-in. 100% business certainty.",
    description:
      "We eliminate the friction of deploying enterprise analytics: fixed deliverables, 100% intellectual property ownership, strict non-disclosure agreements, and guaranteed rapid delivery.",
    cta_schedule: "Book free diagnostic assessment",
    cta_whatsapp: "Ask questions on WhatsApp",
    guarantees: [
      {
        id: 'turnaround',
        icon: Zap,
        badge: "14 DAYS MAX",
        title: "14-Day Rapid Delivery Guarantee",
        subtitle: "Fast first production deliverable",
        description:
          "Your first executive dashboard live in production within 14 days or less. If we miss the agreed deadline, we continue development at zero cost until full completion.",
        highlights: [
          "Interactive prototype validated in the first 5 business days",
          "Final production deployment before day 14",
          "Written on-time completion guarantee",
        ],
      },
      {
        id: 'ownership',
        icon: FileCode2,
        badge: "100% FULL OWNERSHIP",
        title: "100% Data & Code Ownership",
        subtitle: "Zero code retention or vendor lock-in",
        description:
          "Full intellectual property ownership: all Power BI (.pbix) files, SQL queries, DAX measures, Python ETL scripts, and dashboards belong 100% to your company.",
        highlights: [
          "Raw source files (.pbix, .sql, .py) handed over directly",
          "No forced retainer lock-in or proprietary dependencies",
          "Comprehensive documentation for team autonomy",
        ],
      },
      {
        id: 'security',
        icon: Lock,
        badge: "SOC2 & HIPAA READY",
        title: "Enterprise NDA & Data Privacy Protocol",
        subtitle: "Strict confidentiality and bank-grade security",
        description:
          "Bilateral non-disclosure agreements (NDA) before kickoff. SOC2-compliant read-only database connections, encrypted credentials, and zero AI training on your private business records.",
        highlights: [
          "Formal bilateral NDA signed before data access",
          "Strictly read-only database credentials and secure tunnels",
          "Zero third-party data leakage or unauthorized storage",
        ],
      },
      {
        id: 'architect',
        icon: UserCheck,
        badge: "SENIOR ARCHITECTS",
        title: "Direct Senior BI Architect Access",
        subtitle: "No junior middle-managers or lost context",
        description:
          "Collaborate directly end-to-end with senior Business Intelligence architects and engineers. The expert who audits your requirements is the one who writes the code and optimizes your dashboards.",
        highlights: [
          "Direct video calls and priority WhatsApp communication",
          "Data models architected against global industry standards",
          "Instant unblocking of technical and business challenges",
        ],
      },
    ],
    badges_bar_title: "Verified Enterprise Standards & Security Protocols",
    security_badges: [
      { label: "SOC2-Ready Read-Only Access", desc: "Read-only DB roles & encrypted credentials" },
      { label: "HIPAA Data Privacy Protocol", desc: "Strict PHI segregation and data anonymization" },
      { label: "100% Open Data & Code Ownership", desc: ".pbix, SQL, and Python source transfer" },
      { label: "99.9% Pipeline Reliability SLA", desc: "Continuous health monitoring & automated alerts" },
    ],
    track_record: [
      { stat: "+$420k", label: "Gross Margin Protected", sub: "Annual leakage prevented across stores" },
      { stat: "33,370+", label: "Live Production Records", sub: "Rows synchronized across systems" },
      { stat: "94%", label: "Manual Overhead Reduced", sub: "From 40 hrs to 2.5 hrs weekly" },
      { stat: "14 Days", label: "Guaranteed Turnaround", sub: "First live production dashboard" },
    ],
  },
};

export const TrustGuarantees: React.FC<TrustGuaranteesProps> = ({
  lang,
  onScheduleClick,
  waLink,
}) => {
  const content = trustGuaranteesContent[lang];

  return (
    <section id="guarantees" className="section-frame max-w-[1240px] mx-auto px-5 md:px-8 scroll-mt-20">
      {/* Section Header */}
      <div className="section-heading text-center max-w-3xl mx-auto" data-reveal>
        <p className="eyebrow justify-center">
          <span>07</span>
          {content.eyebrow}
        </p>
        <h2 className="section-title font-serif text-ink">{content.title}</h2>
        <p className="section-description text-muted">{content.description}</p>
      </div>

      {/* 4 Core Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 mb-12">
        {content.guarantees.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className="relative p-6 sm:p-8 rounded-xl border border-[var(--rule)] bg-[#081310] hover:border-[rgba(99,230,190,0.3)] transition-all duration-300 flex flex-col justify-between group"
              data-reveal
              style={{ '--reveal-delay': `${idx * 80}ms` } as React.CSSProperties}
            >
              <div>
                {/* Header with Badge & Icon */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[rgba(99,230,190,0.08)] border border-[rgba(99,230,190,0.2)] flex items-center justify-center text-[var(--mint)] group-hover:scale-105 transition-transform duration-200">
                    <IconComp size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[0.62rem] font-mono tracking-wider font-bold uppercase bg-[rgba(242,166,90,0.1)] text-[var(--copper)] border border-[rgba(242,166,90,0.25)]">
                    {item.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-serif text-xl sm:text-2xl text-[var(--ivory)] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-mono uppercase text-[rgba(99,230,190,0.85)] tracking-wide mb-3">
                  {item.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm text-[rgba(150,165,159,0.92)] leading-relaxed mb-5">
                  {item.description}
                </p>
              </div>

              {/* Bullet highlights */}
              <div className="pt-4 border-t border-[var(--rule)] space-y-2">
                {item.highlights.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-[var(--ivory)]">
                    <CheckCircle2 size={14} className="text-[var(--mint)] shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Compliance Protocols Bar */}
      <div
        className="rounded-xl border border-[var(--rule)] bg-[#0a1714] p-6 sm:p-8 mb-12"
        data-reveal
      >
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={20} className="text-[var(--mint)]" />
          <h4 className="font-mono text-xs tracking-wider uppercase text-[var(--ivory)] font-bold">
            {content.badges_bar_title}
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.security_badges.map((b, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[rgba(8,19,16,0.6)] border border-[rgba(243,240,232,0.06)]"
            >
              <div className="flex items-center gap-2 text-[var(--mint)] text-xs font-bold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--mint)]" />
                {b.label}
              </div>
              <p className="text-[0.75rem] text-muted leading-snug">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Track Record Stats Banner */}
      <div
        className="rounded-xl border border-[var(--rule)] bg-gradient-to-r from-[#081310] via-[#0a1b17] to-[#081310] p-6 sm:p-8"
        data-reveal
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[var(--rule)]">
          {content.track_record.map((item, idx) => (
            <div key={idx} className={`${idx > 0 ? 'pt-4 sm:pt-0 sm:pl-4' : ''}`}>
              <div className="font-serif text-3xl sm:text-4xl text-[var(--mint)] font-normal mb-1">
                {item.stat}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[var(--ivory)] mb-1">
                {item.label}
              </div>
              <div className="text-[0.7rem] text-muted font-mono">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantees Direct Conversion Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center" data-reveal>
        <button
          type="button"
          onClick={onScheduleClick}
          className="button button--primary w-full sm:w-auto justify-center"
        >
          <Calendar size={17} />
          {content.cta_schedule}
          <ArrowUpRight size={17} />
        </button>

        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('whatsapp_click', {
                source_section: 'trust_guarantees',
                package_id: 'general',
                language: lang,
              })
            }
            className="button button--whatsapp w-full sm:w-auto justify-center"
          >
            <MessageCircle size={17} className="text-[#25D366]" />
            {content.cta_whatsapp}
          </a>
        )}
      </div>
    </section>
  );
};
