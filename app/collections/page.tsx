import { getAllCollections } from '@/lib/shopify/api';
import { AllCollectionsClient } from '@/components/collections/AllCollectionsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Collections | BOINNG! Streetwear',
  description: 'Browse all collections from BOINNG! - India\'s boldest streetwear brand featuring premium quality, limited drops, and bold designs.',
  alternates: {
    canonical: 'https://boinng.in/collections/all',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function AllCollectionsPage() {
  const collections = await getAllCollections();

  return <AllCollectionsClient collections={collections} />;
}
