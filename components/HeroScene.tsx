import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import GlobeDashboard from './GlobeDashboard';

// Loaded as a separate chunk so phones and reduced-motion users never download the 3D runtime.
const Spline = lazy(() => import('@splinetool/react-spline'));

// PLACEHOLDER SCENE (Spline's public example, ~6KB).
// Swap for the real one: Spline editor → Export → Code Export → copy the .splinecode URL.
// Author the scene in brand colors (mint #63E6BE, copper #F2A65A on #07110F) with
// "Hide Background" ON and Geometry Quality "Performance" (see ../PERFORMANCE.md).
const SCENE_URL = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode';

interface HeroSceneProps {
  texts: {
    title: string;
    updated: string;
    stockAlert: string;
    goalAlert: string;
  };
}

// Only run WebGL on desktop-class devices that haven't asked for reduced motion.
function canRun3D(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;
  const canvas = document.createElement('canvas');
  return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
}

// A failed chunk download or runtime crash must degrade to the 2D hero, never a blank column.
class SceneErrorBoundary extends React.Component<{ onError: () => void; children: React.ReactNode }> {
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.props.children;
  }
}

// Layers the Spline scene behind the Decision Room dashboard card.
// The dashboard is always rendered: it is the content (and the fallback everywhere 3D is skipped).
export default function HeroScene({ texts }: HeroSceneProps) {
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setEnabled(canRun3D());
  }, []);

  // If the scene hasn't loaded after 10s (slow GPU, blocked CDN), give up quietly.
  useEffect(() => {
    if (!enabled || loaded || failed) return;
    timeoutRef.current = setTimeout(() => setFailed(true), 10000);
    return () => clearTimeout(timeoutRef.current);
  }, [enabled, loaded, failed]);

  const showScene = enabled && !failed;

  return (
    <div className="hero-scene">
      {showScene && (
        <SceneErrorBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <div className={`hero-scene__canvas ${loaded ? 'hero-scene__canvas--on' : ''}`} aria-hidden="true">
              <Spline
                scene={SCENE_URL}
                onLoad={() => {
                  clearTimeout(timeoutRef.current);
                  setLoaded(true);
                }}
              />
            </div>
          </Suspense>
        </SceneErrorBoundary>
      )}
      <GlobeDashboard texts={texts} />
    </div>
  );
}
