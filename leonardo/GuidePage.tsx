import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { trackPageView } from '../utils/analytics';
import { GUIDES, type Guide } from './guidesData';
import { ServicesLayout, ServiceActions } from './ServicesLayout';

const SITE = 'https://www.sagepoint-analytics.com';

const COPY = {
  es: {
    home: 'Inicio', homePath: '/es/', services: 'Servicios', servicesPath: '/servicios/', crumbLabel: 'Ruta de navegación', current: 'Guía de costos',
    eyebrow: 'SAGEPOINT ANALYTICS · GUÍAS', inLanguage: 'es-GT', listEyebrow: 'Lista breve', listTitle: 'Antes de solicitar una propuesta',
    list: ['Reúne muestras de fuentes y un ejemplo del reporte actual.', 'Define KPIs, usuarios, permisos y frecuencia de actualización.', 'Pide entregables, validaciones, capacitación, licencias separadas y soporte por escrito.'],
    serviceLead: 'Si quieres conocer el servicio de implementación, revisa', faqTitle: 'Preguntas frecuentes',
    closeTitle: 'Hablemos de tu alcance', close: 'Trae una muestra de tus fuentes y una pregunta que tu dashboard deba responder. En la llamada gratuita de 30–45 minutos veremos qué falta para preparar una propuesta comparable.',
  },
  en: {
    home: 'Home', homePath: '/', services: 'Services', servicesPath: '/en/services/', crumbLabel: 'Breadcrumb', current: 'Cost guide',
    eyebrow: 'SAGEPOINT ANALYTICS · GUIDES', inLanguage: 'en-US', listEyebrow: 'Checklist', listTitle: 'Before you ask for a proposal',
    list: ['Gather a sample export from each source and a copy of your current report.', 'Write down your numbers, who will use them, their access and how often data should update.', 'Ask for deliverables, checks, training, separate licenses and support in writing.'],
    serviceLead: 'To see what the build looks like, read about', faqTitle: 'Frequently asked questions',
    closeTitle: 'Let’s look at your scope', close: 'Bring a sample of your data and one question your dashboard should answer. On the free 30 to 45 minute call we tell you which option fits and what it would cost.',
  },
} as const;

export function guideGraph(guide: Guide) {
  const c = COPY[guide.lang];
  return [
    { '@type': 'Article', headline: guide.h1, description: guide.description, inLanguage: c.inLanguage, mainEntityOfPage: `${SITE}${guide.path}`, author: { '@id': `${SITE}/#organization` }, publisher: { '@id': `${SITE}/#organization` } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.home, item: `${SITE}${c.homePath}` },
      { '@type': 'ListItem', position: 2, name: c.services, item: `${SITE}${c.servicesPath}` },
      { '@type': 'ListItem', position: 3, name: guide.service.name, item: `${SITE}${guide.service.path}` },
      { '@type': 'ListItem', position: 4, name: guide.h1, item: `${SITE}${guide.path}` },
    ] },
    { '@type': 'FAQPage', mainEntity: guide.faq.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ];
}

export default function GuidePage() {
  const { pathname } = useLocation();
  const guide = GUIDES.find(item => item.path === (pathname.endsWith('/') ? pathname : `${pathname}/`));
  if (!guide) return null;
  return <GuideContent guide={guide} />;
}

export function GuideContent({ guide }: { guide: Guide }) {
  const { lang, source } = guide;
  const c = COPY[lang];
  useDocumentMeta(guide.title, guide.description, guide.path, [{ lang, path: guide.path }], guideGraph(guide));
  useEffect(() => { trackPageView(guide.path, guide.title, lang); }, [guide.path, guide.title, lang]);
  return <ServicesLayout lang={lang} source={source}>
    <article>
      <header className="wrap service-hero"><nav className="service-breadcrumb" aria-label={c.crumbLabel}><Link to={c.homePath}>{c.home}</Link><span aria-hidden="true">›</span><Link to={c.servicesPath}>{c.services}</Link><span aria-hidden="true">›</span><Link to={guide.service.path}>{guide.service.name}</Link><span aria-hidden="true">›</span><span aria-current="page">{c.current}</span></nav><p className="eyebrow">{c.eyebrow}</p><h1>{guide.h1}</h1><p className="service-lede">{guide.lede}</p><ServiceActions lang={lang} source={source} /></header>
      {guide.sections.map(section => <section className="wrap service-section guide-copy" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <section className="wrap service-section guide-copy"><p className="eyebrow">{c.listEyebrow}</p><h2>{c.listTitle}</h2><ul className="service-symptoms">{c.list.map(item => <li key={item}>{item}</li>)}</ul><p>{c.serviceLead} <Link className="service-text-link" to={guide.service.path}>{guide.service.linkText}</Link>.</p></section>
      <section className="wrap service-section"><p className="eyebrow">FAQ</p><h2>{c.faqTitle}</h2><div className="service-faq">{guide.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
      <section className="wrap service-section service-close"><h2>{c.closeTitle}</h2><p>{c.close}</p><ServiceActions lang={lang} source={`${source}_close`} /></section>
    </article>
  </ServicesLayout>;
}
