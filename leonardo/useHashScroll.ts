import { useEffect } from 'react';
import type { DependencyList } from 'react';
import { useLocation } from 'react-router-dom';

export function useHashScroll(deps: DependencyList = []) {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    
    let cancelled = false;
    let observer: ResizeObserver | null = null;
    let timeoutId: number;

    const id = location.hash === '#contact' ? 'agendar' : location.hash.slice(1);

    const cancel = () => {
      cancelled = true;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      clearTimeout(timeoutId);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('mousedown', cancel);
    };

    const doScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) return;
      
      const navHeight = 70;
      const y = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: y, behavior: 'auto' });
    };

    const start = () => {
      if (cancelled) return;
      doScroll();
      
      observer = new ResizeObserver(() => {
        if (!cancelled) doScroll();
      });
      observer.observe(document.body);
      
      timeoutId = window.setTimeout(cancel, 1500);

      window.addEventListener('wheel', cancel, { passive: true, once: true });
      window.addEventListener('touchstart', cancel, { passive: true, once: true });
      window.addEventListener('mousedown', cancel, { passive: true, once: true });
    };

    const readyPromise = document.fonts ? document.fonts.ready : Promise.resolve();
    readyPromise.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(start);
      });
    });

    return cancel;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash, ...deps]);
}
