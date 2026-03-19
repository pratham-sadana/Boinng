import { getAllCollections } from '@/lib/shopify/api';
import { AllCollectionsClient } from '@/components/collections/AllCollectionsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Collections — BOINNG!',
  description: 'Every drop, every theme, every excuse to wear wild socks. Browse all BOINNG! collections — made in India.',
  alternates: {
    canonical: 'https://boinng.in/collections',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600;

export default async function AllCollectionsPage() {
  const collections = await getAllCollections();
  return <AllCollectionsClient collections={collections} />;
}