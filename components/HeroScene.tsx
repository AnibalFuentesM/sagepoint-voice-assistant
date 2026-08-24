import React from 'react';
import GlobeDashboard, { GlobeDashboardProps } from './GlobeDashboard';

interface HeroSceneProps {
  texts: GlobeDashboardProps['texts'];
  lang?: 'es' | 'en';
}

// Decision Room dashboard with a subtle brand glow behind it.
// (The old Spline 3D backdrop was removed: it was a placeholder scene that
// added visual noise and shipped an extra WebGL runtime for no benefit.)
export default function HeroScene({ texts, lang }: HeroSceneProps) {
  return (
    <div className="hero-scene">
      <div className="hero-scene__glow" aria-hidden="true" />
      <GlobeDashboard texts={texts} lang={lang} />
    </div>
  );
}

