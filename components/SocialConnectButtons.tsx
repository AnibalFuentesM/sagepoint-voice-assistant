import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type AppLanguage = 'es' | 'en';

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type SocialConnectButtonsProps = {
  lang: AppLanguage;
};

type SocialButtonConfig = {
  id: 'facebook' | 'instagram' | 'linkedin';
  key?: React.Key;
  href: string;
  label: string;
  title: string;
  border: string;
  glow: string;
  ripple: string;
  hoverGlow: string;
  icon: React.ReactNode;
};

const copy = {
  es: {
    groupLabel: 'Botones de redes sociales',
    buttons: {
      facebook: 'Visítanos en Facebook',
      instagram: 'Síguenos en Instagram',
      linkedin: 'Conéctate en LinkedIn',
    },
  },
  en: {
    groupLabel: 'Social network buttons',
    buttons: {
      facebook: 'Visit us on Facebook',
      instagram: 'Follow us on Instagram',
      linkedin: 'Connect on LinkedIn',
    },
  },
} as const;

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="social-connect-icon h-[18px] w-[18px] fill-current">
      <path d="M13.47 20v-6.85h2.3l.35-2.68h-2.65V8.75c0-.77.21-1.31 1.32-1.31H16V5.05c-.56-.08-1.24-.13-2.07-.13-2.05 0-3.45 1.25-3.45 3.55v1.99H8.2v2.68h2.28V20h2.99Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="social-connect-icon h-[18px] w-[18px] stroke-current" fill="none" strokeWidth="1.75">
      <rect x="5" y="5" width="14" height="14" rx="4" />
      <circle cx="12" cy="12" r="3.1" />
      <circle cx="16.35" cy="7.7" r="0.95" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="social-connect-icon h-[18px] w-[18px] fill-current">
      <circle cx="6.15" cy="6.4" r="1.35" />
      <path d="M5 9.15h2.3V19H5V9.15Zm4.3 0h2.2v1.38c.49-.86 1.43-1.63 2.95-1.63 2.69 0 4.05 1.7 4.05 4.7V19h-2.36v-4.77c0-1.61-.63-2.42-1.96-2.42-1.47 0-2.52.98-2.52 2.98V19H9.3V9.15Z" />
    </svg>
  );
}

function SocialConnectButton({ href, label, title, border, glow, ripple, hoverGlow, icon }: SocialButtonConfig) {
  const shouldReduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const rippleId = useRef(0);

  const createRipple = (el: HTMLAnchorElement, clientPoint?: { x: number; y: number }) => {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.15;
    const nextRipple: Ripple = {
      id: rippleId.current++,
      x: clientPoint ? clientPoint.x - rect.left : rect.width / 2,
      y: clientPoint ? clientPoint.y - rect.top : rect.height / 2,
      size,
    };
    setRipples((current) => [...current, nextRipple]);
  };

  const removeRipple = (id: number) => {
    setRipples((current) => current.filter((r) => r.id !== id));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    createRipple(event.currentTarget, { x: event.clientX, y: event.clientY });
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={title}
      onPointerDown={handlePointerDown}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.93, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 380, damping: 20, mass: 0.5 }
      }
      className="social-connect-button relative flex h-11 w-11 items-center justify-center rounded-full text-slate-100/90 backdrop-blur-xl transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071012] cursor-pointer"
      style={
        {
          '--social-border': isHovered ? hoverGlow : border,
          '--social-glow': isHovered ? hoverGlow : glow,
          '--social-ripple': ripple,
        } as React.CSSProperties
      }
    >
      {/* Halo ring on hover */}
      <AnimatePresence>
        {isHovered && !shouldReduceMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1.18 }}
            exit={{ opacity: 0, scale: 1.0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              boxShadow: `0 0 16px 4px ${hoverGlow}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Ripple effect */}
      <AnimatePresence initial={false}>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            aria-hidden="true"
            className="social-connect-ripple"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0.5, scale: 0 }}
            animate={shouldReduceMotion ? { opacity: [0.18, 0] } : { opacity: [0.5, 0.18, 0], scale: 1 }}
            exit={{ opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.18, ease: 'linear' }
                : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
            }
            onAnimationComplete={() => removeRipple(r.id)}
          />
        ))}
      </AnimatePresence>

      {/* Icon with scale on hover */}
      <motion.span
        className="social-connect-icon relative z-[1]"
        animate={isHovered && !shouldReduceMotion ? { scale: 1.2 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        {icon}
      </motion.span>
    </motion.a>
  );
}

export default function SocialConnectButtons({ lang }: SocialConnectButtonsProps) {
  const localizedCopy = copy[lang];

  const buttons: SocialButtonConfig[] = [
    {
      id: 'facebook',
      href: 'https://www.facebook.com/profile.php?id=61582019309607',
      label: localizedCopy.buttons.facebook,
      title: localizedCopy.buttons.facebook,
      border: 'rgba(151, 175, 181, 0.24)',
      glow: 'rgba(110, 142, 150, 0.14)',
      ripple: 'rgba(187, 211, 216, 0.32)',
      hoverGlow: 'rgba(66, 103, 178, 0.55)',
      icon: <FacebookIcon />,
    },
    {
      id: 'instagram',
      href: 'https://www.instagram.com/anibalmarianofuentes/',
      label: localizedCopy.buttons.instagram,
      title: localizedCopy.buttons.instagram,
      border: 'rgba(190, 158, 124, 0.26)',
      glow: 'rgba(161, 128, 98, 0.15)',
      ripple: 'rgba(233, 194, 150, 0.3)',
      hoverGlow: 'rgba(214, 73, 100, 0.55)',
      icon: <InstagramIcon />,
    },
    {
      id: 'linkedin',
      href: 'https://www.linkedin.com/company/112223220/admin/dashboard/',
      label: localizedCopy.buttons.linkedin,
      title: localizedCopy.buttons.linkedin,
      border: 'rgba(128, 158, 168, 0.24)',
      glow: 'rgba(92, 123, 135, 0.14)',
      ripple: 'rgba(171, 200, 208, 0.28)',
      hoverGlow: 'rgba(10, 102, 194, 0.55)',
      icon: <LinkedInIcon />,
    },
  ];

  return (
    <div
      className="social-connect-row flex flex-wrap items-center gap-3 pt-1"
      role="group"
      aria-label={localizedCopy.groupLabel}
    >
      {buttons.map((button) => (
        <SocialConnectButton key={button.id} {...button} />
      ))}
    </div>
  );
}
