'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={shouldReduceMotion ? { opacity: 0 } : 'initial'}
        animate={shouldReduceMotion ? { opacity: 1 } : 'animate'}
        exit={shouldReduceMotion ? { opacity: 0 } : 'exit'}
        variants={shouldReduceMotion ? undefined : pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
