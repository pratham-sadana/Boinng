import { MetadataRoute } from 'next';

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
      url: `${baseUrl}/collections`, 
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

  // Try to fetch dynamic collections and products
  let dynamicPages: MetadataRoute.Sitemap = [];
  
  try {
    // Fetch collections from your API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const collectionsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || baseUrl}/api/menu`,
      { 
        signal: controller.signal,
        next: { revalidate: 86400 }, // Revalidate daily
      }
    );
    clearTimeout(timeout);
    
    if (collectionsResponse.ok) {
      const collections = await collectionsResponse.json();
      
      if (Array.isArray(collections)) {
        dynamicPages = [
          ...dynamicPages,
          ...collections.map((collection: any) => ({
            url: `${baseUrl}/collections/${collection.handle}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          })),
        ];
      }
    }
  } catch (error) {
    // Gracefully handle errors - sitemap will use only static pages
    // This is safe because collections are also routable if they exist
    if (process.env.NODE_ENV === 'development') {
      console.warn('Sitemap: Could not fetch dynamic collections. Using static pages only.');
    }
  }

  return [...staticPages, ...dynamicPages];
}
