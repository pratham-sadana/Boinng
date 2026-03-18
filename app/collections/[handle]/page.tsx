import { getCollectionProducts } from '@/lib/shopify/api';
import { notFound } from 'next/navigation';
import { FeaturedProductsContent } from '@/components/home/FeaturedProductsContent';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { handle: string } }) {
  // You might want to fetch collection details here to get a proper title
  const title = params.handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${title} | BOINNG!`,
    description: `Shop the ${title} collection at BOINNG!`,
  };
}

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const products = await getCollectionProducts(params.handle, 24);

  if (!products) {
    notFound();
  }

  const title = params.handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="">
      <FeaturedProductsContent title={title} products={products} />
    </div>
  );
}
