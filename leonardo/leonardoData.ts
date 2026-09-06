// Content for the Leonardo home page, generated from the standalone preview.
// The 23 dashboard images were lifted out of the preview's base64 payload into
// /public/assets/img and matched back to their production filenames by hash, so
// the HTML no longer carries a megabyte of inline data.
// Regenerate rather than hand-edit.

export type LeoCat = 'bi' | 'auto' | 'web';

/** Cards that fly past the camera in the hero. Decorative: alt text stays empty in the DOM. */
export type LeoTile = { cat: string; title: string; alt: string; h: number; src: string };

/** A real screenshot we are allowed to show. */
export type LeoShot = {
  kind: 'shot';
  file: string;
  cat: LeoCat;
  title: string;
  alt: string;
  h: number;
  src: string;
};

/** A project the client will not let us show on screen, so the figure stands in for the image. */
export type LeoStat = {
  kind: 'type';
  cat: LeoCat;
  client: string;
  num: string;
  numl: string;
  title: string;
  desc: string;
  stack: string[];
};

export type LeoProject = LeoShot | LeoStat;

export type LeoQuote = { text: string; author: string; role: string };

export const TILES: LeoTile[] = [
  {
    "cat": "dash",
    "title": "Centro de control ejecutivo GT / US",
    "alt": "Centro de control ejecutivo GT / US",
    "h": 1144,
    "src": "/assets/img/dash-exec-control-room.webp"
  },
  {
    "cat": "dash",
    "title": "Apex Auto — margen bruto, 12 tiendas",
    "alt": "Apex Auto — margen bruto, 12 tiendas",
    "h": 986,
    "src": "/assets/img/dash-apex-margin-cockpit.webp"
  },
  {
    "cat": "ops",
    "title": "Operador BPO — SLA por sistema",
    "alt": "Operador BPO — SLA por sistema",
    "h": 1069,
    "src": "/assets/img/dash-bpo-sla-engine.webp"
  },
  {
    "cat": "ia",
    "title": "Modelo predictivo de ventas a 12 semanas",
    "alt": "Modelo predictivo de ventas a 12 semanas",
    "h": 973,
    "src": "/assets/img/dash-forecast-model.webp"
  },
  {
    "cat": "auto",
    "title": "Horas manuales eliminadas por semana",
    "alt": "Horas manuales eliminadas por semana",
    "h": 922,
    "src": "/assets/img/dash-report-automation.webp"
  },
  {
    "cat": "ops",
    "title": "Rendimiento de agentes en vivo",
    "alt": "Rendimiento de agentes en vivo",
    "h": 809,
    "src": "/assets/img/dash-agent-leaderboard.webp"
  },
  {
    "cat": "fin",
    "title": "Antigüedad de cartera y DSO",
    "alt": "Antigüedad de cartera y DSO",
    "h": 999,
    "src": "/assets/img/dash-dso-aging.webp"
  },
  {
    "cat": "ia",
    "title": "Retención por cohorte de alta",
    "alt": "Retención por cohorte de alta",
    "h": 951,
    "src": "/assets/img/dash-cohort-retention.webp"
  },
  {
    "cat": "ops",
    "title": "Alertas de reorden multi-tienda",
    "alt": "Alertas de reorden multi-tienda",
    "h": 778,
    "src": "/assets/img/dash-inventory-alerts.webp"
  },
  {
    "cat": "dash",
    "title": "Embudo comercial por etapa",
    "alt": "Embudo comercial por etapa",
    "h": 929,
    "src": "/assets/img/dash-funnel-conversion.webp"
  },
  {
    "cat": "auto",
    "title": "Validación de 22 archivos fuente",
    "alt": "Validación de 22 archivos fuente",
    "h": 1101,
    "src": "/assets/img/dash-data-quality.webp"
  },
  {
    "cat": "fin",
    "title": "Ahorro acumulado del proyecto",
    "alt": "Ahorro acumulado del proyecto",
    "h": 948,
    "src": "/assets/img/dash-roi-savings.webp"
  },
  {
    "cat": "auto",
    "title": "Zendesk Talk — cuadre Explore vs. API",
    "alt": "Zendesk Talk — cuadre Explore vs. API",
    "h": 1030,
    "src": "/assets/img/dash-zendesk-reconciliation.webp"
  },
  {
    "cat": "dash",
    "title": "Pulso operativo en tiempo real",
    "alt": "Pulso operativo en tiempo real",
    "h": 1344,
    "src": "/assets/img/dash-ops-pulse.webp"
  },
  {
    "cat": "ia",
    "title": "Arquitectura de datos Sagepoint",
    "alt": "Arquitectura de datos Sagepoint",
    "h": 986,
    "src": "/assets/img/dash-portfolio-architecture.webp"
  }
];

export const PROJECTS: LeoProject[] = [
  {
    "kind": "shot",
    "file": "apex-powerbi",
    "cat": "bi",
    "title": "Apex Auto Group — cockpit ejecutivo en Power BI",
    "alt": "Dashboard de Power BI de Apex Auto Group con unidades vendidas, ingreso neto y margen bruto por región",
    "h": 507,
    "src": "/assets/img/work-apex-powerbi.webp"
  },
  {
    "kind": "shot",
    "file": "jks-crm",
    "cat": "web",
    "title": "JKS — CRM empresarial",
    "alt": "Pantalla de análisis y reportes del CRM empresarial de JKS con asignaciones por agente",
    "h": 453,
    "src": "/assets/img/work-jks-crm.webp"
  },
  {
    "kind": "type",
    "cat": "bi",
    "client": "Operador BPO multi-cliente",
    "num": "33,370",
    "numl": "filas reconciliadas · 79 semanas",
    "title": "Motor de reportería multi-tenant",
    "desc": "Catorce sistemas de telefonía y CRM consolidados a diario. El cumplimiento de SLA pasó de 81.2% a 99.4% y liberó 28 horas de supervisión por semana.",
    "stack": [
      "Apps Script",
      "SQL Warehousing",
      "Looker Studio",
      "14 APIs"
    ]
  },
  {
    "kind": "shot",
    "file": "dicoma",
    "cat": "web",
    "title": "Dicoma S.A. — sitio corporativo",
    "alt": "Página de inicio de Dicoma S.A., empresa de diseño y construcción eléctrica",
    "h": 506,
    "src": "/assets/img/work-dicoma.webp"
  },
  {
    "kind": "shot",
    "file": "mission-control",
    "cat": "auto",
    "title": "GravityClaw — consola Mission Control",
    "alt": "Consola Mission Control de GravityClaw con estado del bot, tareas y actividad reciente",
    "h": 506,
    "src": "/assets/img/work-mission-control.webp"
  },
  {
    "kind": "shot",
    "file": "saludable",
    "cat": "web",
    "title": "Saludable — Nutricionista Maylin Sic",
    "alt": "Página de inicio del sitio de nutrición Saludable con agenda de consultas",
    "h": 506,
    "src": "/assets/img/work-saludable.webp"
  },
  {
    "kind": "type",
    "cat": "bi",
    "client": "Zendesk Talk · reportería",
    "num": "11,327",
    "numl": "call units · 0 diferencias",
    "title": "Cuadre entre Explore y la API",
    "desc": "Un workflow en Apps Script sustituyó la exportación manual y validó cada unidad contra las dos fuentes. El cierre pasó de horas a una corrida diaria.",
    "stack": [
      "Google Apps Script",
      "Talk API v2",
      "Sheets"
    ]
  },
  {
    "kind": "shot",
    "file": "jens-desserts",
    "cat": "web",
    "title": "Jen's Desserts GT",
    "alt": "Página de inicio de Jen's Desserts con pedidos por WhatsApp",
    "h": 506,
    "src": "/assets/img/work-jens-desserts.webp"
  },
  {
    "kind": "shot",
    "file": "inmotion",
    "cat": "web",
    "title": "InMotion Dance Academy",
    "alt": "Catálogo de videos de InMotion Dance Academy con filtros por estilo y nivel",
    "h": 506,
    "src": "/assets/img/work-inmotion.webp"
  }
];

export const SAY: LeoQuote[] = [
  {
    "text": "Ver la fuga de margen en repuestos el mismo día, no semanas después.",
    "author": "Marcus Vance",
    "role": "Managing Partner · Apex Auto"
  },
  {
    "text": "Hoy el SLA está en 99.4% y liberamos 28 horas de supervisores por semana.",
    "author": "Carolina Flores",
    "role": "VP Operaciones · operador BPO multi-cliente"
  },
  {
    "text": "Tuvo la paciencia de entender nuestras ideas antes de proponer nada.",
    "author": "Meylin Sic",
    "role": "Coordinadora de Proyecto"
  },
  {
    "text": "Un solo cockpit para 12 concesionarios y 85 feeds de DMS.",
    "author": "Marcus Vance",
    "role": "Managing Partner · Apex Auto"
  },
  {
    "text": "Gestionar 33,000 registros y 14 sistemas era una pesadilla manual.",
    "author": "Carolina Flores",
    "role": "VP Operaciones · operador BPO multi-cliente"
  },
  {
    "text": "El primer dashboard funcional llegó en menos de 10 días.",
    "author": "Meylin Sic",
    "role": "Coordinadora de Proyecto"
  }
];

export const CATNAME: Record<LeoCat, string> = {
  bi: 'BI & Dashboards',
  auto: 'Automatización',
  web: 'Web & Apps',
};

export const CATCOLOR: Record<LeoCat, string> = {
  bi: '#63e6be',
  auto: '#8b7dff',
  web: '#33d0ff',
};

/** Same three colours as CATCOLOR, as bare channels, for rgba() interpolation in inline styles. */
export const CATRGB: Record<LeoCat, string> = {
  bi: '99,230,190',
  auto: '139,125,255',
  web: '51,208,255',
};
