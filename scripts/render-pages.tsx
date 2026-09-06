import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import LeonardoHome, { HOME_META } from '../leonardo/LeonardoHome';
import PortfolioPage, { portfolioContent } from '../components/PortfolioPage';
import WebPage, { webContent } from '../components/WebPage';
import { translateLeo } from '../leonardo/leonardoEnglish';

/** Build-time rendering uses the same components, copy and routing as the browser. */
export function renderPage(path: string, language: 'es' | 'en') {
  const url = path + (language === 'en' ? '?lang=en' : '');
  const Component = path === '/' ? LeonardoHome : path === '/portfolio/' ? PortfolioPage : WebPage;
  const meta = path === '/' ? HOME_META[language] : path === '/portfolio/' ? portfolioContent[language].meta : webContent[language].meta;
  return { markup: renderToString(<StaticRouter location={url}><Component /></StaticRouter>), meta };
}
export { translateLeo };
