'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  productName?: string;
  variant?: 'inline' | 'floating';
}

export default function WhatsAppButton({ productName, variant = 'floating' }: WhatsAppButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const message = productName
    ? `Hi, I'm interested in the ${productName}. Can you provide more details?`
    : 'Hi, I have a question about GatorÉlite products.';

  const whatsappUrl = `https://wa.me/923712362553?text=${encodeURIComponent(message)}`;

  if (variant === 'inline') {
    return (
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
        whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <MessageCircle size={20} />
        <span className="font-medium text-sm">Order via Concierge WhatsApp</span>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 min-h-[44px] min-w-[44px] rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-shadow focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label="Contact us on WhatsApp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <MessageCircle size={24} className="text-white" />
    </motion.a>
  );
}
