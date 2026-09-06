'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20" style={{ background: 'var(--bg-primary)' }}>
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
              className="w-16 h-16 border-2 border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <KeyRound size={28} className="text-gold" />
            </motion.div>
            <h1 className="font-serif text-3xl text-cream mb-2">Reset Password</h1>
            <p className="text-cream/40 text-sm">Enter your email and we&apos;ll send you a reset link</p>
          </div>

          {/* Form or Success */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass rounded-2xl p-8 text-center"
              role="status"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
                className="w-16 h-16 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-gold text-2xl">✓</span>
              </motion.div>
              <h3 className="font-serif text-2xl text-cream mb-3">Check Your Email</h3>
              <p className="text-cream/40 text-sm mb-6">
                If an account with <span className="text-cream/60">{email}</span> exists, we&apos;ve sent a password reset link.
              </p>
              <p className="text-cream/30 text-xs mb-6">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <div className="luxury-divider mb-6" aria-hidden="true" />
              <Link
                href="/login"
                className="text-gold hover:text-gold/80 transition-colors text-sm flex items-center justify-center gap-2 min-h-[44px]"
              >
                <ArrowLeft size={14} />
                <span>Back to Sign In</span>
              </Link>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-8 space-y-6"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-cream/50 text-xs uppercase mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#161616] border border-gold/10 rounded-lg pl-11 pr-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] min-h-[44px] transition-all duration-300"
                    placeholder="you@example.com"
                    autoFocus
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || !email}
                className="btn-gold rounded w-full flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </motion.button>

              {/* Divider */}
              <div className="luxury-divider my-6" aria-hidden="true" />

              {/* Links */}
              <div className="text-center space-y-4">
                <p className="text-cream/40 text-sm">
                  Remember your password?{' '}
                  <Link href="/login" className="text-gold hover:text-gold/80 transition-colors">
                    Sign in
                  </Link>
                </p>
                <Link href="/" className="text-cream/30 text-xs hover:text-cream/50 transition-colors">
                  Back to Home
                </Link>
              </div>
            </motion.form>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
