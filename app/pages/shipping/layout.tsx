import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information | BOINNG! Quirky Socks',
  description: 'Shipping information for BOINNG! quirky socks. Fast delivery across India with tracking.',
  alternates: {
    canonical: 'https://boinng.in/pages/shipping',
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
