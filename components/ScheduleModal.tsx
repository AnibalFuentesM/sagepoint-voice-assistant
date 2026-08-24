import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Video,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  CalendarCheck,
  User,
  Mail,
  Phone,
  Building,
  Check,
} from 'lucide-react';
import { trackEvent, getLeadAttribution } from '../utils/analytics';
import { submitToGoogleSheet } from '../utils/sheetUtils';

export type PackageId = 'quick-win' | 'executive' | 'custom' | 'retainer' | 'general';

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'es' | 'en';
  preselectedPackage?: PackageId;
  sourceSection?: string;
}

export const scheduleModalContent = {
  es: {
    title: "Agendar Llamada de Diagnóstico Gratuito",
    subtitle: "30–45 minutos por videollamada con un Senior BI Architect para auditar tus datos y diseñar tu hoja de ruta.",
    close: "Cerrar ventana de agendamiento",
    step1_title: "1. Selecciona Fecha y Hora",
    step2_title: "2. Datos de Contacto y Contexto",
    step3_title: "¡Diagnóstico Agendado con Éxito!",
    duration_badge: "30–45 min · Videollamada Google Meet",
    host_badge: "Senior BI Architect · Sagepoint",
    free_badge: "100% Gratuito y Sin Compromiso",
    timezone_label: "Zona horaria:",
    timezone_options: {
      cst: "Guatemala / Centroamérica (CST, UTC-6)",
      est: "EE. UU. Este / Miami / NY (EST, UTC-5)",
      pst: "EE. UU. Pacífico / LA (PST, UTC-8)",
    },
    select_date: "Selecciona un día hábil:",
    select_time: "Horarios disponibles:",
    package_label: "Paquete o servicio de interés:",
    packages: {
      general: "Diagnóstico inicial / Exploración general",
      'quick-win': "Diagnóstico Express + Dashboard Quick-Win ($750)",
      executive: "Dashboard Ejecutivo + Automatización (desde $2,500)",
      custom: "Solución a Medida (Modelos IA / Integraciones)",
      retainer: "Soporte Cercano Mensual ($300 / $600 / $1,000)",
    },
    fields: {
      name: "Nombre completo",
      name_ph: "Ej. Roberto García",
      email: "Correo electrónico corporativo",
      email_ph: "roberto@tuempresa.com",
      phone: "WhatsApp / Teléfono",
      phone_ph: "+502 5555 1234",
      company: "Empresa / Industria",
      company_ph: "Ej. Distribuidora del Sur · Retail",
      notes: "¿Cuál es tu principal reto con los datos o reportes actuales?",
      notes_ph: "Ej. Reportes en Excel tardan 15 horas a la semana y no tenemos visibilidad en vivo de márgenes por sucursal...",
    },
    errors: {
      name: "Por favor ingresa tu nombre (mínimo 2 caracteres)",
      email: "Por favor ingresa un correo electrónico válido",
      date: "Por favor selecciona una fecha",
      time: "Por favor selecciona un horario",
    },
    buttons: {
      next: "Continuar a datos de contacto",
      back: "Volver a horarios",
      confirm: "Confirmar Agendamiento Gratuito",
      confirming: "Confirmando tu cita...",
      add_gcal: "Añadir a Google Calendar",
      confirm_wa: "Confirmar por WhatsApp",
      close_done: "Entendido y Cerrar",
    },
    success: {
      heading: "Tu diagnóstico está confirmado",
      body: "Te enviamos la invitación de Google Meet y los detalles de conexión a tu correo electrónico.",
      date_label: "Fecha y hora reservada:",
      prep_title: "¿Qué revisaremos en la videollamada?",
      prep_items: [
        "Auditoría rápida de tus fuentes de datos actuales (Excel, ERP, CRM, SQL)",
        "Demostración de dashboards interactivos aplicados a tu industria",
        "Estimación exacta de retorno de inversión (ROI) y tiempos de entrega",
      ],
    },
    guarantee_text: "Tu información está protegida bajo estricto protocolo de confidencialidad (NDA).",
  },
  en: {
    title: "Book Free Diagnostic Call",
    subtitle: "30–45 minute video call with a Senior BI Architect to audit your data flows and plan your roadmap.",
    close: "Close scheduling dialog",
    step1_title: "1. Select Date & Time",
    step2_title: "2. Contact & Company Details",
    step3_title: "Diagnostic Call Confirmed!",
    duration_badge: "30–45 min · Google Meet Video Call",
    host_badge: "Senior BI Architect · Sagepoint",
    free_badge: "100% Free · No Commitment Required",
    timezone_label: "Timezone:",
    timezone_options: {
      cst: "Guatemala / Central America (CST, UTC-6)",
      est: "US Eastern / Miami / NY (EST, UTC-5)",
      pst: "US Pacific / LA (PST, UTC-8)",
    },
    select_date: "Select a business day:",
    select_time: "Available slots:",
    package_label: "Package or service of interest:",
    packages: {
      general: "Initial Assessment / General Consultation",
      'quick-win': "Express Assessment + Quick-Win Dashboard ($750)",
      executive: "Executive Dashboard + Automation (from $2,500)",
      custom: "Custom Solution (AI Models / Integrations)",
      retainer: "Soporte Cercano Monthly ($300 / $600 / $1,000)",
    },
    fields: {
      name: "Full Name",
      name_ph: "e.g. David Sterling",
      email: "Business Email",
      email_ph: "david@yourcompany.com",
      phone: "WhatsApp / Phone Number",
      phone_ph: "+1 312 555 0188",
      company: "Company / Industry",
      company_ph: "e.g. Sterling Logistics · Supply Chain",
      notes: "What is your main operational reporting challenge?",
      notes_ph: "e.g. Manual spreadsheets take 15 hrs/week and we lack real-time visibility into branch profit margins...",
    },
    errors: {
      name: "Please enter your full name (at least 2 characters)",
      email: "Please enter a valid business email address",
      date: "Please select an available date",
      time: "Please select a time slot",
    },
    buttons: {
      next: "Continue to contact details",
      back: "Back to time slots",
      confirm: "Confirm Free Assessment",
      confirming: "Confirming your booking...",
      add_gcal: "Add to Google Calendar",
      confirm_wa: "Confirm via WhatsApp",
      close_done: "Done & Close",
    },
    success: {
      heading: "Your Diagnostic Call is Confirmed",
      body: "We sent the Google Meet invitation and calendar link to your email address.",
      date_label: "Reserved date & time:",
      prep_title: "What will we cover in the video call?",
      prep_items: [
        "Rapid audit of your current data sources (Excel, ERP, CRM, SQL)",
        "Live demonstration of interactive dashboards tailored to your industry",
        "Exact ROI estimate, deliverables roadmap, and timeline commitments",
      ],
    },
    guarantee_text: "Your information is protected under strict bilateral confidentiality (NDA).",
  },
};

// Generate realistic next business days
function getAvailableDates(lang: 'es' | 'en') {
  const dates: { dateStr: string; label: string; dayName: string; dayNumber: string; monthName: string }[] = [];
  const now = new Date();
  let added = 0;
  let offset = 1;

  const dayNamesEs = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNamesEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  while (added < 7) {
    const d = new Date(now.getTime() + offset * 86400000);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Saturday and Sunday
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayName = lang === 'es' ? dayNamesEs[dayOfWeek] : dayNamesEn[dayOfWeek];
      const monthName = lang === 'es' ? monthNamesEs[d.getMonth()] : monthNamesEn[d.getMonth()];
      const dayNumber = String(d.getDate());
      const label = `${dayName} ${dayNumber} ${monthName}`;

      dates.push({ dateStr, label, dayName, dayNumber, monthName });
      added++;
    }
    offset++;
  }

  return dates;
}

const AVAILABLE_TIMES = [
  '09:00 AM',
  '10:30 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  lang,
  preselectedPackage = 'general',
  sourceSection = 'direct_scheduling',
}) => {
  const t = scheduleModalContent[lang];
  const modalRef = useRef<HTMLDivElement>(null);
  const dates = getAvailableDates(lang);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]?.dateStr || '');
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>(dates[0]?.label || '');
  const [selectedTime, setSelectedTime] = useState<string>(AVAILABLE_TIMES[1] || '10:30 AM');
  const [timezone, setTimezone] = useState<'cst' | 'est' | 'pst'>('cst');

  const [packageChoice, setPackageChoice] = useState<PackageId>(preselectedPackage);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync preselected package if prop updates
  useEffect(() => {
    if (preselectedPackage) {
      setPackageChoice(preselectedPackage);
    }
  }, [preselectedPackage]);

  // Handle escape key and focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus modal
    setTimeout(() => {
      modalRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateStep2 = () => {
    const errors: { name?: string; email?: string } = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = t.errors.name;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errors.email = t.errors.email;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDateSelect = (dateStr: string, label: string) => {
    setSelectedDate(dateStr);
    setSelectedDateLabel(label);
  };

  const handleNextStep = () => {
    if (!selectedDate) return;
    if (!selectedTime) return;
    setStep(2);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);

    const attribution = getLeadAttribution();
    const serviceTitle = t.packages[packageChoice];
    const tzLabel = t.timezone_options[timezone];

    const submissionData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || 'No especificado',
      company: formData.company.trim() || 'No especificado',
      industry: formData.company.trim() || 'No especificado',
      service: `[CALENDARIO] ${packageChoice} | ${serviceTitle} | Cita: ${selectedDateLabel} @ ${selectedTime} (${tzLabel})`,
      packageId: packageChoice,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      timezone: tzLabel,
      details: formData.notes.trim() || 'Sin notas adicionales',
      type: 'Diagnóstico Agendado en Calendario',
      language: lang === 'es' ? 'Español' : 'English',
      ...attribution,
    };

    // Track GA4 events
    trackEvent('schedule_call', {
      source_section: sourceSection,
      package_id: packageChoice,
      method: 'direct_calendar',
      language: lang,
      scheduled_date: selectedDate,
      scheduled_time: selectedTime,
    });

    try {
      const res = await submitToGoogleSheet(submissionData);
      if (res === 'confirmed' || res === 'unconfirmed') {
        trackEvent('generate_lead', {
          package_id: packageChoice,
          language: lang,
          source: attribution.utm_source,
          method: 'schedule_modal',
        });
      }
    } catch {
      // Sheet error shouldn't block local success confirmation
    } finally {
      setIsSubmitting(false);
      setStep(3);
    }
  };

  // Google Calendar URL generator
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(
      lang === 'es'
        ? 'Diagnóstico Estratégico BI & Datos · Sagepoint Analytics'
        : 'Strategic BI & Data Diagnostic · Sagepoint Analytics'
    );
    const details = encodeURIComponent(
      lang === 'es'
        ? `Llamada de diagnóstico 1-a-1 con Senior BI Architect de Sagepoint Analytics.\nPaquete: ${t.packages[packageChoice]}\nEnlace Google Meet disponible en tu invitación.`
        : `1-on-1 diagnostic call with a Senior BI Architect at Sagepoint Analytics.\nPackage: ${t.packages[packageChoice]}\nGoogle Meet link in your invitation.`
    );
    const location = encodeURIComponent('Google Meet Video Call');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // WhatsApp confirmation URL
  const createWhatsAppConfirmationUrl = () => {
    const msg =
      lang === 'es'
        ? `Hola Sagepoint, acabo de agendar mi diagnóstico gratuito para el ${selectedDateLabel} a las ${selectedTime} (${t.timezone_options[timezone]}). Mi nombre es ${formData.name}.`
        : `Hi Sagepoint, I just booked my free diagnostic call for ${selectedDateLabel} at ${selectedTime} (${t.timezone_options[timezone]}). My name is ${formData.name}.`;
    return `https://wa.me/50240464716?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
      aria-describedby="schedule-modal-desc"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-[#091512] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto outline-none"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage/10 border border-sage/30 flex items-center justify-center text-sage">
              <Calendar size={20} />
            </div>
            <div>
              <h2 id="schedule-modal-title" className="font-serif text-xl sm:text-2xl text-ink leading-tight">
                {step === 3 ? t.step3_title : t.title}
              </h2>
              <p id="schedule-modal-desc" className="text-xs text-muted">
                {t.duration_badge} · {t.free_badge}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="p-2 rounded-full text-slate-400 hover:text-ink hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Date & Time Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-ink">{t.select_date}</span>
                <div className="flex items-center gap-2">
                  <label htmlFor="schedule-tz" className="text-muted">{t.timezone_label}</label>
                  <select
                    id="schedule-tz"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value as any)}
                    className="bg-surface border border-white/15 rounded-lg px-2.5 py-1 text-xs text-ink focus:border-sage focus:outline-none"
                  >
                    <option value="cst">{t.timezone_options.cst}</option>
                    <option value="est">{t.timezone_options.est}</option>
                    <option value="pst">{t.timezone_options.pst}</option>
                  </select>
                </div>
              </div>

              {/* Date Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {dates.map((d) => {
                  const isSelected = selectedDate === d.dateStr;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => handleDateSelect(d.dateStr, d.label)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-sage/20 border-sage text-sage font-bold shadow-md shadow-sage/10 scale-[1.02]'
                          : 'bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="block text-[0.7rem] uppercase tracking-wider text-muted mb-0.5">
                        {d.dayName}
                      </span>
                      <span className="block text-xl font-mono font-bold leading-none mb-1">
                        {d.dayNumber}
                      </span>
                      <span className="block text-[0.72rem] text-muted">
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div>
                <span className="block text-xs font-semibold text-ink mb-3">{t.select_time}</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {AVAILABLE_TIMES.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-sage text-dark font-bold border-sage shadow-md shadow-sage/20'
                            : 'bg-surface border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <Clock size={12} />
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 1 Footer CTA */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div className="text-xs text-muted flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-sage" />
                  <span>{t.host_badge}</span>
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="button button--primary px-6!"
                >
                  {t.buttons.next}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Lead Context Form */}
          {step === 2 && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Selected Slot Summary Chip */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-sage/10 border border-sage/25 text-xs text-sage">
                <div className="flex items-center gap-2">
                  <CalendarCheck size={16} />
                  <span>
                    <strong>{selectedDateLabel}</strong> @ <strong>{selectedTime}</strong> ({t.timezone_options[timezone]})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-ink hover:underline font-semibold"
                >
                  {lang === 'es' ? 'Cambiar horario' : 'Change time'}
                </button>
              </div>

              {/* Inputs */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-name" className="block text-xs font-medium text-muted mb-1.5">
                    {t.fields.name} *
                  </label>
                  <div className="relative">
                    <input
                      id="modal-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                      }}
                      className={`form-control text-sm ${fieldErrors.name ? 'border-red-400 focus:border-red-400' : ''}`}
                      placeholder={t.fields.name_ph}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? 'modal-name-error' : undefined}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p id="modal-name-error" className="text-xs text-red-400 mt-1" role="alert">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="modal-email" className="block text-xs font-medium text-muted mb-1.5">
                    {t.fields.email} *
                  </label>
                  <div className="relative">
                    <input
                      id="modal-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                      }}
                      className={`form-control text-sm ${fieldErrors.email ? 'border-red-400 focus:border-red-400' : ''}`}
                      placeholder={t.fields.email_ph}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? 'modal-email-error' : undefined}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p id="modal-email-error" className="text-xs text-red-400 mt-1" role="alert">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-phone" className="block text-xs font-medium text-muted mb-1.5">
                    {t.fields.phone}
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-control text-sm"
                    placeholder={t.fields.phone_ph}
                  />
                </div>
                <div>
                  <label htmlFor="modal-company" className="block text-xs font-medium text-muted mb-1.5">
                    {t.fields.company}
                  </label>
                  <input
                    id="modal-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="form-control text-sm"
                    placeholder={t.fields.company_ph}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-package" className="block text-xs font-medium text-muted mb-1.5">
                  {t.package_label}
                </label>
                <select
                  id="modal-package"
                  value={packageChoice}
                  onChange={(e) => setPackageChoice(e.target.value as PackageId)}
                  className="form-control text-sm"
                >
                  <option value="general">{t.packages.general}</option>
                  <option value="quick-win">{t.packages['quick-win']}</option>
                  <option value="executive">{t.packages.executive}</option>
                  <option value="custom">{t.packages.custom}</option>
                  <option value="retainer">{t.packages.retainer}</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-notes" className="block text-xs font-medium text-muted mb-1.5">
                  {t.fields.notes}
                </label>
                <textarea
                  id="modal-notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-control text-sm resize-none"
                  placeholder={t.fields.notes_ph}
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="button button--secondary px-4! text-xs"
                >
                  <ArrowLeft size={15} />
                  {t.buttons.back}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button button--primary px-6!"
                >
                  {isSubmitting ? t.buttons.confirming : t.buttons.confirm}
                  <Check size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && (
            <div className="text-center space-y-6 animate-[floatIn_0.3s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-sage/20 border-2 border-sage mx-auto flex items-center justify-center text-sage">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink mb-2">
                  {t.success.heading}
                </h3>
                <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                  {t.success.body}
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-surface border border-white/10 text-left max-w-md mx-auto space-y-3">
                <div className="text-xs text-muted">{t.success.date_label}</div>
                <div className="text-base font-serif font-bold text-ink flex items-center gap-2">
                  <Calendar size={18} className="text-sage" />
                  {selectedDateLabel} @ {selectedTime}
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Video size={14} className="text-sage" />
                  <span>
                    Google Meet Video Link ({lang === 'es' ? `enviado a ${formData.email || 'tu correo'}` : `sent to ${formData.email || 'your email'}`})
                  </span>
                </div>
              </div>

              {/* Agenda / What to expect */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left max-w-md mx-auto">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2.5">
                  {t.success.prep_title}
                </h4>
                <ul className="space-y-2 text-xs text-muted">
                  {t.success.prep_items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={13} className="text-sage mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={createGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button--secondary w-full sm:w-auto justify-center"
                >
                  <Calendar size={16} />
                  {t.buttons.add_gcal}
                </a>

                <a
                  href={createWhatsAppConfirmationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { language: lang, placement: 'schedule_modal_success' })}
                  className="button button--whatsapp w-full sm:w-auto justify-center"
                >
                  <MessageCircle size={16} />
                  {t.buttons.confirm_wa}
                </a>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-muted hover:text-sage transition-colors underline"
                >
                  {t.buttons.close_done}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
