import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';
import { trackEvent, trackWhatsAppClick } from '../utils/analytics';
import { localizedPath, type SiteLang } from '../utils/i18nRoutes';
import './leonardo.css';
import './services.css';

export function ServicesLayout({ lang, source, children }: { lang: SiteLang; source: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const home = localizedPath('/', lang);
  const hub = localizedPath('/servicios/', lang);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const switchLang = (next: SiteLang) => navigate(localizedPath('/servicios/', next));
  const booking = () => { trackEvent('lead_form_open', { source_section: source, language: lang }); setOpen(true); };
  return <div className="leo service-site">
    <a className="skip" href="#content">{lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
    <header className="nav"><div className="wrap nav-in">
      <Link className="mark" to={home}><i />SAGEPOINT</Link>
      <nav className="nav-links" aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}>
        <Link to={hub}>{lang === 'es' ? 'Servicios' : 'Services'}</Link>
        <Link to={`${home}#casos`}>{lang === 'es' ? 'Casos' : 'Cases'}</Link>
        <Link to={`${home}#paquetes`}>{lang === 'es' ? 'Paquetes' : 'Packages'}</Link>
      </nav>
      <div className="nav-act"><div className="language-switch" role="group" aria-label={lang === 'es' ? 'Idioma' : 'Language'}>
        <button type="button" lang="es" aria-label="Español" aria-pressed={lang === 'es'} onClick={() => switchLang('es')}>ES</button>
        <button type="button" lang="en" aria-label="English" aria-pressed={lang === 'en'} onClick={() => switchLang('en')}>EN</button>
      </div><button className="pill pill--fill pill--sm" type="button" onClick={booking}>{lang === 'es' ? 'Agendar diagnóstico' : 'Book an assessment'}</button></div>
    </div></header>
    <main id="content">{children}</main>
    <footer className="site-foot"><div className="wrap"><div className="f-grid">
      <div className="f-col f-about"><Link className="mark" to={home}><i />SAGEPOINT</Link><p>{lang === 'es' ? 'Inteligencia de negocios y automatización para empresas en crecimiento.' : 'Business intelligence and reporting automation for growing operations.'}</p></div>
      <nav className="f-col" aria-label={lang === 'es' ? 'Servicios del pie de página' : 'Footer services'}><h2 className="f-h">{lang === 'es' ? 'Servicios' : 'Services'}</h2><ul><li><Link to={hub}>{lang === 'es' ? 'Todos los servicios' : 'All services'}</Link></li><li><Link to={localizedPath('/web/', lang)}>{lang === 'es' ? 'Páginas web' : 'Websites'}</Link></li></ul></nav>
      <nav className="f-col" aria-label={lang === 'es' ? 'Compañía' : 'Company'}><h2 className="f-h">{lang === 'es' ? 'Compañía' : 'Company'}</h2><ul><li><Link to={`${home}#casos`}>{lang === 'es' ? 'Casos' : 'Cases'}</Link></li><li><Link to={localizedPath('/portfolio/', lang)}>Portfolio</Link></li><li><Link to={`${home}#paquetes`}>{lang === 'es' ? 'Paquetes' : 'Packages'}</Link></li></ul></nav>
      <div className="f-col"><h2 className="f-h">{lang === 'es' ? 'Contacto' : 'Contact'}</h2><a href="mailto:info@sagepoint-analytics.com">info@sagepoint-analytics.com</a></div>
    </div><div className="f-bot"><p>© 2026 Sagepoint Analytics</p><p>{lang === 'es' ? 'Guatemala y Estados Unidos' : 'Guatemala & United States'}</p></div></div></footer>
    <BookingModal lang={lang} open={open} packageId="general" source={source} onClose={() => setOpen(false)} />
  </div>;
}

export function ServiceActions({ lang, source }: { lang: SiteLang; source: string }) {
  const [open, setOpen] = useState(false);
  const booking = () => { trackEvent('lead_form_open', { source_section: source, language: lang }); setOpen(true); };
  return <div className="service-actions"><button type="button" className="pill pill--fill" onClick={booking}>{lang === 'es' ? 'Agendar diagnóstico gratuito' : 'Book a free assessment'}</button>
    {lang === 'es' ? <a className="pill pill--ghost" href="https://wa.me/50240464716" onClick={() => trackWhatsAppClick({ source_section: source, language: lang })}>WhatsApp</a> : <a className="pill pill--ghost" href="mailto:info@sagepoint-analytics.com">Email us</a>}
    <BookingModal lang={lang} open={open} packageId="general" source={source} onClose={() => setOpen(false)} />
  </div>;
}
