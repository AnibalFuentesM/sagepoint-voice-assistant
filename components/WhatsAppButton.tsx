import React from 'react';
import { trackEvent } from '../utils/analytics';

const PHONE = '50240464716';

const MESSAGES = {
  es: 'Hola, me interesa conocer más sobre los servicios de Sagepoint Analytics.',
  en: 'Hi, I would like to learn more about Sagepoint Analytics services.'
};

const LABELS = {
  es: 'Escríbenos por WhatsApp',
  en: 'Chat with us on WhatsApp'
};

export default function WhatsAppButton({ lang }: { lang: 'es' | 'en' }) {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGES[lang])}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={LABELS[lang]}
      title={LABELS[lang]}
      onClick={() => trackEvent('whatsapp_click', { language: lang })}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:scale-110 hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] transition-all duration-200"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.59-1.73a12.74 12.74 0 0 0 6.21 1.58h.01c7.06 0 12.79-5.74 12.79-12.8 0-3.42-1.33-6.63-3.75-9.05a12.72 12.72 0 0 0-9.05-3.6zm0 23.36h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.91 1.03 1.04-3.81-.25-.39a10.55 10.55 0 0 1-1.62-5.68c0-5.87 4.78-10.65 10.66-10.65 2.84 0 5.51 1.11 7.52 3.12a10.58 10.58 0 0 1 3.11 7.53c0 5.88-4.78 10.66-10.65 10.66zm5.84-7.98c-.32-.16-1.89-.93-2.19-1.04-.29-.11-.51-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.44 5.45 4.82.76.33 1.36.53 1.82.67.77.24 1.46.21 2.01.13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z" />
      </svg>
    </a>
  );
}
