import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BOINNG! Quirky Socks',
  description: 'Privacy policy for BOINNG! quirky socks. Learn how we protect your personal information.',
  alternates: {
    canonical: 'https://boinng.in/pages/privacy',
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
