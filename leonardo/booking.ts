import type { LeoLanguage } from './leonardoEnglish';

/** Google Calendar booking page (info@), 45 min, Guatemala time. English CTAs only. */
export const BOOKING_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ12_rBDtC7Zkrj_dExafEF4yFR_XIu34aXCH7xNKVDS1a_DLc047qwmZqUIDCq6W20XmchLCpCG';

export function getEnglishBookingUrl(language: LeoLanguage, bookingUrl = BOOKING_URL) {
  const normalizedUrl = bookingUrl.trim();
  return language === 'en' && normalizedUrl ? normalizedUrl : null;
}

/** Company page on LinkedIn, linked from the founder card. */
export const FOUNDER_LINKEDIN = 'https://www.linkedin.com/company/112223220/';

/**
 * Founder photo. Leave empty to show the "AF" monogram. To use a real photo, save a square
 * image (min. 400×400) as public/assets/img/anibal.jpg and set this to '/assets/img/anibal.jpg'.
 */
export const FOUNDER_PHOTO = '/assets/img/anibal.jpg';
