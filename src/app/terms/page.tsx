import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms of Service — GatorÉlite',
  description: 'GatorÉlite terms of service. Read our return policy, shipping terms, warranty details, and liability information.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto">
          <TermsContent />
        </div>
      </main>
      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
