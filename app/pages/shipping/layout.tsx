import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information | BOINNG! Streetwear',
  description: 'BOINNG! Shipping Information. Fast delivery across India with tracking.',
  alternates: {
    canonical: 'https://boinng.com/pages/shipping',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShippingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
