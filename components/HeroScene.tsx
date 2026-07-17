import React from 'react';
import GlobeDashboard from './GlobeDashboard';

interface HeroSceneProps {
  texts: {
    title: string;
    updated: string;
    stockAlert: string;
    goalAlert: string;
  };
}

// Decision Room dashboard with a subtle brand glow behind it.
// (The old Spline 3D backdrop was removed: it was a placeholder scene that
// added visual noise and shipped an extra WebGL runtime for no benefit.)
export default function HeroScene({ texts }: HeroSceneProps) {
  return (
    <div className="hero-scene">
      <div className="hero-scene__glow" aria-hidden="true" />
      <GlobeDashboard texts={texts} />
    </div>
  );
}
