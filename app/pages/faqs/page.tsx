import type { Metadata } from 'next';
import { FaqsPageClient } from '@/components/faqs/FaqsPageClient';

export const metadata: Metadata = {
  title: 'FAQs — BOINNG!',
  description: 'Got questions about your socks? We\'ve got answers. Probably.',
  alternates: {
    canonical: 'https://boinng.in/pages/faqs',
  },
  openGraph: {
    title: 'FAQs | BOINNG! Quirky Socks',
    description: 'Find answers to common questions about BOINNG! socks, orders, shipping, and returns.',
    url: 'https://boinng.in/pages/faqs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQs | BOINNG! Quirky Socks',
    description: 'Find answers to common questions about BOINNG! socks, orders, shipping, and returns.',
  },
};

export default function FaqsPage() {
  return <FaqsPageClient />;
}