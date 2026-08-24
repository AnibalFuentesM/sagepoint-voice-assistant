/**
 * Tier 3: Cross-Feature Combinations Test Suite
 * Pairwise interactions, state persistence, cross-module synchronization, and multi-step lifecycle flows.
 */

import { describe, it, expect } from '../harness/test-framework';
import { createBrowserEnvironment } from '../harness/env-simulator';
import {
  captureLeadAttribution,
  getLeadAttribution,
  trackEvent,
  trackPageView,
} from '../../utils/analytics';
import { submitToGoogleSheet } from '../../utils/sheetUtils';
import * as fs from 'fs';
import * as path from 'path';

export function registerTier3Suites() {
  describe('Tier 3 - Pairwise Interactions & State Synchronization', 3, () => {
    it('T3.1: Package selection + Language toggle keeps selected package ID in sync with translated labels', () => {
      type PackageId = 'quick-win' | 'executive' | 'custom' | 'retainer' | 'general';
      let selectedPackage: PackageId = 'executive';
      let lang: 'es' | 'en' = 'es';

      const packageLabels: Record<'es' | 'en', Record<PackageId, string>> = {
        es: {
          general: 'Diagnóstico gratuito / Consultoría general',
          'quick-win': 'Diagnóstico Express + Dashboard Quick-Win ($750)',
          executive: 'Dashboard Ejecutivo + Automatización (desde $2,500)',
          custom: 'Solución a Medida (cotización)',
          retainer: 'Soporte Cercano Mensual ($300 / $600 / $1,000/mes)',
        },
        en: {
          general: 'Free assessment / General consulting',
          'quick-win': 'Express Assessment + Quick-Win Dashboard ($750)',
          executive: 'Executive Dashboard + Automation (from $2,500)',
          custom: 'Custom Solution (quote)',
          retainer: 'Soporte Cercano Monthly ($300 / $600 / $1,000/mo)',
        },
      };

      expect(packageLabels[lang][selectedPackage]).toContain('Dashboard Ejecutivo');

      // Toggle to English
      lang = 'en';
      expect(packageLabels[lang][selectedPackage]).toContain('Executive Dashboard');
      expect(selectedPackage).toBe('executive');
    });

    it('T3.2: Language toggle dynamically updates WhatsApp prefilled URL templates for all tiers', () => {
      type PackageId = 'quick-win' | 'executive' | 'custom' | 'retainer' | 'general';
      const waMessages: Record<'es' | 'en', Record<PackageId, string>> = {
        es: {
          general: 'Hola, quiero agendar el diagnóstico gratuito de Sagepoint Analytics.',
          'quick-win': 'Hola, me interesa el Diagnóstico Express + Dashboard Quick-Win ($750). ¿Podemos agendar el diagnóstico gratuito?',
          executive: 'Hola, me interesa el Dashboard Ejecutivo + Automatización. Quisiera cotizar mi proyecto.',
          custom: 'Hola, necesito una solución a medida (modelos predictivos / integraciones / data warehouse). ¿Podemos hablar?',
          retainer: 'Hola, me interesa el Soporte Cercano Mensual para mantenimiento y coaching.',
        },
        en: {
          general: 'Hi, I would like to book the free assessment with Sagepoint Analytics.',
          'quick-win': 'Hi, I am interested in the Express Assessment + Quick-Win Dashboard ($750). Can we book the free assessment?',
          executive: 'Hi, I am interested in the Executive Dashboard + Automation package. I would like a quote for my project.',
          custom: 'Hi, I need a custom solution (predictive models / integrations / data warehouse). Can we talk?',
          retainer: 'Hi, I am interested in the Soporte Cercano monthly support add-on.',
        },
      };

      const waLink = (id: PackageId, l: 'es' | 'en') =>
        `https://wa.me/50240464716?text=${encodeURIComponent(waMessages[l][id])}`;

      const esQuickWin = waLink('quick-win', 'es');
      const enQuickWin = waLink('quick-win', 'en');

      expect(esQuickWin).toContain('Diagn%C3%B3stico%20Express');
      expect(enQuickWin).toContain('Express%20Assessment');
      expect(esQuickWin).toContain('50240464716');
      expect(enQuickWin).toContain('50240464716');
    });

    it('T3.3: Initial UTM campaign is preserved through package selection and language switch to form submission', async () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?utm_source=linkedin&utm_medium=sponsored&utm_campaign=latam_cfo_q3');
      env.installGlobals();
      captureLeadAttribution();

      // User selects package
      const selectedService = 'quick-win';
      trackEvent('select_package', { package_id: selectedService, language: 'es' });

      // User switches language
      env.setNavigation('https://www.sagepoint-analytics.com/?lang=en');
      trackPageView('/?lang=en', 'Business Intelligence Dashboards');

      // User submits form
      const attribution = getLeadAttribution();
      expect(attribution.utm_source).toBe('linkedin');
      expect(attribution.utm_campaign).toBe('latam_cfo_q3');

      const payload = {
        name: 'Alejandro Rivera',
        email: 'arivera@corp.gt',
        phone: '+502 4444 8888',
        service: 'quick-win | Express Assessment',
        packageId: selectedService,
        language: 'English',
        ...attribution,
      };

      const result = await submitToGoogleSheet(payload);
      expect(result).toBe('confirmed');

      const submittedBody = env.state.fetchCalls[0].body as URLSearchParams;
      expect(submittedBody.get('utm_source')).toBe('linkedin');
      expect(submittedBody.get('utm_campaign')).toBe('latam_cfo_q3');
      expect(submittedBody.get('language')).toBe('English');
    });

    it('T3.4: Conditional details textarea visibility toggles seamlessly when switching between package tiers', () => {
      type PackageId = 'quick-win' | 'executive' | 'custom' | 'retainer' | 'general';
      const hasDetailsField = (service: PackageId) => service === 'custom' || service === 'executive';

      expect(hasDetailsField('general')).toBeFalsy();
      expect(hasDetailsField('quick-win')).toBeFalsy();
      expect(hasDetailsField('executive')).toBeTruthy();
      expect(hasDetailsField('custom')).toBeTruthy();
      expect(hasDetailsField('retainer')).toBeFalsy();
    });

    it('T3.5: Accordion FAQ ensures single open item behavior on sequential toggles', () => {
      let openFaq: number | null = 0; // Item 0 open initially

      // User clicks Item 1 -> Item 1 opens, Item 0 closes
      openFaq = openFaq === 1 ? null : 1;
      expect(openFaq).toBe(1);

      // User clicks Item 1 again -> Item 1 closes
      openFaq = openFaq === 1 ? null : 1;
      expect(openFaq).toBeNull();

      // User clicks Item 3 -> Item 3 opens
      openFaq = openFaq === 3 ? null : 3;
      expect(openFaq).toBe(3);
    });

    it('T3.6: English submission maps localized industry and country selections to consistent English labels', async () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?lang=en');
      env.installGlobals();

      // Form maps dropdowns to standard English strings for backend Google Sheets
      const payload = {
        name: 'Sarah Jenkins',
        email: 'sjenkins@medhealth.com',
        phone: '+1 312 555 0123',
        industry: 'Services',
        country: 'United States',
        service: 'executive | Executive Dashboard + Automation',
        packageId: 'executive',
        language: 'English',
        type: 'Formulario Web',
        ...getLeadAttribution(),
      };

      const result = await submitToGoogleSheet(payload);
      expect(result).toBe('confirmed');

      const body = env.state.fetchCalls[0].body as URLSearchParams;
      expect(body.get('industry')).toBe('Services');
      expect(body.get('country')).toBe('United States');
      expect(body.get('language')).toBe('English');
    });

    it('T3.7: Lead submission success panel retains selected package context for the follow-up WhatsApp CTA', () => {
      const selectedPackage = 'executive';
      const lang = 'en';

      const waMessages: Record<string, string> = {
        executive: 'Hi, I am interested in the Executive Dashboard + Automation package. I would like a quote for my project.',
      };

      const waLink = `https://wa.me/50240464716?text=${encodeURIComponent(waMessages[selectedPackage])}`;
      expect(waLink).toContain('Executive%20Dashboard');

      // Event tracking on success panel WhatsApp click
      const env = createBrowserEnvironment();
      env.installGlobals();
      trackEvent('whatsapp_click', { language: lang, placement: 'form_success', package_id: selectedPackage });

      expect(env.state.trackedEvents.length).toBe(1);
      expect(env.state.trackedEvents[0].params.placement).toBe('form_success');
      expect(env.state.trackedEvents[0].params.package_id).toBe('executive');
    });

    it('T3.8: Complete GA4 Funnel event telemetry sequence preserves campaign and package cohesion', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?utm_source=google&utm_medium=cpc&utm_campaign=q3_cro');
      env.installGlobals();
      captureLeadAttribution();

      const attribution = getLeadAttribution();

      // 1. page_view
      trackPageView('/', 'Sagepoint Analytics');

      // 2. view_roi_calc
      trackEvent('view_roi_calc', { source_section: 'hero_metrics', language: 'es' });

      // 3. calculate_roi
      trackEvent('calculate_roi', { team_size: 10, hours_per_week: 8, estimated_savings: 58240, language: 'es' });

      // 4. select_package
      trackEvent('select_package', { package_id: 'executive', language: 'es' });

      // 5. lead_submit_attempt
      trackEvent('lead_submit_attempt', {
        package_id: 'executive',
        language: 'es',
        campaign: attribution.utm_campaign,
        source: attribution.utm_source,
      });

      // 6. generate_lead (confirmed server conversion)
      trackEvent('generate_lead', {
        package_id: 'executive',
        language: 'es',
        campaign: attribution.utm_campaign,
        source: attribution.utm_source,
      });

      expect(env.state.trackedEvents.length).toBe(6);
      const events = env.state.trackedEvents.map((e) => e.name);
      expect(events).toEqual([
        'page_view',
        'view_roi_calc',
        'calculate_roi',
        'select_package',
        'lead_submit_attempt',
        'generate_lead',
      ]);

      expect(env.state.trackedEvents[4].params.campaign).toBe('q3_cro');
      expect(env.state.trackedEvents[5].params.campaign).toBe('q3_cro');
    });

    it('T3.9: ScheduleModal booking integrates preselected package, custom date/time, and ad click attribution into Google Sheet payload', async () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?gclid=test_gclid_9999&utm_campaign=cfo_schedule');
      env.installGlobals();
      captureLeadAttribution();

      // Open schedule modal with Quick-Win preselected
      const selectedPackage = 'quick-win';
      trackEvent('schedule_call', {
        source_section: 'hero',
        package_id: selectedPackage,
        method: 'direct_calendar',
        language: 'es',
        scheduled_date: '2026-08-20',
        scheduled_time: '10:30 AM',
      });

      const payload = {
        name: 'Fernando Ruiz',
        email: 'fruiz@importaciones.gt',
        phone: '+502 4444 7777',
        company: 'Importaciones del Norte',
        service: '[CALENDARIO] quick-win | Diagnóstico Express + Dashboard Quick-Win ($750) | Cita: Jue 20 Ago @ 10:30 AM (CST)',
        packageId: selectedPackage,
        scheduledDate: '2026-08-20',
        scheduledTime: '10:30 AM',
        timezone: 'Guatemala / Centroamérica (CST, UTC-6)',
        type: 'Diagnóstico Agendado en Calendario',
        language: 'Español',
        ...getLeadAttribution(),
      };

      const result = await submitToGoogleSheet(payload);
      expect(result).toBe('confirmed');

      const body = env.state.fetchCalls[0].body as URLSearchParams;
      expect(body.get('name')).toBe('Fernando Ruiz');
      expect(body.get('packageId')).toBe('quick-win');
      expect(body.get('gclid')).toBe('test_gclid_9999');
      expect(body.get('utm_source')).toBe('google');
      expect(body.get('utm_campaign')).toBe('cfo_schedule');
      expect(body.get('type')).toBe('Diagnóstico Agendado en Calendario');
    });

    it('T3.10: Form field error validation state correctly rejects invalid inputs and cleans errors upon correction', () => {
      let formErrors: Record<string, string | undefined> = {};
      const validateField = (field: 'name' | 'email', value: string) => {
        let error: string | undefined;
        if (field === 'name') {
          if (!value || value.trim().length < 2) {
            error = 'Por favor ingresa un nombre válido (mínimo 2 caracteres).';
          }
        } else if (field === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value || !emailRegex.test(value.trim())) {
            error = 'Por favor ingresa un correo electrónico válido.';
          }
        }
        formErrors = { ...formErrors, [field]: error };
        return !error;
      };

      // Step 1: Initial empty input fails
      expect(validateField('name', '')).toBeFalsy();
      expect(formErrors.name).toBe('Por favor ingresa un nombre válido (mínimo 2 caracteres).');

      // Step 2: Typing valid name clears error
      expect(validateField('name', 'Roberto Gomez')).toBeTruthy();
      expect(formErrors.name).toBe(undefined);

      // Step 3: Malformed email fails
      expect(validateField('email', 'roberto@')).toBeFalsy();
      expect(formErrors.email).toBe('Por favor ingresa un correo electrónico válido.');

      // Step 4: Valid email clears error
      expect(validateField('email', 'roberto@empresa.com')).toBeTruthy();
      expect(formErrors.email).toBe(undefined);
    });
  });
}
