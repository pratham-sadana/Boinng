import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | BOINNG! Quirky Socks',
  description: 'BOINNG! Terms of Service for shopping our quirky socks online.',
  alternates: {
    canonical: 'https://boinng.in/pages/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
