import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { trackPageView } from '../utils/analytics';
import { SERVICES, type Service } from './servicesData';
import { ServicesLayout, ServiceActions } from './ServicesLayout';

const SITE = 'https://www.sagepoint-analytics.com';
export function serviceGraph(service: Service) {
  const home = service.lang === 'es' ? '/' : '/en/';
  const hub = service.lang === 'es' ? '/servicios/' : '/en/services/';
  return [
    { '@type': 'Service', name: service.h1, description: service.description, serviceType: service.h1, provider: { '@id': `${SITE}/#organization` }, areaServed: { '@type': 'Country', name: service.lang === 'es' ? 'Guatemala' : 'United States' }, url: `${SITE}${service.path}` },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: service.lang === 'es' ? 'Inicio' : 'Home', item: `${SITE}${home}` },
      { '@type': 'ListItem', position: 2, name: service.lang === 'es' ? 'Servicios' : 'Services', item: `${SITE}${hub}` },
      { '@type': 'ListItem', position: 3, name: service.h1, item: `${SITE}${service.path}` },
    ] },
    { '@type': 'FAQPage', mainEntity: service.faq.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ];
}

export default function ServicePage() {
  const { pathname } = useLocation();
  const service = SERVICES.find(item => item.path === (pathname.endsWith('/') ? pathname : `${pathname}/`));
  if (!service) return null;
  return <ServiceContent service={service} />;
}

export function ServiceContent({ service }: { service: Service }) {
  const { lang } = service;
  const home = lang === 'es' ? '/' : '/en/';
  const hub = lang === 'es' ? '/servicios/' : '/en/services/';
  const source = `service_${service.slug}`;
  useDocumentMeta(service.title, service.description, service.path, [{ lang, path: service.path }], serviceGraph(service));
  useEffect(() => { trackPageView(service.path, service.title, lang); }, [service.path, service.title, lang]);
  return <ServicesLayout lang={lang} source={source}>
    <section className="wrap service-hero"><nav className="service-breadcrumb" aria-label={lang === 'es' ? 'Ruta de navegación' : 'Breadcrumb'}><Link to={home}>{lang === 'es' ? 'Inicio' : 'Home'}</Link><span aria-hidden="true">›</span><Link to={hub}>{lang === 'es' ? 'Servicios' : 'Services'}</Link><span aria-hidden="true">›</span><span aria-current="page">{service.h1}</span></nav><p className="eyebrow">SAGEPOINT ANALYTICS · {lang === 'es' ? 'SERVICIOS' : 'SERVICES'}</p><h1>{service.h1}</h1><p className="service-lede">{service.subhead}</p><ServiceActions lang={lang} source={source} /></section>
    <section className="wrap service-section"><p className="eyebrow">{lang === 'es' ? 'El problema' : 'The problem'}</p><h2>{lang === 'es' ? 'Cuando el dato no llega a tiempo' : 'When the data cannot keep up'}</h2><p>{service.problemIntro}</p><ul className="service-symptoms">{service.symptoms.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section className="wrap service-section"><p className="eyebrow">{lang === 'es' ? 'Qué entregamos' : 'What you get'}</p><h2>{lang === 'es' ? 'Una solución que tu equipo puede usar' : 'A deliverable your team can use'}</h2><p>{service.approach}</p><div className="service-cards">{service.deliverables.map(item => <article className="service-card" key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div></section>
    <section className="wrap service-section"><p className="eyebrow">{lang === 'es' ? 'Cómo trabajamos' : 'How it works'}</p><h2>{lang === 'es' ? 'Del diagnóstico a la entrega' : 'From assessment to handoff'}</h2><ol className="service-steps">{service.process.map((step, index) => <li key={step}><span className="service-step-number">{index + 1}</span><p>{step}</p></li>)}</ol></section>
    <section className="wrap service-section service-proof"><p className="eyebrow">{lang === 'es' ? 'Caso publicado' : 'Published case'}</p><h2>{lang === 'es' ? 'Trabajo comprobable' : 'Work you can inspect'}</h2><p>{service.proof}</p><Link className="service-text-link" to={`${home}#casos`}>{lang === 'es' ? 'Ver casos publicados →' : 'See published cases →'}</Link></section>
    <section className="wrap service-section"><p className="eyebrow">{lang === 'es' ? 'Paquete recomendado' : 'Package fit'}</p><h2>{lang === 'es' ? 'El alcance determina el paquete' : 'The scope determines the package'}</h2><p>{service.packageFit}</p><Link className="service-text-link" to={`${home}#paquetes`}>{lang === 'es' ? 'Comparar paquetes →' : 'Compare packages →'}</Link></section>
    <section className="wrap service-section"><p className="eyebrow">FAQ</p><h2>{lang === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2><div className="service-faq">{service.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
    <section className="wrap service-section"><p className="eyebrow">{lang === 'es' ? 'Servicios relacionados' : 'Related services'}</p><h2>{lang === 'es' ? 'Otros trabajos que podemos abordar' : 'Other work we can help with'}</h2><div className="service-cards">{SERVICES.filter(item => item.lang === lang && item.slug !== service.slug).map(item => <article className="service-card" key={item.slug}><h3><Link to={item.path}>{item.h1}</Link></h3><p>{item.subhead}</p><Link className="service-text-link" to={item.path}>{lang === 'es' ? 'Ver servicio →' : 'Explore service →'}</Link></article>)}</div></section>
    <section className="wrap service-section service-close"><h2>{lang === 'es' ? 'Conversemos sobre tus datos' : 'Let’s look at your reporting work'}</h2><p>{lang === 'es' ? 'Trae un ejemplo del reporte o proceso actual. Revisaremos fuentes, decisiones y excepciones para proponer un alcance útil.' : 'Bring a current report or workflow example. We will review sources, decisions, and exceptions before proposing a useful scope.'}</p><ServiceActions lang={lang} source={source} /></section>
  </ServicesLayout>;
}
