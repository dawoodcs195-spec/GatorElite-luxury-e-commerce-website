'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SignupPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to profile
      router.push('/profile');
      router.refresh();
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
              <UserPlus size={28} className="text-gold" />
            </motion.div>
            <h1 className="font-serif text-3xl text-cream mb-2">Create Account</h1>
            <p className="text-cream/40 text-sm">Join the GatorÉlite family</p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-cream/50 text-xs uppercase mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161616] border border-gold/10 rounded-lg pl-11 pr-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] min-h-[44px] transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-cream/50 text-xs uppercase mb-2">
                Password
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
                  placeholder="••••••"
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
              <p className="text-cream/30 text-xs mt-1">At least 6 characters</p>
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
                  placeholder="••••••"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || !name || !email || !password || !confirmPassword || password !== confirmPassword || password.length < 6}
              className="btn-gold rounded w-full flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>

            {/* Legal agreement */}
            <p className="text-cream/30 text-xs text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-cream/50 hover:text-gold transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-cream/50 hover:text-gold transition-colors">Privacy Policy</Link>.
            </p>

            {/* Divider */}
            <div className="luxury-divider my-6" aria-hidden="true" />

            {/* Links */}
            <div className="text-center space-y-4">
              <p className="text-cream/40 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-gold hover:text-gold/80 transition-colors">
                  Sign in
                </Link>
              </p>
              <Link href="/" className="text-cream/30 text-xs hover:text-cream/50 transition-colors">
                Back to Home
              </Link>
            </div>
          </motion.form>

          {/* Note about first user */}
          <motion.div
            className="mt-6 glass rounded-xl p-4 text-center"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-cream/30 text-xs">
              <span className="text-gold">Note:</span> The first user to register becomes the admin.
            </p>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
