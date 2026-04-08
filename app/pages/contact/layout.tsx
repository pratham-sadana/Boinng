import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | BOINNG! Quirky Socks',
  description: 'Get in touch with BOINNG! for help with orders, sizing, or anything about our quirky socks.',
  alternates: {
    canonical: 'https://boinng.in/pages/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
