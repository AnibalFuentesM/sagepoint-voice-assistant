import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PortfolioPage from './components/PortfolioPage';
import { captureLeadAttribution, initializeAnalytics } from './utils/analytics';
import './index.css';

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
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/" element={<PortfolioPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
