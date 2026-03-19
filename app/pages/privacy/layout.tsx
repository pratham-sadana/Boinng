import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BOINNG! Streetwear',
  description: 'BOINNG! Privacy Policy. Learn how we protect your personal information.',
  alternates: {
    canonical: 'https://boinng.com/pages/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
