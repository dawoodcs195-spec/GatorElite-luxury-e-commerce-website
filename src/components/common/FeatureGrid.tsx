'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { Palette, Gem, Ruler } from 'lucide-react';

const FEATURES = [
  { icon: Palette, title: 'Hand-Dyeing Process', description: 'Each belt undergoes a traditional vegetable tanning process using proprietary dyes, producing deep, rich tones.' },
  { icon: Gem, title: 'Solid Brass Hardware', description: 'Buckles are cast from solid brass and hand-burnished to a warm patina. Anti-tarnish coating ensures lasting brilliance.' },
  { icon: Ruler, title: 'Perfect Micro-Adjust Fit', description: 'The precision ratchet track offers 38 discrete positions across 3 inches of adjustment.' },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function FeatureGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }} aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.8 }}
          className="text-center mb-14 sm:mb-20"
        >
          <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">Craftsmanship</p>
          <h2 id="features-heading" className="font-serif text-3xl md:text-5xl text-cream mb-4">The Art of Perfection</h2>
          <div className="luxury-divider w-24 mx-auto mt-6" aria-hidden="true" />
        </motion.div>

        <motion.div
          variants={shouldReduceMotion ? undefined : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6"
          role="list"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={shouldReduceMotion ? undefined : cardVariant}
              whileHover={shouldReduceMotion ? {} : { y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group glass rounded-2xl p-6 sm:p-8 border border-gold/5 hover:border-gold/25 transition-colors duration-500 cursor-default"
              role="listitem"
            >
              <motion.div
                className="w-14 h-14 border border-gold/20 rounded-xl flex items-center justify-center mb-6 group-hover:border-gold/40 transition-colors duration-500"
                whileHover={shouldReduceMotion ? {} : { rotate: 5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <f.icon size={24} className="text-gold" strokeWidth={1.5} aria-hidden="true" />
              </motion.div>
              <h3 className="font-serif text-xl text-cream mb-3">{f.title}</h3>
              <p className="text-cream/40 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
