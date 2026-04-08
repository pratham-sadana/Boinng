import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds | BOINNG! Quirky Socks',
  description: 'Returns and refunds policy for BOINNG! quirky socks orders.',
  alternates: {
    canonical: 'https://boinng.in/pages/returns',
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
