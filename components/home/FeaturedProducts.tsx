import { getCollectionProducts } from '@/lib/shopify/api';
import { FeaturedProductsContent } from './FeaturedProductsContent';

interface FeaturedProductsProps {
  title?: string;
  collectionHandle?: string;
  limit?: number;
  excludeHandle?: string;
  prioritizeImages?: boolean;
}

export async function FeaturedProducts({
  title = '',
  collectionHandle = 'best-sellers',
  limit = 4,
  excludeHandle,
  prioritizeImages = false,
}: FeaturedProductsProps) {
  const handle = collectionHandle || 'best-sellers';

  // Fetch extra so we still hit `limit` after filtering
  const fetchLimit = excludeHandle ? limit + 1 : limit;
  const products = await getCollectionProducts(handle, fetchLimit);

  const filtered = excludeHandle
    ? products.filter((p) => p.handle !== excludeHandle).slice(0, limit)
    : products;

  return <FeaturedProductsContent title={title} products={filtered} prioritizeImages={prioritizeImages} />;
}