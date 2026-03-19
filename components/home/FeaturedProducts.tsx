import { getCollectionProducts } from '@/lib/shopify/api';
import { FeaturedProductsContent } from './FeaturedProductsContent';

interface FeaturedProductsProps {
  title?: string;
  collectionHandle?: string;
  limit?: number;
}

export async function FeaturedProducts({
  title = "",
  collectionHandle = "best-sellers",
  limit = 4
}: FeaturedProductsProps) {
  // Ensure we have a valid handle
  const handle = collectionHandle || "best-sellers";
  
  const products = await getCollectionProducts(handle, limit);

  return <FeaturedProductsContent title={title} products={products} />;
}
