'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20" style={{ background: 'var(--bg-primary)' }}>
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          {/* 404 number */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            className="mb-8"
          >
            <span className="font-serif text-8xl md:text-9xl text-gold-gradient">404</span>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="luxury-divider w-24 mx-auto mb-8"
            aria-hidden="true"
          />

          {/* Message */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-serif text-3xl text-cream mb-4"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-cream/40 text-sm mb-10 leading-relaxed"
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back to something extraordinary.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Link
                href="/"
                className="btn-gold rounded flex items-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <Home size={16} />
                <span>Back to Home</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Link
                href="/shop"
                className="btn-outline rounded flex items-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <span>Browse Shop</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Go back */}
          <motion.button
            onClick={() => window.history.back()}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 text-cream/30 text-xs hover:text-cream/50 transition-colors flex items-center gap-1.5 mx-auto min-h-[44px] focus:outline-none"
          >
            <ArrowLeft size={12} />
            <span>Go back</span>
          </motion.button>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
