import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import {
  trackPageView,
  trackScheduleCall,
  trackSelectPackage,
  trackWhatsAppClick,
} from '../utils/analytics';
import BookingModal from './BookingModal';
import { CATCOLOR, CATNAME, CATRGB, PROJECTS, SAY, TILES, type LeoCat } from './leonardoData';
import './leonardo.css';

const WA = 'https://wa.me/50240464716';

const META_TITLE = 'BI Fraccional y Dashboards Ejecutivos para PYMEs | Sagepoint Analytics';
const META_DESCRIPTION =
  'Tu departamento externo de Inteligencia de Negocios y Automatización. Resultados en 14 días, ' +
  'dashboards ejecutivos y 80% de ahorro en reportes sin contratar analistas costosos.';

type Filter = 'all' | LeoCat;

const FILTERS: { id: Filter; label: string; color: string }[] = [
  { id: 'all', label: 'Todo', color: 'var(--bone)' },
  { id: 'bi', label: 'BI & Dashboards', color: 'var(--mint)' },
  { id: 'auto', label: 'Automatización', color: 'var(--violet)' },
  { id: 'web', label: 'Web & Apps', color: 'var(--arc)' },
];

/** Package ids carried on the CTA buttons, mapped to the label the closer echoes back. */
const PACKAGE_NAMES: Record<string, string> = {
  'quick-win': 'Radiografía de Datos',
  executive: 'Cockpit Ejecutivo',
  custom: 'Sala de Control',
  retainer: 'Soporte Cercano',
};

// ---------------------------------------------------------------- flythrough geometry
const FLY_N = 22; // cards in the air
const START = 0.24; // progress where the flight begins
const ZFAR = 2400; // spawn depth
const FOCAL = 820; // camera focal length
const LOOPS = 2.0; // how far the field advances across the section

/** Deterministic per-card jitter, so the layout is identical on every render and on the server. */
function seeded(i: number) {
  let s = (i * 2654435761 + 12345) >>> 0;
  const f = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  f();
  f();
  f();
  return f;
}

type FlyCard = { ang: number; rad: number; birth: number; spin: number; sz: number; src: string; h: number };

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => v * v * (3 - 2 * v);

export default function LeonardoHome() {
  useDocumentMeta(META_TITLE, META_DESCRIPTION, '/');

  const [filter, setFilter] = useState<Filter>('all');
  /** Package the visitor last showed interest in, by id. Drives the closer echo and the modal. */
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [booking, setBooking] = useState({ open: false, pkg: 'general', source: 'nav' });
  /** 'on' only on screens with room for the flythrough, and never under reduced-motion. */
  const [cinema, setCinema] = useState(false);
  /** The 22 hero cards are held back until the browser is idle: they must not race the headline. */
  const [fieldReady, setFieldReady] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const flightRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);

  const cards = useMemo<FlyCard[]>(
    () =>
      Array.from({ length: FLY_N }, (_, i) => {
        const r = seeded(i + 3);
        const t = TILES[i % TILES.length];
        return {
          ang: i * 2.39996 + r() * 0.55, // golden angle keeps them evenly scattered
          rad: 0.36 + Math.pow(r(), 0.7) * 0.92, // leave a corridor around the headline
          birth: (i / FLY_N) * 0.92 + r() * 0.05,
          spin: (r() - 0.5) * 10,
          sz: 0.68 + r() * 0.7,
          src: t.src,
          h: t.h,
        };
      }),
    [],
  );

  const shown = useMemo(
    () => PROJECTS.map((p) => filter === 'all' || p.cat === filter),
    [filter],
  );

  useEffect(() => {
    trackPageView('/', META_TITLE, 'es');
  }, []);

  /** The page is pure black; keep the overscroll gutter from flashing the app's dark green. */
  useEffect(() => {
    document.body.classList.add('leo-page');
    return () => document.body.classList.remove('leo-page');
  }, []);

  /** Restore the package the visitor picked before reloading. */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('sp_package');
      if (saved && PACKAGE_NAMES[saved]) setPickedId(saved);
    } catch {
      // Private browsing: the echo just stays hidden.
    }
  }, []);

  /** Reveal-on-scroll for every [data-rv] block inside this page. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-rv]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, [filter]);

  /** Hairline under the sticky header, once the page has moved at all. */
  useEffect(() => {
    const onScroll = () => navRef.current?.classList.toggle('stuck', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Decide whether the flythrough runs at all, and re-decide when the viewport or the preference changes. */
  useEffect(() => {
    const roomy = window.matchMedia('(min-width: 860px) and (min-height: 620px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const decide = () => setCinema(roomy.matches && !reduce.matches);
    decide();
    roomy.addEventListener('change', decide);
    reduce.addEventListener('change', decide);
    return () => {
      roomy.removeEventListener('change', decide);
      reduce.removeEventListener('change', decide);
    };
  }, []);

  /** Build the card field only once the main thread is free, or as soon as the visitor scrolls. */
  useEffect(() => {
    if (!cinema) {
      setFieldReady(false);
      return;
    }
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        setFieldReady(true);
      }
    };
    const idle = (window as unknown as { requestIdleCallback?: typeof requestIdleCallback })
      .requestIdleCallback;
    const handle = idle ? idle(go, { timeout: 2500 }) : window.setTimeout(go, 1200);
    window.addEventListener('scroll', go, { passive: true, once: true });
    return () => {
      done = true;
      window.removeEventListener('scroll', go);
      if (idle && 'cancelIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(
          handle as number,
        );
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, [cinema]);

  /**
   * The flythrough itself. This stays imperative on purpose: it writes transforms for up to 22
   * elements on every animation frame, and routing that through React state would drop frames.
   */
  useEffect(() => {
    const flight = flightRef.current;
    if (!flight) return;

    const fit = (el: HTMLElement, avail: number, max: number) => {
      el.style.fontSize = '100px';
      const natural = el.offsetWidth;
      if (!natural) return;
      el.style.fontSize = `${Math.min(max, (avail / natural) * 100)}px`;
    };

    const fitAll = () => {
      const root = rootRef.current;
      if (!root) return;
      const vw = window.innerWidth;
      const depth = window.innerHeight * 1.25;
      root.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
        const m = el.dataset.fit;
        const avail =
          m === 'd' ? depth * 0.86 : m === 'd-sm' ? depth * 0.3 : m === 'w-sm' ? vw * 0.78 : vw * 0.955;
        fit(el, avail, 460);
      });
      const closer = root.querySelector<HTMLElement>('.closer-disp');
      if (closer) {
        const parent = closer.closest('.wrap') as HTMLElement | null;
        if (parent) {
          fit(
            closer,
            parent.clientWidth - parseFloat(getComputedStyle(parent).paddingLeft) * 2,
            168,
          );
        }
      }
    };

    const render = () => {
      const rect = flight.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = cinema && span > 0 ? clamp01(-rect.top / span) : 0;

      // The camera dollies down the room, then the walls sweep past the lens.
      if (boxRef.current) {
        const q = clamp01(p / 0.22);
        const depth = window.innerHeight * 1.25;
        boxRef.current.style.transform = `translateZ(${(Math.pow(q, 1.55) * depth * 0.92).toFixed(1)}px)`;
      }
      if (roomRef.current) roomRef.current.style.opacity = (1 - clamp01((p - 0.15) / 0.09)).toFixed(3);
      if (glowRef.current) {
        glowRef.current.style.opacity = cinema ? clamp01((p - 0.13) / 0.12).toFixed(3) : '1';
      }

      // The plate rises as the room clears, and fades again on the way out.
      const out = cinema ? 1 - smooth(clamp01((p - 0.94) / 0.06)) : 1;
      if (plateRef.current) {
        const f = (cinema ? smooth(clamp01((p - 0.11) / 0.12)) : 1) * out;
        plateRef.current.style.opacity = f.toFixed(3);
        plateRef.current.style.transform = `translateY(${((1 - f) * 24).toFixed(1)}px)`;
      }
      if (fieldRef.current) fieldRef.current.style.opacity = out.toFixed(3);
      if (cueRef.current) cueRef.current.style.opacity = (1 - clamp01(p / 0.05)).toFixed(2);

      // The field: cards surface at the vanishing point and sail past the camera.
      if (!cinema) return;
      const travel = clamp01((p - START) / (1 - START));
      const reach = Math.max(window.innerWidth, window.innerHeight) * 0.86;

      cards.forEach((c, i) => {
        const el = cardEls.current[i];
        if (!el) return;
        let u = travel * LOOPS - c.birth;
        if (u <= 0) {
          el.style.opacity = '0';
          return;
        }
        if (u > 1) u = u % 1;
        const z = ZFAR * (1 - u) - FOCAL * 0.74;
        const k = FOCAL / (FOCAL + z);
        if (k <= 0.03 || k > 8) {
          el.style.opacity = '0';
          return;
        }
        const sc = k * c.sz;
        const x = Math.cos(c.ang) * c.rad * reach * k;
        const y = Math.sin(c.ang) * c.rad * reach * k;
        el.style.opacity = (Math.min(1, u * 8) * (1 - clamp01((sc - 1.4) / 1.5))).toFixed(3);
        el.style.transform =
          `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) ` +
          `scale(${sc.toFixed(3)}) rotate(${(c.spin * k).toFixed(2)}deg)`;
      });
    };

    if (!cinema) {
      if (boxRef.current) boxRef.current.style.transform = '';
      if (roomRef.current) roomRef.current.style.opacity = '';
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        render();
        ticking = false;
      });
    };
    const onResize = () => {
      fitAll();
      render();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Fitting depends on the webfonts having landed, so measure again once they have.
    let alive = true;
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      if (!alive) return;
      fitAll();
      requestAnimationFrame(() => {
        fitAll();
        render();
      });
    });
    fitAll();
    render();

    return () => {
      alive = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [cinema, fieldReady, cards]);

  const pickPackage = (id: string, name: string) => {
    try {
      sessionStorage.setItem('sp_package', id);
    } catch {
      // Private browsing: the pick just does not survive a reload.
    }
    setPickedId(id);
    trackSelectPackage({ package_id: id, package_name: name, language: 'es' });
  };

  const openBooking = (e: React.MouseEvent, pkg: string, source: string) => {
    e.preventDefault();
    setBooking({ open: true, pkg, source });
    trackScheduleCall({ source_section: source, package_id: pkg, language: 'es' });
  };

  const packageCta = (id: string, className: string) => (
    <a
      className={className}
      href="#agendar"
      onClick={(e) => {
        pickPackage(id, PACKAGE_NAMES[id]);
        openBooking(e, id, `paquete:${id}`);
      }}
    >
      Agendar diagnóstico
    </a>
  );

  return (
    <div className="leo" ref={rootRef}>
      <a className="skip" href="#top">
        Saltar al contenido
      </a>

      <header className="nav" id="nav" ref={navRef}>
        <div className="wrap nav-in">
          <a className="mark" href="#top">
            <i />
            SAGEPOINT
          </a>
          <nav className="nav-links" aria-label="Secciones del sitio">
            <a href="#trabajo">Trabajo</a>
            <a href="#casos">Casos</a>
            <a href="#sistema">Sistema</a>
            <a href="#paquetes">Paquetes</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-act">
            <a className="pill pill--ghost pill--sm" href="#paquetes">
              Paquetes
            </a>
            <a
              className="pill pill--fill pill--sm"
              href="#agendar"
              onClick={(e) => openBooking(e, pickedId ?? 'general', 'nav')}
            >
              Agendar
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="flight" id="flight" ref={flightRef} data-cinema={cinema ? 'on' : 'off'}>
          <div className="stage">
            <div className="room" id="room" ref={roomRef} aria-hidden="true">
              <div className="box" id="box" ref={boxRef}>
                <div className="face face--top">
                  <span data-fit="w">Sagepoint</span>
                </div>
                <div className="face face--left">
                  <span className="stack2">
                    <b data-fit="d-sm">Tus</b>
                    <b data-fit="d">Datos</b>
                  </span>
                </div>
                <div className="face face--right">
                  <span className="stack2">
                    <b data-fit="d-sm">Tu</b>
                    <b data-fit="d">Contexto</b>
                  </span>
                </div>
                <div className="face face--bot">
                  <span data-fit="w-sm">Tú decides</span>
                </div>
              </div>
            </div>

            <div className="glow" id="glow" ref={glowRef} aria-hidden="true" />
            <div className="field" id="field" ref={fieldRef} aria-hidden="true">
              {cinema && fieldReady
                ? cards.map((c, i) => (
                    <div
                      className="fly"
                      key={i}
                      ref={(el) => {
                        cardEls.current[i] = el;
                      }}
                    >
                      <img
                        src={c.src}
                        alt=""
                        width={920}
                        height={c.h}
                        decoding="async"
                        fetchPriority="low"
                        loading="lazy"
                      />
                    </div>
                  ))
                : null}
            </div>

            <div className="plate" id="plate" ref={plateRef}>
              <p className="eyebrow">BI fraccional · Guatemala &amp; Estados Unidos</p>
              <h1 className="hero-h1">
                De datos dispersos a <em>decisiones que venden</em>
              </h1>
              <p className="hero-sub">
                Tu departamento de inteligencia de negocios y automatización por una fracción de lo
                que cuesta un analista interno. Resultados desde la semana dos.
              </p>
              <div className="hero-cta">
                <a
                  className="pill pill--fill"
                  href="#agendar"
                  onClick={(e) => openBooking(e, 'general', 'hero')}
                >
                  Agendar diagnóstico gratuito
                </a>
                <a className="pill pill--ghost" href="#paquetes">
                  Ver paquetes
                </a>
              </div>
              <div className="micro">
                <span>
                  <b>14</b> días al primer dashboard
                </span>
                <span>
                  <b>100%</b> propiedad de tus datos
                </span>
                <span>
                  <b>0</b> contratos forzosos
                </span>
              </div>
            </div>

            <div className="cue" id="cue" ref={cueRef}>
              <span>Baja</span>
              <i />
            </div>
          </div>
        </section>

        {/* TICKER / CITAS */}
        <div className="ticker ticker--say" aria-label="Lo que dicen los clientes">
          {/* The row is rendered twice so the -50% translate loops seamlessly. Fragments, not a
              wrapper div: the spans have to stay direct flex children of .ticker-track. */}
          <div className="ticker-track">
            {[0, 1].map((dup) => (
              <React.Fragment key={dup}>
                {SAY.map((q) => (
                  <span className="tq" key={q.author + q.text} aria-hidden={dup === 1}>
                    <q>{q.text}</q>
                    <i />
                    <cite>
                      <b>{q.author}</b> · {q.role}
                    </cite>
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* GALLERY */}
        <section id="trabajo">
          <div className="wrap">
            <div className="sec-head" data-rv>
              <div>
                <p className="eyebrow">Portafolio</p>
                <h2 className="sec-title">
                  Lo que ya
                  <br />
                  está corriendo
                </h2>
              </div>
              <p className="sec-lede">
                Once proyectos en producción: cockpits ejecutivos, motores de reportería,
                automatizaciones y sitios. Capturas reales — y donde el cliente no permite compartir
                pantalla, va la cifra en vez de una imagen prestada.
              </p>
            </div>

            <div className="filters" role="group" aria-label="Filtrar por tipo de trabajo" data-rv>
              {FILTERS.map((f) => (
                <button
                  className="fb"
                  key={f.id}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  style={{ '--c': f.color } as React.CSSProperties}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="gal" id="gal">
              {PROJECTS.map((p, i) => {
                const style = {
                  '--c': CATCOLOR[p.cat],
                  '--crgb': CATRGB[p.cat],
                } as React.CSSProperties;
                const hidden = shown[i] ? '' : ' hide';
                if (p.kind === 'shot') {
                  return (
                    <figure
                      className={`tile tile--shot${hidden}`}
                      key={p.file}
                      data-cat={p.cat}
                      style={style}
                    >
                      <img src={p.src} alt={p.alt} loading="lazy" width={900} height={p.h} />
                      <figcaption className="tile-bar">
                        <i />
                        <b>{p.title}</b>
                      </figcaption>
                    </figure>
                  );
                }
                return (
                  <article
                    className={`ptile${hidden}`}
                    key={p.client + p.title}
                    data-cat={p.cat}
                    style={style}
                  >
                    <div className="p-chip">
                      <span className="tag" style={{ background: CATCOLOR[p.cat] }}>
                        {CATNAME[p.cat]}
                      </span>
                    </div>
                    <p className="p-eyebrow">{p.client}</p>
                    <p className="p-num">{p.num}</p>
                    <p className="p-numl">{p.numl}</p>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <div className="chips">
                      {p.stack.map((t) => (
                        <span className="chip" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="gal-foot" data-rv>
              <Link className="pill pill--ghost" to="/portfolio/">
                Ver el portafolio completo
              </Link>
            </div>
          </div>
        </section>

        {/* CASES */}
        <section id="casos">
          <div className="wrap">
            <div className="sec-head" data-rv>
              <div>
                <p className="eyebrow">Casos seleccionados</p>
                <h2 className="sec-title">
                  Números que
                  <br />
                  cambiaron de mano
                </h2>
              </div>
              <p className="sec-lede">
                Impacto cuantificado en producción. Cada cifra salió de un sistema que sigue
                corriendo hoy.
              </p>
            </div>
            <div className="cases">
              <article className="case" data-rv>
                <div className="case-top">
                  <div>
                    <div className="case-stat" style={{ color: 'var(--amber)' }}>
                      $420k
                    </div>
                    <div className="case-statl">Margen protegido / año</div>
                  </div>
                  <span className="tag" style={{ background: 'var(--amber)' }}>
                    Automoción
                  </span>
                </div>
                <h3>Apex Auto Group — cockpit ejecutivo multi-tienda</h3>
                <p>
                  Doce concesionarios y 85+ feeds DMS unificados en un solo Power BI con refresco
                  sub-segundo.
                </p>
                <div className="ba">
                  <div className="b">
                    <i>✕</i>
                    <span>85 reportes aislados, 5–7 días de retraso</span>
                  </div>
                  <div className="a">
                    <i>✓</i>
                    <span>Un cockpit único, fuga visible el mismo día</span>
                  </div>
                </div>
                <div className="chips">
                  <span className="chip">Power BI</span>
                  <span className="chip">SQL &amp; DAX</span>
                  <span className="chip">Python ETL</span>
                </div>
              </article>

              <article className="case" data-rv>
                <div className="case-top">
                  <div>
                    <div className="case-stat" style={{ color: 'var(--arc)' }}>
                      99.4%
                    </div>
                    <div className="case-statl">SLA · antes 81.2%</div>
                  </div>
                  <span className="tag" style={{ background: 'var(--arc)' }}>
                    Operaciones
                  </span>
                </div>
                <h3>IBH BPO — motor de reportería multi-tenant</h3>
                <p>
                  33,370 registros de rendimiento a través de 14 sistemas de telefonía y CRM,
                  reconciliados a diario.
                </p>
                <div className="ba">
                  <div className="b">
                    <i>✕</i>
                    <span>35 h/semana consolidando a mano</span>
                  </div>
                  <div className="a">
                    <i>✓</i>
                    <span>28 h/semana devueltas a los supervisores</span>
                  </div>
                </div>
                <div className="chips">
                  <span className="chip">Apps Script</span>
                  <span className="chip">Looker Studio</span>
                  <span className="chip">14 PM APIs</span>
                </div>
              </article>

              <article className="case" data-rv>
                <div className="case-top">
                  <div>
                    <div className="case-stat" style={{ color: 'var(--violet)' }}>
                      94%
                    </div>
                    <div className="case-statl">Menos tiempo · DSO −11 días</div>
                  </div>
                  <span className="tag" style={{ background: 'var(--violet)' }}>
                    IA &amp; Automatización
                  </span>
                </div>
                <h3>InboxHealth — conciliación de facturación médica</h3>
                <p>
                  Python y Playwright recorren el portal con MFA, concilian contra el ledger y avisan
                  por Slack.
                </p>
                <div className="ba">
                  <div className="b">
                    <i>✕</i>
                    <span>40 h/semana de conciliación manual</span>
                  </div>
                  <div className="a">
                    <i>✓</i>
                    <span>2.5 h/semana supervisadas, cero errores de tipeo</span>
                  </div>
                </div>
                <div className="chips">
                  <span className="chip">Python</span>
                  <span className="chip">Playwright</span>
                  <span className="chip">Sheets API</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SYSTEM */}
        <section id="sistema">
          <div className="wrap">
            <div className="sec-head" data-rv>
              <div>
                <p className="eyebrow">El sistema Sagepoint</p>
                <h2 className="sec-title">
                  Tres pasos,
                  <br />
                  cero TI interno
                </h2>
              </div>
              <p className="sec-lede">
                La IA sola alucina y no conoce tu contexto local. Cada métrica que sale de aquí pasó
                por un consultor antes de llegar a tu pantalla.
              </p>
            </div>
            <div className="steps">
              <article className="step" data-rv>
                <div className="step-n" style={{ '--c': 'var(--mint)' } as React.CSSProperties}>
                  PASO 01
                </div>
                <h3>Levantamos la señal</h3>
                <p>
                  Auditamos tus fuentes reales —DMS, CRM, ERP, telefonía, las hojas de cálculo que
                  nadie quiere abrir— y mapeamos dónde se pierde la información.
                </p>
              </article>
              <article className="step" data-rv>
                <div className="step-n" style={{ '--c': 'var(--arc)' } as React.CSSProperties}>
                  PASO 02
                </div>
                <h3>Conectamos y validamos</h3>
                <p>
                  Ingesta automatizada con Python, Playwright y Apps Script. Cada regla de validación
                  corre a diario y un humano revisa lo que la máquina marca.
                </p>
              </article>
              <article className="step" data-rv>
                <div className="step-n" style={{ '--c': 'var(--amber)' } as React.CSSProperties}>
                  PASO 03
                </div>
                <h3>Entregamos la decisión</h3>
                <p>
                  Dashboards que tu equipo entiende sin capacitación de tres semanas, con alertas que
                  llegan a Slack o WhatsApp antes de que el problema crezca.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* PACKAGES */}
        <section id="paquetes">
          <div className="wrap">
            <div className="sec-head" data-rv>
              <div>
                <p className="eyebrow">Cómo se empieza</p>
                <h2 className="sec-title">
                  Primero una
                  <br />
                  prueba pequeña
                </h2>
              </div>
              <p className="sec-lede">
                No tienes que decidir hoy el proyecto completo. Se empieza por una radiografía de dos
                semanas, y de ahí se ve si hay con qué seguir. Todo con entregable, plazo y precio por
                escrito.
              </p>
            </div>

            <div className="plist">
              <p className="lstep">
                <span>Etapa 1</span> Por aquí se entra
              </p>
              <article className="prow prow--lead" data-rv>
                <div className="prow-price">
                  <b>$750</b>
                  <span>pago único</span>
                </div>
                <div className="prow-body">
                  <h3>Radiografía de Datos</h3>
                  <p className="prow-facts">
                    <em>14 días</em> · <em>90 minutos</em> de tu equipo · NDA antes de tocar un
                    archivo
                  </p>
                  <p className="prow-scope">
                    Auditamos dos de tus fuentes y te dejamos un dashboard vivo con hasta ocho KPIs,
                    más un informe de oportunidades priorizadas y una ronda de revisiones. En catorce
                    días sabes qué se puede automatizar y qué no.
                  </p>
                  <div className="prow-act">
                    {packageCta('quick-win', 'pill pill--mint')}
                    <span className="prow-note">
                      Se acredita completo al proyecto si contratas en 30 días
                    </span>
                  </div>
                </div>
              </article>

              <p className="lstep lstep--mid" data-rv>
                <span>Etapa 2</span> Si la radiografía muestra que vale la pena
              </p>
              <article className="prow" data-rv>
                <div className="prow-price">
                  <b>$2,500</b>
                  <span>desde · por proyecto</span>
                </div>
                <div className="prow-body">
                  <h3>
                    Cockpit Ejecutivo <i className="prow-tag">Más elegido</i>
                  </h3>
                  <p className="prow-facts">
                    <em>4–6 semanas</em> · <em>4 horas</em> de tu equipo
                  </p>
                  <p className="prow-scope">
                    Hasta cuatro fuentes integradas, hasta tres dashboards ejecutivos y un flujo de
                    reportes automatizado que se lleva el 80% del tiempo manual. Incluye dos sesiones
                    de capacitación, documentación y dos rondas de revisiones.
                  </p>
                  <div className="prow-act">
                    {packageCta('executive', 'pill pill--ghost')}
                    <span className="prow-note">
                      No incluye data warehouse ni modelos a medida
                    </span>
                  </div>
                </div>
              </article>

              <article className="prow" data-rv>
                <div className="prow-price">
                  <b>$12,000</b>
                  <span>desde · por proyecto</span>
                </div>
                <div className="prow-body">
                  <h3>Sala de Control</h3>
                  <p className="prow-facts">
                    <em>10–14 semanas</em> · alcance cerrado por escrito
                  </p>
                  <p className="prow-scope">
                    Para operaciones multi-sistema donde el dato hay que construirlo antes de
                    graficarlo. Data warehouse propio, portal a medida con usuarios y permisos,
                    modelos predictivos dedicados e integraciones con tu CRM o ERP.
                  </p>
                  <div className="prow-act">{packageCta('custom', 'pill pill--ghost')}</div>
                </div>
              </article>

              <p className="lstep lstep--mid" data-rv>
                <span>Etapa 3</span> Cuando el proyecto termina
              </p>
              <article className="prow prow--sm" data-rv>
                <div className="prow-price">
                  <b>$300+</b>
                  <span>al mes · tres niveles</span>
                </div>
                <div className="prow-body">
                  <h3>Soporte Cercano</h3>
                  <p className="prow-scope">
                    Tus dashboards siguen vivos: mantenimiento, ajustes, coaching y WhatsApp
                    prioritario. Prepago anual con dos meses de cortesía. Tres niveles según
                    intensidad; cada uno define sus horas mensuales y no se acumulan.
                  </p>
                  <div className="prow-act">{packageCta('retainer', 'pill pill--ghost')}</div>
                </div>
              </article>
            </div>

            <p className="aside" data-rv>
              ¿Buscas solo un sitio web o una aplicación, sin la parte de datos? También lo hacemos,
              aparte de esta escalera — <Link to="/portfolio/">mira el portafolio</Link>.
            </p>
          </div>
        </section>

        {/* QUOTES */}
        <section id="testimonios">
          <div className="wrap">
            <div className="sec-head" data-rv>
              <div>
                <p className="eyebrow">Testimonios</p>
                <h2 className="sec-title">
                  Lo dicen
                  <br />
                  quienes firman
                </h2>
              </div>
              <p className="sec-lede">
                Citas de proyectos entregados, con la métrica que quedó del otro lado.
              </p>
            </div>
            <div className="quotes">
              <figure className="quote" data-rv>
                <blockquote>
                  “Ver la fuga de margen en repuestos el mismo día, no semanas después. Recuperamos
                  más de $420,000 en el primer año.”
                </blockquote>
                <figcaption>
                  <span className="av">MV</span>
                  <span className="who">
                    Marcus Vance<span>Managing Partner · Apex Auto</span>
                  </span>
                  <span className="kpi">
                    $420k
                    <br />
                    recuperados
                  </span>
                </figcaption>
              </figure>
              <figure className="quote" data-rv>
                <blockquote>
                  “Gestionar 33,000 registros y 14 sistemas era una pesadilla manual. Hoy el SLA está
                  en 99.4% y liberamos 28 horas de supervisores por semana.”
                </blockquote>
                <figcaption>
                  <span className="av b">CF</span>
                  <span className="who">
                    Carolina Flores<span>VP Operaciones · IBH BPO</span>
                  </span>
                  <span className="kpi">
                    99.4%
                    <br />
                    SLA
                  </span>
                </figcaption>
              </figure>
              <figure className="quote" data-rv>
                <blockquote>
                  “Tuvo la paciencia de entender nuestras ideas antes de proponer nada. El primer
                  dashboard funcional llegó en menos de 10 días.”
                </blockquote>
                <figcaption>
                  <span className="av c">MS</span>
                  <span className="who">
                    Meylin Sic<span>Coordinadora de Proyecto</span>
                  </span>
                  <span className="kpi">
                    10 días
                    <br />
                    a producción
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="wrap">
            <div className="sec-head" data-rv>
              <div>
                <p className="eyebrow">Preguntas frecuentes</p>
                <h2 className="sec-title">
                  Lo que
                  <br />
                  más preguntan
                </h2>
              </div>
            </div>
            <div className="faq" data-rv>
              <details>
                <summary>¿El diagnóstico inicial realmente es gratuito?</summary>
                <p>
                  Sí. Es una videollamada de 30 a 45 minutos donde revisamos tus fuentes de datos y te
                  decimos qué se puede automatizar y qué no. Sales con un diagnóstico escrito aunque
                  no contrates nada.
                </p>
              </details>
              <details>
                <summary>¿Necesito un departamento de TI para esto?</summary>
                <p>
                  No. Trabajamos con las herramientas que ya tienes —Excel, Google Sheets, tu CRM, tu
                  ERP— y nos integramos como tu equipo de datos externo. Si hace falta infraestructura
                  nueva, lo decimos antes de empezar y va cotizado aparte.
                </p>
              </details>
              <details>
                <summary>¿De quién son los datos y los dashboards?</summary>
                <p>
                  Tuyos, al 100%. Todo se construye en tus cuentas, con tus licencias. Firmamos NDA
                  antes de tocar cualquier archivo y te entregamos la documentación completa al cierre
                  del proyecto.
                </p>
              </details>
              <details>
                <summary>¿Qué pasa si el alcance crece a mitad del proyecto?</summary>
                <p>
                  Cada paquete define entregables, plazos y exclusiones por escrito antes de arrancar.
                  Si aparece algo fuera de alcance, se cotiza como adición y decides tú — nunca se
                  factura una sorpresa.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CLOSER */}
        <section className="closer" id="agendar">
          <div className="wrap">
            <h2 className="disp closer-disp" data-rv>
              Hablemos <em>de tus datos</em>
            </h2>
            <p
              className="sec-lede"
              style={{ marginInline: 'auto', textAlign: 'center' }}
              data-rv
            >
              Treinta minutos, sin compromiso. Traes tus fuentes y te decimos qué se puede automatizar
              esta misma quincena.
            </p>
            <p className="pkg-echo" id="pkgEcho" hidden={!pickedId}>
              {pickedId ? `Diagnóstico para: ${PACKAGE_NAMES[pickedId]}` : null}
            </p>
            <div className="hero-cta" style={{ marginTop: 30 }} data-rv>
              <a
                className="pill pill--fill"
                href="#agendar"
                onClick={(e) => openBooking(e, pickedId ?? 'general', 'closer')}
              >
                Agendar diagnóstico gratuito
              </a>
              <a
                className="pill pill--ghost"
                href={WA}
                onClick={() => trackWhatsAppClick({ source_section: 'closer', language: 'es' })}
              >
                Escribir por WhatsApp
              </a>
            </div>
            <ul className="guarantees" data-rv>
              <li>Videollamada de 30–45 min</li>
              <li>Diagnóstico escrito aunque no contrates</li>
              <li>NDA antes de tocar un archivo</li>
              <li>Sin contratos forzosos</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <div className="f-grid">
            <div className="f-col f-about">
              <a className="mark" href="#top">
                <i />
                SAGEPOINT
              </a>
              <p>
                Inteligencia de negocios y automatización para empresas en crecimiento. Guatemala y
                Estados Unidos.
              </p>
            </div>
            <nav className="f-col" aria-labelledby="f-servicios">
              <h2 className="f-h" id="f-servicios">
                Servicios
              </h2>
              <ul>
                <li>
                  <a href="#trabajo">Dashboards &amp; BI</a>
                </li>
                <li>
                  <a href="#trabajo">Automatización web</a>
                </li>
                <li>
                  <a href="#trabajo">Automatización en Excel</a>
                </li>
                <li>
                  <a href="#trabajo">Modelos predictivos</a>
                </li>
                <li>
                  <a href="#trabajo">Data coaching</a>
                </li>
              </ul>
            </nav>
            <nav className="f-col" aria-labelledby="f-compania">
              <h2 className="f-h" id="f-compania">
                Compañía
              </h2>
              <ul>
                <li>
                  <a href="#casos">Casos</a>
                </li>
                <li>
                  <Link to="/portfolio/">Portfolio</Link>
                </li>
                <li>
                  <a href="#paquetes">Paquetes</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </nav>
            <nav className="f-col" aria-labelledby="f-contacto">
              <h2 className="f-h" id="f-contacto">
                Contacto
              </h2>
              <ul>
                <li>
                  <a href="#agendar" onClick={(e) => openBooking(e, pickedId ?? 'general', 'footer')}>
                    Agendar diagnóstico
                  </a>
                </li>
                <li>
                  <a
                    href={WA}
                    onClick={() => trackWhatsAppClick({ source_section: 'footer', language: 'es' })}
                  >
                    WhatsApp +502 4046 4716
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="f-bot">
            <p>© 2026 Sagepoint Analytics</p>
            <p>Guatemala &amp; Estados Unidos</p>
          </div>
        </div>
      </footer>

      <BookingModal
        open={booking.open}
        packageId={booking.pkg}
        source={booking.source}
        onClose={() => setBooking((b) => ({ ...b, open: false }))}
      />
    </div>
  );
}
