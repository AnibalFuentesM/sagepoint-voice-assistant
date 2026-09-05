import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LeonardoHome from './leonardo/LeonardoHome';
import { captureLeadAttribution, initializeAnalytics } from './utils/analytics';
import './index.css';

// Separate chunk: the portfolio (and its `motion` dependency) is only downloaded
// when someone actually visits /portfolio, keeping the landing page bundle lean.
const PortfolioPage = lazy(() => import('./components/PortfolioPage'));
// Separate chunk: the /web landing is the paid-traffic destination and must not
// add weight to the home page bundle.
const WebPage = lazy(() => import('./components/WebPage'));

initializeAnalytics();
captureLeadAttribution();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LeonardoHome />} />
          <Route path="/web" element={<WebPage />} />
          <Route path="/web/" element={<WebPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/" element={<PortfolioPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
