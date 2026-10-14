import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { trackPageView } from '../utils/analytics';
import { getLangFromPath, pairedAlternates } from '../utils/i18nRoutes';
import { CONTACT_CENTER_SLUGS, HUBS, SERVICES } from './servicesData';
import { ServicesLayout, ServiceActions } from './ServicesLayout';

export default function ServicesHub() {
  const { pathname } = useLocation();
  const lang = getLangFromPath(pathname);
  const hub = HUBS[lang];
  useDocumentMeta(hub.title, hub.description, hub.path, pairedAlternates('/servicios/'), [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'es' ? 'Inicio' : 'Home', item: `https://www.sagepoint-analytics.com${lang === 'es' ? '/es/' : '/'}` },
      { '@type': 'ListItem', position: 2, name: lang === 'es' ? 'Servicios' : 'Services', item: `https://www.sagepoint-analytics.com${hub.path}` },
    ] }
  ]);
  useEffect(() => { trackPageView(hub.path, hub.title, lang); }, [hub.path, hub.title, lang]);
  return <ServicesLayout lang={lang} source="services_hub">
    <section className="wrap service-hero"><nav aria-label={lang === 'es' ? 'Ruta de navegación' : 'Breadcrumb'} className="service-breadcrumb"><Link to={lang === 'es' ? '/es/' : '/'}>{lang === 'es' ? 'Inicio' : 'Home'}</Link><span aria-hidden="true">›</span><span aria-current="page">{lang === 'es' ? 'Servicios' : 'Services'}</span></nav><p className="eyebrow">SAGEPOINT ANALYTICS</p><h1>{hub.h1}</h1><p className="service-lede">{hub.intro}</p><ServiceActions lang={lang} source="services_hub" /></section>
    <section className="wrap service-section"><p className="eyebrow">{lang === 'es' ? 'Elige el trabajo que necesitas' : 'Choose the work you need'}</p><h2>{lang === 'es' ? 'Del dato disperso a una entrega útil' : 'Pick the problem you want solved'}</h2><p>{lang === 'es' ? 'Cada servicio aborda una necesidad distinta. Revisamos tus fuentes y el resultado esperado antes de recomendar herramienta o paquete. Así queda claro qué construiremos y cómo tu equipo lo usará.' : 'Each service solves a different problem. We look at your sources and the result you need before recommending a tool or package, so you know what we will build and how your team will use it.'}</p><div className="service-cards">{SERVICES.filter(s => s.lang === lang && !CONTACT_CENTER_SLUGS.includes(s.slug)).map(service => <article className="service-card" key={service.slug}><p className="eyebrow">{lang === 'es' ? 'Servicio' : 'Service'}</p><h3><Link to={service.path}>{service.h1}</Link></h3><p>{service.subhead}</p><Link className="service-text-link" to={service.path}>{lang === 'es' ? 'Ver servicio →' : 'Explore service →'}</Link></article>)}</div></section>
    {lang === 'en' && <section className="wrap service-section"><p className="eyebrow">For contact centers and BPOs</p><h2>KPI and client reporting for contact centers</h2><p>Specialized reporting for operations that run on ACD, WFM, QA and CRM data.</p><div className="service-cards">{SERVICES.filter(s => s.lang === 'en' && CONTACT_CENTER_SLUGS.includes(s.slug)).map(service => <article className="service-card" key={service.slug}><p className="eyebrow">Contact centers</p><h3><Link to={service.path}>{service.h1}</Link></h3><p>{service.subhead}</p><Link className="service-text-link" to={service.path}>Explore service →</Link></article>)}</div></section>}
    {lang === 'es' && <section className="wrap service-section"><p className="eyebrow">Guía</p><h2>¿Cuánto cuesta un dashboard de Power BI?</h2><p>Conoce los factores que cambian el alcance, los paquetes publicados y cómo pedir una cotización comparable.</p><Link className="service-text-link" to="/guias/cuanto-cuesta-dashboard-power-bi-guatemala/">Leer la guía de costos →</Link></section>}
    <section className="wrap service-section service-close"><h2>{lang === 'es' ? '¿No sabes por dónde empezar?' : 'Unsure where to start?'}</h2><p>{lang === 'es' ? 'Cuéntanos qué reporte, decisión o tarea te está consumiendo tiempo. En la llamada gratuita revisamos el contexto y te diremos qué datos hacen falta para acotar una propuesta.' : 'Tell us which report, decision or weekly task is taking too much time. On the free call we look at the context and tell you what data we need to give you a fixed price.'}</p><ServiceActions lang={lang} source="services_hub_close" /></section>
  </ServicesLayout>;
}
