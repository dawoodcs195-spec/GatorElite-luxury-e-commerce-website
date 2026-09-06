'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sizeData = [
  { size: '28"', waist: '26-27"', belt: '30"' },
  { size: '30"', waist: '28-29"', belt: '32"' },
  { size: '32"', waist: '30-31"', belt: '34"' },
  { size: '34"', waist: '32-33"', belt: '36"' },
  { size: '36"', waist: '34-35"', belt: '38"' },
  { size: '38"', waist: '36-37"', belt: '40"' },
  { size: '40"', waist: '38-39"', belt: '42"' },
  { size: '42"', waist: '40-41"', belt: '44"' },
  { size: '44"', waist: '42-43"', belt: '46"' },
];

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
            tabIndex={-1}
            className="relative w-full max-w-lg glass rounded-2xl p-6 md:p-8 max-h-[80vh] overflow-y-auto"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 min-h-[44px] min-w-[44px] rounded-full border border-gold/20 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/40 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
              aria-label="Close size guide"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                <Ruler size={20} className="text-gold" />
              </div>
              <div>
                <h2 id="size-guide-title" className="font-serif text-xl text-cream">Size Guide</h2>
                <p className="text-cream/40 text-xs">Find your perfect fit</p>
              </div>
            </div>

            {/* How to measure */}
            <div className="mb-6 p-4 rounded-xl bg-gold/5 border border-gold/10">
              <h3 className="text-gold text-sm font-medium mb-2">How to Measure</h3>
              <ol className="text-cream/50 text-xs space-y-1 list-decimal list-inside">
                <li>Measure around your waist where you normally wear your belt</li>
                <li>Add 2 inches to your waist measurement for belt size</li>
                <li>If between sizes, we recommend sizing up</li>
              </ol>
            </div>

            {/* Size table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left py-3 px-2 text-gold/70 text-xs tracking-wider uppercase" scope="col">Belt Size</th>
                    <th className="text-left py-3 px-2 text-gold/70 text-xs tracking-wider uppercase" scope="col">Waist</th>
                    <th className="text-left py-3 px-2 text-gold/70 text-xs tracking-wider uppercase" scope="col">Total Length</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row) => (
                    <tr key={row.size} className="border-b border-gold/5 hover:bg-gold/5 transition-colors">
                      <td className="py-3 px-2 text-cream font-medium">{row.size}</td>
                      <td className="py-3 px-2 text-cream/60">{row.waist}</td>
                      <td className="py-3 px-2 text-cream/60">{row.belt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note */}
            <p className="text-cream/30 text-xs mt-4 text-center">
              All measurements in inches. Our ratchet mechanism allows micro-adjustments for a perfect fit.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
