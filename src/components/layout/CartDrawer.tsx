'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPriceFormatted } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeCart();
      return;
    }
    if (e.key !== 'Tab' || !drawerRef.current) return;

    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [closeCart]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-[#111111] border-l border-gold/10 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gold/10">
              <h2 className="font-serif text-xl text-cream tracking-wider">Your Cart</h2>
              <button
                ref={closeButtonRef}
                onClick={closeCart}
                className="text-cream/40 hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-cream/30 text-sm mb-4">Your cart is empty</p>
                  <button onClick={closeCart} className="btn-outline text-xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50 rounded">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 bg-[#1A1A1A] rounded-lg border border-gold/5">
                    <div className="w-16 h-16 rounded-lg border border-gold/20 flex-shrink-0" style={{ backgroundColor: item.color }} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-cream text-sm font-medium truncate">GatorÉlite — {item.color}</h4>
                      <p className="text-cream/40 text-xs mt-1">Size: {item.size}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 min-h-[44px] min-w-[44px] border border-gold/20 rounded flex items-center justify-center text-cream/50 hover:border-gold hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
                            aria-label={`Decrease quantity of ${item.color} belt`}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-cream text-sm w-6 text-center" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 min-h-[44px] min-w-[44px] border border-gold/20 rounded flex items-center justify-center text-cream/50 hover:border-gold hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
                            aria-label={`Increase quantity of ${item.color} belt`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gold text-sm font-medium">{item.priceFormatted}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-cream/30 hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400/50 rounded"
                            aria-label={`Remove ${item.color} belt from cart`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-gold/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-cream/50 text-sm">Subtotal</span>
                  <span className="text-gold font-serif text-lg">{totalPriceFormatted()}</span>
                </div>
                <Link href="/checkout" onClick={closeCart} className="btn-gold w-full block text-center rounded min-h-[44px] focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-[#111111]">
                  <span>Proceed to Checkout</span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
