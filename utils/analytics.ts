// GA4 bootstrap, campaign attribution and event helpers.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const ATTRIBUTION_KEY = 'sagepoint_lead_attribution';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const CLICK_ID_KEYS = ['gclid', 'fbclid', 'msclkid', 'ttclid'] as const;

export type LeadAttribution = Record<(typeof UTM_KEYS)[number], string> & {
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  ttclid?: string;
  landingPage: string;
  referrer: string;
  capturedAt: string;
};

// Public GA4 measurement ID (not a secret — it ships in the HTML of every GA site).
// Used automatically in production builds; dev stays silent unless
// VITE_GA_MEASUREMENT_ID is set in .env.local.
const PROD_MEASUREMENT_ID = 'G-F296ZSRJ2Z';

export function initializeAnalytics() {
  const measurementId =
    import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ||
    (import.meta.env.PROD ? PROD_MEASUREMENT_ID : '');
  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
    if (import.meta.env.DEV) {
      console.info('GA4 disabled in dev: set VITE_GA_MEASUREMENT_ID in .env.local to test analytics locally.');
    }
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    // gtag consumes Arguments objects, as in the official bootstrap snippet.
    window.dataLayer?.push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
}

export function captureLeadAttribution() {
  const params = new URLSearchParams(window.location.search);
  const hasCampaign =
    UTM_KEYS.some((key) => params.has(key)) ||
    CLICK_ID_KEYS.some((key) => params.has(key));

  try {
    if (!hasCampaign && localStorage.getItem(ATTRIBUTION_KEY)) return;

    // Detect click IDs from search params
    const gclid = params.get('gclid') || '';
    const fbclid = params.get('fbclid') || '';
    const msclkid = params.get('msclkid') || '';
    const ttclid = params.get('ttclid') || '';

    // Smart default source/medium if click IDs exist without explicit UTMs
    let defaultSource = 'direct';
    let defaultMedium = 'none';
    if (gclid) {
      defaultSource = 'google';
      defaultMedium = 'cpc';
    } else if (fbclid) {
      defaultSource = 'facebook';
      defaultMedium = 'paid_social';
    } else if (msclkid) {
      defaultSource = 'bing';
      defaultMedium = 'cpc';
    } else if (ttclid) {
      defaultSource = 'tiktok';
      defaultMedium = 'paid_social';
    }

    const attribution: LeadAttribution = {
      utm_source: params.get('utm_source') || defaultSource,
      utm_medium: params.get('utm_medium') || defaultMedium,
      utm_campaign: params.get('utm_campaign') || 'none',
      utm_content: params.get('utm_content') || 'none',
      utm_term: params.get('utm_term') || 'none',
      ...(gclid ? { gclid } : {}),
      ...(fbclid ? { fbclid } : {}),
      ...(msclkid ? { msclkid } : {}),
      ...(ttclid ? { ttclid } : {}),
      landingPage: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer || 'direct',
      capturedAt: new Date().toISOString(),
    };

    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution is helpful but should never block rendering or lead submission.
  }
}

export function getLeadAttribution(): LeadAttribution {
  try {
    const stored = localStorage.getItem(ATTRIBUTION_KEY);
    if (stored) return JSON.parse(stored) as LeadAttribution;
  } catch {
    // Fall through to a safe direct-traffic attribution.
  }

  return {
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'none',
    utm_content: 'none',
    utm_term: 'none',
    landingPage: window.location.pathname,
    referrer: document.referrer || 'direct',
    capturedAt: new Date().toISOString(),
  };
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

export function trackPageView(path: string, title: string, language?: string) {
  const page_location = typeof window !== 'undefined' ? window.location.href : '';
  const lang = language || (typeof document !== 'undefined' && document.documentElement.lang) || 'es';
  trackEvent('page_view', {
    page_title: title,
    page_location,
    page_path: path,
    language: lang,
  });
}

export interface SelectPackageEventParams {
  package_id: string;
  package_name?: string;
  price?: string | number;
  currency?: string;
  language?: string;
  [key: string]: unknown;
}

export function trackSelectPackage(params: SelectPackageEventParams) {
  trackEvent('select_package', {
    currency: 'USD',
    ...params,
  });
}

export interface LeadSubmitAttemptEventParams {
  package_id?: string;
  form_location?: string;
  language?: string;
  [key: string]: unknown;
}

export function trackLeadSubmitAttempt(params: LeadSubmitAttemptEventParams) {
  trackEvent('lead_submit_attempt', {
    form_location: 'contact_section',
    ...params,
  });
}

export interface GenerateLeadEventParams {
  package_id?: string;
  lead_id?: string;
  attribution?: unknown;
  language?: string;
  [key: string]: unknown;
}

export function trackGenerateLead(params: GenerateLeadEventParams) {
  trackEvent('generate_lead', {
    ...params,
  });
}

export interface WhatsAppClickEventParams {
  source_section?: string;
  package_id?: string;
  language?: string;
  [key: string]: unknown;
}

export function trackWhatsAppClick(params: WhatsAppClickEventParams) {
  trackEvent('whatsapp_click', {
    ...params,
  });
}

export interface ScheduleCallEventParams {
  source_section?: string;
  package_id?: string;
  method?: string;
  language?: string;
  [key: string]: unknown;
}

export function trackScheduleCall(params: ScheduleCallEventParams) {
  trackEvent('schedule_call', {
    method: 'direct_calendar',
    ...params,
  });
}

export interface ViewRoiCalcEventParams {
  source_section?: string;
  language?: string;
  [key: string]: unknown;
}

export function trackViewRoiCalc(params: ViewRoiCalcEventParams) {
  trackEvent('view_roi_calc', {
    source_section: 'roi_calculator',
    ...params,
  });
}

export interface CalculateRoiEventParams {
  team_size: number;
  hours_per_week: number;
  estimated_savings: number;
  language?: string;
  [key: string]: unknown;
}

export function trackCalculateRoi(params: CalculateRoiEventParams) {
  trackEvent('calculate_roi', {
    ...params,
  });
}


