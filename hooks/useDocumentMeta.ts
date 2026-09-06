import { useEffect } from 'react';

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
export function useDocumentMeta(title: string, description: string, path: string) {
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

    const language = new URL(url).searchParams.get('lang') === 'en' ? 'en' : 'es';
    const route = new URL(url).pathname;
    for (const lang of ['es', 'en', 'x-default']) {
      let alternate = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!alternate) {
        alternate = document.createElement('link');
        alternate.rel = 'alternate';
        alternate.hreflang = lang;
        document.head.appendChild(alternate);
      }
      alternate.href = `${SITE_URL}${route}${lang === 'en' ? '?lang=en' : ''}`;
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
        { '@type': path.startsWith('/portfolio') ? 'CollectionPage' : 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: language, isPartOf: { '@id': `${SITE_URL}/#website` } },
      ],
    });
    document.head.appendChild(structured);
  }, [title, description, path]);
}
