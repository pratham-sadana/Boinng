import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart/context';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar }          from '@/components/layout/Navbar';
import { Footer }          from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'BOINNG! — Bold Streetwear',
  description: 'BOINNG! is India\'s boldest streetwear brand. Limited drops, premium quality, zero compromise.',
  keywords: ['streetwear', 'BOINNG', 'India', 'fashion', 'streetstyle', 'bold fashion', 'Indian streetwear'],
  authors: [{ name: 'BOINNG!' }],
  creator: 'BOINNG!',
  publisher: 'BOINNG!',
  formatDetection: {
    email: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://boinng.com',
  },
  metadataBase: new URL('https://boinng.com'),
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
    title: 'BOINNG! — Bold Streetwear',
    description: 'Limited drops. Premium quality. Zero compromise.',
    type: 'website',
    url: 'https://boinng.com',
    siteName: 'BOINNG!',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOINNG! — Bold Streetwear',
    description: 'India\'s boldest streetwear brand',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
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
