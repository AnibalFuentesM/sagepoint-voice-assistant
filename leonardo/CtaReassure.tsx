import React from 'react';

type Props = {
  lang: 'es' | 'en';
  align?: 'left' | 'center';
};

export default function CtaReassure({ lang, align = 'center' }: Props) {
  const isEs = lang === 'es';
  const checks = isEs 
    ? ['Llamada de 30–45 min', 'Diagnóstico sin costo', 'Sin compromiso']
    : ['30–45 min call', 'Free diagnostic', 'No commitment'];

  return (
    <div 
      className="ctareassure"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: '12px',
        marginTop: '16px',
        fontFamily: 'var(--f-mono)',
        fontSize: '10.5px',
        textTransform: 'uppercase',
        letterSpacing: '.12em',
        color: 'var(--mute)'
      }}
    >
      {checks.map((text, i) => (
        <React.Fragment key={i}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="var(--mint)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
              <polyline points="3 8 7 12 13 4"></polyline>
            </svg>
            {text}
          </span>
          {i < checks.length - 1 && (
            <span aria-hidden="true" style={{ opacity: 0.35 }}>·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
