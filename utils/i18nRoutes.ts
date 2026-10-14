export type SiteLang = 'es' | 'en';

export function getLangFromPath(pathname: string): SiteLang {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  if (
    pathname === '/es' ||
    pathname.startsWith('/es/') ||
    pathname.startsWith('/servicios') ||
    pathname.startsWith('/guias') ||
    pathname.startsWith('/web')
  ) {
    return 'es';
  }
  return 'en';
}

/** Localize a site path, preserving its hash and query string. */
export function localizedPath(path: string, lang: SiteLang): string {
  const url = new URL(path, 'https://www.sagepoint-analytics.com');
  let pathname = url.pathname.replace(/^\/(?:en|es)(?=\/|$)/, '') || '/';
  if (pathname === '/services' || pathname.startsWith('/services/')) {
    pathname = pathname.replace(/^\/services/, '/servicios');
  }
  if (pathname.startsWith('/servicios')) {
    if (lang === 'en') {
      pathname = pathname.replace(/^\/servicios/, '/en/services');
    }
  } else if (pathname.startsWith('/web') || pathname.startsWith('/guias')) {
    if (lang === 'en') {
      pathname = `/en${pathname}`;
    }
  } else {
    if (lang === 'es') {
      pathname = pathname === '/' ? '/es/' : `/es${pathname}`;
    }
  }
  return `${pathname}${url.search}${url.hash}`;
}

export const pairedAlternates = (path: string) => [
  { lang: 'es', path: localizedPath(path, 'es') },
  { lang: 'en', path: localizedPath(path, 'en') },
];

export function legacyEnglishPath(pathname: string): string {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return localizedPath(normalized, 'en');
}
