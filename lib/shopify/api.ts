import { shopifyFetch } from './client';
import {
  COLLECTION_QUERY,
  PRODUCT_QUERY,
  FEATURED_PRODUCTS_QUERY,
} from './queries';
import type { Product, Collection, TransformedProduct } from './types';

/**
 * Fetch products from a Shopify collection by handle.
 * Used for "Best Sellers", "New Arrivals", etc.
 */
export async function getCollectionProducts(
  handle: string,
  limit: number = 8
): Promise<Product[]> {
  try {
    const response = await shopifyFetch<{
      collection: Collection | null;
    }>({
      query: COLLECTION_QUERY,
      variables: {
        handle,
        first: limit,
      },
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
    // Return empty array but don't throw - let the page render
    return [];
  }
}

/**
 * Fetch featured/best-selling products from the store.
 */
export async function getFeaturedProducts(
  limit: number = 8
): Promise<Product[]> {
  try {
    const response = await shopifyFetch<{
      products: { edges: Array<{ node: Product }> };
    }>({
      query: FEATURED_PRODUCTS_QUERY,
      variables: {
        first: limit,
      },
    });

    return response.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

/**
 * Fetch a single product by handle for the product detail page.
 */
export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await shopifyFetch<{
      product: Product;
    }>({
      query: PRODUCT_QUERY,
      variables: {
        handle,
      },
    });

    return response.product || null;
  } catch (error) {
    console.error(`Error fetching product "${handle}":`, error);
    return null;
  }
}

/**
 * Transform Shopify product to display format for frontend.
 * Handles pricing, images, and availability.
 */
export function transformProduct(product: Product): TransformedProduct {
  const defaultVariant = product.variants.edges[0]?.node;
  const featuredImage = product.featuredImage || product.images?.edges[0]?.node;

  // Collect all images from product and variants
  const allImages: Array<{ url: string; alt: string; width: number; height: number }> = [];
  
  // Add featured image first
  if (featuredImage) {
    allImages.push({
      url: featuredImage.url,
      alt: featuredImage.altText || product.title,
      width: featuredImage.width,
      height: featuredImage.height,
    });
  }
  
  // Add all product images
  if (product.images?.edges) {
    product.images.edges.forEach((edge) => {
      const img = edge.node;
      const exists = allImages.some((existing) => existing.url === img.url);
      if (!exists) {
        allImages.push({
          url: img.url,
          alt: img.altText || product.title,
          width: img.width,
          height: img.height,
        });
      }
    });
  }
  
  // Add variant images
  product.variants.edges.forEach((edge) => {
    if (edge.node.image) {
      const img = edge.node.image;
      const exists = allImages.some((existing) => existing.url === img.url);
      if (!exists) {
        allImages.push({
          url: img.url,
          alt: img.altText || product.title,
          width: img.width,
          height: img.height,
        });
      }
    }
  });

  // Get price from variant first, fallback to priceRange
  const price = defaultVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount || '0';
  const comparePrice = defaultVariant?.compareAtPrice?.amount || product.compareAtPriceRange?.minVariantPrice?.amount || null;
  const currency = defaultVariant?.price?.currencyCode || product.priceRange?.minVariantPrice?.currencyCode || 'INR';

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
      ? {
          url: featuredImage.url,
          alt: featuredImage.altText || product.title,
          width: featuredImage.width,
          height: featuredImage.height,
        }
      : null,
    images: allImages.length > 0 ? allImages : (featuredImage ? [{
      url: featuredImage.url,
      alt: featuredImage.altText || product.title,
      width: featuredImage.width,
      height: featuredImage.height,
    }] : []),
    variants: product.variants.edges.map((e) => e.node),
    tags: product.tags,
  };
}
