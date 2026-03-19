import { getCollectionProducts } from '@/lib/shopify/api';
import { notFound } from 'next/navigation';
import { FeaturedProductsContent } from '@/components/home/FeaturedProductsContent';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ handle?: string }> }) {
  const resolvedParams = await params;
  if (!resolvedParams.handle) {
    return {
      title: 'Collection | BOINNG!',
      description: 'Browse our collection at BOINNG!',
    };
  }
  
  const title = resolvedParams.handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${title} | BOINNG!`,
    description: `Shop the ${title} collection at BOINNG!`,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle?: string }> }) {
  const resolvedParams = await params;
  if (!resolvedParams.handle) {
    notFound();
  }
  
  let products;
  try {
    products = await getCollectionProducts(resolvedParams.handle, 24);
  } catch (error) {
    console.error('CollectionPage error:', error);
    throw error; // Let error boundary handle it
  }

  const title = resolvedParams.handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="">
      <FeaturedProductsContent title={title} products={products} />
    </div>
  );
}
