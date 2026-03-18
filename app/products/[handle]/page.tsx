import { getProduct, transformProduct } from '@/lib/shopify/api';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/product/ProductDetails';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';

// Revalidate product pages every 60 seconds
export const revalidate = 60;

// Generate metadata for the product page
export async function generateMetadata({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

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

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  const transformedProduct = transformProduct(product);

  return (
    <div className="pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <ProductDetails product={transformedProduct} />
      </div>
      
      {/* Products You May Like Section */}
      <div className="mt-24 pt-16 border-t border-black/10">
        <FeaturedProducts 
          title="PRODUCTS YOU MAY LIKE"
          collectionHandle="best-sellers"
          limit={4}
        />
      </div>
    </div>
  );
}
