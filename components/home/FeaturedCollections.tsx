import { getFeaturedCollections } from '@/lib/shopify/api';
import { FeaturedCollectionsContent } from './FeaturedCollectionsContent';

interface FeaturedCollectionsProps {
  title?: string;
  limit?: number;
}

export async function FeaturedCollections({
  title = 'FEATURED COLLECTIONS',
  limit = 6
}: FeaturedCollectionsProps) {
  const collections = await getFeaturedCollections(limit);

  return <FeaturedCollectionsContent title={title} collections={collections} />;
}
