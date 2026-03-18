import { getCollectionProducts } from '@/lib/shopify/api';
import { FeaturedProductsContent } from './FeaturedProductsContent';

interface FeaturedProductsProps {
  title?: string;
  collectionHandle?: string;
  limit?: number;
}

export async function FeaturedProducts({
  title = "THE DROP",
  collectionHandle = "all",
  limit = 4
}: FeaturedProductsProps) {
  const products = collectionHandle === 'all'
    ? await getCollectionProducts('all', limit)
    : await getCollectionProducts(collectionHandle, limit);

  return <FeaturedProductsContent title={title} products={products} />;
}
