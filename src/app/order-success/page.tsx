'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface OrderData {
  _id: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; price: number; quantity: number; size: string; color: string }[];
  totalAmount: number;
  shipping: { address: string; city: string; state?: string; zip?: string; country?: string };
  status: string;
  createdAt: string;
}

function OrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    fetch('/api/orders?orderId=' + orderId)
      .then(r => r.json())
      .then(d => { if (d.orders && d.orders.length > 0) setOrder(d.orders[0]); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20" style={{ background: 'var(--bg-primary)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-8 sm:p-12 max-w-lg w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
          <CheckCircle className="text-gold mx-auto mb-6" size={56} />
        </motion.div>
        <h1 className="font-serif text-3xl text-cream mb-2">Order Confirmed</h1>
        <p className="text-cream/40 text-sm mb-8">Thank you for choosing GatorÉlite. We&apos;ll send you shipping updates via email.</p>

        {loading ? (
          <div className="py-8"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" /></div>
        ) : order ? (
          <div className="text-left space-y-4">
            <div className="bg-[#161616] rounded-xl p-4">
              <div className="flex justify-between"><span className="text-cream/50 text-sm">Order ID</span><span className="text-gold font-mono text-xs">{order._id.slice(-8).toUpperCase()}</span></div>
              <div className="flex justify-between items-center mt-2"><span className="text-cream/50 text-sm">Status</span><span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded text-xs uppercase">{order.status}</span></div>
              <div className="flex justify-between mt-2"><span className="text-cream/50 text-sm">Date</span><span className="text-cream/70 text-sm">{new Date(order.createdAt).toLocaleDateString()}</span></div>
            </div>
            <div className="bg-[#161616] rounded-xl p-4">
              <h4 className="text-cream/50 text-xs uppercase mb-3">Items</h4>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1.5">
                  <div className="flex items-center gap-2"><Package size={14} className="text-gold/40" /><span className="text-cream text-sm">{item.name}</span><span className="text-cream/30 text-xs">x{item.quantity}</span>{item.size && <span className="text-cream/30 text-xs">({item.size})</span>}</div>
                  <span className="text-cream/70 text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-gold/10 mt-3 pt-3 flex justify-between">
                <span className="text-cream/70 font-medium">Total</span>
                <span className="text-gold font-serif text-lg">Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-[#161616] rounded-xl p-4">
              <h4 className="text-cream/50 text-xs uppercase mb-2 flex items-center gap-2"><MapPin size={12} /> Shipping To</h4>
              <p className="text-cream text-sm">{order.customerName}</p>
              <p className="text-cream/50 text-sm">{order.shipping.address}, {order.shipping.city}{order.shipping.state ? `, ${order.shipping.state}` : ''} {order.shipping.zip || ''}</p>
              <p className="text-cream/40 text-xs mt-1">{order.customerEmail}</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#161616] rounded-xl p-4 mb-6"><p className="text-cream/40 text-sm">Your order has been placed successfully.</p></div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link href="/shop" className="btn-gold rounded inline-flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50"><span>Continue Shopping</span><ArrowRight size={16} /></Link>
          <Link href="/" className="px-6 py-3 border border-gold/20 rounded text-cream/50 text-sm hover:border-gold/40 hover:text-cream transition-colors min-h-[44px] inline-flex items-center justify-center">Return Home</Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>}>
        <OrderContent />
      </Suspense>
      <Footer />
    </>
  );
}
