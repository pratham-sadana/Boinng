import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const handle = resolvedParams?.handle || 'collection';
  const baseUrl = 'https://boinng.in';
  
  // Format handle to title (best-sellers -> Best Sellers)
  const formattedTitle = handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} | BOINNG! Streetwear`,
    description: `Explore our ${formattedTitle.toLowerCase()} collection. Premium streetwear from BOINNG! - Limited drops, bold designs, zero compromise.`,
    keywords: ['streetwear', 'BOINNG', 'collection', formattedTitle.toLowerCase()],
    alternates: {
      canonical: `${baseUrl}/collections/${handle}`,
    },
    openGraph: {
      title: `${formattedTitle} | BOINNG!`,
      description: `Check out our ${formattedTitle.toLowerCase()} collection`,
      type: 'website',
      url: `${baseUrl}/collections/${handle}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
