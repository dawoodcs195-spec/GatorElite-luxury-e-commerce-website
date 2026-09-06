'use client';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { SPRING, staggerContainer, fadeInUp } from '@/lib/motion';

export default function ContactPage() {
  const [fd, setFd] = useState({ name: '', email: '', message: '' });
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const shouldReduceMotion = useReducedMotion();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fd),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">Get in Touch</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream mb-4">Contact Us</h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="luxury-divider w-24 mx-auto mt-6"
              aria-hidden="true"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact form */}
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={SPRING}
                className="glass rounded-2xl p-12 text-center"
                role="status"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, ...SPRING }}
                  className="w-16 h-16 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <span className="text-gold text-2xl">✓</span>
                </motion.div>
                <h3 className="font-serif text-2xl text-cream mb-3">Message Sent</h3>
                <p className="text-cream/40 text-sm">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6"
                aria-label="Contact form"
                initial="hidden"
                animate="visible"
                variants={shouldReduceMotion ? undefined : staggerContainer}
              >
                <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                  <label htmlFor="contact-name" className="block text-cream/50 text-xs uppercase mb-2">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={fd.name}
                    onChange={(e) => setFd({ ...fd, name: e.target.value })}
                    className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] min-h-[44px] transition-all duration-300"
                  />
                </motion.div>
                <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                  <label htmlFor="contact-email" className="block text-cream/50 text-xs uppercase mb-2">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={fd.email}
                    onChange={(e) => setFd({ ...fd, email: e.target.value })}
                    className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] min-h-[44px] transition-all duration-300"
                  />
                </motion.div>
                <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                  <label htmlFor="contact-message" className="block text-cream/50 text-xs uppercase mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={fd.message}
                    onChange={(e) => setFd({ ...fd, message: e.target.value })}
                    className="w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] resize-none transition-all duration-300"
                  />
                </motion.div>
                <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                  {error && (
                    <p className="text-red-400 text-xs">{error}</p>
                  )}
                  <motion.button
                    type="submit"
                    disabled={sending}
                    className="btn-gold rounded w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-40"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={SPRING}
                  >
                    <span>{sending ? 'Sending...' : 'Send'}</span>
                  </motion.button>
                </motion.div>
              </motion.form>
            )}

            {/* WhatsApp concierge */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass rounded-2xl p-5 sm:p-8 flex flex-col justify-center"
            >
              <h3 className="font-serif text-2xl text-cream mb-4">Prefer to chat?</h3>
              <p className="text-cream/40 text-sm mb-6 leading-relaxed">
                Connect with our luxury concierge team directly via WhatsApp for instant assistance with orders, sizing, or bespoke requests.
              </p>
              <WhatsAppButton variant="inline" />
              <p className="text-cream/20 text-xs mt-4 text-center">
                Available Monday–Saturday, 10am–8pm PKT
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
