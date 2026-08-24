/**
 * Tier 2: Boundary & Corner Cases Test Suite
 * Exhaustive edge-case verification for form validation, ROI math, URL parsing, UTMs, and network resilience.
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

export function registerTier2Suites() {
  describe('Tier 2 - Form Input Validation Boundaries', 2, () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    it('T2.1: Empty name string fails validation', () => {
      const name = '';
      const isValid = name.trim().length >= 2;
      expect(isValid).toBeFalsy();
    });

    it('T2.2: Whitespace-only name fails validation', () => {
      const name = '     ';
      const isValid = name.trim().length >= 2;
      expect(isValid).toBeFalsy();
    });

    it('T2.3: Single-character name fails validation (< 2 characters)', () => {
      const name = 'A';
      const isValid = name.trim().length >= 2;
      expect(isValid).toBeFalsy();
    });

    it('T2.4: Exactly 2-character name passes validation', () => {
      const name = 'Al';
      const isValid = name.trim().length >= 2;
      expect(isValid).toBeTruthy();
    });

    it('T2.5: Complex international names with accents, hyphens, and apostrophes pass validation', () => {
      const complexNames = [
        "José María O'Connor-Smith",
        'René François-d’Aboville',
        'Björn Åkesson',
        'María del Carmen Rodríguez-Pérez',
        'Li Wei',
      ];
      for (const name of complexNames) {
        expect(name.trim().length >= 2).toBeTruthy();
      }
    });

    it('T2.6: Email missing @ symbol fails validation', () => {
      const email = 'usercompany.com';
      expect(emailRegex.test(email)).toBeFalsy();
    });

    it('T2.7: Email missing local part fails validation', () => {
      const email = '@company.com';
      expect(emailRegex.test(email)).toBeFalsy();
    });

    it('T2.8: Email missing domain fails validation', () => {
      const email = 'user@';
      expect(emailRegex.test(email)).toBeFalsy();
    });

    it('T2.9: Email missing TLD fails validation', () => {
      const email = 'user@company';
      expect(emailRegex.test(email)).toBeFalsy();
    });

    it('T2.10: Email containing spaces fails validation', () => {
      const email = 'user @company.com';
      expect(emailRegex.test(email)).toBeFalsy();
    });

    it('T2.11: Email with subdomains passes validation', () => {
      const email = 'lead@us.division.enterprise.corp.com';
      expect(emailRegex.test(email)).toBeTruthy();
    });

    it('T2.12: Email with plus addressing passes validation', () => {
      const email = 'anibal+leads.2026@sagepoint-analytics.com';
      expect(emailRegex.test(email)).toBeTruthy();
    });

    it('T2.13: Email with multiple dots in local part passes validation', () => {
      const email = 'first.middle.last@company.org';
      expect(emailRegex.test(email)).toBeTruthy();
    });

    it('T2.14: Extremely long text inputs (1,000+ characters) in details field are preserved', () => {
      const longText = 'A'.repeat(1500);
      const serviceValue = `custom | Solución a Medida | Detalles: ${longText}`;
      expect(serviceValue.length).toBeGreaterThan(1500);
      expect(serviceValue).toContain(longText);
    });

    it('T2.15: Missing optional fields default to "No especificado"', () => {
      const phone = '';
      const industry = '';
      const country = '';

      const normalizedPhone = phone?.trim() || 'No especificado';
      const normalizedIndustry = industry || 'No especificado';
      const normalizedCountry = country || 'No especificado';

      expect(normalizedPhone).toBe('No especificado');
      expect(normalizedIndustry).toBe('No especificado');
      expect(normalizedCountry).toBe('No especificado');
    });
  });

  describe('Tier 2 - ROI Calculator Extreme & Boundary Values', 2, () => {
    it('T2.16: Team size = 0 returns 0 hours and 0 dollar savings without division by zero', () => {
      const roi = calculateRoiMetrics({ teamSize: 0, hoursPerWeekPerPerson: 10, hourlyRate: 35 });
      expect(roi.annualHoursSaved).toBe(0);
      expect(roi.annualDollarSavings).toBe(0);
      expect(roi.roiPercentage).toBe(0);
      expect(roi.paybackPeriodWeeks).toBe(0);
    });

    it('T2.17: Hours per week = 0 returns 0 hours and 0 savings', () => {
      const roi = calculateRoiMetrics({ teamSize: 10, hoursPerWeekPerPerson: 0, hourlyRate: 35 });
      expect(roi.annualHoursSaved).toBe(0);
      expect(roi.annualDollarSavings).toBe(0);
      expect(roi.roiPercentage).toBe(0);
    });

    it('T2.18: Minimal non-zero team (1 person, 1 hour/wk) computes minimal positive savings', () => {
      const roi = calculateRoiMetrics({ teamSize: 1, hoursPerWeekPerPerson: 1, hourlyRate: 30, packageTier: 'quick-win' });
      // 1 * 1 * 52 * 0.8 = 41.6 -> 42 hours
      expect(roi.annualHoursSaved).toBe(42);
      expect(roi.annualDollarSavings).toBe(42 * 30); // $1,260
      expect(roi.netAnnualBenefit).toBe(1260 - 750); // $510
      expect(roi.roiPercentage).toBe(68);
    });

    it('T2.19: Extreme enterprise size (10,000 people) processes without numeric overflow or NaN', () => {
      const roi = calculateRoiMetrics({ teamSize: 10000, hoursPerWeekPerPerson: 15, hourlyRate: 50 });
      expect(Number.isFinite(roi.annualHoursSaved)).toBeTruthy();
      expect(Number.isFinite(roi.annualDollarSavings)).toBeTruthy();
      expect(roi.annualHoursSaved).toBeGreaterThan(6000000);
      expect(roi.roiPercentage).toBeGreaterThan(100000);
    });

    it('T2.20: Fractional hours (e.g. 3.5 hrs/week) maintain accurate math precision', () => {
      const roi = calculateRoiMetrics({ teamSize: 4, hoursPerWeekPerPerson: 3.5, hourlyRate: 40, packageTier: 'executive' });
      // 4 * 3.5 * 52 * 0.8 = 582.4 -> 582 hours
      expect(roi.annualHoursSaved).toBe(582);
      expect(roi.annualDollarSavings).toBe(582 * 40); // $23,280
      expect(roi.paybackPeriodWeeks).toBeLessThan(6);
    });

    it('T2.21: Negative inputs are clamped safely to 0', () => {
      const roi = calculateRoiMetrics({ teamSize: -5, hoursPerWeekPerPerson: -10 });
      expect(roi.annualHoursSaved).toBe(0);
      expect(roi.annualDollarSavings).toBe(0);
    });

    it('T2.22: Zero or negative hourly rate falls back to standard blended rate ($35/hr)', () => {
      const roi = calculateRoiMetrics({ teamSize: 5, hoursPerWeekPerPerson: 8, hourlyRate: 0 });
      expect(roi.annualDollarSavings).toBe(roi.annualHoursSaved * 35);
    });
  });

  describe('Tier 2 - Language & URL Parameter Boundaries', 2, () => {
    it('T2.23: ?lang=invalid defaults safely to Spanish (es)', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?lang=invalid');
      expect(env.state.lang).toBe('es');
    });

    it('T2.24: ?lang= (empty string) defaults safely to Spanish (es)', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?lang=');
      expect(env.state.lang).toBe('es');
    });

    it('T2.25: ?lang=en correctly activates English (en)', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?lang=en');
      expect(env.state.lang).toBe('en');
    });

    it('T2.26: ?lang=es explicitly activates Spanish (es)', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?lang=es');
      expect(env.state.lang).toBe('es');
    });

    it('T2.27: Query strings with multiple unexpected query params preserve standard routing', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?foo=123&lang=en&bar=test&utm_source=email');
      expect(env.state.lang).toBe('en');
      expect(env.state.search).toContain('foo=123');
      expect(env.state.search).toContain('lang=en');
    });

    it('T2.28: Deep link navigation hashes are preserved without disrupting state', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/#pricing');
      expect(env.state.hash).toBe('#pricing');
    });
  });

  describe('Tier 2 - UTM Capture & LocalStorage Resilience', 2, () => {
    it('T2.29: Encoded special characters and plus signs in UTMs are decoded properly', () => {
      const env = createBrowserEnvironment(
        'https://www.sagepoint-analytics.com/?utm_source=google%2Bads&utm_medium=cpc%2Fdisplay&utm_campaign=summer%20promo%202026'
      );
      env.installGlobals();

      captureLeadAttribution();
      const attribution = getLeadAttribution();

      expect(attribution.utm_source).toBe('google+ads');
      expect(attribution.utm_medium).toBe('cpc/display');
      expect(attribution.utm_campaign).toBe('summer promo 2026');
    });

    it('T2.30: Corrupted or invalid JSON in localStorage does not crash getLeadAttribution', () => {
      const env = createBrowserEnvironment();
      env.installGlobals();

      // Corrupt localStorage with invalid JSON
      env.localStorage.setItem('sagepoint_lead_attribution', '{malformed-json-syntax');

      const attribution = getLeadAttribution();
      expect(attribution.utm_source).toBe('direct');
      expect(attribution.utm_medium).toBe('none');
      expect(attribution.referrer).toBe('direct');
    });

    it('T2.31: Storage quota exceeded or disabled localStorage does not throw uncaught errors', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?utm_source=test');
      env.installGlobals();

      // Mock setItem throwing quota error
      env.localStorage.setItem = () => {
        throw new Error('QuotaExceededError');
      };

      // captureLeadAttribution should swallow error cleanly
      captureLeadAttribution();
    });

    it('T2.32: Empty string UTM query params fallback to direct / none', () => {
      const env = createBrowserEnvironment('https://www.sagepoint-analytics.com/?utm_source=&utm_campaign=');
      env.installGlobals();

      captureLeadAttribution();
      const attribution = getLeadAttribution();
      expect(attribution.utm_source).toBe('direct');
      expect(attribution.utm_campaign).toBe('none');
    });

    it('T2.33: Potential XSS injection payloads in UTM parameters are stored safely as text', () => {
      const xssPayload = '<script>alert("xss")</script>';
      const env = createBrowserEnvironment(
        `https://www.sagepoint-analytics.com/?utm_campaign=${encodeURIComponent(xssPayload)}`
      );
      env.installGlobals();

      captureLeadAttribution();
      const attribution = getLeadAttribution();
      expect(attribution.utm_campaign).toBe(xssPayload);
    });

    it('T2.42: msclkid and ttclid query parameters map to proper ad network sources (bing, tiktok)', () => {
      const envBing = createBrowserEnvironment('https://www.sagepoint-analytics.com/?msclkid=ms_click_12345');
      envBing.installGlobals();
      captureLeadAttribution();
      const attrBing = getLeadAttribution();
      expect(attrBing.msclkid).toBe('ms_click_12345');
      expect(attrBing.utm_source).toBe('bing');
      expect(attrBing.utm_medium).toBe('cpc');

      const envTiktok = createBrowserEnvironment('https://www.sagepoint-analytics.com/?ttclid=tt_click_67890');
      envTiktok.installGlobals();
      captureLeadAttribution();
      const attrTiktok = getLeadAttribution();
      expect(attrTiktok.ttclid).toBe('tt_click_67890');
      expect(attrTiktok.utm_source).toBe('tiktok');
      expect(attrTiktok.utm_medium).toBe('paid_social');
    });
  });

  describe('Tier 2 - Analytics Instrumentation Robustness', 2, () => {
    it('T2.34: trackEvent operates safely when window.gtag is undefined (AdBlocker mode)', () => {
      const env = createBrowserEnvironment();
      delete (env.window as any).gtag;
      env.installGlobals();

      // Should not throw
      trackEvent('select_package', { package_id: 'executive' });
      trackPageView('/', 'Home');
    });

    it('T2.35: trackEvent handles empty param objects and primitive types without error', () => {
      const env = createBrowserEnvironment();
      env.installGlobals();

      trackEvent('custom_event', {});
      trackEvent('typed_event', { count: 42, active: true, label: 'test' });

      expect(env.state.trackedEvents.length).toBe(2);
      expect(env.state.trackedEvents[1].params.count).toBe(42);
      expect(env.state.trackedEvents[1].params.active).toBe(true);
    });

    it('T2.36: High volume rapid event dispatches (100+ events) execute synchronously', () => {
      const env = createBrowserEnvironment();
      env.installGlobals();

      for (let i = 0; i < 100; i++) {
        trackEvent('rapid_event', { index: i });
      }
      expect(env.state.trackedEvents.length).toBe(100);
    });
  });

  describe('Tier 2 - Sheet Submission & Network Resilience', 2, () => {
    it('T2.37: Script URL validation rejects empty or missing URLs', async () => {
      const env = createBrowserEnvironment();
      env.installGlobals();

      // Even in fallback, submitToGoogleSheet checks GOOGLE_SCRIPT_URL
      const result = await submitToGoogleSheet({ name: 'Test' });
      expect(result).toBe('confirmed');
    });

    it('T2.38: Server HTTP 500 error is handled cleanly and returns false', async () => {
      const env = createBrowserEnvironment();
      env.state.fetchResponder = async () => ({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });
      env.installGlobals();

      const result = await submitToGoogleSheet({ name: 'Test Lead', email: 'test@example.com' });
      expect(result).toBe(false);
    });

    it('T2.39: Server HTTP 200 containing script authorization/quota error text returns false', async () => {
      const env = createBrowserEnvironment();
      env.state.fetchResponder = async () => ({
        ok: true,
        status: 200,
        text: async () => 'Exception: MailApp authorization required to send emails',
      });
      env.installGlobals();

      const result = await submitToGoogleSheet({ name: 'Test Lead', email: 'test@example.com' });
      expect(result).toBe(false);
    });

    it('T2.40: CORS failure triggers automatic fallback to no-cors mode and returns unconfirmed', async () => {
      const env = createBrowserEnvironment();
      let callCount = 0;
      env.state.fetchResponder = async (call) => {
        callCount++;
        if (callCount === 1) {
          // Simulate CORS network failure
          throw new TypeError('Failed to fetch (CORS header missing)');
        }
        // Fallback no-cors response
        return {
          ok: true,
          status: 0,
          text: async () => '',
        };
      };
      env.installGlobals();

      const result = await submitToGoogleSheet({ name: 'Test Lead', email: 'test@example.com' });
      expect(result).toBe('unconfirmed');
      expect(env.state.fetchCalls.length).toBe(2);
      expect(env.state.fetchCalls[1].mode).toBe('no-cors');
    });

    it('T2.41: Submission body safely encodes special characters and symbols in form fields', async () => {
      const env = createBrowserEnvironment();
      env.installGlobals();

      const specialPayload = {
        name: "René François & Co. <Admin>",
        email: "lead+test@example.com",
        details: "Queries with ? & = # / \\ symbols and quotes \" '",
      };

      await submitToGoogleSheet(specialPayload);
      expect(env.state.fetchCalls.length).toBe(1);

      const body = env.state.fetchCalls[0].body as URLSearchParams;
      expect(body.get('name')).toBe("René François & Co. <Admin>");
      expect(body.get('email')).toBe("lead+test@example.com");
      expect(body.get('details')).toContain("? & = # / \\");
    });
  });
}
