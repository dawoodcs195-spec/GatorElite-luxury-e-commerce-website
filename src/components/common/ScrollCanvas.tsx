'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const T = 120;
const FP = '/frames/ezgif-frame-';
const COLS = [
  { name: 'Onyx Black', slug: 'onyx-black', bg: '#0A0A0A', color: '#1a1a1a' },
  { name: 'Midnight Navy', slug: 'midnight-navy', bg: '#080D1A', color: '#1a2a4a' },
  { name: 'Espresso Brown', slug: 'espresso-brown', bg: '#120A07', color: '#3a2010' },
  { name: 'Cognac Gold', slug: 'cognac-gold', bg: '#181008', color: '#8a6a3a' },
];

// Stagger animation variants for color cards
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

export default function ScrollCanvas() {
  const cRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const [prog, setProg] = useState(0);
  const [bg, setBg] = useState('var(--bg-primary)');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const curRef = useRef(0);

  // Use 'end end' so animation spans the FULL scroll distance of the section
  const { scrollYProgress } = useScroll({ target: cRef, offset: ['start start', 'end end'] });
  const sp = useSpring(scrollYProgress, { stiffness: 100, damping: 40, restDelta: 0.0001 });

  // Phase 1 (0–0.25): Hero text — "GatorElite — The Apex of Luxury"
  const tY = useTransform(sp, [0, 0.25], [0, -120]);
  const tO = useTransform(sp, [0, 0.2, 0.22, 0.25], [1, 1, 0, 0]);

  // Phase 2 (0.2–0.45): "100% Genuine Crocodile Hide"
  const p2O = useTransform(sp, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
  const p2Y = useTransform(sp, [0.2, 0.25], [40, 0]);

  // Phase 3 (0.45–0.65): "Precision Engineered Automatic Mechanism"
  const p3O = useTransform(sp, [0.45, 0.5, 0.6, 0.65], [0, 1, 1, 0]);
  const p3Y = useTransform(sp, [0.45, 0.5], [40, 0]);

  // Phase 4 (0.65–0.95): "Four Signature Colorways" + cards
  const p4O = useTransform(sp, [0.65, 0.7, 0.88, 0.92], [0, 1, 1, 0]);
  const p4Y = useTransform(sp, [0.65, 0.7], [40, 0]);

  // Canvas opacity: fade in early, stay visible through frames, fade out at end
  const cO = useTransform(sp, [0, 0.02, 0.92, 1], [0, 1, 1, 0.3]);

  // Progress bar: fills across entire scroll
  const pw = useTransform(sp, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const imgs2 = [];
    let ld = 0;
    for (let i = 1; i <= T; i++) {
      const img = new Image();
      img.src = FP + String(i).padStart(3, '0') + '.jpg';
      imgs2.push(img);
      const check = () => {
        ld++;
        setProg(Math.round((ld / T) * 100));
        if (ld === T) setReady(true);
      };
      img.onload = check;
      img.onerror = check;
    }
    imgs.current = imgs2;
  }, []);

  const draw = useCallback((fi: number) => {
    const cv = cvRef.current;
    const im = imgs.current[fi];
    if (!cv || !im || !im.complete || !im.naturalWidth) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const sticky = cv.closest('.canvas-sticky') as HTMLElement | null;
    const w = window.innerWidth;
    const h = sticky ? sticky.offsetHeight : window.innerHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    const ia = im.naturalWidth / im.naturalHeight;
    const ca = w / h;
    let dw, dh, ox, oy;
    if (ia > ca) {
      dh = h;
      dw = dh * ia;
      ox = (w - dw) / 2;
      oy = 0;
    } else {
      dw = w;
      dh = dw / ia;
      ox = 0;
      oy = (h - dh) / 2;
    }
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(im, ox, oy, dw, dh);
  }, []);

  useEffect(() => {
    return sp.on('change', (v: number) => {
      const fi = Math.min(Math.floor(v * T), T - 1);
      if (fi !== curRef.current) {
        curRef.current = fi;
        draw(fi);
      }
      // Background color shifts during the last 25% of scroll (frames 90–120)
      if (v >= 0.75 && v <= 1) {
        const cp = (v - 0.75) / 0.25;
        setBg(COLS[Math.min(Math.floor(cp * COLS.length), COLS.length - 1)].bg);
      } else {
        setBg('var(--bg-primary)');
      }

      // Show cards with stagger when entering phase 4
      if (v >= 0.78 && !showCards) {
        setShowCards(true);
      }
    });
  }, [sp, draw, showCards]);

  useEffect(() => {
    const h = () => draw(curRef.current);
    window.addEventListener('resize', h);
    // Also observe the sticky container for mobile viewport changes
    const sticky = cRef.current?.querySelector('.canvas-sticky') as HTMLElement | null;
    let ro: ResizeObserver | null = null;
    if (sticky) {
      ro = new ResizeObserver(() => draw(curRef.current));
      ro.observe(sticky);
    }
    return () => {
      window.removeEventListener('resize', h);
      ro?.disconnect();
    };
  }, [draw]);

  useEffect(() => {
    if (ready) draw(0);
  }, [ready, draw]);

  return (
    <div ref={cRef} className="canvas-section" style={{ position: 'relative' }} aria-label="Interactive product showcase — scroll to explore the GatorÉlite belt">
      {!ready && (
        <div className="preloader" role="status" aria-live="polite" aria-label="Loading product showcase">
          <div className="font-serif text-2xl text-gold tracking-widest">
            Gator<span className="text-cream/60">Elite</span>
          </div>
          <div className="preloader-bar" role="progressbar" aria-valuenow={prog} aria-valuemin={0} aria-valuemax={100} aria-label="Loading progress">
            <div className="preloader-fill" style={{ width: prog + '%' }} />
          </div>
          <p className="text-cream/30 text-xs">Loading — {prog}%</p>
        </div>
      )}

      <div className="canvas-sticky" style={{ backgroundColor: bg, transition: 'background-color 0.8s ease' }}>
        {/* Canvas frame renderer */}
        <motion.div className="absolute inset-0" style={{ opacity: cO }}>
          <canvas ref={cvRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" aria-hidden="true" />

        {/* Progress bar at bottom */}
        <motion.div className="absolute bottom-0 left-0 h-[2px] z-50" style={{ width: pw, background: 'linear-gradient(90deg,#C9A96E,#B87333)' }} aria-hidden="true" />

        {/* Phase 1: Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <motion.div style={{ y: prefersReducedMotion ? 0 : tY, opacity: tO }} className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: prefersReducedMotion ? 0.2 : undefined }}
              className="text-gold/70 text-xs tracking-[0.3em] uppercase mb-6"
            >
              Handcrafted Excellence
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: prefersReducedMotion ? 0.2 : undefined, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-cream leading-[0.95] mb-6"
            >
              Gator<span className="text-gold-gradient">Elite</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: prefersReducedMotion ? 0.2 : undefined }}
              className="text-cream/40 text-sm sm:text-lg font-light max-w-lg"
            >
              The Apex of Luxury
            </motion.p>
          </motion.div>
        </div>

        {/* Phase 2: Authenticity */}
        <motion.div className="absolute inset-0 flex items-center px-6 md:px-16" style={{ opacity: p2O, y: prefersReducedMotion ? 0 : p2Y }}>
          <div className="max-w-lg">
            <p className="text-gold/60 text-xs tracking-[0.2em] uppercase mb-3">Authenticity</p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-cream leading-tight mb-4">100% Genuine<br />Crocodile Hide</h2>
            <p className="text-cream/50 text-sm leading-relaxed">Belly cut selection, hand-selected for its perfectly symmetrical scale pattern.</p>
          </div>
        </motion.div>

        {/* Phase 3: Tagline */}
        <motion.div className="absolute inset-0 flex items-center justify-end px-6 md:px-16" style={{ opacity: p3O, y: prefersReducedMotion ? 0 : p3Y }}>
          <div className="max-w-lg text-right">
            <p className="text-gold/60 text-xs tracking-[0.2em] uppercase mb-3">Presence</p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-cream leading-tight">The finish of luxury,<br />the backbone of power.</h2>
          </div>
        </motion.div>

        {/* Phase 4: Four Colorways — Staggered cards appearing one by one */}
        <motion.div className="absolute inset-0 flex flex-col items-center justify-end pb-24 sm:pb-32 md:pb-40 px-4 sm:px-6" style={{ opacity: p4O, y: prefersReducedMotion ? 0 : p4Y }}>
          <p className="text-gold/60 text-xs tracking-[0.2em] uppercase mb-4">Signature Collection</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-cream text-center mb-8">Four Signature Colorways</h2>

          {/* Staggered color cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 max-w-xs sm:max-w-md md:max-w-2xl w-full"
            initial="hidden"
            animate={showCards ? "visible" : "hidden"}
            variants={prefersReducedMotion ? undefined : staggerContainer}
          >
            {COLS.map((c, index) => (
              <motion.a
                key={c.slug}
                href={`/product/${c.slug}`}
                variants={prefersReducedMotion ? undefined : cardVariant}
                className="group glass rounded-xl p-5 text-center hover:border-gold/40 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] min-h-[44px]"
                aria-label={`Explore ${c.name} belt`}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Color circle with inner shadow */}
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-3 border-2 border-gold/30 group-hover:border-gold transition-all duration-300 relative overflow-hidden"
                  style={{ backgroundColor: c.color }}
                  aria-hidden="true"
                >
                  {/* Inner highlight */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
                  {/* Border glow on hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-gold/60" />
                </div>
                <p className="text-cream text-xs tracking-wider mb-2">{c.name}</p>
                <span className="text-gold text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Explore →</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator (hides after first scroll) */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20" style={{ opacity: tO }} aria-hidden="true">
          <p className="text-cream/30 text-[10px] tracking-widest uppercase">Scroll to Explore</p>
          <motion.div animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-5 h-8 border border-cream/20 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-gold rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
