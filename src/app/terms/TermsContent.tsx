'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Package, RotateCcw, Shield, CreditCard, Truck, AlertTriangle } from 'lucide-react';

const sections = [
  {
    icon: Package,
    title: 'Products & Orders',
    content: `All GatorÉlite products are handcrafted from 100% genuine crocodile leather. Due to the natural origin of our materials, slight variations in color, texture, and pattern are inherent characteristics of genuine exotic leather and are not considered defects.

By placing an order, you confirm that all information provided is accurate and complete. We reserve the right to cancel orders where fraudulent or unauthorized activity is suspected.

All orders are subject to availability. In the unlikely event that an item is out of stock after your order is placed, we will notify you promptly and offer a full refund or alternative options.`,
  },
  {
    icon: CreditCard,
    title: 'Pricing & Payment',
    content: `All prices are displayed in the currency shown at checkout. We accept major credit cards, PayPal, and bank transfers as indicated at checkout.

Payment is required in full before an order is processed. We do not offer layaway or installment plans unless explicitly stated on the product page.

Prices are subject to change without notice, but changes will not affect orders already confirmed.`,
  },
  {
    icon: Truck,
    title: 'Shipping & Delivery',
    content: `We ship worldwide using insured, tracked carriers. Estimated delivery times are provided at checkout and are approximate — delays caused by customs, weather, or carrier issues are beyond our control.

Risk of loss and title for items purchased pass to you upon delivery to the carrier. We strongly recommend insuring your shipment. GatorÉlite is not responsible for packages lost or damaged during transit once delivered to the carrier.

You are responsible for any customs duties, import taxes, or brokerage fees imposed by your country.`,
  },
  {
    icon: RotateCcw,
    title: 'Returns & Exchanges',
    content: `We want you to be completely satisfied with your purchase. If for any reason you are not, we offer a 30-day return policy from the date of delivery.

To be eligible for a return:
• The item must be unused, in its original condition, and in the original packaging
• The item must include all tags, dust bag, and certificate of authenticity
• Proof of purchase (order confirmation) is required

Custom or personalized orders (e.g., custom sizing, monogramming) are final sale and cannot be returned unless defective.

Refunds are processed within 5–7 business days of receiving and inspecting the returned item. The original shipping cost is non-refundable unless the return is due to our error.

Exchanges are available for different sizes of the same belt model, subject to stock availability.`,
  },
  {
    icon: Shield,
    title: 'Warranty',
    content: `Every GatorÉlite belt comes with a lifetime warranty covering defects in craftsmanship and materials under normal use. This warranty covers:
    
• Stitching failure
• Buckle mechanism malfunction
• Leather delamination

This warranty does not cover:
• Normal wear and tear (scratches, patina development)
• Damage from improper care, storage, or use
• Unauthorized modifications or repairs
• Cosmetic damage that does not affect functionality

To make a warranty claim, contact us at dawood.cs195@gmail.com with your order number, photos of the issue, and a description of the problem.`,
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, GatorÉlite shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with your use of our products or website.

Our total liability for any claim arising out of or relating to these terms or our products shall not exceed the amount you paid for the specific product giving rise to the claim.

Products are sold &quot;as described&quot; on their product pages. We make no warranties beyond what is expressly stated.`,
  },
];

export default function TermsContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-gold/60 text-xs tracking-[0.3em] uppercase mb-4">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl text-cream mb-4">Terms of Service</h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="luxury-divider w-24 mx-auto mt-6 mb-6"
          aria-hidden="true"
        />
        <p className="text-cream/40 text-sm">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="glass rounded-2xl p-8 md:p-12 mb-8"
      >
        <p className="text-cream/60 text-sm leading-relaxed mb-4">
          Welcome to GatorÉlite. These Terms of Service (&quot;Terms&quot;) govern your use of our website and the purchase of our handcrafted crocodile leather products. By accessing our site or placing an order, you agree to be bound by these Terms.
        </p>
        <p className="text-cream/60 text-sm leading-relaxed">
          Please read these Terms carefully before making a purchase. If you do not agree to these Terms, please do not use our site or purchase our products.
        </p>
      </motion.div>

      {sections.map((section, i) => (
        <motion.section
          key={section.title}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
          className="glass rounded-2xl p-8 md:p-10 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center">
              <section.icon size={18} className="text-gold" />
            </div>
            <h2 className="font-serif text-2xl text-cream">{section.title}</h2>
          </div>
          <div className="text-cream/50 text-sm leading-relaxed whitespace-pre-line">
            {section.content}
          </div>
        </motion.section>
      ))}

      <motion.section
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="glass rounded-2xl p-8 md:p-10 mb-6"
      >
        <h2 className="font-serif text-2xl text-cream mb-5">Governing Law</h2>
        <div className="text-cream/50 text-sm leading-relaxed">
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of our products shall be resolved through good-faith negotiation first, followed by binding arbitration if necessary.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="glass rounded-2xl p-8 md:p-10"
      >
        <h2 className="font-serif text-2xl text-cream mb-5">Contact</h2>
        <div className="text-cream/50 text-sm leading-relaxed">
          <p>
            For questions about these Terms, please contact us at{' '}
            <a href="mailto:dawood.cs195@gmail.com" className="text-gold hover:text-gold/80 transition-colors">
              dawood.cs195@gmail.com
            </a>.
          </p>
        </div>
      </motion.section>
    </>
  );
}
