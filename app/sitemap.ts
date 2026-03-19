import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boinng.com';
  
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
    // Fetch collections from your API
    const collectionsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || baseUrl}/api/menu`, {
      next: { revalidate: 86400 }, // Revalidate daily
    });
    
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
    console.error('Failed to fetch collections for sitemap:', error);
  }

  return [...staticPages, ...dynamicPages];
}
