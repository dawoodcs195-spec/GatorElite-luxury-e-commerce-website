'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, LogOut, Save, Package, Heart, ShoppingCart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (!data.authenticated) {
        router.push('/login');
        return;
      }

      // Get full profile
      const profileResponse = await fetch('/api/auth/profile');
      const profileData = await profileResponse.json();

      if (profileData.success) {
        setUser(profileData.user);
        setForm({
          name: profileData.user.name || '',
          phone: profileData.user.phone || '',
          address: profileData.user.address || {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser({ ...user!, ...form });
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
            <p className="text-cream/30 text-sm mt-4">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
          <div className="text-center glass rounded-2xl p-8 max-w-md">
            <User size={48} className="text-gold/40 mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-cream mb-2">Sign In Required</h2>
            <p className="text-cream/40 text-sm mb-6">Please sign in to view your profile.</p>
            <Link href="/login" className="btn-gold rounded inline-block min-h-[44px]">
              <span>Sign In</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 border-2 border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={36} className="text-gold" />
            </div>
            <h1 className="font-serif text-3xl text-cream mb-2">{user.name}</h1>
            <div className="flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${
                user.role === 'admin' 
                  ? 'bg-gold/20 text-gold border border-gold/30' 
                  : 'bg-cream/10 text-cream/60 border border-cream/20'
              }`}>
                <Shield size={12} className="inline mr-1" />
                {user.role}
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Quick actions */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-serif text-lg text-cream mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors p-2 rounded-lg hover:bg-gold/5 min-h-[44px]"
                  >
                    <ShoppingCart size={18} />
                    <span className="text-sm">My Orders</span>
                  </Link>
                  <Link
                    href="/shop"
                    className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors p-2 rounded-lg hover:bg-gold/5 min-h-[44px]"
                  >
                    <Package size={18} />
                    <span className="text-sm">Browse Shop</span>
                  </Link>
                  <Link
                    href="/story"
                    className="flex items-center gap-3 text-cream/60 hover:text-gold transition-colors p-2 rounded-lg hover:bg-gold/5 min-h-[44px]"
                  >
                    <Heart size={18} />
                    <span className="text-sm">Our Story</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 text-gold hover:text-gold/80 transition-colors p-2 rounded-lg hover:bg-gold/5 min-h-[44px]"
                    >
                      <Shield size={18} />
                      <span className="text-sm">Admin Dashboard</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Account info */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-serif text-lg text-cream mb-4">Account</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-cream/40">
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-cream/40">
                    <Shield size={14} />
                    <span>Role: {user.role}</span>
                  </div>
                  {user.lastLogin && (
                    <div className="text-cream/30 text-xs">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/20 rounded-xl text-red-400/60 hover:border-red-500 hover:text-red-400 transition-colors min-h-[44px]"
              >
                <LogOut size={16} />
                <span className="text-sm">Sign Out</span>
              </button>
            </motion.div>

            {/* Main content */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl text-cream">Profile Details</h3>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-gold text-sm hover:text-gold/80 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {/* Message */}
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 px-4 py-3 rounded-lg text-sm ${
                      message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-cream/50 text-xs uppercase mb-2">Full Name</label>
                    {editing ? (
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-[#161616] border border-gold/10 rounded-lg pl-11 pr-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]"
                        />
                      </div>
                    ) : (
                      <p className="text-cream text-sm">{user.name}</p>
                    )}
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-cream/50 text-xs uppercase mb-2">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full bg-[#161616]/50 border border-gold/10 rounded-lg pl-11 pr-4 py-3 text-cream/50 text-sm cursor-not-allowed min-h-[44px]"
                      />
                    </div>
                    <p className="text-cream/30 text-xs mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-cream/50 text-xs uppercase mb-2">Phone</label>
                    {editing ? (
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-[#161616] border border-gold/10 rounded-lg pl-11 pr-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                    ) : (
                      <p className="text-cream text-sm">{user.phone || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-cream/50 text-xs uppercase mb-2">Address</label>
                    {editing ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" />
                          <input
                            type="text"
                            value={form.address.street}
                            onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                            className="w-full bg-[#161616] border border-gold/10 rounded-lg pl-11 pr-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]"
                            placeholder="Street address"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={form.address.city}
                            onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                            className="bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            value={form.address.state}
                            onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                            className="bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]"
                            placeholder="State"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={form.address.zip}
                            onChange={(e) => setForm({ ...form, address: { ...form.address, zip: e.target.value } })}
                            className="bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]"
                            placeholder="ZIP code"
                          />
                          <input
                            type="text"
                            value={form.address.country}
                            onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })}
                            className="bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none min-h-[44px]"
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-cream text-sm">
                        {user.address
                          ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zip}`
                          : 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Save/Cancel buttons */}
                  {editing && (
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-gold rounded flex items-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        <span>Save Changes</span>
                      </motion.button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setForm({
                            name: user.name,
                            phone: user.phone || '',
                            address: user.address || {
                              street: '',
                              city: '',
                              state: '',
                              zip: '',
                              country: '',
                            },
                          });
                          setMessage({ type: '', text: '' });
                        }}
                        className="px-6 py-3 border border-gold/20 rounded text-cream/50 text-sm hover:border-gold/40 hover:text-cream transition-colors min-h-[44px]"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
