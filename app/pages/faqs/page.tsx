import type { Metadata } from 'next';
import { FaqsPageClient } from '@/components/faqs/FaqsPageClient';

export const metadata: Metadata = {
  title: 'FAQs — BOINNG!',
  description: 'Got questions about your socks? We\'ve got answers. Probably.',
};

export default function FaqsPage() {
  return <FaqsPageClient />;
}