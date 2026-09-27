import type { LeoLanguage } from './leonardoEnglish';

export const BOOKING_URL = '';

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
export const FOUNDER_PHOTO = '';
