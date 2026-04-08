import { getAllProducts } from '@/lib/shopify/api';
import { AllProductsClient } from '@/components/shop/AllProductsClient';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products | BOINNG! - Quirky Socks',
  description: 'Shop all quirky socks from BOINNG! Fun designs, premium comfort, and socks for every mood.',
  alternates: {
    canonical: 'https://boinng.in/shop',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function ShopPage() {
  const products = await getAllProducts(100);

  return (
    <div className="min-h-screen pt-8 pb-24">
      {/* Header Section */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto mb-12">
        {/* <Link
          href="/"
          className="inline-flex items-center gap-2 text-boinng-blue font-bold uppercase tracking-widest mb-8 hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} />
          Back
        </Link> */}

        <div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase tracking-widest font-bold mb-4 leading-tight">
            Shop All
          </h1>
          <p className="text-xl text-black/60 max-w-2xl">
            You can never enough socks
          </p>
          
          {/* Product count */}
          {/* {products.length > 0 && (
            <p className="text-sm text-black/50 uppercase tracking-widest font-bold mt-6">
              {products.length} Products Available
            </p>
          )} */}
        </div>
      </div>

      {/* Products Grid */}
      <AllProductsClient products={products} />
    </div>
  );
}
