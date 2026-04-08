import { getAllCollections } from '@/lib/shopify/api';
import { AllCollectionsClient } from '@/components/categories/AllCollectionsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Categories — BOINNG!',
  description: 'Every drop, every theme, every excuse to wear wild socks. Browse all BOINNG! categories - made in India.',
  alternates: {
    canonical: 'https://boinng.in/categories',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600;

export default async function AllCategoriesPage() {
  const collections = await getAllCollections();
  return <AllCollectionsClient collections={collections} />;
}