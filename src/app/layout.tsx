import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import PageTransition from '@/components/layout/PageTransition';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ThemeProvider } from '@/context/ThemeContext';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gatorelite.com'),
  title: 'GatorÉlite — The Apex of Luxury',
  description: 'Handcrafted premium crocodile leather belts. 100% Genuine Crocodile Hide. Precision Engineered Automatic Mechanism.',
  keywords: ['crocodile leather', 'luxury belt', 'premium belt', 'handcrafted', 'GatorElite'],
  authors: [{ name: 'GatorÉlite' }],
  openGraph: {
    title: 'GatorÉlite — The Apex of Luxury',
    description: 'Handcrafted premium crocodile leather belts. 100% Genuine Crocodile Hide.',
    type: 'website',
    siteName: 'GatorÉlite',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'GatorÉlite — Premium Crocodile Leather Belts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GatorÉlite — The Apex of Luxury',
    description: 'Handcrafted premium crocodile leather belts. 100% Genuine Crocodile Hide.',
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="bg-gradient-navy text-[#F5F0E8] antialiased overflow-x-hidden font-sans min-h-screen relative">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <SmoothScroll>
                  <PageTransition>{children}</PageTransition>
                </SmoothScroll>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
