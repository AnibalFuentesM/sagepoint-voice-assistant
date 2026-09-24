export type SiteLang = 'es' | 'en';

export function getLangFromPath(pathname: string): SiteLang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

/** Localize a Spanish site path, preserving its hash and query string. */
export function localizedPath(path: string, lang: SiteLang): string {
  const url = new URL(path, 'https://www.sagepoint-analytics.com');
  let pathname = url.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (pathname === '/services/' || pathname.startsWith('/services/')) pathname = pathname.replace(/^\/services\//, '/servicios/');
  if (lang === 'en') {
    pathname = pathname.replace(/^\/servicios\//, '/services/');
    pathname = `/en${pathname}`;
  }
  return `${pathname}${url.search}${url.hash}`;
}

export const pairedAlternates = (spanishPath: string) => [
  { lang: 'es', path: localizedPath(spanishPath, 'es') },
  { lang: 'en', path: localizedPath(spanishPath, 'en') },
];

export function legacyEnglishPath(pathname: string): string {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return localizedPath(normalized, 'en');
}
