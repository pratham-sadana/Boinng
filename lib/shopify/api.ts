import { shopifyFetch, shopifyAdminFetch } from './client';
import {
  COLLECTION_QUERY,
  PRODUCT_QUERY,
  FEATURED_PRODUCTS_QUERY,
  FEATURED_COLLECTIONS_QUERY,
  ALL_COLLECTIONS_QUERY,
  ALL_PRODUCTS_QUERY,
  NAVIGATION_MENU_QUERY,
} from './queries';
import type { Product, Collection, TransformedProduct, CollectionPreview, Metafield } from './types';

// ─── Admin: Enable metafield storefront access ────────────────────────────────
// Call this once from an API route to expose all category metafields to the
// Storefront API. It's idempotent — safe to call multiple times.
// Usage: fetch('/api/setup-metafields') once from your browser.

const METAFIELD_DEFINITIONS_QUERY = `
  query GetMetafieldDefinitions($after: String) {
    metafieldDefinitions(first: 250, ownerType: PRODUCT, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          name
          namespace
          key
          access { storefront }
        }
      }
    }
  }
`;

const ENABLE_STOREFRONT_MUTATION = `
  mutation EnableStorefront($id: ID!) {
    metafieldDefinitionUpdate(definition: {
      id: $id
      access: { storefront: PUBLIC_READ }
    }) {
      updatedDefinition { id name namespace key access { storefront } }
      userErrors { field message code }
    }
  }
`;

const TARGET_KEYS = [
  'fabric', 'activity', 'accessory_size',
  'clothing_features', 'target_gender',
  'color', 'care_guide', 'size_chart',
];

const TARGET_NAMESPACES = ['custom', 'shopify'];

// Type for metafield definitions API response
type MetafieldDefinitionsResponse = {
  metafieldDefinitions: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: Array<{
      node: {
        id: string;
        name: string;
        namespace: string;
        key: string;
        access: { storefront: string | null };
      };
    }>;
  };
};

type MenuTitlesResponse = {
  menu: {
    items: Array<{
      title: string;
    }>;
  } | null;
};

export async function getMenuTitles(handle: string): Promise<string[]> {
  try {
    const response = await shopifyFetch<MenuTitlesResponse>({
      query: NAVIGATION_MENU_QUERY,
      variables: { handle },
      cache: 'force-cache',
    });

    if (!response.menu?.items?.length) {
      return [];
    }

    return response.menu.items
      .map((item) => item.title?.trim())
      .filter((title): title is string => Boolean(title));
  } catch (error) {
    console.error(`Error fetching menu titles for "${handle}":`, error);
    return [];
  }
}

export async function enableMetafieldStorefrontAccess(): Promise<{
  enabled: string[];
  skipped: string[];
  errors: string[];
  allDefinitions: Array<{ namespace: string; key: string; access: string | null }>;
}> {
  const enabled: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];
  const allDefinitions: Array<{ namespace: string; key: string; access: string | null }> = [];

  try {
    let hasNextPage = true;
    let endCursor: string | null = null;

    while (hasNextPage) {
      const resp: MetafieldDefinitionsResponse = await shopifyAdminFetch({
        query: METAFIELD_DEFINITIONS_QUERY,
        variables: { after: endCursor },
      });

      if (!resp || !resp.metafieldDefinitions) {
        throw new Error('Invalid response from metafieldDefinitions query');
      }

      const { pageInfo, edges } = resp.metafieldDefinitions;
      hasNextPage = pageInfo.hasNextPage;
      endCursor = pageInfo.endCursor;

      const definitions = edges.map((e) => e.node);

      for (const def of definitions) {
        allDefinitions.push({
          namespace: def.namespace,
          key: def.key,
          access: def.access.storefront,
        });

        // Only process target keys in target namespaces
        if (!TARGET_KEYS.includes(def.key) || !TARGET_NAMESPACES.includes(def.namespace)) {
          continue;
        }

        if (def.access.storefront === 'PUBLIC_READ') {
          skipped.push(`${def.namespace}.${def.key}`);
          continue;
        }

        const result = await shopifyAdminFetch<{
          metafieldDefinitionUpdate: {
            updatedDefinition: { id: string; name: string } | null;
            userErrors: { field: string; message: string }[];
          };
        }>({
          query: ENABLE_STOREFRONT_MUTATION,
          variables: { id: def.id },
        });

        const { userErrors } = result.metafieldDefinitionUpdate;
        if (userErrors.length > 0) {
          errors.push(`${def.namespace}.${def.key}: ${userErrors[0].message}`);
        } else {
          enabled.push(`${def.namespace}.${def.key}`);
        }
      }
    }
  } catch (error) {
    errors.push(String(error));
  }

  return { enabled, skipped, errors, allDefinitions };
}

// ─── Collection products ──────────────────────────────────────────────────────

export async function getCollectionProducts(
  handle: string,
  limit: number = 8
): Promise<Product[]> {
  try {
    const response = await shopifyFetch<{ collection: Collection | null }>({
      query: COLLECTION_QUERY,
      variables: { handle, first: limit },
    });

    if (!response.collection) {
      console.warn(`Collection "${handle}" not found in Shopify store`);
      return [];
    }
    if (!response.collection.products?.edges) {
      console.warn(`Collection "${handle}" has no products`);
      return [];
    }

    return response.collection.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error(`Error fetching collection "${handle}":`, error);
    return [];
  }
}

// ─── Featured products ────────────────────────────────────────────────────────

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const response = await shopifyFetch<{
      products: { edges: Array<{ node: Product }> };
    }>({
      query: FEATURED_PRODUCTS_QUERY,
      variables: { first: limit },
    });
    return response.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// ─── Single product ───────────────────────────────────────────────────────────

export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await shopifyFetch<{ product: Product }>({
      query: PRODUCT_QUERY,
      variables: { handle },
    });
    return response.product || null;
  } catch (error) {
    console.error(`Error fetching product "${handle}":`, error);
    return null;
  }
}

// ─── Transform product ────────────────────────────────────────────────────────

export function transformProduct(product: Product): TransformedProduct {
  const defaultVariant = product.variants.edges[0]?.node;
  const featuredImage  = product.featuredImage || product.images?.edges[0]?.node;

  const allImages: Array<{ url: string; alt: string; width: number; height: number }> = [];
  if (featuredImage) {
    allImages.push({ url: featuredImage.url, alt: featuredImage.altText || product.title, width: featuredImage.width, height: featuredImage.height });
  }
  if (product.images?.edges) {
    product.images.edges.forEach((edge) => {
      const img = edge.node;
      if (!allImages.some((e) => e.url === img.url)) {
        allImages.push({ url: img.url, alt: img.altText || product.title, width: img.width, height: img.height });
      }
    });
  }
  product.variants.edges.forEach((edge) => {
    if (edge.node.image) {
      const img = edge.node.image;
      if (!allImages.some((e) => e.url === img.url)) {
        allImages.push({ url: img.url, alt: img.altText || product.title, width: img.width, height: img.height });
      }
    }
  });

  const price        = defaultVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || '0';
  const comparePrice = defaultVariant?.compareAtPrice?.amount || product.compareAtPriceRange?.minVariantPrice?.amount || null;
  const currency     = defaultVariant?.price?.currencyCode || product.priceRange?.minVariantPrice?.currencyCode || 'INR';

  const resolveMetafield = (mf: Metafield): string => {
    if (mf.reference?.fields?.length) {
      const fields = mf.reference.fields;
      const display = fields.find((f) => ['label', 'name', 'value', 'title'].includes(f.key));
      if (display) return display.value;
      return fields.map((f) => f.value).filter(Boolean).join(', ');
    }
    if (mf.references?.nodes?.length) {
      return mf.references.nodes
        .map((node) => {
          const display = node.fields.find((f) => ['label', 'name', 'value', 'title'].includes(f.key));
          return display?.value || node.fields.map((f) => f.value).filter(Boolean).join(', ');
        })
        .filter(Boolean)
        .join(', ');
    }
    if (mf.value?.startsWith('["gid://') || mf.value?.startsWith('gid://')) return '';
    if (mf.value?.startsWith('[')) {
      try {
        const parsed = JSON.parse(mf.value);
        if (Array.isArray(parsed)) return parsed.join(', ');
      } catch {}
    }
    return mf.value || '';
  };

  const metafieldMap: Record<string, string> = {};
  if (product.metafields) {
    const validMetafields = product.metafields.filter((m): m is Metafield => m !== null);

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[transformProduct] "${product.handle}" raw metafields:`,
        validMetafields.map((m) => ({
          ns: m.namespace, key: m.key,
          value: m.value?.slice(0, 60),
          hasRef: !!m.reference,
          hasRefs: !!m.references?.nodes?.length,
          refsCount: m.references?.nodes?.length ?? 0,
        }))
      );
    }

    validMetafields.forEach((mf) => {
      const resolved = resolveMetafield(mf);
      if (resolved) {
        metafieldMap[mf.key] = resolved;
        metafieldMap[`${mf.namespace}.${mf.key}`] = resolved;
      }
    });
  }

  const getMeta = (...keys: string[]) => {
    for (const k of keys) { if (metafieldMap[k]) return metafieldMap[k]; }
    return undefined;
  };

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    availableForSale: product.availableForSale,
    price,
    comparePrice,
    currency,
    image: featuredImage
      ? { url: featuredImage.url, alt: featuredImage.altText || product.title, width: featuredImage.width, height: featuredImage.height }
      : null,
    images: allImages.length > 0
      ? allImages
      : featuredImage
      ? [{ url: featuredImage.url, alt: featuredImage.altText || product.title, width: featuredImage.width, height: featuredImage.height }]
      : [],
    variants: product.variants.edges.map((e) => e.node),
    tags: product.tags,
    accessorySize:    getMeta('shopify.accessory-size',    'custom.accessory-size',    'accessory-size'),
    fabric:           getMeta('shopify.fabric',            'custom.fabric',            'fabric'),
    activity:         getMeta('shopify.activity',          'custom.activity',          'activity'),
    clothingFeatures: getMeta('shopify.clothing-features', 'custom.clothing-features', 'clothing-features'),
    targetGender:     getMeta('shopify.target-gender',     'custom.target-gender',     'target-gender'),
  };
}

// ─── Collections ──────────────────────────────────────────────────────────────

export async function getFeaturedCollections(limit: number = 6): Promise<CollectionPreview[]> {
  try {
    const response = await shopifyFetch<{
      collections: { edges: Array<{ node: CollectionPreview }> };
    }>({
      query: FEATURED_COLLECTIONS_QUERY,
      variables: { first: limit },
    });
    return response.collections.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching featured collections:', error);
    return [];
  }
}

export async function getAllCollections(): Promise<CollectionPreview[]> {
  try {
    const response = await shopifyFetch<{
      collections: { edges: Array<{ node: CollectionPreview }> };
    }>({
      query: ALL_COLLECTIONS_QUERY,
      variables: { first: 50 },
    });
    return response.collections.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching all collections:', error);
    return [];
  }
}

export async function getAllProducts(limit: number = 100): Promise<Product[]> {
  try {
    const response = await shopifyFetch<{
      products: { edges: Array<{ node: Product }> };
    }>({
      query: ALL_PRODUCTS_QUERY,
      variables: { first: limit },
    });
    return response.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}