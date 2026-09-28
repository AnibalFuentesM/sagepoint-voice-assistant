import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import './mobileMenu.css';

interface MobileMenuProps {
  items: { href: string; label: string }[];
  cta: { label: string; onClick: () => void };
  lang?: 'es' | 'en';
}

export default function MobileMenu({ items, cta, lang = 'es' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const id = "mobile-menu-sheet";

  const t = {
    openMenu: lang === 'en' ? 'Open menu' : 'Abrir menú',
    closeMenu: lang === 'en' ? 'Close menu' : 'Cerrar menú',
    mainMenu: lang === 'en' ? 'Main menu' : 'Menú principal',
  };

  const close = () => {
    setIsOpen(false);
    btnRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (window.innerWidth > 1100) close();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalStyle; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !sheetRef.current) return;
    const focusable = Array.from(
      sheetRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (first) {
      requestAnimationFrame(() => first.focus());
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first?.focus();
          e.preventDefault();
        }
      }
    };
    
    const sheet = sheetRef.current;
    sheet.addEventListener('keydown', handleTab);
    return () => sheet.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const menuContent = isOpen ? (
    <div className="leo">
      <div className="leo-mobile-menu" id={id} ref={sheetRef} role="dialog" aria-modal="true" aria-label={t.mainMenu}>
        <div className="mm-sheet">
          <button className="mm-close" onClick={close} aria-label={t.closeMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <nav className="mm-nav">
            {items.map((item, i) => {
              const isRouterLink = item.href.startsWith('/');
              const num = String(i + 1).padStart(2, '0');
              const style = { '--i': i } as React.CSSProperties;
              
              const linkContent = (
                <>
                  <span className="mm-num">{num}</span>
                  {item.label}
                </>
              );

              return isRouterLink ? (
                <Link key={item.href} to={item.href} onClick={close} className="mm-link" style={style}>
                  {linkContent}
                </Link>
              ) : (
                <a key={item.href} href={item.href} onClick={close} className="mm-link" style={style}>
                  {linkContent}
                </a>
              );
            })}
          </nav>
          <div className="mm-act">
            <button className="pill pill--fill" onClick={() => { close(); cta.onClick(); }}>
              {cta.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        ref={btnRef}
        className="mm-toggle" 
        aria-expanded={isOpen} 
        aria-controls={id}
        aria-label={t.openMenu}
        onClick={() => setIsOpen(true)}
      >
        <span className="mm-icon" aria-hidden="true" />
      </button>
      
      {typeof document !== 'undefined' && menuContent
        ? createPortal(menuContent, document.body)
        : null}
    </>
  );
}
