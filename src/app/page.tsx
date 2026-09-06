'use client';
import Header from '@/components/layout/Header';
import ScrollCanvas from '@/components/common/ScrollCanvas';
import FeatureGrid from '@/components/common/FeatureGrid';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="relative">
        <ScrollCanvas />
        <FeatureGrid />
      </main>
      <Footer />
    </>
  );
}
