import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const handle = resolvedParams?.handle || 'category';
  const baseUrl = 'https://boinng.in';
  
  // Format handle to title (best-sellers -> Best Sellers)
  const formattedTitle = handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} | BOINNG! Streetwear`,
    description: `Explore our ${formattedTitle.toLowerCase()} category. Premium streetwear from BOINNG! - Limited drops, bold designs, zero compromise.`,
    keywords: ['streetwear', 'BOINNG', 'category', formattedTitle.toLowerCase()],
    alternates: {
      canonical: `${baseUrl}/categories/${handle}`,
    },
    openGraph: {
      title: `${formattedTitle} | BOINNG!`,
      description: `Check out our ${formattedTitle.toLowerCase()} category`,
      type: 'website',
      url: `${baseUrl}/categories/${handle}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
