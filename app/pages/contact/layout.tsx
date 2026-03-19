import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | BOINNG! Streetwear',
  description: 'Get in touch with BOINNG!. We\'d love to hear from you about our streetwear collections.',
  alternates: {
    canonical: 'https://boinng.com/pages/contact',
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
