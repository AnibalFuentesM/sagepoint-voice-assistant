import { useEffect } from 'react';

export function useSpotlight() {
  useEffect(() => {
    let ticking = false;
    let currentSpot: HTMLElement | null = null;
    let lastX = 0;
    let lastY = 0;

    const update = () => {
      if (currentSpot) {
        const rect = currentSpot.getBoundingClientRect();
        currentSpot.style.setProperty('--mx', `${lastX - rect.left}px`);
        currentSpot.style.setProperty('--my', `${lastY - rect.top}px`);
      }
      ticking = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      const target = e.target as HTMLElement | null;
      const spot = target?.closest('.spot') as HTMLElement | null;

      if (spot !== currentSpot) {
        if (currentSpot) {
          currentSpot.style.setProperty('--mx', '-9999px');
          currentSpot.style.setProperty('--my', '-9999px');
        }
        currentSpot = spot;
      }

      if (currentSpot && !ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const onPointerLeave = () => {
      if (currentSpot) {
        currentSpot.style.setProperty('--mx', '-9999px');
        currentSpot.style.setProperty('--my', '-9999px');
        currentSpot = null;
      }
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      onPointerLeave();
    };
  }, []);
}
