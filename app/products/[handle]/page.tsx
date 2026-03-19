import { getProduct, transformProduct } from '@/lib/shopify/api';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ProductDetails } from '@/components/product/ProductDetails';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | BOINNG!`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.featuredImage?.url || '',
          width: product.featuredImage?.width || 800,
          height: product.featuredImage?.height || 600,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const resolvedParams = await params;

  let product;
  try {
    product = await getProduct(resolvedParams.handle);
  } catch (error) {
    console.error('ProductPage error:', error);
    throw error;
  }

  if (!product) notFound();

  const transformedProduct = transformProduct(product);

  return (
    <main className="bg-[#FFFEFA] min-h-screen">
      {/* JSON-LD Schema for Product */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: transformedProduct.title,
            description: transformedProduct.description,
            image: transformedProduct.images.map((img) => img.url),
            brand: {
              '@type': 'Brand',
              name: 'BOINNG!',
            },
            offers: {
              '@type': 'Offer',
              url: `https://boinng.com/products/${resolvedParams.handle}`,
              priceCurrency: transformedProduct.currency || 'INR',
              price: transformedProduct.price,
              availability: transformedProduct.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
            url: `https://boinng.com/products/${resolvedParams.handle}`,
          }),
        }}
      />

      {/* Product details */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 pt-10 pb-16">
        <ProductDetails product={transformedProduct} />
      </div>

      {/* You may also like */}
      <div className="border-t border-black/10">
        <FeaturedProducts
          title="YOU MAY ALSO LIKE"
          collectionHandle="best-sellers"
          limit={8}
          excludeHandle={resolvedParams.handle}
        />
      </div>

    </main>
  );
}