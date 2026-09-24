import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { legacyEnglishPath } from './utils/i18nRoutes';
import LeonardoHome from './leonardo/LeonardoHome';
import { captureLeadAttribution, initializeAnalytics } from './utils/analytics';
import './index.css';

// Separate chunk: the portfolio (and its `motion` dependency) is only downloaded
// when someone actually visits /portfolio, keeping the landing page bundle lean.
const PortfolioPage = lazy(() => import('./components/PortfolioPage'));
// Separate chunk: the /web landing is the paid-traffic destination and must not
// add weight to the home page bundle.
const WebPage = lazy(() => import('./components/WebPage'));
const ServicesHub = lazy(() => import('./leonardo/ServicesHub'));
const ServicePage = lazy(() => import('./leonardo/ServicePage'));

initializeAnalytics();
captureLeadAttribution();

function LegacyLanguageFallback() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('lang') !== 'en') return;
    params.delete('lang');
    navigate({ pathname: legacyEnglishPath(location.pathname), search: params.toString(), hash: location.hash }, { replace: true });
  }, [location.pathname, location.search, location.hash, navigate]);
  return null;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LegacyLanguageFallback />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LeonardoHome />} />
          <Route path="/en" element={<LeonardoHome />} />
          <Route path="/en/" element={<LeonardoHome />} />
          <Route path="/web" element={<WebPage />} />
          <Route path="/web/" element={<WebPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/" element={<PortfolioPage />} />
          <Route path="/en/web" element={<WebPage />} />
          <Route path="/en/web/" element={<WebPage />} />
          <Route path="/en/portfolio" element={<PortfolioPage />} />
          <Route path="/en/portfolio/" element={<PortfolioPage />} />
          <Route path="/servicios" element={<ServicesHub />} />
          <Route path="/servicios/" element={<ServicesHub />} />
          <Route path="/en/services" element={<ServicesHub />} />
          <Route path="/en/services/" element={<ServicesHub />} />
          <Route path="/servicios/:slug" element={<ServicePage />} />
          <Route path="/servicios/:slug/" element={<ServicePage />} />
          <Route path="/en/services/:slug" element={<ServicePage />} />
          <Route path="/en/services/:slug/" element={<ServicePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
