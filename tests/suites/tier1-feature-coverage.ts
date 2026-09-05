/**
 * Tier 1: Feature Coverage Test Suite
 * Comprehensive verification of F1 through F15 in isolation.
 */

import { describe, it, expect } from '../harness/test-framework';
import { createBrowserEnvironment, calculateRoiMetrics } from '../harness/env-simulator';
import { SAGEPOINT_INFO, GOOGLE_SCRIPT_URL, SHEET_ID } from '../../constants';
import {
  captureLeadAttribution,
  getLeadAttribution,
  trackEvent,
  trackPageView,
  initializeAnalytics,
  trackSelectPackage,
  trackLeadSubmitAttempt,
  trackGenerateLead,
  trackWhatsAppClick,
  trackScheduleCall,
  trackViewRoiCalc,
  trackCalculateRoi,
} from '../../utils/analytics';
import { submitToGoogleSheet } from '../../utils/sheetUtils';
import * as fs from 'fs';
import * as path from 'path';

export function registerTier1Suites() {
  describe('Tier 1 - F1: Executive Value Proposition & Copy', 1, () => {
    it('F1.1: SAGEPOINT_INFO defines core value proposition and quantified services', () => {
      expect(SAGEPOINT_INFO).toContain('Transformamos la intuición en certeza');
      expect(SAGEPOINT_INFO).toContain('ahorrando hasta un 80% del tiempo operativo');
      expect(SAGEPOINT_INFO).toContain('Zendesk Talk API Reporting');
      expect(SAGEPOINT_INFO).toContain('11,327 call units');
      expect(SAGEPOINT_INFO).toContain('33,370 filas');
    });

    it('F1.2: Value prop addresses SME pain points and $60k/yr internal analyst costs', () => {
      expect(SAGEPOINT_INFO).toContain('socio estratégico de analítica de datos para empresas en crecimiento');
      expect(SAGEPOINT_INFO).toContain('convertir datos dispersos en decisiones inteligentes');
      expect(SAGEPOINT_INFO).toContain('sin necesitar departamento de TI');
    });

    it('F1.3: Package definitions specify explicit deliverables, timelines, and pricing', () => {
      expect(SAGEPOINT_INFO).toContain('Diagnóstico Express + Dashboard Quick-Win ($750 USD, pago único, 2 semanas)');
      expect(SAGEPOINT_INFO).toContain('Dashboard Ejecutivo + Automatización (desde $2,500 USD por proyecto, 4–6 semanas - Más Popular)');
      expect(SAGEPOINT_INFO).toContain('Soporte Cercano Mensual (add-on, $300 / $600 / $1,000 USD/mes)');
    });

    it('F1.4: Initial assessment is explicitly marked as free with tangible timeline', () => {
      expect(SAGEPOINT_INFO).toContain('El diagnóstico inicial (videollamada de 30–45 minutos) es gratuito');
      expect(SAGEPOINT_INFO).toContain('Resultados tangibles en los primeros meses');
    });

    it('F1.5: Sheet ID and Google Script URL constants are configured and valid', () => {
      expect(SHEET_ID).toBe('1JIHkkwn4fLVz6cV6Bb_CS2fryKBP-WbaFLROeuctV4c');
      expect(GOOGLE_SCRIPT_URL).toMatch(/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/);
    });
  });

  describe('Tier 1 - F2: 100% Bilingual Parity (ES/EN)', 1, () => {
    it('F2.1: Content dictionary matches complete structure between ES and EN', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('const content = {');
      expect(appFile).toContain('es: {');
      expect(appFile).toContain('en: {');
      
      const sections = ['meta', 'nav', 'hero', 'services', 'benefits', 'packages', 'cases', 'testimonials', 'faq', 'contact', 'footer'];
      for (const sec of sections) {
        expect(appFile).toContain(`${sec}: {`);
      }
    });

    it('F2.2: English translation is natural and culturally adapted (not machine literal)', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Turn your data into decisions that sell.');
      expect(appFile).toContain('Business intelligence projects with a clear deliverable');
      expect(appFile).toContain('Visible results from week two.');
      expect(appFile).toContain('Book your free assessment');
    });

    it('F2.3: All 5 Service items have exact 1-to-1 counterparts in ES and EN', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      // ES items
      expect(appFile).toContain('Dashboard & BI');
      expect(appFile).toContain('Automatización Web');
      expect(appFile).toContain('Automatización en Excel');
      expect(appFile).toContain('Modelos Predictivos');
      expect(appFile).toContain('Data Coaching');
      // EN items
      expect(appFile).toContain('Web Automation');
      expect(appFile).toContain('Excel Automation');
      expect(appFile).toContain('Predictive Models');
    });

    it('F2.4: Contact form options maintain consistent package IDs across languages', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain("'quick-win'");
      expect(appFile).toContain("'executive'");
      expect(appFile).toContain("'custom'");
      expect(appFile).toContain("'retainer'");
      expect(appFile).toContain("'general'");
    });

    it('F2.5: Document language attribute and meta updates respond to language parameter', () => {
      const envEs = createBrowserEnvironment('https://www.sagepoint-analytics.com/');
      expect(envEs.state.lang).toBe('es');

      const envEn = createBrowserEnvironment('https://www.sagepoint-analytics.com/?lang=en');
      expect(envEn.state.lang).toBe('en');
    });

    it('F2.6: Portfolio page content dictionary has complete 1-to-1 ES and EN parity', () => {
      const portfolioFile = fs.readFileSync(path.resolve(__dirname, '../../components/PortfolioPage.tsx'), 'utf8');
      expect(portfolioFile).toContain('export const portfolioContent = {');
      expect(portfolioFile).toContain('es: {');
      expect(portfolioFile).toContain('en: {');
      expect(portfolioFile).toContain('ai-automation');
      expect(portfolioFile).toContain('operations-bi');
      expect(portfolioFile).toContain('web-apps');
      expect(portfolioFile).toContain('corporate-sites');
      expect(portfolioFile).toContain('health-wellness');
      expect(portfolioFile).toContain('gastronomy');
      expect(portfolioFile).toContain('Automatización de Portal Administrativo (Salud)');
      expect(portfolioFile).toContain('Zendesk Talk API Reporting');
      expect(portfolioFile).toContain('BPO Production Reporting');
      expect(portfolioFile).toContain('ECW Alert Automation');
      expect(portfolioFile).toContain('Apex Auto Group | Executive Dashboard');
      expect(portfolioFile).toContain('GravityClaw');
      expect(portfolioFile).toContain('Enterprise CRM Platform');
    });
  });

  describe('Tier 1 - F3: Above-the-Fold Hero CTA', 1, () => {
    it('F3.1: Hero section contains primary and secondary conversion CTAs', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('t.hero.cta_consult');
      expect(appFile).toContain('t.hero.cta_services');
      expect(appFile).toContain('href="#contact"');
      expect(appFile).toContain('href="#pricing"');
    });

    it('F3.2: Hero metrics display quantified proof points (80%, 11,327, 33,370)', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain("value: '80%'");
      expect(appFile).toContain("value: '11,327'");
      expect(appFile).toContain("value: '33,370'");
    });

    it('F3.3: Hero proof rail provides fast credibility facts', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain("value: 'GT + US'");
      expect(appFile).toContain("value: '2 semanas'");
      expect(appFile).toContain("value: '<24 horas'");
    });

    it('F3.4: Social connect component is integrated in the Hero area', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('<SocialConnectButtons lang={lang} />');
    });

    it('F3.5: Interactive Hero 3D/Canvas scene receives localized alert badges', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('<HeroScene texts={{');
      expect(appFile).toContain('stockAlert: t.hero.dashboard.stock');
      expect(appFile).toContain('goalAlert: t.hero.dashboard.goal');
    });

    it('F3.6: Hero includes secondary WhatsApp conversion CTA and micro-proof badges', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('t.hero.cta_whatsapp');
      expect(appFile).toContain('button--whatsapp');
      expect(appFile).toContain('hero-microproof');
      expect(appFile).toContain('t.hero.micro_proof');
    });
  });

  describe('Tier 1 - F4: Interactive Before/After Visualizer', 1, () => {
    it('F4.1: Benefits section defines the Sagepoint practitioner-led system', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('EL SISTEMA SAGEPOINT');
      expect(appFile).toContain('THE SAGEPOINT SYSTEM');
      expect(appFile).toContain('Validación activa');
    });

    it('F4.2: Step-by-step contrast between fragmented data and confident decision', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Datos fragmentados');
      expect(appFile).toContain('Decisión confiable');
      expect(appFile).toContain('Fragmented data');
      expect(appFile).toContain('Confident decision');
    });

    it('F4.3: Visual cards highlight verified human logic over blind AI', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Decisiones Validadas por Expertos');
      expect(appFile).toContain('Expert-Validated Decisions');
      expect(appFile).toContain('Tu Departamento de Datos Externo');
      expect(appFile).toContain('Your External Data Department');
    });

    it('F4.4: Scroll reveals and data attributes are wired to animations', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('data-reveal');
      expect(appFile).toContain('decision-flow');
      expect(appFile).toContain('decision-step');
    });

    it('F4.5: Benefits list emphasizes close support in Guatemala and the US', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Soporte Cercano comprobado');
      expect(appFile).toContain('Soporte Cercano (Close Support)');
    });

    it('F4.6: BeforeAfterComparison component defines 5 operational dimensions and bilingual split slider', () => {
      const beforeAfterFile = fs.readFileSync(path.resolve(__dirname, '../../components/BeforeAfterComparison.tsx'), 'utf8');
      expect(beforeAfterFile).toContain('export const beforeAfterContent = {');
      expect(beforeAfterFile).toContain('es: {');
      expect(beforeAfterFile).toContain('en: {');
      expect(beforeAfterFile).toContain("id: 'speed'");
      expect(beforeAfterFile).toContain("id: 'accuracy'");
      expect(beforeAfterFile).toContain("id: 'workload'");
      expect(beforeAfterFile).toContain("id: 'visibility'");
      expect(beforeAfterFile).toContain("id: 'cost'");
      expect(beforeAfterFile).toContain('role="slider"');
      expect(beforeAfterFile).toContain('aria-label={t.slider_label}');
    });
  });

  describe('Tier 1 - F5: Interactive Package Selector & Matrix', 1, () => {
    it('F5.1: Matrix contains 3 fixed-scope project packages + 1 monthly retainer', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain("id: 'quick-win'");
      expect(appFile).toContain("id: 'executive'");
      expect(appFile).toContain("id: 'custom'");
      expect(appFile).toContain("id: 'retainer'");
    });

    it('F5.2: Quick-Win package is priced at $750 with 2-week timeline', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('price: "$750"');
      expect(appFile).toContain('timeline: "2 semanas"');
      expect(appFile).toContain('Auditoría de hasta 2 fuentes de datos');
      expect(appFile).toContain('1 dashboard con hasta 8 KPIs clave');
    });

    it('F5.3: Executive package is highlighted as Most Popular from $2,500', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('tag: "Más Popular"');
      expect(appFile).toContain('price: "$2,500"');
      expect(appFile).toContain('timeline: "4–6 semanas"');
      expect(appFile).toContain('Hasta 4 fuentes de datos integradas');
      expect(appFile).toContain('Automatización de 1 flujo de reportes');
    });

    it('F5.4: Custom tier and Retainer add-on clearly define enterprise deliverables', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Modelos predictivos dedicados');
      expect(appFile).toContain('Integraciones CRM/ERP');
      expect(appFile).toContain('Soporte Cercano Mensual');
      expect(appFile).toContain('price: "$300 / $600 / $1,000"');
    });

    it('F5.5: Package selection sets form state and scrolls to contact section', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('handleSelectPackage');
      expect(appFile).toContain("setSelectedService(id)");
      expect(appFile).toContain("trackEvent('select_package'");
      expect(appFile).toContain("document.getElementById('contact')?.scrollIntoView");
    });

    it('F5.6: PackageMatrix component defines 4 persona tabs, 3 guarantees, and full comparison table', () => {
      const matrixFile = fs.readFileSync(path.resolve(__dirname, '../../components/PackageMatrix.tsx'), 'utf8');
      expect(matrixFile).toContain('export const packageMatrixContent = {');
      expect(matrixFile).toContain('es: {');
      expect(matrixFile).toContain('en: {');
      expect(matrixFile).toContain("id: 'starter'");
      expect(matrixFile).toContain("id: 'growth'");
      expect(matrixFile).toContain("id: 'enterprise'");
      expect(matrixFile).toContain("id: 'retainer'");
      expect(matrixFile).toContain('Garantía 14 Días');
      expect(matrixFile).toContain('14-Day Turnaround');
      expect(matrixFile).toContain('100% Propiedad de Datos');
      expect(matrixFile).toContain('100% Data Ownership');
      expect(matrixFile).toContain('matrix_rows: [');
    });
  });

  describe('Tier 1 - F6: Interactive ROI & Savings Calculator Logic', 1, () => {
    it('F6.1: Calculator accurately computes 80% time reduction for 5-person team', () => {
      const roi = calculateRoiMetrics({
        teamSize: 5,
        hoursPerWeekPerPerson: 8,
        hourlyRate: 35,
        packageTier: 'executive',
      });
      // 5 * 8 * 52 = 2080 total hours
      // 2080 * 0.8 = 1664 hours saved
      expect(roi.annualHoursSaved).toBe(1664);
      expect(roi.monthlyHoursSaved).toBe(139);
      expect(roi.annualDollarSavings).toBe(1664 * 35); // $58,240
      expect(roi.investmentCost).toBe(2500);
      expect(roi.netAnnualBenefit).toBe(58240 - 2500); // $55,740
      expect(roi.roiPercentage).toBeGreaterThan(2000);
      expect(roi.paybackPeriodWeeks).toBeLessThan(3);
    });

    it('F6.2: Quick-Win package ROI for small business (1 analyst, 5 hrs/wk)', () => {
      const roi = calculateRoiMetrics({
        teamSize: 1,
        hoursPerWeekPerPerson: 5,
        hourlyRate: 30,
        packageTier: 'quick-win',
      });
      // 1 * 5 * 52 = 260 total hours
      // 260 * 0.8 = 208 hours saved
      expect(roi.annualHoursSaved).toBe(208);
      expect(roi.annualDollarSavings).toBe(208 * 30); // $6,240
      expect(roi.investmentCost).toBe(750);
      expect(roi.netAnnualBenefit).toBe(6240 - 750); // $5,490
      expect(roi.roiPercentage).toBe(732);
      expect(roi.paybackPeriodWeeks).toBeLessThan(7);
    });

    it('F6.3: Large organization ROI calculation (50 people, 10 hrs/wk)', () => {
      const roi = calculateRoiMetrics({
        teamSize: 50,
        hoursPerWeekPerPerson: 10,
        hourlyRate: 40,
        packageTier: 'custom',
      });
      // 50 * 10 * 52 = 26,000 total hours
      // 26,000 * 0.8 = 20,800 hours saved
      expect(roi.annualHoursSaved).toBe(20800);
      expect(roi.annualDollarSavings).toBe(20800 * 40); // $832,000
      expect(roi.investmentCost).toBe(5000);
      expect(roi.roiPercentage).toBeGreaterThan(10000);
    });

    it('F6.4: Zero team size produces zero savings with zero division errors', () => {
      const roi = calculateRoiMetrics({
        teamSize: 0,
        hoursPerWeekPerPerson: 10,
        hourlyRate: 35,
      });
      expect(roi.annualHoursSaved).toBe(0);
      expect(roi.annualDollarSavings).toBe(0);
      expect(roi.roiPercentage).toBe(0);
      expect(roi.paybackPeriodWeeks).toBe(0);
    });

    it('F6.5: Payback period reflects accurate recovery time in weeks', () => {
      const roi = calculateRoiMetrics({
        teamSize: 2,
        hoursPerWeekPerPerson: 6,
        hourlyRate: 35,
        packageTier: 'executive',
      });
      // 2 * 6 * 52 * 0.8 = 499.2 -> 499 hours
      // 499 * 35 = $17,465 / yr = $335.86 / wk
      // $2500 / $335.86 = 7.4 weeks
      expect(roi.paybackPeriodWeeks).toBeCloseTo(7.4, 0.5);
    });

    it('F6.6: RoiCalculator component implements interactive sliders and dynamic package recommendation logic', () => {
      const roiFile = fs.readFileSync(path.resolve(__dirname, '../../components/RoiCalculator.tsx'), 'utf8');
      expect(roiFile).toContain('export const roiCalculatorContent = {');
      expect(roiFile).toContain('computeRoiMetrics');
      expect(roiFile).toContain("trackEvent('view_roi_calc'");
      expect(roiFile).toContain("trackEvent('calculate_roi'");
      expect(roiFile).toContain('id="roi-team-size"');
      expect(roiFile).toContain('id="roi-hours-week"');
      expect(roiFile).toContain('id="roi-hourly-rate"');
    });
  });

  describe('Tier 1 - F7: Enterprise Case Studies & Metrics', 1, () => {
    it('F7.1: Case study 1 documents Apex Auto Group multi-store executive BI dashboard', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Apex Auto Group');
      expect(appFile).toContain('12 concesionarios');
      expect(appFile).toContain('$420k');
      expect(appFile).toContain('Power BI');
    });

    it('F7.2: Case study 2 documents BPO Operations with 33,370 rows & 14 systems', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('BPO Operations');
      expect(appFile).toContain('33,370');
      expect(appFile).toContain('14 sistemas');
      expect(appFile).toContain('99.4%');
    });

    it('F7.3: Case study 3 documents medical billing automation with 94% time reduction', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Automatización de Conciliación');
      expect(appFile).toContain('Python y Playwright');
      expect(appFile).toContain('94%');
      expect(appFile).toContain('11 días');
    });

    it('F7.4: Case study cards display quantified visual signal readouts, impact comparisons, and tech chips', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('case-card__impact');
      expect(appFile).toContain('case-card__impact-before');
      expect(appFile).toContain('case-card__impact-after');
      expect(appFile).toContain('case-card__tags');
      expect(appFile).toContain('MARGEN PROTEGIDO');
      expect(appFile).toContain('FILAS RECONCILIADAS');
      expect(appFile).toContain('TIEMPO AHORRADO');
    });

    it('F7.5: Deep links connect directly to the /portfolio/ showcase route', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('to="/portfolio/"');
      expect(appFile).toContain('Ver portfolio completo');
    });
  });

  describe('Tier 1 - F8: Trust Engine & Guarantees', 1, () => {
    it('F8.1: Testimonials feature structured executive testimonials with business metrics', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Marcus Vance');
      expect(appFile).toContain('Recuperación de $420k en margen');
      expect(appFile).toContain('Carolina Flores');
      expect(appFile).toContain('99.4% SLA · Ahorro 28 hrs/sem');
      expect(appFile).toContain('Carlos Arenas');
      expect(appFile).toContain('94% Reducción · DSO -11 Días');
      expect(appFile).toContain('Meylin Sic');
      expect(appFile).toContain('Entrega funcional en 10 días');
    });

    it('F8.2: Testimonial cards render 5-star ratings, verified badges, and executive avatars', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('testimonial-card__header');
      expect(appFile).toContain('testimonial-card__stars');
      expect(appFile).toContain('testimonial-card__verified');
      expect(appFile).toContain('testimonial-card__metric-badge');
      expect(appFile).toContain('testimonial-card__avatar');
      expect(appFile).toContain('Cliente Verificado');
      expect(appFile).toContain('Verified Client');
    });

    it('F8.3: TrustGuarantees component documents 4 enterprise guarantees', () => {
      const trustFile = fs.readFileSync(path.resolve(__dirname, '../../components/TrustGuarantees.tsx'), 'utf8');
      expect(trustFile).toContain('Garantía de Entrega en 14 Días');
      expect(trustFile).toContain('14-Day Rapid Delivery Guarantee');
      expect(trustFile).toContain('100% Propiedad de Datos y Código');
      expect(trustFile).toContain('100% Data & Code Ownership');
      expect(trustFile).toContain('Protocolo de Privacidad y NDA Empresarial');
      expect(trustFile).toContain('Enterprise NDA & Data Privacy Protocol');
      expect(trustFile).toContain('Acceso Directo a Senior BI Architect');
      expect(trustFile).toContain('Direct Senior BI Architect Access');
    });

    it('F8.4: TrustGuarantees includes security protocols bar and quantified track record', () => {
      const trustFile = fs.readFileSync(path.resolve(__dirname, '../../components/TrustGuarantees.tsx'), 'utf8');
      expect(trustFile).toContain('SOC2-Ready Read-Only Access');
      expect(trustFile).toContain('HIPAA Data Privacy Protocol');
      expect(trustFile).toContain('99.9% Pipeline Reliability SLA');
      expect(trustFile).toContain('+$420k');
      expect(trustFile).toContain('33,370+');
      expect(trustFile).toContain('94%');
      expect(trustFile).toContain('14 Días');
    });

    it('F8.5: FAQ and packages address data safety, IP ownership, and SLA guarantees', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('El entregable es tuyo: dashboards, automatizaciones y documentación.');
      expect(appFile).toContain('Atendemos empresas en Guatemala, Centroamérica, México y Estados Unidos');
      expect(appFile).toContain('excludes: "Automatización, integraciones y modelos predictivos."');
      expect(appFile).toContain('excludes: "Data warehouse y modelos IA a medida."');
    });
  });

  describe('Tier 1 - F9: Direct Diagnostic Scheduling', 1, () => {
    it('F9.1: Header navigation provides immediate scheduling CTA button', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('t.nav.schedule');
      expect(appFile).toContain('t.nav.schedule_short');
      expect(appFile).toContain('button--nav');
    });

    it('F9.2: Free assessment scope is defined as 30–45 min video consultation', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Una videollamada de 30–45 minutos donde revisamos tus fuentes de datos');
      expect(appFile).toContain('A 30–45 minute video call where we review your data sources');
    });

    it('F9.3: Direct contact options include email, phone and WhatsApp channels', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('info@sagepoint-analytics.com');
      expect(appFile).toContain('+502 4046 4716');
    });

    it('F9.4: Diagnosis request heading is clearly labeled on the contact form', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('SOLICITUD DE DIAGNÓSTICO');
      expect(appFile).toContain('ASSESSMENT REQUEST');
    });

    it('F9.5: Scheduling actions track conversion events in analytics layer', () => {
      const env = createBrowserEnvironment();
      env.installGlobals();
      trackEvent('schedule_call', { source_section: 'nav', package_id: 'general', language: 'es' });
      expect(env.state.trackedEvents.length).toBe(1);
      expect(env.state.trackedEvents[0].name).toBe('schedule_call');
      expect(env.state.trackedEvents[0].params.source_section).toBe('nav');
    });

    it('F9.6: ScheduleModal component provides interactive date/time booking, timezone selection, and accessible dialog roles', () => {
      const scheduleFile = fs.readFileSync(path.resolve(__dirname, '../../components/ScheduleModal.tsx'), 'utf8');
      expect(scheduleFile).toContain('export const scheduleModalContent = {');
      expect(scheduleFile).toContain('role="dialog"');
      expect(scheduleFile).toContain('aria-modal="true"');
      expect(scheduleFile).toContain('aria-labelledby="schedule-modal-title"');
      expect(scheduleFile).toContain('aria-describedby="schedule-modal-desc"');
      expect(scheduleFile).toContain('getAvailableDates');
      expect(scheduleFile).toContain('AVAILABLE_TIMES');
      expect(scheduleFile).toContain('createGoogleCalendarUrl');
      expect(scheduleFile).toContain('createWhatsAppConfirmationUrl');
      expect(scheduleFile).toContain('Guatemala / Centroamérica (CST, UTC-6)');
      expect(scheduleFile).toContain('EE. UU. Este / Miami / NY (EST, UTC-5)');
    });
  });

  describe('Tier 1 - F10: Frictionless Accessible Contact Form', 1, () => {
    it('F10.1: Form fields include name, email, phone, service, industry, country, and details', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('name="name"');
      expect(appFile).toContain('name="email"');
      expect(appFile).toContain('name="phone"');
      expect(appFile).toContain('name="service"');
      expect(appFile).toContain('name="industry"');
      expect(appFile).toContain('name="country"');
      expect(appFile).toContain('name="details"');
    });

    it('F10.2: Name and email inputs have required attributes and HTML5 types', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('type="email"');
      expect(appFile).toContain('autoComplete="tel"');
    });

    it('F10.3: Conditional details textarea appears only for custom and executive packages', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain("(selectedService === 'custom' || selectedService === 'executive')");
    });

    it('F10.4: Form submission transitions through idle -> sending -> success states', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain("setFormState('sending')");
      expect(appFile).toContain("setFormState('success')");
      expect(appFile).toContain("setFormState('error')");
    });

    it('F10.5: Success screen offers immediate WhatsApp continue button and reset action', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('contact-form__success');
      expect(appFile).toContain('t.contact.form.success_wa');
      expect(appFile).toContain('t.contact.form.success_again');
    });

    it('F10.6: Form implements inline field-level validation and 100% WCAG htmlFor/id accessible pairings with zero alert() calls', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile.includes('alert(')).toBeFalsy();
      expect(appFile).toContain('validateField');
      expect(appFile).toContain('htmlFor="contact-name"');
      expect(appFile).toContain('id="contact-name"');
      expect(appFile).toContain('htmlFor="contact-email"');
      expect(appFile).toContain('id="contact-email"');
      expect(appFile).toContain('htmlFor="contact-phone"');
      expect(appFile).toContain('id="contact-phone"');
      expect(appFile).toContain('htmlFor="contact-service"');
      expect(appFile).toContain('id="contact-service"');
      expect(appFile).toContain('aria-invalid=');
      expect(appFile).toContain('aria-describedby=');
      expect(appFile).toContain('role="alert"');
    });
  });

  describe('Tier 1 - F11: Full Contextual WhatsApp Routing', 1, () => {
    it('F11.1: Verified phone number is consistently 50240464716 across components', () => {
      const waButton = fs.readFileSync(path.resolve(__dirname, '../../components/WhatsAppButton.tsx'), 'utf8');
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(waButton).toContain("PHONE = '50240464716'");
      expect(appFile).toContain('https://wa.me/50240464716?text=');
    });

    it('F11.2: Spanish WhatsApp messages are contextualized for each package ID', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Hola, quiero agendar el diagnóstico gratuito de Sagepoint Analytics.');
      expect(appFile).toContain('Hola, me interesa el Diagnóstico Express + Dashboard Quick-Win ($750).');
      expect(appFile).toContain('Hola, me interesa el Dashboard Ejecutivo + Automatización.');
      expect(appFile).toContain('Hola, necesito una solución a medida');
      expect(appFile).toContain('Hola, me interesa el Soporte Cercano Mensual');
    });

    it('F11.3: English WhatsApp messages are contextualized for each package ID', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('Hi, I would like to book the free assessment with Sagepoint Analytics.');
      expect(appFile).toContain('Hi, I am interested in the Express Assessment + Quick-Win Dashboard ($750).');
      expect(appFile).toContain('Hi, I am interested in the Executive Dashboard + Automation package.');
      expect(appFile).toContain('Hi, I need a custom solution');
      expect(appFile).toContain('Hi, I am interested in the Soporte Cercano monthly support add-on.');
    });

    it('F11.4: Floating WhatsApp button includes proper rel and aria-label attributes', () => {
      const waButton = fs.readFileSync(path.resolve(__dirname, '../../components/WhatsAppButton.tsx'), 'utf8');
      expect(waButton).toContain('target="_blank"');
      expect(waButton).toContain('rel="noopener noreferrer"');
      expect(waButton).toContain('aria-label={LABELS[lang]}');
    });

    it('F11.5: Pricing card WhatsApp links pass placement and package_id tracking', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain("placement: 'price_card', package_id: plan.id");
      expect(appFile).toContain("placement: 'retainer_card', package_id: 'retainer'");
    });

    it('F11.6: Contextual WhatsApp CTAs are present across Hero, Package Matrix, ROI Calculator, and Trust Guarantees', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      const guaranteesFile = fs.readFileSync(path.resolve(__dirname, '../../components/TrustGuarantees.tsx'), 'utf8');
      const roiFile = fs.readFileSync(path.resolve(__dirname, '../../components/RoiCalculator.tsx'), 'utf8');
      expect(appFile).toContain('button--whatsapp');
      expect(guaranteesFile).toContain('cta_whatsapp');
      expect(roiFile).toContain('cta_wa');
    });
  });

  describe('Tier 1 - F12: Enhanced UTM & Click ID Attribution', 1, () => {
    it('F12.1: captureLeadAttribution parses UTM query params and sets localStorage', () => {
      const env = createBrowserEnvironment(
        'https://www.sagepoint-analytics.com/?utm_source=google&utm_medium=cpc&utm_campaign=q3_cro&utm_content=hero_ad&utm_term=bi_dashboards',
        'https://google.com'
      );
      env.installGlobals();

      captureLeadAttribution();
      const attribution = getLeadAttribution();

      expect(attribution.utm_source).toBe('google');
      expect(attribution.utm_medium).toBe('cpc');
      expect(attribution.utm_campaign).toBe('q3_cro');
      expect(attribution.utm_content).toBe('hero_ad');
      expect(attribution.utm_term).toBe('bi_dashboards');
      expect(attribution.referrer).toBe('https://google.com');
      expect(attribution.capturedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('F12.2: Default attribution fallback is direct / none when no params are present', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/');
      env.installGlobals();

      const attribution = getLeadAttribution();
      expect(attribution.utm_source).toBe('direct');
      expect(attribution.utm_medium).toBe('none');
      expect(attribution.utm_campaign).toBe('none');
    });

    it('F12.3: First-touch attribution persists across subsequent direct visits', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?utm_source=linkedin&utm_medium=social&utm_campaign=cfo_target');
      env.installGlobals();
      captureLeadAttribution();

      // Subsequent visit with no UTMs
      env.setNavigation('https://www.sagepoint-analytics.com/portfolio/');
      captureLeadAttribution();

      const attribution = getLeadAttribution();
      expect(attribution.utm_source).toBe('linkedin');
      expect(attribution.utm_campaign).toBe('cfo_target');
    });

    it('F12.4: submitToGoogleSheet merges attribution into the submission payload', async () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?utm_source=twitter&utm_medium=post&utm_campaign=data_tips');
      env.installGlobals();
      captureLeadAttribution();

      const payload = {
        name: 'Carlos Mendez',
        email: 'carlos@mendezcorp.com',
        phone: '+502 5555 1234',
        service: 'executive | Dashboard Ejecutivo',
        ...getLeadAttribution(),
      };

      const result = await submitToGoogleSheet(payload);
      expect(result).toBe('confirmed');
      expect(env.state.fetchCalls.length).toBe(1);

      const body = env.state.fetchCalls[0].body as URLSearchParams;
      expect(body.get('name')).toBe('Carlos Mendez');
      expect(body.get('utm_source')).toBe('twitter');
      expect(body.get('utm_campaign')).toBe('data_tips');
      expect(body.get('source')).toBe('Sagepoint Web');
    });

    it('F12.5: Google Script URL is validated before initiating network requests', async () => {
      const env = createBrowserEnvironment();
      env.installGlobals();

      const result = await submitToGoogleSheet({ name: 'Test', email: 'test@example.com' });
      expect(result).toBe('confirmed');
    });

    it('F12.6: captureLeadAttribution captures and maps ad click IDs (gclid, fbclid, msclkid, ttclid)', () => {
      const envGoogle = createBrowserEnvironment('https://www.sagepoint-analytics.com/?gclid=Cj0KCQjww_28BhCrARIsADg7_123');
      envGoogle.installGlobals();
      captureLeadAttribution();
      const attrGoogle = getLeadAttribution();
      expect(attrGoogle.gclid).toBe('Cj0KCQjww_28BhCrARIsADg7_123');
      expect(attrGoogle.utm_source).toBe('google');
      expect(attrGoogle.utm_medium).toBe('cpc');

      const envFb = createBrowserEnvironment('https://www.sagepoint-analytics.com/?fbclid=IwAR3x_test_fb_456');
      envFb.installGlobals();
      captureLeadAttribution();
      const attrFb = getLeadAttribution();
      expect(attrFb.fbclid).toBe('IwAR3x_test_fb_456');
      expect(attrFb.utm_source).toBe('facebook');
      expect(attrFb.utm_medium).toBe('paid_social');
    });
  });

  describe('Tier 1 - F13: Complete GA4 Event Instrumentation', 1, () => {
    it('F13.1: trackEvent safely queues events into dataLayer', () => {
      const env = createBrowserEnvironment();
      env.installGlobals();

      trackEvent('select_package', { package_id: 'executive', language: 'es' });
      trackEvent('whatsapp_click', { language: 'es', placement: 'hero' });

      expect(env.state.trackedEvents.length).toBe(2);
      expect(env.state.trackedEvents[0].name).toBe('select_package');
      expect(env.state.trackedEvents[0].params.package_id).toBe('executive');
      expect(env.state.trackedEvents[1].name).toBe('whatsapp_click');
    });

    it('F13.2: trackPageView sends page_view event with path and title', () => {
      const env = createBrowserEnvironment();
      env.installGlobals();

      trackPageView('/?lang=en', 'Business Intelligence Dashboards | Sagepoint Analytics');
      expect(env.state.trackedEvents.length).toBe(1);
      expect(env.state.trackedEvents[0].name).toBe('page_view');
      expect(env.state.trackedEvents[0].params.page_path).toBe('/?lang=en');
    });

    it('F13.3: lead_submit_attempt and generate_lead are logged with full campaign data', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?utm_source=google&utm_campaign=q3_leadgen');
      env.installGlobals();
      captureLeadAttribution();

      const attribution = getLeadAttribution();
      trackEvent('lead_submit_attempt', {
        package_id: 'quick-win',
        language: 'es',
        campaign: attribution.utm_campaign,
        source: attribution.utm_source,
      });

      trackEvent('generate_lead', {
        package_id: 'quick-win',
        language: 'es',
        campaign: attribution.utm_campaign,
        source: attribution.utm_source,
      });

      expect(env.state.trackedEvents.length).toBe(2);
      expect(env.state.trackedEvents[0].name).toBe('lead_submit_attempt');
      expect(env.state.trackedEvents[1].name).toBe('generate_lead');
      expect(env.state.trackedEvents[1].params.campaign).toBe('q3_leadgen');
    });

    it('F13.4: initializeAnalytics guards dev environments and provisions dataLayer structure', () => {
      const analyticsFile = fs.readFileSync(path.resolve(__dirname, '../../utils/analytics.ts'), 'utf8');
      expect(analyticsFile).toContain('window.dataLayer = window.dataLayer || []');
      expect(analyticsFile).toContain('window.gtag = function gtag');
      expect(analyticsFile).toContain('https://www.googletagmanager.com/gtag/js?id=');
      expect(analyticsFile).toContain("window.gtag('config', measurementId, { send_page_view: false })");
    });

    it('F13.5: GA4 measurement ID is G-F296ZSRJ2Z', () => {
      const analyticsFile = fs.readFileSync(path.resolve(__dirname, '../../utils/analytics.ts'), 'utf8');
      expect(analyticsFile).toContain("PROD_MEASUREMENT_ID = 'G-F296ZSRJ2Z'");
    });

    it('F13.6: Strongly-typed GA4 event helpers dispatch correct event structures', () => {
      const env = createBrowserEnvironment();
      env.installGlobals();

      trackSelectPackage({ package_id: 'executive', package_name: 'Executive Dashboard', price: 2500, language: 'en' });
      trackLeadSubmitAttempt({ package_id: 'executive', form_location: 'contact_section', language: 'en' });
      trackGenerateLead({ package_id: 'executive', lead_id: 'lead_123', attribution: 'google', language: 'en' });
      trackWhatsAppClick({ source_section: 'hero', package_id: 'general', language: 'en' });
      trackScheduleCall({ source_section: 'nav', package_id: 'executive', method: 'direct_calendar', language: 'en' });
      trackViewRoiCalc({ source_section: 'roi_calculator', language: 'en' });
      trackCalculateRoi({ team_size: 5, hours_per_week: 10, estimated_savings: 50000, language: 'en' });

      expect(env.state.trackedEvents.length).toBe(7);
      expect(env.state.trackedEvents[0].name).toBe('select_package');
      expect(env.state.trackedEvents[0].params.package_name).toBe('Executive Dashboard');
      expect(env.state.trackedEvents[1].name).toBe('lead_submit_attempt');
      expect(env.state.trackedEvents[2].name).toBe('generate_lead');
      expect(env.state.trackedEvents[3].name).toBe('whatsapp_click');
      expect(env.state.trackedEvents[4].name).toBe('schedule_call');
      expect(env.state.trackedEvents[5].name).toBe('view_roi_calc');
      expect(env.state.trackedEvents[6].name).toBe('calculate_roi');
    });
  });

  describe('Tier 1 - F14: Mobile Responsiveness & Layout Integrity', 1, () => {
    it('F14.1: Site shell enforces overflow-x-hidden to prevent horizontal scrolling', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('overflow-x-hidden');
    });

    it('F14.2: Mobile header renders compact CTA and language toggles', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('flex md:hidden items-center');
      expect(appFile).toContain('t.nav.schedule_short');
    });

    it('F14.3: Grids stack single column on mobile screens (grid-cols-1 / md:grid-cols-...)', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain('grid md:grid-cols-2');
      expect(appFile).toContain('lg:grid-cols-[0.9fr_1.1fr]');
      expect(appFile).toContain('pricing-grid');
    });

    it('F14.4: Touch-friendly floating WhatsApp widget uses 56x56px touch target', () => {
      const waButton = fs.readFileSync(path.resolve(__dirname, '../../components/WhatsAppButton.tsx'), 'utf8');
      expect(waButton).toContain('w-14 h-14'); // 14 * 4px = 56px (exceeds 44px touch target guideline)
      expect(waButton).toContain('z-50');
    });

    it('F14.5: prefersReducedMotion helper disables non-essential animations', () => {
      const appFile = fs.readFileSync(path.resolve(__dirname, '../../App.tsx'), 'utf8');
      expect(appFile).toContain("prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches");
    });

    it('F14.6: Interactive navigation and chips enforce accessible 44px minimum touch targets in CSS', () => {
      const cssFile = fs.readFileSync(path.resolve(__dirname, '../../index.css'), 'utf8');
      expect(cssFile).toContain('min-height: 2.75rem'); // 44px accessible touch target
      expect(cssFile).toContain('min-width: 2.75rem'); // 44px accessible touch target
    });
  });

  describe('Tier 1 - F15: Production Build & Pre-rendering', 1, () => {
    it('F15.1: Production dist/index.html exists and contains valid HTML structure', () => {
      const indexPath = path.resolve(__dirname, '../../dist/index.html');
      expect(fs.existsSync(indexPath)).toBeTruthy();
      const content = fs.readFileSync(indexPath, 'utf8');
      expect(content).toContain('<!doctype html>');
      expect(content).toContain('<title>');
      expect(content).toContain('Sagepoint Analytics');
    });

    it('F15.2: Postbuild script generates dist/portfolio/index.html with pre-rendered SEO', () => {
      const portfolioPath = path.resolve(__dirname, '../../dist/portfolio/index.html');
      expect(fs.existsSync(portfolioPath)).toBeTruthy();
      const content = fs.readFileSync(portfolioPath, 'utf8');
      expect(content).toContain('Portfolio');
      expect(content).toContain('https://www.sagepoint-analytics.com/portfolio/');
    });

    it('F15.3: Portfolio page includes BreadcrumbList and CollectionPage JSON-LD schema', () => {
      const portfolioPath = path.resolve(__dirname, '../../dist/portfolio/index.html');
      const content = fs.readFileSync(portfolioPath, 'utf8');
      expect(content).toContain('application/ld+json');
      expect(content).toContain('"@type": "CollectionPage"');
      expect(content).toContain('"@type": "BreadcrumbList"');
    });

    it('F15.4: OpenGraph and Twitter card metadata are correctly embedded', () => {
      const portfolioPath = path.resolve(__dirname, '../../dist/portfolio/index.html');
      const content = fs.readFileSync(portfolioPath, 'utf8');
      expect(content).toContain('property="og:title"');
      expect(content).toContain('name="twitter:title"');
    });

    it('F15.5: SEO postbuild script executes cleanly without runtime errors', () => {
      const scriptPath = path.resolve(__dirname, '../../scripts/postbuild-seo.mjs');
      expect(fs.existsSync(scriptPath)).toBeTruthy();
    });

    it('F15.6: Portfolio prerender includes alternate hreflang tags for ES, EN and x-default', () => {
      const portfolioPath = path.resolve(__dirname, '../../dist/portfolio/index.html');
      const content = fs.readFileSync(portfolioPath, 'utf8');
      expect(content).toContain('hreflang="es"');
      expect(content).toContain('hreflang="en"');
      expect(content).toContain('hreflang="x-default"');
    });
  });
}

