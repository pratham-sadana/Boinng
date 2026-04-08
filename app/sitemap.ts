import { MetadataRoute } from 'next';
import { getAllCollections, getAllProducts } from '@/lib/shopify/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boinng.in';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: new Date(), 
      changeFrequency: 'daily',
      priority: 1.0 
    },
    { 
      url: `${baseUrl}/categories`, 
      lastModified: new Date(), 
      changeFrequency: 'weekly',
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/pages/contact`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly',
      priority: 0.5 
    },
    {
      url: `${baseUrl}/pages/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pages/faqs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    { 
      url: `${baseUrl}/pages/privacy`, 
      lastModified: new Date(), 
      changeFrequency: 'yearly',
      priority: 0.3 
    },
    { 
      url: `${baseUrl}/pages/terms`, 
      lastModified: new Date(), 
      changeFrequency: 'yearly',
      priority: 0.3 
    },
    { 
      url: `${baseUrl}/pages/shipping`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly',
      priority: 0.5 
    },
    { 
      url: `${baseUrl}/pages/returns`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly',
      priority: 0.5 
    },
  ];

  // Try to fetch dynamic categories and products from Shopify
  let dynamicPages: MetadataRoute.Sitemap = [];
  
  try {
    const [collections, products] = await Promise.all([
      getAllCollections(),
      getAllProducts(250),
    ]);

    const categoryPages = collections.map((collection) => ({
      url: `${baseUrl}/categories/${collection.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    dynamicPages = [...categoryPages, ...productPages];
  } catch (error) {
    // Gracefully handle errors - sitemap will use only static pages.
    if (process.env.NODE_ENV === 'development') {
      console.warn('Sitemap: Could not fetch dynamic categories/products. Using static pages only.');
    }
  }

  return [...staticPages, ...dynamicPages];
}
