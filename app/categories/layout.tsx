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
    title: `${formattedTitle} Socks | BOINNG!`,
    description: `Explore ${formattedTitle.toLowerCase()} socks by BOINNG! Quirky designs, comfy fits, and standout pairs for every day.`,
    keywords: ['quirky socks', 'BOINNG', 'socks category', formattedTitle.toLowerCase(), 'fun socks'],
    alternates: {
      canonical: `${baseUrl}/categories/${handle}`,
    },
    openGraph: {
      title: `${formattedTitle} Socks | BOINNG!`,
      description: `Shop ${formattedTitle.toLowerCase()} socks at BOINNG!`,
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
