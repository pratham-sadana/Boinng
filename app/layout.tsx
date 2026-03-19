import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart/context';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar }          from '@/components/layout/Navbar';
import { Footer }          from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'BOINNG! — Bold Streetwear',
  description: 'BOINNG! is India\'s boldest streetwear brand. Limited drops, premium quality, zero compromise.',
  keywords: ['streetwear', 'BOINNG', 'India', 'fashion', 'streetstyle'],
  openGraph: {
    title: 'BOINNG! — Bold Streetwear',
    description: 'Limited drops. Premium quality. Zero compromise.',
    type: 'website',
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
