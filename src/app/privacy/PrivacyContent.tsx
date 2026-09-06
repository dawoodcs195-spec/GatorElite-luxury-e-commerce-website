'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { SPRING } from '@/lib/motion';
import { Shield, Eye, Lock, Trash2 } from 'lucide-react';

const sections = [
  {
    icon: Shield,
    title: 'Information We Collect',
    content: `When you visit GatorÉlite, we automatically collect certain information about your device, including your web browser, IP address, time zone, and some of the cookies installed on your device. As you browse, we collect information about the individual web pages or products you view, what websites or search terms referred you to GatorÉlite, and how you interact with our site.

When you make a purchase or attempt to make a purchase, we collect your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. This is referred to as "Order Information."

When we talk about "Personal Information" in this Privacy Policy, we are talking about both Device Information and Order Information.`,
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: `We use the Order Information that we collect generally to fulfill any orders placed through the site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:
    
• Communicate with you
• Screen our orders for potential risk or fraud
• When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services

We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our site (for example, by generating analytics about how our customers browse and interact with the site).`,
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: `We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. All payment transactions are processed through a gateway provider and are not stored or processed on our servers.

Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential.

We use industry-standard encryption (SSL/TLS) to protect sensitive information transmitted during checkout.`,
  },
  {
    icon: Trash2,
    title: 'Your Rights',
    content: `If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise these rights, please contact us through the contact information below.

Additionally, if you are a European resident, we note that we are processing your information in order to fulfill contracts we might have with you (for example, if you make an order through the site), or otherwise to pursue our legitimate business interests listed above.`,
  },
];

export default function PrivacyContent() {
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
        <h1 className="font-serif text-4xl md:text-5xl text-cream mb-4">Privacy Policy</h1>
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
        <p className="text-cream/60 text-sm leading-relaxed mb-6">
          At GatorÉlite (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase our handcrafted crocodile leather products.
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
        transition={{ delay: 0.7, duration: 0.6 }}
        className="glass rounded-2xl p-8 md:p-10 mb-6"
      >
        <h2 className="font-serif text-2xl text-cream mb-5">Cookies</h2>
        <div className="text-cream/50 text-sm leading-relaxed">
          <p className="mb-4">
            We use cookies to enhance your experience on our site. Cookies are small text files that are placed on your computer or mobile device when you browse a website. We use cookies to:
          </p>
          <ul className="list-none space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1 text-xs">✦</span>
              <span>Remember your preferences and login status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1 text-xs">✦</span>
              <span>Keep items in your shopping cart</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1 text-xs">✦</span>
              <span>Analyze site traffic and usage patterns</span>
            </li>
          </ul>
          <p className="mt-4">
            You can choose to disable cookies through your browser settings. However, some features of the site may not function properly if cookies are disabled.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="glass rounded-2xl p-8 md:p-10 mb-6"
      >
        <h2 className="font-serif text-2xl text-cream mb-5">Contact Us</h2>
        <div className="text-cream/50 text-sm leading-relaxed">
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="mt-4 glass-light rounded-lg p-4">
            <p className="text-cream/70 text-sm">
              <strong className="text-gold">GatorÉlite</strong><br />
              Email: <a href="mailto:dawood.cs195@gmail.com" className="text-gold hover:text-gold/80 transition-colors">dawood.cs195@gmail.com</a>
            </p>
          </div>
        </div>
      </motion.section>
    </>
  );
}
