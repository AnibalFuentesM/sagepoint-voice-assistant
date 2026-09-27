import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { trackPageView } from '../utils/analytics';
import { GUIDES, type Guide } from './guidesData';
import { ServicesLayout, ServiceActions } from './ServicesLayout';

const SITE = 'https://www.sagepoint-analytics.com';
const SERVICE = '/servicios/dashboards-power-bi-guatemala/';

export function guideGraph(guide: Guide) {
  return [
    { '@type': 'Article', headline: guide.h1, description: guide.description, inLanguage: 'es-GT', mainEntityOfPage: `${SITE}${guide.path}`, author: { '@id': `${SITE}/#organization` }, publisher: { '@id': `${SITE}/#organization` } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${SITE}/servicios/` },
      { '@type': 'ListItem', position: 3, name: 'Dashboards Power BI', item: `${SITE}${SERVICE}` },
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
  const source = 'guide_power_bi_cost';
  useDocumentMeta(guide.title, guide.description, guide.path, [{ lang: 'es', path: guide.path }], guideGraph(guide));
  useEffect(() => { trackPageView(guide.path, guide.title, 'es'); }, [guide.path, guide.title]);
  return <ServicesLayout lang="es" source={source}>
    <article>
      <header className="wrap service-hero"><nav className="service-breadcrumb" aria-label="Ruta de navegación"><Link to="/">Inicio</Link><span aria-hidden="true">›</span><Link to="/servicios/">Servicios</Link><span aria-hidden="true">›</span><Link to={SERVICE}>Dashboards Power BI</Link><span aria-hidden="true">›</span><span aria-current="page">Guía de costos</span></nav><p className="eyebrow">SAGEPOINT ANALYTICS · GUÍAS</p><h1>{guide.h1}</h1><p className="service-lede">{guide.lede}</p><ServiceActions lang="es" source={source} /></header>
      {guide.sections.map(section => <section className="wrap service-section guide-copy" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <section className="wrap service-section guide-copy"><p className="eyebrow">Lista breve</p><h2>Antes de solicitar una propuesta</h2><ul className="service-symptoms"><li>Reúne muestras de fuentes y un ejemplo del reporte actual.</li><li>Define KPIs, usuarios, permisos y frecuencia de actualización.</li><li>Pide entregables, validaciones, capacitación, licencias separadas y soporte por escrito.</li></ul><p>Si quieres conocer el servicio de implementación, revisa <Link className="service-text-link" to={SERVICE}>dashboards Power BI en Guatemala →</Link>.</p></section>
      <section className="wrap service-section"><p className="eyebrow">FAQ</p><h2>Preguntas frecuentes</h2><div className="service-faq">{guide.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
      <section className="wrap service-section service-close"><h2>Hablemos de tu alcance</h2><p>Trae una muestra de tus fuentes y una pregunta que tu dashboard deba responder. En la llamada gratuita de 30–45 minutos veremos qué falta para preparar una propuesta comparable.</p><ServiceActions lang="es" source={`${source}_close`} /></section>
    </article>
  </ServicesLayout>;
}
