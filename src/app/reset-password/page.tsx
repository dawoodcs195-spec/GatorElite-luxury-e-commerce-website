'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check if token exists on mount
  useEffect(() => {
    if (!token) {
      setError('No reset token found. Please request a new password reset link.');
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
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
              {success ? (
                <CheckCircle size={28} className="text-gold" />
              ) : (
                <Lock size={28} className="text-gold" />
              )}
            </motion.div>
            <h1 className="font-serif text-3xl text-cream mb-2">
              {success ? 'Password Updated' : 'New Password'}
            </h1>
            <p className="text-cream/40 text-sm">
              {success ? 'Your password has been changed successfully' : 'Enter your new password below'}
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <p className="text-cream/50 text-sm mb-6">
                You can now sign in with your new password.
              </p>
              <div className="luxury-divider mb-6" aria-hidden="true" />
              <Link
                href="/login"
                className="btn-gold rounded flex items-center justify-center gap-2 w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <span>Sign In</span>
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

              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-cream/50 text-xs uppercase mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#161616] border border-gold/10 rounded-lg pl-11 pr-12 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] min-h-[44px] transition-all duration-300"
                    placeholder="••••••••"
                    minLength={6}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-cream/30 text-xs mt-1.5">Minimum 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-cream/50 text-xs uppercase mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#161616] border border-gold/10 rounded-lg pl-11 pr-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] min-h-[44px] transition-all duration-300"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || !token || !password || !confirmPassword}
                className="btn-gold rounded w-full flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
              </motion.button>

              {/* Divider */}
              <div className="luxury-divider my-6" aria-hidden="true" />

              {/* Links */}
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-cream/40 text-xs hover:text-cream/60 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <ArrowLeft size={12} />
                  <span>Request a new reset link</span>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
          <div className="text-cream/30 text-sm">Loading...</div>
        </main>
        <Footer />
      </>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
