import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { trackPageView } from '../utils/analytics';
import { getLangFromPath, pairedAlternates } from '../utils/i18nRoutes';
import { HUBS, SERVICES } from './servicesData';
import { ServicesLayout, ServiceActions } from './ServicesLayout';

export default function ServicesHub() {
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);
  const hub = HUBS[lang];
  useDocumentMeta(hub.title, hub.description, hub.path, pairedAlternates('/servicios/'), [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'es' ? 'Inicio' : 'Home', item: `https://www.sagepoint-analytics.com/${lang === 'en' ? 'en/' : ''}` },
      { '@type': 'ListItem', position: 2, name: lang === 'es' ? 'Servicios' : 'Services', item: `https://www.sagepoint-analytics.com${hub.path}` },
    ] }
  ]);
  useEffect(() => { trackPageView(hub.path, hub.title, lang); }, [hub.path, hub.title, lang]);
  return <ServicesLayout lang={lang} source="services_hub">
    <section className="wrap service-hero"><nav aria-label={lang === 'es' ? 'Ruta de navegación' : 'Breadcrumb'} className="service-breadcrumb"><Link to={lang === 'es' ? '/' : '/en/'}>{lang === 'es' ? 'Inicio' : 'Home'}</Link><span aria-hidden="true">›</span><span aria-current="page">{lang === 'es' ? 'Servicios' : 'Services'}</span></nav><p className="eyebrow">SAGEPOINT ANALYTICS</p><h1>{hub.h1}</h1><p className="service-lede">{hub.intro}</p><ServiceActions lang={lang} source="services_hub" /></section>
    <section className="wrap service-section"><p className="eyebrow">{lang === 'es' ? 'Elige el trabajo que necesitas' : 'Choose the work you need'}</p><h2>{lang === 'es' ? 'Del dato disperso a una entrega útil' : 'From scattered data to a useful deliverable'}</h2><p>{lang === 'es' ? 'Cada servicio aborda una necesidad distinta. Revisamos tus fuentes y el resultado esperado antes de recomendar herramienta o paquete. Así queda claro qué construiremos y cómo tu equipo lo usará.' : 'Each service answers a different operational need. We review your sources, definitions, and expected output before recommending a tool or package, so the work has a clear owner and handoff.'}</p><div className="service-cards">{SERVICES.filter(s => s.lang === lang).map(service => <article className="service-card" key={service.slug}><p className="eyebrow">{lang === 'es' ? 'Servicio' : 'Service'}</p><h3><Link to={service.path}>{service.h1}</Link></h3><p>{service.subhead}</p><Link className="service-text-link" to={service.path}>{lang === 'es' ? 'Ver servicio →' : 'Explore service →'}</Link></article>)}</div></section>
    <section className="wrap service-section service-close"><h2>{lang === 'es' ? '¿No sabes por dónde empezar?' : 'Unsure where to start?'}</h2><p>{lang === 'es' ? 'Cuéntanos qué reporte, decisión o tarea te está consumiendo tiempo. En la llamada gratuita revisamos el contexto y te diremos qué datos hacen falta para acotar una propuesta.' : 'Tell us which report, decision, or recurring task is taking too much work. The free assessment identifies the data and decisions needed to scope a proposal.'}</p><ServiceActions lang={lang} source="services_hub_close" /></section>
  </ServicesLayout>;
}
