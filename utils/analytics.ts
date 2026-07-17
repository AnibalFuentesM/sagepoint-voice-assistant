// GA4 bootstrap, campaign attribution and event helpers.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const ATTRIBUTION_KEY = 'sagepoint_lead_attribution';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export type LeadAttribution = Record<(typeof UTM_KEYS)[number], string> & {
  landingPage: string;
  referrer: string;
  capturedAt: string;
};

export function initializeAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
    if (import.meta.env.DEV) {
      console.info('GA4 disabled: set VITE_GA_MEASUREMENT_ID to a valid G-... value.');
    }
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
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
  const hasCampaign = UTM_KEYS.some((key) => params.has(key));

  try {
    if (!hasCampaign && localStorage.getItem(ATTRIBUTION_KEY)) return;

    const attribution = {
      utm_source: params.get('utm_source') || 'direct',
      utm_medium: params.get('utm_medium') || 'none',
      utm_campaign: params.get('utm_campaign') || 'none',
      utm_content: params.get('utm_content') || 'none',
      utm_term: params.get('utm_term') || 'none',
      landingPage: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer || 'direct',
      capturedAt: new Date().toISOString(),
    } satisfies LeadAttribution;

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

export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

export function trackPageView(path: string, title: string) {
  trackEvent('page_view', { page_path: path, page_title: title });
}
