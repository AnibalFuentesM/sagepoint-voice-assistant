import { useEffect, useRef } from 'react';

interface GlobeDashboardProps {
  texts: {
    title: string;
    updated: string;
    stockAlert: string;
    goalAlert: string;
  };
}

const canTilt = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Operating pulse: a live, growing data feed -----------------------------
// The curve is generated from a rolling window of readings. Every tick a new
// reading arrives (upward drift, occasional dips), the window shifts, and the
// rendered curve morphs to the new shape via rAF — no React re-renders.

const PULSE = {
  w: 520,
  h: 190,
  top: 34, // highest y a point may reach
  floor: 174, // chart baseline
  n: 12, // readings in the window
  markerIndex: 9, // which reading carries the dashed reference marker
  tickMs: 2000,
  morphMs: 700,
};

// Seed readings shaped like the original hand-drawn curve, so the first paint
// (and the reduced-motion static chart) matches the shipped design.
const PULSE_SEED = [22, 26, 31, 29, 38, 43, 41, 54, 60, 57, 71, 78];

const pulseX = (i: number) => (i / (PULSE.n - 1)) * PULSE.w;

// Normalize the current window into chart space; the feed can climb forever.
function pulseYs(values: number[]): number[] {
  const min = Math.min(...values);
  const span = Math.max(Math.max(...values) - min, 1);
  return values.map((v) => PULSE.floor - ((v - min) / span) * (PULSE.floor - PULSE.top));
}

// Catmull-Rom through every point, emitted as cubic beziers.
function pulseLinePath(ys: number[]): string {
  let d = `M0 ${ys[0].toFixed(1)}`;
  for (let i = 1; i < ys.length; i++) {
    const x0 = pulseX(i - 1);
    const x1 = pulseX(i);
    const yPrev = ys[i - 2] ?? ys[i - 1];
    const yNext = ys[i + 1] ?? ys[i];
    const cp1y = ys[i - 1] + (ys[i] - yPrev) / 6;
    const cp2y = ys[i] - (yNext - ys[i - 1]) / 6;
    d += ` C${(x0 + (x1 - x0) / 3).toFixed(1)} ${cp1y.toFixed(1)} ${(x1 - (x1 - x0) / 3).toFixed(1)} ${cp2y.toFixed(1)} ${x1.toFixed(1)} ${ys[i].toFixed(1)}`;
  }
  return d;
}

const pulseAreaPath = (ys: number[]) => `${pulseLinePath(ys)} L${PULSE.w} ${PULSE.h} L0 ${PULSE.h} Z`;

const SEED_YS = pulseYs(PULSE_SEED);
const SEED_LINE = pulseLinePath(SEED_YS);
const SEED_AREA = pulseAreaPath(SEED_YS);
const SEED_MARKER_Y = SEED_YS[PULSE.markerIndex];
const SEED_END_Y = SEED_YS[PULSE.n - 1];
const MARKER_X = pulseX(PULSE.markerIndex);

const proofMetrics = [
  {
    index: '01',
    value: '33,370',
    label: 'ROWS / FILAS',
    width: '92%',
    color: '#63E6BE',
  },
  {
    index: '02',
    value: '11,327',
    label: 'CALL UNITS / UNIDADES',
    width: '72%',
    color: '#D79864',
  },
  {
    index: '03',
    value: '80%',
    label: 'REPORT TIME / TIEMPO',
    width: '80%',
    color: '#F4F1E8',
  },
] as const;

export default function GlobeDashboard({ texts }: GlobeDashboardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRaf = useRef(0);

  const figRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const lineGlowRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const markerLineRef = useRef<SVGPathElement>(null);
  const markerDotRef = useRef<SVGCircleElement>(null);
  const endDotRef = useRef<SVGCircleElement>(null);
  const pulseRingRef = useRef<SVGCircleElement>(null);
  const signalRef = useRef<HTMLSpanElement>(null);
  const metricValueRefs = useRef<(HTMLElement | null)[]>([]);

  // Live feed: shift in a new reading every tick and morph the curve to it.
  // Skipped entirely under reduced motion (the seed curve stays as a static chart)
  // and idles while the card is off-screen or the tab is hidden.
  useEffect(() => {
    const line = lineRef.current;
    const area = areaRef.current;
    if (!line || !area || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const values = [...PULSE_SEED];
    let renderedYs = pulseYs(values);
    let signal = 18.4;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;
    let onScreen = true;
    let disposed = false;

    const io = new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    if (figRef.current) io.observe(figRef.current);

    const apply = (ys: number[]) => {
      line.setAttribute('d', pulseLinePath(ys));
      lineGlowRef.current?.setAttribute('d', pulseLinePath(ys));
      area.setAttribute('d', pulseAreaPath(ys));
      const markerY = ys[PULSE.markerIndex].toFixed(1);
      markerLineRef.current?.setAttribute('d', `M${MARKER_X.toFixed(1)} ${markerY} V${PULSE.floor}`);
      markerDotRef.current?.setAttribute('cy', markerY);
      const endY = ys[ys.length - 1].toFixed(1);
      endDotRef.current?.setAttribute('cy', endY);
      pulseRingRef.current?.setAttribute('cy', endY);
    };

    const tick = () => {
      if (disposed) return;
      timer = setTimeout(tick, PULSE.tickMs);
      if (!onScreen || document.hidden) return;

      const last = values[values.length - 1];
      const dip = Math.random() < 0.22;
      const delta = dip ? -(2 + Math.random() * 5) : 2 + Math.random() * 7;
      values.shift();
      values.push(Math.max(last + delta, 1));
      signal = Math.min(38, Math.max(9, signal + delta * 0.12));
      if (signalRef.current) {
        signalRef.current.textContent = `+${signal.toFixed(1)}`;
        signalRef.current.classList.remove('dash-signal-value--tick');
        void signalRef.current.offsetWidth;
        signalRef.current.classList.add('dash-signal-value--tick');
      }

      const from = renderedYs.slice();
      const to = pulseYs(values);
      const t0 = performance.now();
      const step = (now: number) => {
        if (disposed) return;
        const p = Math.min(1, (now - t0) / PULSE.morphMs);
        const eased = 1 - Math.pow(1 - p, 3);
        renderedYs = from.map((y, i) => y + (to[i] - y) * eased);
        apply(renderedYs);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };

    // Let the entrance draw-in finish before the feed starts moving.
    timer = setTimeout(tick, 3000);
    return () => {
      disposed = true;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  // Count the proof figures in once the dashboard becomes visible. This keeps
  // the motion meaningful (the data arrives) instead of adding decoration only.
  useEffect(() => {
    const figure = figRef.current;
    if (!figure || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const started = performance.now();
      const duration = 1450;
      const targets = [33370, 11327, 80];

      const animate = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        metricValueRefs.current.forEach((node, index) => {
          if (!node) return;
          const value = Math.round(targets[index] * eased);
          node.textContent = index === 2 ? `${value}%` : value.toLocaleString('en-US');
        });
        if (progress < 1) raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    }, { threshold: 0.28 });

    observer.observe(figure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleTiltMove = (e: React.PointerEvent) => {
    const card = cardRef.current;
    if (!card || tiltRaf.current || !canTilt()) return;
    const { clientX, clientY } = e;
    tiltRaf.current = requestAnimationFrame(() => {
      tiltRaf.current = 0;
      const rect = card.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(-py * 5).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(px * 6).toFixed(2)}deg`);
      card.style.setProperty('--spot-x', `${((px + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty('--spot-y', `${((py + 0.5) * 100).toFixed(1)}%`);
    });
  };

  const handleTiltLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    if (tiltRaf.current) {
      cancelAnimationFrame(tiltRaf.current);
      tiltRaf.current = 0;
    }
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <figure ref={figRef} className="relative isolate flex min-h-[590px] w-full items-center justify-center py-8 sm:min-h-[620px] md:h-[650px] md:py-0">
      <figcaption className="sr-only">
        {texts.title}. 33,370 rows, 11,327 call units, and 80% reporting time saved.
      </figcaption>

      {/* Ambient field */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[8%] top-[12%] h-52 w-52 rounded-full bg-[#63E6BE]/10 blur-[70px]" />
        <div className="absolute bottom-[8%] right-[2%] h-48 w-48 rounded-full bg-[#D79864]/10 blur-[65px]" />
        <div className="absolute inset-x-[8%] top-[17%] h-[68%] rounded-full border border-[#63E6BE]/10 [transform:perspective(700px)_rotateX(68deg)]" />
        <div className="absolute inset-x-[15%] top-[22%] h-[58%] rounded-full border border-white/[0.04] [transform:perspective(700px)_rotateX(68deg)]" />
      </div>

      <div
        className="relative w-full max-w-[560px] animate-[floatIn_0.9s_ease-out_0.15s_both] motion-reduce:animate-none"
        onPointerMove={handleTiltMove}
        onPointerLeave={handleTiltLeave}
      >
        {/* Offset editorial frame */}
        <div
          aria-hidden="true"
          className="absolute -inset-2 translate-x-3 translate-y-3 rounded-[32px] border border-[#D79864]/20 bg-[#0A1714]/50"
        />

        {/* No backdrop-filter here: the 95%-opaque background hides it anyway, and re-blurring
            the backdrop on every tilt frame is the single most expensive paint on the page. */}
        <div ref={cardRef} className="dash-tilt dashboard-card relative overflow-hidden rounded-[28px] border border-[#63E6BE]/20 bg-[#07110F]/95 shadow-[0_32px_90px_rgba(0,0,0,0.48),0_0_45px_rgba(99,230,190,0.07)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(244,241,232,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(244,241,232,0.035)_1px,transparent_1px)] [background-size:32px_32px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(99,230,190,0.10),transparent_36%),radial-gradient(circle_at_92%_82%,rgba(215,152,100,0.08),transparent_34%)]"
          />
          <div aria-hidden="true" className="dashboard-spotlight absolute inset-0" />

          {/* Live status strip */}
          <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.08] bg-[#0A1714]/90 px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#63E6BE] shadow-[0_0_10px_rgba(99,230,190,0.9)] motion-safe:animate-pulse" />
              <span className="truncate font-mono text-[9px] font-semibold tracking-[0.22em] text-[#F4F1E8]/55 sm:text-[10px]">
                SAGEPOINT // DECISION ROOM
              </span>
            </div>
            <span className="dashboard-live-pill shrink-0 rounded-full border border-[#63E6BE]/20 bg-[#63E6BE]/[0.06] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#63E6BE]">
              {texts.updated}
            </span>
          </div>

          <div className="relative p-4 sm:p-5">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#D79864]">
                  06:42 GT / LIVE SIGNAL
                </p>
                <h3 className="max-w-[360px] font-serif text-2xl font-semibold leading-tight text-[#F4F1E8] sm:text-3xl">
                  {texts.title}
                </h3>
              </div>
              <div className="hidden text-right sm:block">
                <span ref={signalRef} className="dash-signal-value block font-serif text-3xl leading-none text-[#63E6BE] tabular-nums">+18.4</span>
                <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#F4F1E8]/40">
                  SIGNAL INDEX
                </span>
              </div>
            </div>

            {/* Operating pulse */}
            <section className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0A1714]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#F4F1E8]/50">
                  OPERATING PULSE / PULSO
                </span>
                <span className="flex items-center gap-2 font-mono text-[9px] text-[#63E6BE]">
                  <span className="h-px w-5 bg-[#63E6BE]" />
                  +24.8%
                </span>
              </div>

              <div className="chart-stage relative h-[180px] overflow-hidden px-3 pt-3 sm:h-[205px]">
                <div aria-hidden="true" className="chart-scan" />
                <svg
                  viewBox="0 0 520 190"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`${texts.title}: 33,370 rows / filas, 11,327 call units / unidades, 80 percent.`}
                  className="h-full w-full overflow-visible"
                >
                  <title>{texts.title}</title>
                  <defs>
                    <linearGradient id="decision-room-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#63E6BE" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#63E6BE" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="decision-room-line" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#D79864" />
                      <stop offset="44%" stopColor="#F4F1E8" />
                      <stop offset="100%" stopColor="#63E6BE" />
                    </linearGradient>
                  </defs>

                  <g aria-hidden="true" stroke="rgba(244,241,232,0.08)" strokeWidth="1">
                    <path d="M0 30 H520" />
                    <path d="M0 78 H520" />
                    <path d="M0 126 H520" />
                    <path d="M0 174 H520" />
                  </g>

                  <path
                    ref={areaRef}
                    className="chart-area"
                    d={SEED_AREA}
                    fill="url(#decision-room-area)"
                  />
                  <path
                    ref={lineGlowRef}
                    className="chart-line-glow"
                    d={SEED_LINE}
                    fill="none"
                    stroke="#63E6BE"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    ref={lineRef}
                    className="chart-line"
                    pathLength={1}
                    d={SEED_LINE}
                    fill="none"
                    stroke="url(#decision-room-line)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <g className="chart-marker">
                    <path
                      ref={markerLineRef}
                      d={`M${MARKER_X.toFixed(1)} ${SEED_MARKER_Y.toFixed(1)} V${PULSE.floor}`}
                      fill="none"
                      stroke="#63E6BE"
                      strokeOpacity="0.22"
                      strokeWidth="1"
                      strokeDasharray="4 5"
                    />
                    <circle ref={markerDotRef} cx={MARKER_X.toFixed(1)} cy={SEED_MARKER_Y.toFixed(1)} r="4" fill="#07110F" stroke="#63E6BE" strokeWidth="2" />
                    <circle ref={endDotRef} cx={PULSE.w} cy={SEED_END_Y.toFixed(1)} r="5" fill="#63E6BE" />
                    <circle ref={pulseRingRef} className="chart-pulse" cx={PULSE.w} cy={SEED_END_Y.toFixed(1)} r="10" fill="none" stroke="#63E6BE" strokeOpacity="0.35" />
                  </g>
                </svg>

                <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 bottom-3 flex justify-between font-mono text-[8px] text-[#F4F1E8]/30">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                  <span>04</span>
                  <span>05</span>
                  <span>06</span>
                  <span>NOW</span>
                </div>
              </div>
            </section>

            {/* Verified proof metrics */}
            <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
              {proofMetrics.map((metric) => (
                <div
                  key={metric.index}
                  className="proof-card group rounded-[16px] border border-white/[0.07] bg-[#0A1714]/80 p-3 transition-all duration-300 hover:border-[#63E6BE]/25 motion-reduce:transition-none sm:p-4"
                  style={{ '--proof-delay': `${1050 + Number(metric.index) * 150}ms` } as React.CSSProperties}
                >
                  <div className="mb-3 flex items-center justify-between font-mono text-[8px] text-[#F4F1E8]/30">
                    <span>{metric.index}</span>
                    <span className="hidden sm:inline">PROOF</span>
                  </div>
                  <strong
                    ref={(node) => { metricValueRefs.current[Number(metric.index) - 1] = node; }}
                    className="block font-serif text-lg font-semibold leading-none text-[#F4F1E8] tabular-nums sm:text-2xl"
                  >
                    {metric.value}
                  </strong>
                  <span className="mt-2 block min-h-6 font-mono text-[7px] font-semibold uppercase leading-tight tracking-[0.08em] text-[#F4F1E8]/45 sm:text-[8px]">
                    {metric.label}
                  </span>
                  <div className="mt-2 h-px overflow-hidden bg-white/[0.08]">
                    <div
                      className="proof-bar h-full"
                      style={{ width: metric.width, backgroundColor: metric.color, animationDelay: `${1200 + Number(metric.index) * 180}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Operational alerts */}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="dashboard-alert dashboard-alert--warning flex min-w-0 items-center gap-3 rounded-[15px] border border-[#D79864]/20 bg-[#D79864]/[0.05] px-3 py-3">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#D79864] opacity-40 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D79864]" />
                </span>
                <span className="truncate text-[10px] font-medium text-[#F4F1E8]/70 sm:text-[11px]" title={texts.stockAlert}>
                  {texts.stockAlert}
                </span>
              </div>
              <div className="dashboard-alert dashboard-alert--success flex min-w-0 items-center gap-3 rounded-[15px] border border-[#63E6BE]/20 bg-[#63E6BE]/[0.05] px-3 py-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#63E6BE] shadow-[0_0_9px_rgba(99,230,190,0.75)]" />
                <span className="truncate text-[10px] font-medium text-[#F4F1E8]/70 sm:text-[11px]" title={texts.goalAlert}>
                  {texts.goalAlert}
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-between border-t border-white/[0.07] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.18em] text-[#F4F1E8]/30 sm:px-5">
            <span>HUMAN + AI VERIFIED</span>
            <span className="text-[#D79864]">GT / US</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
