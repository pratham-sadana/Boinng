import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds | BOINNG! Streetwear',
  description: 'BOINNG! Returns & Refunds Policy. Easy 60-day returns on all orders.',
  alternates: {
    canonical: 'https://boinng.com/pages/returns',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReturnsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
