import { useEffect } from 'react';
import { getLangFromPath } from '../utils/i18nRoutes';

const SITE_URL = 'https://www.sagepoint-analytics.com';

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Per-route document metadata for the SPA: title, meta description, canonical and social previews.
export function useDocumentMeta(title: string, description: string, path: string, alternates: {lang: string; path: string}[] = [{ lang: getLangFromPath(path), path }], extraGraph: Record<string, unknown>[] = []) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const language = getLangFromPath(path);
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove());
    for (const alternate of alternates) {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = alternate.lang;
      link.href = `${SITE_URL}${alternate.path}`;
      document.head.appendChild(link);
    }

    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', language === 'en' ? 'en_US' : 'es_GT');
    upsertMeta('meta[property="og:locale:alternate"]', 'property', 'og:locale:alternate', language === 'en' ? 'es_GT' : 'en_US');
    // A client-side route change must not retain the previous page's FAQ/offers.
    // Build-time HTML has its page-specific graph; the live graph follows navigation.
    const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'));
    let organization: Record<string, unknown> | undefined;
    for (const script of scripts) {
      try {
        const graph = JSON.parse(script.textContent || '{}')['@graph'] || [];
        organization ||= graph.find((item: Record<string, unknown>) => item['@id'] === `${SITE_URL}/#organization`);
      } catch { /* Ignore malformed third-party metadata. */ }
      script.remove();
    }
    if (organization) {
      const { hasOfferCatalog, ...identity } = organization;
      organization = identity;
    }
    const structured = document.createElement('script');
    structured.type = 'application/ld+json';
    structured.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        ...(organization ? [organization] : []),
        { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Sagepoint Analytics' },
        { '@type': path.includes('/portfolio/') ? 'CollectionPage' : 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: language, isPartOf: { '@id': `${SITE_URL}/#website` } },
        ...extraGraph,
      ],
    });
    document.head.appendChild(structured);
  }, [title, description, path, JSON.stringify(alternates), JSON.stringify(extraGraph)]);
}
