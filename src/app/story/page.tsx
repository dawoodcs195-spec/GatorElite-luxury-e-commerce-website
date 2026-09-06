'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SPRING } from '@/lib/motion';
import {
  Shield,
  Gem,
  Award,
  Heart,
  Star,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    n: '01',
    t: 'The Selection',
    d: 'Every GatorElite journey begins at the source. Our scouts travel to select farms across Southeast Asia and Northern Australia to hand-pick crocodile hides of the highest grade — free from blemishes, with uniform scale patterns and rich natural colour. Fewer than one in ten hides meet our standard.',
    icon: Gem,
    img: '/p1.jpg',
  },
  {
    n: '02',
    t: 'The Tanning',
    d: 'We use a proprietary vegetable-tanning process that takes up to 45 days. Unlike chrome tanning, our method preserves the hide\'s natural grain, gives it a distinctive hand-feel, and develops a rich patina over years of wear. The result is leather that ages beautifully rather than deteriorating.',
    icon: Clock,
    img: '/p2.jpg',
  },
  {
    n: '03',
    t: 'The Cutting',
    d: 'Each hide is unique. Our master cutters study the scale pattern, thickness, and natural markings before making a single cut. Every belt is cut to maximise visual symmetry across the length — a step that takes time but separates true luxury from mass production.',
    icon: Shield,
    img: '/p3.jpg',
  },
  {
    n: '04',
    t: 'The Stitching',
    d: 'We use traditional saddle-stitching — two needles, one waxed linen thread, each stitch locked by hand. Unlike machine stitching, a saddle-stitched seam won\'t unravel even if a single thread breaks. Each belt takes over an hour of hand-stitching to complete.',
    icon: Heart,
    img: '/p4.jpg',
  },
  {
    n: '05',
    t: 'The Burnishing',
    d: 'The edges are hand-burnished using a heated brass wheel — layer upon layer of natural wax is melted into the leather until the edge is glass-smooth. This signature GatorElite finish prevents fraying and gives every belt a refined, polished profile.',
    icon: Award,
    img: '/p5.jpg',
  },
  {
    n: '06',
    t: 'The Finishing',
    d: 'Final quality inspection is done by hand under natural light. Every stitch, every edge, every buckle is examined. Only then does the GatorElite mark get stamped — our guarantee of a lifetime of wear. Each belt is packaged in a signature presentation box.',
    icon: Star,
    img: '/p6.jpg',
  },
];

const STATS = [
  { value: '12+', label: 'Years of Craft', icon: Clock },
  { value: '50K+', label: 'Belts Delivered', icon: Award },
  { value: '18', label: 'Countries Served', icon: MapPin },
  { value: '100%', label: 'Handcrafted', icon: Heart },
];

const VALUES = [
  {
    title: 'Heritage Over Hype',
    desc: 'We don\'t chase trends. Every design is rooted in centuries-old leathercraft tradition, refined for the modern connoisseur.',
  },
  {
    title: 'Materials Without Compromise',
    desc: 'Full-grain crocodile leather, solid brass hardware, waxed linen thread — we use only what lasts.',
  },
  {
    title: 'Transparent Origins',
    desc: 'Every hide is traceable to its source. We work exclusively with farms that meet international animal welfare standards.',
  },
  {
    title: 'Lifetime Commitment',
    desc: 'Every GatorElite belt comes with a craftsmanship warranty. If it ever needs repair, we\'ll restore it — no questions asked.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'I\'ve owned belts from the world\'s most famous houses. GatorElite is the only one I reach for daily — the patina after two years is extraordinary.',
    author: 'Asad K.',
    role: 'Collector, Dubai',
  },
  {
    quote: 'The attention to detail is on another level. You can feel the craft the moment you pick it up. It\'s not just a belt — it\'s an heirloom.',
    author: 'Bilal M.',
    role: 'Entrepreneur, London',
  },
  {
    quote: 'I gifted one to my father. He\'s worn luxury brands for decades and said this is the finest belt he\'s ever owned. That says everything.',
    author: 'Hamza R.',
    role: 'Banker, Islamabad',
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const stepVariant = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: SPRING },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function StoryPage() {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const craftRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, 120]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const { scrollYProgress: craftScroll } = useScroll({
    target: craftRef,
    offset: ['start 80%', 'end 60%'],
  });
  const lineHeight = useTransform(craftScroll, [0, 1], ['0%', '100%']);

  return (
    <>
      <Header />
      <main className="min-h-screen relative" style={{ background: 'var(--bg-primary)' }}>
        <div className="fixed inset-0 -z-10" style={{ background: 'var(--bg-gradient)' }} aria-hidden="true" />

        {/* ============================================================ */}
        {/*  HERO                                                        */}
        {/* ============================================================ */}
        <section ref={heroRef} className="relative pt-32 pb-24 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
          {/* Decorative gold radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10 bg-gold blur-[120px] pointer-events-none" aria-hidden="true" />

          <motion.div
            style={shouldReduceMotion ? {} : { y: heroY, opacity: heroOpacity }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-6"
            >
              Our Story
            </motion.p>

            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.05] mb-8"
            >
              The Art of<br />
              <span className="text-gold-gradient">Timeless Craft</span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-cream/50 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Born from a reverence for heritage leathercraft and an obsession with
              perfection — GatorElite transforms the world's finest crocodile hides
              into belts that last a lifetime.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="luxury-divider w-40 mx-auto mb-12"
              aria-hidden="true"
            />

            {/* Hero banner image */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto rounded-2xl overflow-hidden border border-gold/10 max-h-[35vh] sm:max-h-[40vh]"
            >
              <img
                src="/p.jpg"
                alt="GatorElite craftsmanship banner"
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle bottom gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/*  ORIGIN STORY                                                */}
        {/* ============================================================ */}
        <section className="py-24 px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={shouldReduceMotion ? undefined : fadeIn}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <div>
                <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">The Beginning</p>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-cream leading-tight mb-6">
                  Where It All<br />
                  <span className="text-gold-gradient">Started</span>
                </h2>
                <div className="space-y-4 text-cream/50 text-sm leading-relaxed">
                  <p>
                    GatorElite was founded with a simple conviction: a man&apos;s belt should be
                    crafted with the same care as a fine watch or a bespoke suit. In a world
                    flooded with mass-produced accessories, we chose a different path.
                  </p>
                  <p>
                    Our founder spent years apprenticing under master leather craftsmen in
                    Italy and Japan — learning techniques passed down through generations —
                    before bringing that knowledge home to create something new.
                  </p>
                  <p>
                    What began as a one-man workshop has grown into a team of artisans who
                    share the same uncompromising standards. Every GatorElite belt that
                    leaves our workshop carries that original vision: luxury built to endure.
                  </p>
                </div>
              </div>

              {/* Visual element — decorative card */}
              <div className="relative">
                <div className="glass rounded-2xl p-8 md:p-10 border border-gold/10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Gem className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-cream font-medium text-sm">Sourced Responsibly</p>
                        <p className="text-cream/40 text-xs">Traceable origins from farm to finish</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-cream font-medium text-sm">Lifetime Warranty</p>
                        <p className="text-cream/40 text-xs">We stand behind every piece we craft</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-cream font-medium text-sm">100% Handcrafted</p>
                        <p className="text-cream/40 text-xs">No assembly lines — just skilled hands</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow behind card */}
                <div className="absolute -inset-4 rounded-3xl bg-gold/5 blur-xl -z-10" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/*  STATS                                                       */}
        {/* ============================================================ */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={shouldReduceMotion ? undefined : staggerContainer}
            >
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={shouldReduceMotion ? undefined : fadeUp}
                    className="glass rounded-xl p-4 sm:p-6 text-center border border-gold/5"
                  >
                    <Icon className="w-5 h-5 text-gold/40 mx-auto mb-3" />
                    <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-gold mb-1">{stat.value}</p>
                    <p className="text-cream/40 text-xs tracking-wide uppercase">{stat.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  CRAFTSMANSHIP STEPS                                         */}
        {/* ============================================================ */}
        <section ref={craftRef} className="relative py-24 px-6" aria-labelledby="craftsmanship-steps">
          <div className="max-w-4xl mx-auto relative">
            {/* Gold accent progress line */}
            <motion.div
              className="absolute left-0 top-0 w-px hidden md:block"
              style={{ height: lineHeight }}
              aria-hidden="true"
            >
              <div className="w-full h-full bg-gradient-to-b from-gold/60 via-gold/30 to-gold/60" />
              {/* Glowing dot at the tip */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(201,169,110,0.6)]"
                style={{ opacity: useTransform(craftScroll, [0, 0.05, 0.95, 1], [0, 1, 1, 0]) }}
              />
            </motion.div>

            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={shouldReduceMotion ? undefined : fadeUp}
            >
              <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">The Process</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-cream leading-tight mb-4">
                Six Steps to<br />
                <span className="text-gold-gradient">Perfection</span>
              </h2>
              <p className="text-cream/40 text-sm max-w-xl mx-auto">
                Every GatorElite belt passes through six meticulous stages — no shortcuts,
                no machines, no compromises.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={shouldReduceMotion ? undefined : staggerContainer}
            >
              {STEPS.flatMap((step, idx) => {
                const Icon = step.icon;
                const stepEl = (
                  <motion.div
                    key={step.n}
                    variants={shouldReduceMotion ? undefined : stepVariant}
                    className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-4 sm:gap-6 md:gap-8 items-start py-8 sm:py-16"
                  >
                    <div className="flex flex-col items-center md:items-start gap-3">
                      <motion.span
                        className="font-serif text-gold/20 text-4xl sm:text-5xl md:text-7xl leading-none select-none"
                        aria-hidden="true"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.1, color: '#C9A96E' }}
                        transition={SPRING}
                      >
                        {step.n}
                      </motion.span>
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mt-2">
                        <Icon className="w-4 h-4 text-gold/60" />
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-cream mb-4">{step.t}</h3>
                      <p className="text-cream/45 text-sm leading-relaxed mb-6">{step.d}</p>
                    </div>
                    <motion.div
                      className="rounded-xl overflow-hidden border border-gold/10 md:mt-0"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                      transition={SPRING}
                    >
                      <img
                        src={step.img}
                        alt={step.t}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                    </motion.div>
                  </motion.div>
                );

                if (idx < STEPS.length - 1) {
                  return [
                    stepEl,
                    <div
                      key={`fade-${step.n}`}
                      className="relative h-32 -my-10 pointer-events-none"
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/80 to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,transparent_70%)]" />
                    </div>,
                  ];
                }
                return [stepEl];
              })}
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  BRAND VALUES                                                */}
        {/* ============================================================ */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={shouldReduceMotion ? undefined : fadeUp}
            >
              <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">What We Stand For</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-cream leading-tight">
                Our <span className="text-gold-gradient">Values</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={shouldReduceMotion ? undefined : staggerContainer}
            >
              {VALUES.map((v) => (
                <motion.div
                  key={v.title}
                  variants={shouldReduceMotion ? undefined : fadeUp}
                  className="glass rounded-xl p-8 border border-gold/5 hover:border-gold/20 transition-colors duration-500"
                  whileHover={shouldReduceMotion ? {} : { y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                >
                  <h3 className="font-serif text-xl text-cream mb-3">{v.title}</h3>
                  <p className="text-cream/45 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  TESTIMONIALS                                                */}
        {/* ============================================================ */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={shouldReduceMotion ? undefined : fadeUp}
            >
              <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">Client Voices</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-cream leading-tight">
                Worn & <span className="text-gold-gradient">Cherished</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={shouldReduceMotion ? undefined : staggerContainer}
            >
              {TESTIMONIALS.map((t, i) => (
                <motion.blockquote
                  key={i}
                  variants={shouldReduceMotion ? undefined : fadeUp}
                  className="glass rounded-xl p-6 sm:p-8 border border-gold/5 flex flex-col"
                  whileHover={shouldReduceMotion ? {} : { y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className="w-3.5 h-3.5 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-cream/60 text-sm leading-relaxed italic flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer>
                    <p className="text-cream font-medium text-sm">{t.author}</p>
                    <p className="text-cream/30 text-xs">{t.role}</p>
                  </footer>
                </motion.blockquote>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  CTA                                                         */}
        {/* ============================================================ */}
        <section className="py-24 px-6 text-center">
          <motion.div
            className="max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={shouldReduceMotion ? undefined : fadeUp}
          >
            <p className="text-cream/40 text-sm mb-6 leading-relaxed">
              Every GatorElite belt begins its journey in the hands of a master
              craftsman. yours is waiting.
            </p>
            <motion.a
              href="/shop"
              className="btn-gold rounded inline-block min-h-[44px] px-10 focus:outline-none focus:ring-2 focus:ring-gold/50"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={SPRING}
            >
              <span>Discover the Collection</span>
            </motion.a>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
