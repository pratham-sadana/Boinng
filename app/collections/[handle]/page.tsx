import { getCollectionProducts } from '@/lib/shopify/api';
import { notFound } from 'next/navigation';
import { FeaturedProductsContent } from '@/components/home/FeaturedProductsContent';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ handle?: string }> }) {
  const resolvedParams = await params;
  const baseUrl = 'https://boinng.in';
  if (!resolvedParams.handle) {
    return {
      title: 'Socks Collection | BOINNG!',
      description: 'Browse quirky sock collections at BOINNG!.',
      alternates: {
        canonical: `${baseUrl}/categories`,
      },
    };
  }
  
  const title = resolvedParams.handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${title} Socks | BOINNG!`,
    description: `Shop ${title.toLowerCase()} socks at BOINNG!`,
    alternates: {
      canonical: `${baseUrl}/categories/${resolvedParams.handle}`,
    },
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
      <FeaturedProductsContent title={title} products={products} layout="grid" showShopAll={false} />
    </div>
  );
}
