import React, { useEffect, useRef, useState } from 'react';
import { getLeadAttribution, trackEvent } from '../utils/analytics';
import { submitToGoogleSheet } from '../utils/sheetUtils';
import './leonardoForm.css';
import { translateLeo, type LeoLanguage } from './leonardoEnglish';

/**
 * Package ids are the ones the Google Sheet already keys on, so they must not change.
 * The labels are the Leonardo names, which is what the visitor actually read on the page.
 */
export const BOOKING_PACKAGES: { id: string; label: string }[] = [
  { id: 'general', label: 'Diagnóstico gratuito / consultoría general' },
  { id: 'quick-win', label: 'Radiografía de Datos ($750)' },
  { id: 'executive', label: 'Cockpit Ejecutivo (desde $2,500)' },
  { id: 'custom', label: 'Sala de Control (desde $12,000)' },
  { id: 'retainer', label: 'Soporte Cercano ($300+ / mes)' },
];

const COUNTRIES: { id: string; label: string }[] = [
  { id: 'gt', label: 'Guatemala' },
  { id: 'sv', label: 'El Salvador' },
  { id: 'hn', label: 'Honduras' },
  { id: 'ni', label: 'Nicaragua' },
  { id: 'cr', label: 'Costa Rica' },
  { id: 'pa', label: 'Panamá' },
  { id: 'mx', label: 'México' },
  { id: 'us', label: 'Estados Unidos' },
  { id: 'other', label: 'Otro' },
];

const WA = 'https://wa.me/50240464716';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Props = {
  lang: LeoLanguage;
  open: boolean;
  packageId: string;
  /** Where the visitor clicked from, so the funnel can be read in GA4. */
  source: string;
  onClose: () => void;
};

export default function BookingModal({ lang, open, packageId, source, onClose }: Props) {
  const t = (text: string) => translateLeo(lang, text);
  const submitting = useRef(false);
  const ref = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'pending' | 'error'>('idle');
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    service: packageId,
    details: '',
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});

  // Native <dialog> gives us the focus trap, the Escape key and the backdrop for free.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    if (open) setValues((v) => ({ ...v, service: packageId }));
  }, [open, packageId]);

  const handleClose = () => {
    // A sent lead should not come back half-filled if the visitor reopens the form.
    if (state === 'success') {
      setState('idle');
      setValues({ name: '', email: '', phone: '', country: '', service: packageId, details: '' });
      setErrors({});
      setTouched({});
    }
    onClose();
  };

  // Escape and the backdrop close the dialog by themselves; mirror that back into React state.
  // A native listener rather than onClose, because the dialog `close` event does not bubble and
  // React never sees it — which used to leave the page scroll-locked behind a closed dialog.
  const closeRef = useRef(handleClose);
  closeRef.current = handleClose;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => closeRef.current();
    // `cancel` is what Escape fires, and it is cancelable: swallow the browser's own close and
    // route it through React instead, so `open` and the dialog can never disagree.
    const onCancel = (e: Event) => {
      e.preventDefault();
      closeRef.current();
    };
    el.addEventListener('cancel', onCancel);
    el.addEventListener('close', sync);
    return () => {
      el.removeEventListener('cancel', onCancel);
      el.removeEventListener('close', sync);
    };
  }, []);

  // Lock the page behind the dialog. Tied to `open` with cleanup, so it cannot get stuck on.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('leo-modal-open');
    return () => document.body.classList.remove('leo-modal-open');
  }, [open]);

  const validate = (field: 'name' | 'email', value: string) => {
    let msg: string | undefined;
    if (field === 'name' && value.trim().length < 2) msg = 'Necesitamos tu nombre.';
    if (field === 'email' && !EMAIL_RE.test(value.trim())) msg = 'Revisa el correo.';
    setErrors((e) => ({ ...e, [field]: msg }));
    return !msg;
  };

  const set = (field: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if ((field === 'name' || field === 'email') && touched[field]) validate(field, value);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting.current) return;
    const name = values.name.trim();
    const email = values.email.trim();
    const okName = validate('name', name);
    const okEmail = validate('email', email);
    setTouched({ name: true, email: true });
    if (!okName || !okEmail) {
      e.currentTarget.querySelector<HTMLInputElement>(`[name="${!okName ? 'name' : 'email'}"]`)?.focus();
      return;
    }

    submitting.current = true;
    setState('sending');

    const pkg = values.service || 'general';
    const label = BOOKING_PACKAGES.find((p) => p.id === pkg)?.label ?? pkg;
    let service = `${pkg} | ${label}`;
    if (values.details.trim()) {
      service += ` | Detalles: ${values.details.trim()}`;
    }

    const attribution = getLeadAttribution();
    // Same keys and same fallbacks as the previous form: the Sheet columns must not shift.
    const data = {
      name,
      email,
      phone: values.phone.trim() || 'No especificado',
      industry: 'No especificado',
      country: COUNTRIES.find((c) => c.id === values.country)?.label || 'No especificado',
      service,
      details: values.details.trim(),
      packageId: pkg,
      language: lang === 'en' ? 'English' : 'Español',
      type: 'Formulario Web',
      ...attribution,
    };

    trackEvent('lead_submit_attempt', {
      package_id: pkg,
      form_location: 'booking_modal',
      source_section: source,
      language: lang,
      campaign: attribution.utm_campaign,
      source: attribution.utm_source,
    });

    const result = await submitToGoogleSheet(data);
    submitting.current = false;

    if (!result) {
      trackEvent('lead_submit_failed', { package_id: pkg, form_location: 'booking_modal', language: lang });
      setState('error');
      return;
    }
    // Only a confirmed server response counts as a conversion; the no-cors fallback
    // cannot verify the row was actually written.
    if (result === 'confirmed') {
      trackEvent('generate_lead', {
        package_id: pkg,
        lead_id: `lead_${Date.now()}`,
        language: lang,
        campaign: attribution.utm_campaign,
        source: attribution.utm_source,
      });
    } else {
      trackEvent('lead_delivery_unconfirmed', {
        package_id: pkg,
        form_location: 'booking_modal',
        language: lang,
        delivery: 'unconfirmed',
      });
    }
    setState(result === 'confirmed' ? 'success' : 'pending');
  };

  const sending = state === 'sending';

  return (
    <dialog className="bk" ref={ref} aria-labelledby="bk-title">
      <button className="bk-x" type="button" onClick={handleClose} aria-label={t("Cerrar")}>
        ✕
      </button>

      {state === 'success' || state === 'pending' ? (
        <div className="bk-done" role="status">
          <p className="bk-eyebrow">{t(state === 'pending' ? 'Recepción no confirmada' : 'Solicitud recibida')}</p>
          <h2 id="bk-title" className="bk-title">
            {t(state === 'pending' ? 'No pudimos confirmar la recepción.' : 'Listo. Te escribimos en menos de 24 horas.')}
          </h2>
          <p className="bk-lede">
            {t(state === 'pending' ? 'Tu solicitud puede haber llegado. Para evitar duplicarla, no la reenviamos automáticamente. Escríbenos por WhatsApp para confirmar antes de intentar de nuevo.' : 'Revisamos lo que nos contaste y llegamos con una recomendación concreta. Si prefieres adelantar, escríbenos por WhatsApp y seguimos ahí.')}
          </p>
          <div className="bk-act">
            <a className="pill pill--fill" href={WA} onClick={() => trackEvent('whatsapp_click', { source_section: `booking_modal_${state}`, package_id: values.service, language: lang })}>
              {t("Escribir por WhatsApp")}
            </a>
            <button className="pill pill--ghost" type="button" onClick={handleClose}>
              {t("Cerrar")}
            </button>
          </div>
        </div>
      ) : (
        <form className="bk-form" onSubmit={submit} noValidate>
          <p className="bk-eyebrow">{t("Diagnóstico gratuito")}</p>
          <h2 id="bk-title" className="bk-title">
            {t("De 30 a 45 minutos, sin compromiso")}
          </h2>
          <p className="bk-lede">
            {t("Déjanos cómo contactarte y qué quieres resolver. NDA antes de tocar un archivo.")}
          </p>

          <div className="bk-grid">
            <label className="bk-f">
              <span>
                {t("Nombre")} <i>*</i>
              </span>
              <input
                name="name"
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                onBlur={(e) => {
                  setTouched((t) => ({ ...t, name: true }));
                  validate('name', e.target.value);
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'bk-name-error' : undefined}
                autoComplete="name"
                required
              />
              {errors.name ? <em id="bk-name-error" className="bk-err" role="alert">{t(errors.name)}</em> : null}
            </label>

            <label className="bk-f">
              <span>
                {t("Correo de trabajo")} <i>*</i>
              </span>
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                onBlur={(e) => {
                  setTouched((t) => ({ ...t, email: true }));
                  validate('email', e.target.value);
                }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'bk-email-error' : undefined}
                autoComplete="email"
                required
              />
              {errors.email ? <em id="bk-email-error" className="bk-err" role="alert">{t(errors.email)}</em> : null}
            </label>

            <label className="bk-f">
              <span>WhatsApp</span>
              <input
                name="phone"
                type="tel"
                value={values.phone}
                onChange={(e) => set('phone', e.target.value)}
                autoComplete="tel"
                placeholder="+502 5555 5555"
              />
            </label>

            <label className="bk-f">
              <span>{t("País")}</span>
              <select
                name="country"
                value={values.country}
                onChange={(e) => set('country', e.target.value)}
              >
                <option value="">{t("Selecciona")}</option>
                {COUNTRIES.map((c) => (
                  <option value={c.id} key={c.id}>
                    {t(c.label)}
                  </option>
                ))}
              </select>
            </label>

            <label className="bk-f bk-f--wide">
              <span>{t("Me interesa")}</span>
              <select
                name="service"
                value={values.service}
                onChange={(e) => set('service', e.target.value)}
              >
                {BOOKING_PACKAGES.map((p) => (
                  <option value={p.id} key={p.id}>
                    {t(p.label)}
                  </option>
                ))}
              </select>
            </label>

            <label className="bk-f bk-f--wide">
              <span>{t("Cuéntanos el contexto")}</span>
              <textarea
                name="details"
                rows={3}
                value={values.details}
                onChange={(e) => set('details', e.target.value)}
                placeholder={t("Qué fuentes tienes, qué reporte te está costando tiempo, qué te gustaría ver.")}
              />
            </label>
          </div>

          {state === 'error' ? (
            <p className="bk-fail" role="alert">
              {t("No se pudo enviar. Intenta de nuevo o escríbenos por")}{' '}
              <a href={WA} onClick={() => trackEvent('whatsapp_click', { source_section: `booking_modal_${state}`, package_id: values.service, language: lang })}>WhatsApp</a>.
            </p>
          ) : null}

          <div className="bk-act">
            <button className="pill pill--fill" type="submit" disabled={sending}>
              {t(sending ? 'Enviando…' : 'Solicitar mi diagnóstico')}
            </button>
            <a className="bk-alt" href={WA} onClick={() => trackEvent('whatsapp_click', { source_section: `booking_modal_${state}`, package_id: values.service, language: lang })}>
              {t("o escríbenos por WhatsApp")}
            </a>
          </div>
        </form>
      )}
    </dialog>
  );
}
