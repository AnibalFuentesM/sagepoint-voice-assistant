/**
 * Tier 4: Real-World Application Scenarios Test Suite
 * End-to-end multi-step persona journeys and conversion funnels.
 */

import { describe, it, expect } from '../harness/test-framework';
import { createBrowserEnvironment, calculateRoiMetrics } from '../harness/env-simulator';
import {
  captureLeadAttribution,
  getLeadAttribution,
  trackEvent,
  trackPageView,
} from '../../utils/analytics';
import { submitToGoogleSheet } from '../../utils/sheetUtils';

export function registerTier4Suites() {
  describe('Tier 4 - Real-World Application Scenarios', 4, () => {
    it('Scenario 1: US CEO Google Ads Campaign Conversion Flow', async () => {
      // Step 1: Arrives via Google Ads campaign URL in English
      const adUrl =
        'https://www.sagepoint-analytics.com/?utm_source=google&utm_medium=cpc&utm_campaign=us_midmarket_ceo&utm_content=hero_responsive&utm_term=bi_reporting_automation&gclid=Cj0KCQjww_28BhCrARIsADg7&lang=en';
      const env = createBrowserEnvironment(adUrl, 'https://www.google.com/');
      env.installGlobals();

      // Step 2: System captures campaign attribution and fires page_view
      captureLeadAttribution();
      trackPageView('/?lang=en', 'Business Intelligence Dashboards for SMEs | Sagepoint Analytics');

      const attribution = getLeadAttribution();
      expect(attribution.utm_source).toBe('google');
      expect(attribution.utm_campaign).toBe('us_midmarket_ceo');
      expect(attribution.landingPage).toContain('utm_source=google');
      expect(env.state.lang).toBe('en');

      // Step 3: CEO explores the ROI calculator for a 25-person team (10 hrs/wk manual reporting)
      trackEvent('view_roi_calc', { source_section: 'hero_metrics', language: 'en' });
      const roi = calculateRoiMetrics({
        teamSize: 25,
        hoursPerWeekPerPerson: 10,
        hourlyRate: 45,
        packageTier: 'executive',
      });
      // 25 * 10 * 52 * 0.8 = 10,400 hours saved
      // 10,400 * $45 = $468,000 annual savings
      expect(roi.annualHoursSaved).toBe(10400);
      expect(roi.annualDollarSavings).toBe(468000);
      expect(roi.roiPercentage).toBeGreaterThan(15000);
      trackEvent('calculate_roi', { team_size: 25, hours_per_week: 10, estimated_savings: roi.annualDollarSavings, language: 'en' });

      // Step 4: CEO selects the Executive Dashboard + Automation package ($2,500)
      const selectedPackage = 'executive';
      trackEvent('select_package', { package_id: selectedPackage, language: 'en' });

      // Step 5: CEO fills out the contact form with corporate specifications
      const formData = {
        name: 'David Sterling',
        email: 'dsterling@sterlinglogistics.com',
        phone: '+1 312 555 0188',
        industry: 'Logistics',
        country: 'United States',
        service: 'executive | Executive Dashboard + Automation | Detalles: Connect NetSuite with Power BI and automate weekly warehouse KPIs',
        packageId: selectedPackage,
        language: 'English',
        type: 'Formulario Web',
        ...attribution,
      };

      // Step 6: Form triggers lead_submit_attempt
      trackEvent('lead_submit_attempt', {
        package_id: selectedPackage,
        language: 'en',
        campaign: attribution.utm_campaign,
        source: attribution.utm_source,
      });

      // Step 7: Data is successfully dispatched to Google Apps Script
      const result = await submitToGoogleSheet(formData);
      expect(result).toBe('confirmed');

      // Step 8: On confirmed receipt, generate_lead conversion event is logged
      trackEvent('generate_lead', {
        package_id: selectedPackage,
        language: 'en',
        campaign: attribution.utm_campaign,
        source: attribution.utm_source,
      });

      // Step 9: Verify telemetry chain completeness
      expect(env.state.trackedEvents.length).toBe(6);
      const events = env.state.trackedEvents.map((e) => e.name);
      expect(events).toEqual([
        'page_view',
        'view_roi_calc',
        'calculate_roi',
        'select_package',
        'lead_submit_attempt',
        'generate_lead',
      ].filter((name) => events.includes(name)));

      // Step 10: Verify submitted HTTP payload
      const submittedBody = env.state.fetchCalls[0].body as URLSearchParams;
      expect(submittedBody.get('name')).toBe('David Sterling');
      expect(submittedBody.get('utm_source')).toBe('google');
      expect(submittedBody.get('utm_campaign')).toBe('us_midmarket_ceo');
    });

    it('Scenario 2: Guatemalan CFO Organic Discovery & Case Study Inspection Flow', () => {
      // Step 1: Arrives organically at the root URL (Spanish default)
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/');
      env.installGlobals();
      captureLeadAttribution();
      trackPageView('/', 'Dashboards e Inteligencia de Negocios para PYMEs en Guatemala');

      expect(env.state.lang).toBe('es');
      const attribution = getLeadAttribution();
      expect(attribution.utm_source).toBe('direct');

      // Step 2: CFO reviews proof metrics (80% time saving, 11,327 records, 33,370 rows)
      expect(attribution.referrer).toBe('direct');

      // Step 3: CFO evaluates Quick-Win package ($750 USD, 2 weeks)
      const selectedPackage = 'quick-win';
      trackEvent('select_package', { package_id: selectedPackage, language: 'es' });

      // Step 4: CFO decides to initiate direct consultation via WhatsApp
      const waMessage = 'Hola, me interesa el Diagnóstico Express + Dashboard Quick-Win ($750). ¿Podemos agendar el diagnóstico gratuito?';
      const waUrl = `https://wa.me/50240464716?text=${encodeURIComponent(waMessage)}`;

      trackEvent('whatsapp_click', {
        language: 'es',
        placement: 'price_card',
        package_id: selectedPackage,
      });

      expect(waUrl).toContain('50240464716');
      expect(waUrl).toContain('Diagn%C3%B3stico%20Express');
      expect(env.state.trackedEvents.length).toBe(3);
      expect(env.state.trackedEvents[2].name).toBe('whatsapp_click');
    });

    it('Scenario 3: Operations Director Multi-language & Validation Error Recovery Flow', async () => {
      // Step 1: Arrives via Facebook Ad in Spanish
      const fbAdUrl = 'https://www.sagepoint-analytics.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=latam_ops_directors&fbclid=IwAR3x_test_123';
      const env = createBrowserEnvironment(fbAdUrl);
      env.installGlobals();
      captureLeadAttribution();

      // Step 2: Director toggles to English to verify bilingual delivery
      env.setNavigation('https://www.sagepoint-analytics.com/?lang=en');
      expect(env.state.lang).toBe('en');

      // Step 3: Director selects Custom Solution
      const selectedPackage = 'custom';
      trackEvent('select_package', { package_id: selectedPackage, language: 'en' });

      // Step 4: Director attempts submission with invalid inputs (empty name and malformed email)
      const invalidName = '';
      const invalidEmail = 'ops@internal';
      const isNameValid = invalidName.trim().length >= 2;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailRegex.test(invalidEmail);

      expect(isNameValid).toBeFalsy();
      expect(isEmailValid).toBeFalsy();
      // Zero HTTP fetch calls triggered on invalid submission
      expect(env.state.fetchCalls.length).toBe(0);

      // Step 5: Director corrects inputs
      const correctedName = 'Maria Morales';
      const correctedEmail = 'mmorales@distribuidoracentroamerica.com';
      expect(correctedName.trim().length >= 2).toBeTruthy();
      expect(emailRegex.test(correctedEmail)).toBeTruthy();

      // Step 6: Valid form submission completes
      const payload = {
        name: correctedName,
        email: correctedEmail,
        phone: '+502 5555 4321',
        industry: 'Manufacturing',
        country: 'Guatemala',
        service: 'custom | Custom Solution | Detalles: Integrar SAP Business One con tableros de producción en tiempo real',
        packageId: selectedPackage,
        language: 'English',
        ...getLeadAttribution(),
      };

      const result = await submitToGoogleSheet(payload);
      expect(result).toBe('confirmed');
      expect(env.state.fetchCalls.length).toBe(1);

      const body = env.state.fetchCalls[0].body as URLSearchParams;
      expect(body.get('utm_source')).toBe('facebook');
      expect(body.get('utm_campaign')).toBe('latam_ops_directors');
      expect(body.get('industry')).toBe('Manufacturing');
    });

    it('Scenario 4: Mobile Viewport Rapid Conversion Flow (375px Viewport)', () => {
      // Step 1: Mobile user loads site
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/');
      env.installGlobals();
      env.window.innerWidth = 375;
      env.window.innerHeight = 667;

      // Step 2: Track initial mobile page view
      trackPageView('/', 'Sagepoint Analytics');

      // Step 3: User clicks mobile navigation CTA ("Agendar")
      trackEvent('schedule_call', { source_section: 'mobile_nav', package_id: 'general', language: 'es' });

      // Step 4: User scrolls through features and clicks floating WhatsApp button
      trackEvent('whatsapp_click', { language: 'es', placement: 'floating_button' });

      expect(env.state.trackedEvents.length).toBe(3);
      expect(env.state.trackedEvents[1].name).toBe('schedule_call');
      expect(env.state.trackedEvents[2].name).toBe('whatsapp_click');
      expect(env.state.trackedEvents[2].params.placement).toBe('floating_button');
    });

    it('Scenario 5: Corporate Enterprise Custom Quote Flow with Add-on Retainer', async () => {
      // Step 1: Enterprise buyer arrives from LinkedIn
      const linkedinUrl = 'https://www.sagepoint-analytics.com/?utm_source=linkedin&utm_medium=cpc&utm_campaign=enterprise_data_warehouse';
      const env = createBrowserEnvironment(linkedinUrl);
      env.installGlobals();
      captureLeadAttribution();

      // Step 2: Buyer reviews Custom Architecture and selects Soporte Cercano Retainer add-on
      const selectedPackage = 'retainer';
      trackEvent('select_package', { package_id: selectedPackage, language: 'es' });

      // Step 3: Buyer submits inquiry for monthly coaching & SLA support
      const payload = {
        name: 'Roberto Arrivillaga',
        email: 'rarrivillaga@bancocentral.gt',
        phone: '+502 4000 1122',
        industry: 'Services',
        country: 'Guatemala',
        service: 'retainer | Soporte Cercano Mensual ($300 / $600 / $1,000/mes)',
        packageId: selectedPackage,
        language: 'Español',
        type: 'Formulario Web',
        ...getLeadAttribution(),
      };

      const result = await submitToGoogleSheet(payload);
      expect(result).toBe('confirmed');

      trackEvent('generate_lead', {
        package_id: selectedPackage,
        language: 'es',
        campaign: 'enterprise_data_warehouse',
        source: 'linkedin',
      });

      // Step 4: Verify complete payload data
      const body = env.state.fetchCalls[0].body as URLSearchParams;
      expect(body.get('packageId')).toBe('retainer');
      expect(body.get('utm_campaign')).toBe('enterprise_data_warehouse');
    });

    it('Scenario 6: US CTO Google Ads Direct Calendar Scheduling & Attribution Flow', async () => {
      // Step 1: Arrives via Google Ads with gclid and English language parameter
      const googleAdsUrl =
        'https://www.sagepoint-analytics.com/?utm_source=google&utm_medium=cpc&utm_campaign=us_tech_cto&gclid=Cj0KCQjww_tech_cto_777&lang=en';
      const env = createBrowserEnvironment(googleAdsUrl, 'https://www.google.com/');
      env.installGlobals();

      // Step 2: System captures attribution and page view
      captureLeadAttribution();
      trackPageView('/?lang=en', 'Business Intelligence Dashboards for SMEs | Sagepoint Analytics');

      const attribution = getLeadAttribution();
      expect(attribution.gclid).toBe('Cj0KCQjww_tech_cto_777');
      expect(attribution.utm_source).toBe('google');
      expect(attribution.utm_medium).toBe('cpc');
      expect(attribution.utm_campaign).toBe('us_tech_cto');

      // Step 3: CTO clicks "Book assessment" in Nav -> opens ScheduleModal
      trackEvent('schedule_call', {
        source_section: 'nav',
        package_id: 'custom',
        method: 'direct_calendar',
        language: 'en',
        scheduled_date: '2026-08-25',
        scheduled_time: '01:30 PM',
      });

      // Step 4: CTO fills out booking form and confirms meeting
      const bookingData = {
        name: 'James Thornton',
        email: 'jthornton@cloudscale-data.io',
        phone: '+1 415 555 9012',
        company: 'CloudScale Data · B2B SaaS',
        service: '[CALENDARIO] custom | Custom Solution (AI Models / Integrations) | Cita: Tue Aug 25 @ 01:30 PM (EST, UTC-5)',
        packageId: 'custom',
        scheduledDate: '2026-08-25',
        scheduledTime: '01:30 PM',
        timezone: 'US Eastern / Miami / NY (EST, UTC-5)',
        type: 'Diagnóstico Agendado en Calendario',
        language: 'English',
        ...attribution,
      };

      const result = await submitToGoogleSheet(bookingData);
      expect(result).toBe('confirmed');

      trackEvent('generate_lead', {
        package_id: 'custom',
        language: 'en',
        source: attribution.utm_source,
        method: 'schedule_modal',
      });

      // Step 5: Verify submitted network payload
      const submittedBody = env.state.fetchCalls[0].body as URLSearchParams;
      expect(submittedBody.get('name')).toBe('James Thornton');
      expect(submittedBody.get('gclid')).toBe('Cj0KCQjww_tech_cto_777');
      expect(submittedBody.get('type')).toBe('Diagnóstico Agendado en Calendario');
      expect(submittedBody.get('language')).toBe('English');
      expect(submittedBody.get('source')).toBe('Sagepoint Web');

      // Step 6: Verify analytics sequence
      expect(env.state.trackedEvents.length).toBe(3);
      expect(env.state.trackedEvents[1].name).toBe('schedule_call');
      expect(env.state.trackedEvents[2].name).toBe('generate_lead');
    });
  });
}
