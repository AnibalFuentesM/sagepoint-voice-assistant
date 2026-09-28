import React from 'react';
import './trustGrid.css';

type Props = {
  lang: 'es' | 'en';
};

export default function TrustGrid({ lang }: Props) {
  const isEs = lang === 'es';
  
  const content = {
    eyebrow: isEs ? 'Cómo trabajamos' : 'How we work',
    title: isEs ? (
      <>
        {'Nuestros'}
        <br />
        {'compromisos'}
      </>
    ) : (
      <>
        {'Our'}
        <br />
        {'commitments'}
      </>
    ),
    items: [
      {
        id: 'acc',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ),
        title: isEs ? 'Se construye en tus cuentas' : 'Built in your accounts',
        desc: isEs 
          ? 'Todo vive en el Microsoft 365 o Google Workspace del cliente, no en servidores de Sagepoint.'
          : 'Everything lives in your Microsoft 365 or Google Workspace, not on Sagepoint servers.'
      },
      {
        id: 'own',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        ),
        title: isEs ? 'Todo es tuyo' : 'You own everything',
        desc: isEs 
          ? 'Se entregan archivos de Power BI, scripts y documentación; sin dependencia.'
          : 'We hand over the Power BI files, scripts, and documentation; no vendor lock-in.'
      },
      {
        id: 'fnd',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
        title: isEs ? 'Te atiende el fundador' : 'Founder-led delivery',
        desc: isEs 
          ? 'Hablas directo con quien construye tu tablero, por WhatsApp o videollamada. Sin intermediarios ni analistas junior.'
          : 'You talk directly to the person building your dashboards, via WhatsApp or video call. No middlemen.'
      },
      {
        id: 'ctr',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3" />
          </svg>
        ),
        title: isEs ? '0 contratos forzosos' : '0 lock-in contracts',
        desc: isEs 
          ? 'Decides proyecto a proyecto si hay con qué seguir. Sin ataduras mensuales.'
          : 'Decide project by project if you want to continue. No mandatory monthly retainers.'
      }
    ]
  };

  return (
    <section id="confianza">
      <div className="wrap">
        <div className="sec-head" data-rv>
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <h2 className="sec-title">{content.title}</h2>
          </div>
        </div>
        <div className="trustgrid-grid" data-rv>
          {content.items.map((item, i) => (
            <div key={item.id} className="trustgrid-card spot">
              <div className="trustgrid-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="trustgrid-icon" aria-hidden="true">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
