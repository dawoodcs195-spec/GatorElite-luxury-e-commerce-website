'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, User, Mail, Phone, MapPin, CreditCard, Shield, Truck } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';
import { SPRING, staggerContainer, fadeInUp } from '@/lib/motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPriceFormatted, totalPrice, clearCart } = useCartStore();
  const [fd, setFd] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'Pakistan',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated && d.user) {
          setUser(d.user);
          setFd(prev => ({ ...prev, name: d.user.name || '', email: d.user.email || '' }));
        }
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
          <div className="text-center glass rounded-2xl p-12 max-w-md">
            <ShoppingBag size={48} className="text-gold/20 mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-cream mb-2">Your cart is empty</h2>
            <p className="text-cream/40 text-sm mb-6">Add some items before checking out.</p>
            <Link href="/shop" className="btn-gold rounded inline-block min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50">
              <span>Browse Shop</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fd.name || !fd.email || !fd.address || !fd.city) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const orderItems = items.map(item => ({
        productId: item.slug,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || undefined,
          customerName: fd.name,
          customerEmail: fd.email,
          items: orderItems,
          totalAmount: totalPrice(),
          shipping: {
            address: fd.address,
            city: fd.city,
            state: fd.state,
            zip: fd.zip,
            country: fd.country,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push('/order-success?orderId=' + data.order._id);
      } else {
        setError(data.error || 'Failed to place order. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-[#161616] border border-gold/10 rounded-lg px-4 py-3 text-cream text-sm focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] min-h-[44px] transition-all duration-300";

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl text-cream mb-8"
          >
            Checkout
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
              <motion.div className="glass rounded-2xl p-6 space-y-4" initial="hidden" animate="visible" variants={shouldReduceMotion ? undefined : staggerContainer}>
                <h3 className="font-serif text-lg text-cream flex items-center gap-2"><User size={18} className="text-gold" /> Contact Information</h3>
                <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                  <label className="block text-cream/50 text-xs uppercase mb-2">Full Name *</label>
                  <input type="text" required value={fd.name} onChange={(e) => setFd({ ...fd, name: e.target.value })} className={inputClass} placeholder="Your full name" />
                </motion.div>
                <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                  <label className="block text-cream/50 text-xs uppercase mb-2">Email *</label>
                  <input type="email" required value={fd.email} onChange={(e) => setFd({ ...fd, email: e.target.value })} className={inputClass} placeholder="your@email.com" />
                </motion.div>
                <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                  <label className="block text-cream/50 text-xs uppercase mb-2">Phone</label>
                  <input type="tel" value={fd.phone} onChange={(e) => setFd({ ...fd, phone: e.target.value })} className={inputClass} placeholder="+92 300 1234567" />
                </motion.div>
              </motion.div>

              <motion.div className="glass rounded-2xl p-6 space-y-4" initial="hidden" animate="visible" variants={shouldReduceMotion ? undefined : staggerContainer}>
                <h3 className="font-serif text-lg text-cream flex items-center gap-2"><MapPin size={18} className="text-gold" /> Shipping Address</h3>
                <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                  <label className="block text-cream/50 text-xs uppercase mb-2">Street Address *</label>
                  <input type="text" required value={fd.address} onChange={(e) => setFd({ ...fd, address: e.target.value })} className={inputClass} placeholder="Street address" />
                </motion.div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                    <label className="block text-cream/50 text-xs uppercase mb-2">City *</label>
                    <input type="text" required value={fd.city} onChange={(e) => setFd({ ...fd, city: e.target.value })} className={inputClass} placeholder="City" />
                  </motion.div>
                  <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                    <label className="block text-cream/50 text-xs uppercase mb-2">State</label>
                    <input type="text" value={fd.state} onChange={(e) => setFd({ ...fd, state: e.target.value })} className={inputClass} placeholder="State" />
                  </motion.div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                    <label className="block text-cream/50 text-xs uppercase mb-2">ZIP Code</label>
                    <input type="text" value={fd.zip} onChange={(e) => setFd({ ...fd, zip: e.target.value })} className={inputClass} placeholder="ZIP" />
                  </motion.div>
                  <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                    <label className="block text-cream/50 text-xs uppercase mb-2">Country</label>
                    <input type="text" value={fd.country} onChange={(e) => setFd({ ...fd, country: e.target.value })} className={inputClass} />
                  </motion.div>
                </div>
              </motion.div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
              )}

              <motion.div variants={shouldReduceMotion ? undefined : fadeInUp}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-gold rounded w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-40 flex items-center justify-center gap-2"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  transition={SPRING}
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard size={16} /> Place Order — {totalPriceFormatted()}</>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-4 sm:p-6 sticky top-28">
                <h3 className="font-serif text-lg text-cream mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gold/5 last:border-0">
                      <div className="w-12 h-12 rounded-lg bg-[#161616] border border-gold/10 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag size={16} className="text-gold/40" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream text-sm font-medium truncate">{item.name}</p>
                        <p className="text-cream/40 text-xs">{item.color}{item.size ? ` · ${item.size}` : ''} × {item.quantity}</p>
                      </div>
                      <span className="text-cream text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gold/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-cream/50">Subtotal</span><span className="text-cream">{totalPriceFormatted()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-cream/50">Shipping</span><span className="text-green-400">Free</span></div>
                  <div className="luxury-divider my-2" />
                  <div className="flex justify-between"><span className="text-cream/70 font-medium">Total</span><span className="text-gold font-serif text-xl">{totalPriceFormatted()}</span></div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-cream/30 text-xs"><Shield size={12} /> Secure checkout</div>
                  <div className="flex items-center gap-2 text-cream/30 text-xs"><Truck size={12} /> Free shipping nationwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
