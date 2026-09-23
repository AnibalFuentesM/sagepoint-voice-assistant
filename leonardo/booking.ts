import type { LeoLanguage } from './leonardoEnglish';

export const BOOKING_URL = '';

export function getEnglishBookingUrl(language: LeoLanguage, bookingUrl = BOOKING_URL) {
  const normalizedUrl = bookingUrl.trim();
  return language === 'en' && normalizedUrl ? normalizedUrl : null;
}
