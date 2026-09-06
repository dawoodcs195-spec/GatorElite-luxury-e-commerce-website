'use client';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShoppingBag } from 'lucide-react';
import { SPRING, staggerContainer, fadeInUp } from '@/lib/motion';

interface Product {
  _id: string;
  name: string;
  slug: string;
  subtitle: string;
  price: number;
  priceFormatted: string;
  rating: number;
  colorName: string;
  colorHex: string;
  images: string[];
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        setProducts(Array.isArray(d) ? d.filter((p: Product & { isActive?: boolean }) => (p as any).isActive) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.authenticated && d.user.role === 'admin') setIsAdmin(true); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 relative" style={{ background: 'var(--bg-primary)' }}>
        <div className="fixed inset-0 -z-10" style={{ background: 'var(--bg-gradient)' }} aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">Collection</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream mb-4">Shop GatorElite</h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="luxury-divider w-24 mx-auto mt-6"
              aria-hidden="true"
            />
          </motion.div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-20" role="status" aria-label="Loading products">
              <motion.div
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full mx-auto"
              />
              <span className="sr-only">Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-cream/30 text-sm">No products yet. Add some in the admin!</p>
              {isAdmin && (
              <Link href="/admin" className="btn-gold rounded inline-block mt-6 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50">
                <span>Admin</span>
              </Link>
            )}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              initial="hidden"
              animate="visible"
              variants={shouldReduceMotion ? undefined : staggerContainer}
            >
              {products.map((p) => (
                <motion.div key={p._id} variants={shouldReduceMotion ? undefined : fadeInUp} whileHover={shouldReduceMotion ? {} : { y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}>
                  <Link
                    href={'/product/' + p.slug}
                    className="group block glass rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
                    aria-label={`${p.name} — ${p.colorName} — ${p.priceFormatted}`}
                  >
                    <motion.div
                      className="aspect-square relative overflow-hidden"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                      transition={SPRING}
                    >
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={p.images[0]}
                          alt={`${p.name} ${p.colorName} belt`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                          width="400"
                          height="400"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `radial-gradient(circle, ${p.colorHex}40, #0A0A0A)` }}>
                          <div className="w-20 h-20 border border-gold/30 rounded-full flex items-center justify-center">
                            <span className="font-serif text-gold text-2xl" aria-hidden="true">G</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                      <motion.div
                        className="absolute bottom-4 left-4 right-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center gap-2 btn-gold rounded text-center justify-center py-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                          <ShoppingBag size={14} aria-hidden="true" />
                          <span className="text-xs">View Details</span>
                        </div>
                      </motion.div>
                    </motion.div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full border border-gold/30" style={{ backgroundColor: p.colorHex }} aria-hidden="true" />
                        <span className="text-cream/40 text-[10px] uppercase tracking-wider">{p.colorName}</span>
                      </div>
                      <h3 className="font-serif text-lg text-cream group-hover:text-gold transition-colors mb-1">{p.name}</h3>
                      <p className="text-cream/30 text-xs mb-3">{p.subtitle}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gold font-serif text-lg">{p.priceFormatted}</span>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5" role="img" aria-label={`Rating: ${p.rating} out of 5 stars`}>
                            {[...Array(5)].map((_, j) => (
                              <div key={j} className={`w-1 h-1 rounded-full ${j < Math.round(p.rating) ? 'bg-gold' : 'bg-gold/20'}`} />
                            ))}
                          </div>
                          <span className="text-cream/30 text-[10px]">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
