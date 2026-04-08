import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart/context';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar }          from '@/components/layout/Navbar';
import { Footer }          from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'BOINNG! — Quirky Socks Brand',
  description: 'BOINNG! is India\'s quirky socks brand. Bold designs, comfy fits, and limited drops for everyday style.',
  keywords: ['quirky socks', 'BOINNG', 'socks', 'India', 'fun socks', 'statement socks', 'sock brand'],
  authors: [{ name: 'BOINNG!' }],
  creator: 'BOINNG!',
  publisher: 'BOINNG!',
  formatDetection: {
    email: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://boinng.in',
  },
  metadataBase: new URL('https://boinng.in'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'BOINNG! - Quirky Socks Brand',
    description: 'India\'s quirky socks brand for bold everyday looks.',
    type: 'website',
    url: 'https://boinng.in',
    siteName: 'BOINNG!',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOINNG! - Quirky Socks Brand',
    description: 'India\'s quirky socks brand for bold everyday looks.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <a href="#main-content" className="sr-only">Skip to content</a>
          {/* <AnnouncementBar /> */}
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
