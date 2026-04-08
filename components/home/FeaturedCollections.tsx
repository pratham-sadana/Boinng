import { getAllCollections, getFeaturedCollections } from '@/lib/shopify/api';
import { FeaturedCollectionsContent } from './FeaturedCollectionsContent';
import type { CollectionPreview } from '@/lib/shopify/types';

interface FeaturedCollectionsProps {
  title?: string;
  limit?: number;
  mode?: 'curated' | 'all';
  excludeHandles?: string[];
}

const TARGET_COLLECTION_HANDLES = ['crew', 'ankle-length', 'solids'];
const TARGET_COLLECTION_TITLES = ['crew', 'ankle length', 'solids'];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[-_]/g, ' ').trim();
}

function isCollectionPreview(value: CollectionPreview | undefined): value is CollectionPreview {
  return Boolean(value);
}

export async function FeaturedCollections({
  title = 'FEATURED CATEGORIES',
  limit = 6,
  mode = 'curated',
  excludeHandles = [],
}: FeaturedCollectionsProps) {
  const allCollections = await getAllCollections();
  const excluded = new Set(excludeHandles.map((handle) => handle.toLowerCase()));

  if (mode === 'all') {
    const collections = allCollections
      .filter((collection) => !excluded.has(collection.handle.toLowerCase()))
      .slice(0, limit);

    if (collections.length === 0) {
      const fallback = await getFeaturedCollections(limit);
      const filteredFallback = fallback.filter(
        (collection) => !excluded.has(collection.handle.toLowerCase())
      );
      return <FeaturedCollectionsContent title={title} collections={filteredFallback} />;
    }

    return <FeaturedCollectionsContent title={title} collections={collections} />;
  }

  const byHandle = new Map(allCollections.map((c) => [c.handle.toLowerCase(), c]));
  const selectedByHandle = TARGET_COLLECTION_HANDLES
    .map((handle) => byHandle.get(handle))
    .filter(isCollectionPreview);

  const selectedByTitle = allCollections.filter((collection) =>
    TARGET_COLLECTION_TITLES.includes(normalizeText(collection.title))
  );

  const collections = [...selectedByHandle, ...selectedByTitle]
    .filter((collection, index, arr) =>
      arr.findIndex((item) => item.handle === collection.handle) === index
    )
    .filter((collection) => !excluded.has(collection.handle.toLowerCase()))
    .slice(0, 3);

  if (collections.length === 0) {
    const fallback = await getFeaturedCollections(limit);
    return <FeaturedCollectionsContent title={title} collections={fallback} />;
  }

  return <FeaturedCollectionsContent title={title} collections={collections} />;
}
