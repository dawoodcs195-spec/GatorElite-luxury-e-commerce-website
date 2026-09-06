'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SPRING } from '@/lib/motion';

interface Order {
  _id: string;
  items: { name: string; price: number; quantity: number; size: string; color: string }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  confirmed: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  shipped: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  delivered: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.authenticated) {
          router.push('/login');
          return;
        }
        setAuthChecked(true);
        fetchOrders();
      })
      .catch(() => router.push('/login'));
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const r = await fetch('/api/orders');
      const d = await r.json();
      setOrders(d.orders || []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }

  if (!authChecked) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl text-cream mb-2">My Orders</h1>
            <p className="text-cream/40 text-sm">Track and manage your orders</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl">
              <ShoppingBag size={48} className="text-gold/20 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-cream mb-2">No Orders Yet</h3>
              <p className="text-cream/40 text-sm mb-6">Start shopping to see your orders here.</p>
              <Link href="/shop" className="btn-gold rounded inline-block min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50">
                <span>Browse Shop</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const StatusIcon = config.icon;
                return (
                  <motion.div
                    key={order._id}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={SPRING}
                    className="glass rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                      className="w-full flex items-center gap-4 p-4 text-left hover:bg-gold/5 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
                        <StatusIcon size={18} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-cream text-sm font-medium">Order</span>
                          <span className="text-cream/40 text-xs font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <p className="text-cream/40 text-xs mt-0.5">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-gold font-serif">Rs. {order.totalAmount.toLocaleString()}</span>
                        <p className={`text-xs capitalize ${config.color}`}>{order.status}</p>
                      </div>
                      <ArrowRight size={16} className={`text-cream/20 transition-transform ${expanded === order._id ? 'rotate-90' : ''}`} />
                    </button>

                    {expanded === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="border-t border-gold/5"
                      >
                        <div className="p-4 space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5">
                              <div className="flex items-center gap-2">
                                <Package size={14} className="text-gold/40" />
                                <span className="text-cream text-sm">{item.name}</span>
                                <span className="text-cream/30 text-xs">×{item.quantity}</span>
                                {item.size && <span className="text-cream/30 text-xs">({item.size})</span>}
                                {item.color && <span className="text-cream/30 text-xs">{item.color}</span>}
                              </div>
                              <span className="text-cream/70 text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="border-t border-gold/10 pt-3 flex justify-between">
                            <span className="text-cream/50 text-sm">Total</span>
                            <span className="text-gold font-serif">Rs. {order.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
