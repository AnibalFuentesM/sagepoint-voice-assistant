import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookingModal from './BookingModal';
import MobileMenu from './MobileMenu';
import { trackEvent, trackScheduleCall, trackWhatsAppClick } from '../utils/analytics';
import { getEnglishBookingUrl } from './booking';
import { localizedPath, type SiteLang } from '../utils/i18nRoutes';
import './leonardo.css';
import './services.css';

type ChromeProps = { lang: SiteLang; source: string; switchPath?: string };

/** Site header with desktop links, language switch, booking button and the mobile menu. Render inside a `.leo.service-site` element. */
export function SiteHeader({ lang, source, switchPath = '/servicios/' }: ChromeProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const home = localizedPath('/', lang);
  const hub = localizedPath('/servicios/', lang);
  const es = lang === 'es';
  const switchLang = (next: SiteLang) => navigate(localizedPath(switchPath, next));
  const booking = () => {
    const url = getEnglishBookingUrl(lang);
    if (url) { trackScheduleCall({ source_section: source, package_id: 'general', method: 'booking_link', language: lang }); window.open(url, '_blank', 'noopener,noreferrer'); return; }
    trackEvent('lead_form_open', { source_section: source, language: lang }); setOpen(true);
  };
  const links = [
    { href: hub, label: es ? 'Servicios' : 'Services' },
    { href: localizedPath('/web/', lang), label: es ? 'Páginas web' : 'Websites' },
    { href: localizedPath('/portfolio/', lang), label: es ? 'Portafolio' : 'Portfolio' },
    { href: `${home}#paquetes`, label: es ? 'Paquetes' : 'Pricing' },
  ];
  return <>
    <header className="nav"><div className="wrap nav-in">
      <Link className="mark" to={home}><i />SAGEPOINT</Link>
      <nav className="nav-links" aria-label={es ? 'Navegación principal' : 'Main navigation'}>
        {links.map(item => <Link key={item.href} to={item.href}>{item.label}</Link>)}
      </nav>
      <div className="nav-act"><div className="language-switch" role="group" aria-label={es ? 'Idioma' : 'Language'}>
        <button type="button" lang="es" aria-label="Español" aria-pressed={es} onClick={() => switchLang('es')}>ES</button>
        <button type="button" lang="en" aria-label="English" aria-pressed={!es} onClick={() => switchLang('en')}>EN</button>
      </div><button className="pill pill--fill pill--sm" type="button" onClick={booking}>{es ? 'Agendar diagnóstico' : 'Book a free call'}</button>
        <MobileMenu lang={lang} items={[...links, { href: `${home}#faq`, label: 'FAQ' }]} cta={{ label: es ? 'Agendar diagnóstico' : 'Book a free call', onClick: booking }} /></div>
    </div></header>
    <BookingModal lang={lang} open={open} packageId="general" source={source} onClose={() => setOpen(false)} />
  </>;
}

export function SiteFooter({ lang }: { lang: SiteLang }) {
  const home = localizedPath('/', lang);
  const es = lang === 'es';
  return <footer className="site-foot"><div className="wrap"><div className="f-grid">
    <div className="f-col f-about"><Link className="mark" to={home}><i />SAGEPOINT</Link><p>{es ? 'Inteligencia de negocios y automatización para empresas en crecimiento.' : 'Dashboards and automated reporting for small businesses in the United States and Guatemala.'}</p></div>
    <nav className="f-col" aria-label={es ? 'Servicios del pie de página' : 'Footer services'}><h2 className="f-h">{es ? 'Servicios' : 'Services'}</h2><ul><li><Link to={localizedPath('/servicios/', lang)}>{es ? 'Todos los servicios' : 'All services'}</Link></li><li><Link to={localizedPath('/web/', lang)}>{es ? 'Páginas web' : 'Websites'}</Link></li><li><Link to={es ? '/guias/cuanto-cuesta-dashboard-power-bi-guatemala/' : '/en/guides/small-business-dashboard-cost/'}>{es ? 'Guía de costos' : 'Dashboard cost guide'}</Link></li></ul></nav>
    <nav className="f-col" aria-label={es ? 'Compañía' : 'Company'}><h2 className="f-h">{es ? 'Compañía' : 'Company'}</h2><ul><li><Link to={`${home}#casos`}>{es ? 'Casos' : 'Our work'}</Link></li><li><Link to={localizedPath('/portfolio/', lang)}>{es ? 'Portafolio' : 'Portfolio'}</Link></li><li><Link to={`${home}#paquetes`}>{es ? 'Paquetes' : 'Pricing'}</Link></li></ul></nav>
    <div className="f-col"><h2 className="f-h">{es ? 'Contacto' : 'Contact'}</h2><a href="mailto:info@sagepoint-analytics.com">info@sagepoint-analytics.com</a></div>
  </div><div className="f-bot"><p>© 2026 Sagepoint Analytics</p><p>{es ? 'Guatemala y Estados Unidos' : 'Guatemala & United States'}</p></div></div></footer>;
}

/** Shared header, mobile menu and footer for every page except the home. `switchPath` is where the ES/EN switch goes (Spanish path). */
export function ServicesLayout({ lang, source, children, switchPath = '/servicios/' }: ChromeProps & { children: React.ReactNode }) {
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <div className="leo service-site">
    <a className="skip" href="#content">{lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
    <SiteHeader lang={lang} source={source} switchPath={switchPath} />
    <main id="content">{children}</main>
    <SiteFooter lang={lang} />
  </div>;
}

export function ServiceActions({ lang, source }: { lang: SiteLang; source: string }) {
  const [open, setOpen] = useState(false);
  const booking = () => {
    const url = getEnglishBookingUrl(lang);
    if (url) { trackScheduleCall({ source_section: source, package_id: 'general', method: 'booking_link', language: lang }); window.open(url, '_blank', 'noopener,noreferrer'); return; }
    trackEvent('lead_form_open', { source_section: source, language: lang }); setOpen(true);
  };
  return <div className="service-actions"><button type="button" className="pill pill--fill" onClick={booking}>{lang === 'es' ? 'Agendar diagnóstico gratuito' : 'Book a free call'}</button>
    {lang === 'es' ? <a className="pill pill--ghost" href="https://wa.me/50240464716" onClick={() => trackWhatsAppClick({ source_section: source, language: lang })}>WhatsApp</a> : <a className="pill pill--ghost" href="mailto:info@sagepoint-analytics.com">Email us</a>}
    <BookingModal lang={lang} open={open} packageId="general" source={source} onClose={() => setOpen(false)} />
  </div>;
}
