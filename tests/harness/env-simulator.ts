/**
 * Browser & DOM Environment Simulator for End-to-End CRO testing.
 */

export interface TrackedEvent {
  name: string;
  params: Record<string, unknown>;
  timestamp: number;
}

export interface CapturedFetch {
  url: string;
  method: string;
  body: string | URLSearchParams | FormData | null;
  mode?: string;
  redirect?: string;
  signal?: AbortSignal;
}

export interface EnvState {
  url: string;
  pathname: string;
  search: string;
  hash: string;
  referrer: string;
  lang: 'es' | 'en';
  title: string;
  metaTags: Map<string, string>;
  localStorageData: Map<string, string>;
  trackedEvents: TrackedEvent[];
  fetchCalls: CapturedFetch[];
  fetchResponder?: (call: CapturedFetch) => Promise<{ ok: boolean; status: number; text: () => Promise<string> }>;
}

export function createBrowserEnvironment(initialUrl = 'https://www.sagepoint-analytics.com/', initialReferrer = '') {
  const urlObj = new URL(initialUrl);

  const state: EnvState = {
    url: initialUrl,
    pathname: urlObj.pathname,
    search: urlObj.search,
    hash: urlObj.hash,
    referrer: initialReferrer,
    lang: urlObj.searchParams.get('lang') === 'en' ? 'en' : 'es',
    title: 'Sagepoint Analytics',
    metaTags: new Map<string, string>(),
    localStorageData: new Map<string, string>(),
    trackedEvents: [],
    fetchCalls: [],
  };

  const localStorageMock = {
    getItem: (key: string) => state.localStorageData.get(key) ?? null,
    setItem: (key: string, value: string) => state.localStorageData.set(key, String(value)),
    removeItem: (key: string) => state.localStorageData.delete(key),
    clear: () => state.localStorageData.clear(),
    key: (index: number) => Array.from(state.localStorageData.keys())[index] ?? null,
    get length() {
      return state.localStorageData.size;
    },
  };

  const dataLayerMock: unknown[] = [];

  const gtagMock = function (...args: unknown[]) {
    dataLayerMock.push(args);
    if (args[0] === 'event' && typeof args[1] === 'string') {
      state.trackedEvents.push({
        name: args[1],
        params: (args[2] as Record<string, unknown>) || {},
        timestamp: Date.now(),
      });
    }
  };

  const documentElementMock = {
    lang: state.lang,
    scrollHeight: 3200,
    style: {
      setProperty: (_prop: string, _val: string) => {},
    },
  };

  const headMock = {
    appendChild: (_child: unknown) => {},
  };

  const documentMock = {
    title: state.title,
    referrer: state.referrer,
    documentElement: documentElementMock,
    head: headMock,
    getElementById: (id: string) => ({
      id,
      scrollIntoView: (_opts?: unknown) => {},
      style: {
        setProperty: (_p: string, _v: string) => {},
      },
    }),
    querySelectorAll: (_selector: string) => [],
    createElement: (tag: string) => ({
      tagName: tag.toUpperCase(),
      setAttribute: (_k: string, _v: string) => {},
      style: {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const locationMock = {
    href: state.url,
    pathname: state.pathname,
    search: state.search,
    hash: state.hash,
    origin: urlObj.origin,
    protocol: urlObj.protocol,
    host: urlObj.host,
    hostname: urlObj.hostname,
    port: urlObj.port,
    assign: (newUrl: string) => {
      const u = new URL(newUrl, state.url);
      state.url = u.href;
      state.pathname = u.pathname;
      state.search = u.search;
      state.hash = u.hash;
    },
    replace: (newUrl: string) => {
      const u = new URL(newUrl, state.url);
      state.url = u.href;
      state.pathname = u.pathname;
      state.search = u.search;
      state.hash = u.hash;
    },
  };

  const fetchMock = async (url: string | URL, init?: RequestInit) => {
    const captured: CapturedFetch = {
      url: String(url),
      method: init?.method || 'GET',
      body: (init?.body as string | URLSearchParams | FormData) || null,
      mode: init?.mode,
      redirect: init?.redirect,
      signal: init?.signal,
    };
    state.fetchCalls.push(captured);

    if (state.fetchResponder) {
      return state.fetchResponder(captured);
    }

    // Default successful response
    return {
      ok: true,
      status: 200,
      text: async () => 'Success: Row appended to Google Sheet',
      json: async () => ({ status: 'success' }),
    };
  };

  const matchMediaMock = (query: string) => ({
    matches: query.includes('min-width') || query.includes('pointer: fine'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });

  class IntersectionObserverMock {
    constructor(private callback: (entries: unknown[], observer: unknown) => void) {}
    observe(_target: unknown) {}
    unobserve(_target: unknown) {}
    disconnect() {}
  }

  const windowMock = {
    location: locationMock,
    document: documentMock,
    localStorage: localStorageMock,
    dataLayer: dataLayerMock,
    gtag: gtagMock,
    innerHeight: 800,
    innerWidth: 1200,
    scrollY: 0,
    scrollTo: (_opts?: unknown) => {},
    matchMedia: matchMediaMock,
    IntersectionObserver: IntersectionObserverMock,
    addEventListener: () => {},
    removeEventListener: () => {},
    requestAnimationFrame: (cb: (now: number) => void) => setTimeout(() => cb(Date.now()), 16),
    cancelAnimationFrame: (id: NodeJS.Timeout | number) => clearTimeout(id as NodeJS.Timeout),
    fetch: fetchMock,
    AbortController: globalThis.AbortController,
    FormData: globalThis.FormData,
    URLSearchParams: globalThis.URLSearchParams,
  };

  return {
    state,
    window: windowMock,
    document: documentMock,
    localStorage: localStorageMock,
    fetch: fetchMock,
    gtag: gtagMock,
    setNavigation: (newUrl: string) => {
      const u = new URL(newUrl);
      state.url = newUrl;
      state.pathname = u.pathname;
      state.search = u.search;
      state.hash = u.hash;
      state.lang = u.searchParams.get('lang') === 'en' ? 'en' : 'es';
      locationMock.href = newUrl;
      locationMock.pathname = u.pathname;
      locationMock.search = u.search;
      locationMock.hash = u.hash;
      documentMock.documentElement.lang = state.lang;
    },
    installGlobals: () => {
      (globalThis as any).window = windowMock;
      (globalThis as any).document = documentMock;
      (globalThis as any).localStorage = localStorageMock;
      (globalThis as any).gtag = gtagMock;
      (globalThis as any).dataLayer = dataLayerMock;
      (globalThis as any).fetch = fetchMock;
      (globalThis as any).matchMedia = matchMediaMock;
      (globalThis as any).IntersectionObserver = IntersectionObserverMock;
    },
  };
}

/**
 * Mathematical ROI model implementation matching business CRO spec
 */
export interface RoiInput {
  teamSize: number;
  hoursPerWeekPerPerson: number;
  hourlyRate?: number;
  packageTier?: 'quick-win' | 'executive' | 'custom';
}

export interface RoiOutput {
  annualHoursSaved: number;
  monthlyHoursSaved: number;
  annualDollarSavings: number;
  investmentCost: number;
  netAnnualBenefit: number;
  roiPercentage: number;
  paybackPeriodWeeks: number;
}

export function calculateRoiMetrics(input: RoiInput): RoiOutput {
  const teamSize = Math.max(0, input.teamSize);
  const hoursPerWeek = Math.max(0, input.hoursPerWeekPerPerson);
  const hourlyRate = input.hourlyRate && input.hourlyRate > 0 ? input.hourlyRate : 35; // Standard blended analyst rate

  // Sagepoint CRO standard: 80% automated reduction in manual reporting time
  const efficiencyRate = 0.8;
  const annualTotalHoursSpent = teamSize * hoursPerWeek * 52;
  const annualHoursSaved = Math.round(annualTotalHoursSpent * efficiencyRate);
  const monthlyHoursSaved = Math.round(annualHoursSaved / 12);
  const annualDollarSavings = annualHoursSaved * hourlyRate;

  const packageCosts: Record<string, number> = {
    'quick-win': 750,
    executive: 2500,
    custom: 5000,
  };
  const investmentCost = packageCosts[input.packageTier || 'executive'] || 2500;
  const netAnnualBenefit = annualDollarSavings - investmentCost;
  const roiPercentage =
    annualDollarSavings > 0 && investmentCost > 0
      ? Math.round((netAnnualBenefit / investmentCost) * 100)
      : 0;
  
  const weeklyDollarSavings = annualDollarSavings / 52;
  const paybackPeriodWeeks = weeklyDollarSavings > 0 ? Number((investmentCost / weeklyDollarSavings).toFixed(1)) : 0;

  return {
    annualHoursSaved,
    monthlyHoursSaved,
    annualDollarSavings,
    investmentCost,
    netAnnualBenefit,
    roiPercentage,
    paybackPeriodWeeks,
  };
}
