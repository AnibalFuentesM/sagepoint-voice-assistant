import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import LeonardoHome, { HOME_META } from '../leonardo/LeonardoHome';
import PortfolioPage, { portfolioContent } from '../components/PortfolioPage';
import WebPage, { webContent } from '../components/WebPage';
import ServicesHub from '../leonardo/ServicesHub';
import { ServiceContent } from '../leonardo/ServicePage';
import { ALL_ROUTES, HUBS, SERVICES } from '../leonardo/servicesData';
import { getLangFromPath } from '../utils/i18nRoutes';
import { translateLeo } from '../leonardo/leonardoEnglish';

/** Build-time rendering uses the same components, copy and routing as the browser. */
export function renderPage(path: string) {
  const language = getLangFromPath(path);
  const plainPath = path.replace(/^\/en(?=\/|$)/, '') || '/';
  const service = SERVICES.find(item => item.path === path);
  const Component = service ? <ServiceContent service={service} /> : plainPath === '/' ? <LeonardoHome /> : plainPath === '/portfolio/' ? <PortfolioPage /> : plainPath === '/web/' ? <WebPage /> : <ServicesHub />;
  const meta = service ?? (plainPath === '/' ? HOME_META[language] : plainPath === '/portfolio/' ? portfolioContent[language].meta : plainPath === '/web/' ? webContent[language].meta : HUBS[language]);
  return { markup: renderToString(<StaticRouter location={path}>{Component}</StaticRouter>), meta, service };
}
export { translateLeo, ALL_ROUTES };
