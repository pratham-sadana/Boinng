import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | BOINNG! Streetwear',
  description: 'BOINNG! Terms of Service. Please read our terms before shopping.',
  alternates: {
    canonical: 'https://boinng.com/pages/terms',
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
