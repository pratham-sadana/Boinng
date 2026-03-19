import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const handle = resolvedParams?.handle || 'product';
  const baseUrl = 'https://boinng.in';
  
  // Format handle to title (bold-tee -> Bold Tee)
  const formattedTitle = handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} | BOINNG! Streetwear`,
    description: `Shop ${formattedTitle} from BOINNG! - India's boldest streetwear brand. Premium quality, limited drops, bold designs.`,
    keywords: ['streetwear', 'BOINNG', 'fashion', formattedTitle.toLowerCase(), 'shop'],
    alternates: {
      canonical: `${baseUrl}/products/${handle}`,
    },
    openGraph: {
      title: `${formattedTitle} | BOINNG!`,
      description: `Shop ${formattedTitle} from BOINNG!`,
      type: 'website',
      url: `${baseUrl}/products/${handle}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
