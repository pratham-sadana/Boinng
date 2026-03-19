'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatMoney } from '@/lib/utils';
import { transformProduct } from '@/lib/shopify/api';
import { useCart } from '@/lib/cart/context';

const BADGE_BG: Record<string, string> = {
  'NEW': 'bg-boinng-blue text-[#FFFEFA]',
  'HOT': 'bg-boinng-yellow text-boinng-black',
  'SALE': 'bg-boinng-yellow text-boinng-black',
};

const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0 }
  }
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'tween', duration: 0.4 } }
};

import type { Product } from '@/lib/shopify/types';

function ProductCard({ product, onQuickAdd }: { product: Product; onQuickAdd: () => void }) {
  const transformed = transformProduct(product);
  const displayPrice = formatMoney(transformed.price);
  const comparePrice = transformed.comparePrice && parseFloat(transformed.comparePrice) > 0 ? formatMoney(transformed.comparePrice) : null;
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get all available images
  const allImages = transformed.images && transformed.images.length > 0 ? transformed.images : (transformed.image ? [transformed.image] : []);
  const currentImage = allImages[currentImageIndex];
  
  // Check for badges based on tags
  let badge = '';
  if (product.tags?.includes('new')) badge = 'NEW';
  else if (product.tags?.includes('hot')) badge = 'HOT';
  else if (product.tags?.includes('sale')) badge = 'SALE';

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    await onQuickAdd();
    setIsAdding(false);
  };

  const handleMouseEnter = () => {
    // Show 2nd image on hover if exists
    if (allImages.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    // Revert to 1st image when mouse leaves
    setCurrentImageIndex(0);
  };

  return (
    <div className="block group h-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div 
          className="group cursor-pointer relative flex flex-col rounded-xl border h-full border-black/5 shadow-none transition-all duration-500 hover:-translate-y-2 hover:shadow-lg overflow-hidden"
        >
          {/* Image */}
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[300px] overflow-hidden bg-black/5">
          <div className="relative w-full h-full flex items-center justify-center bg-black/[0.03] overflow-hidden">
            <Link href={`/products/${product.handle}`} className="absolute inset-0 z-10" />
            {currentImage?.url ? (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || product.title}
                fill
                loading="eager"
                className="object-cover w-full h-full transition-opacity duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={false}
                key={currentImageIndex}
                onError={(e) => {
                  console.warn(`Failed to load image: ${currentImage?.url}`);
                }}
              />
            ) : (
              <span 
                className="font-display text-4xl uppercase text-center tracking-widest leading-none p-6 text-black/30"
              >
                {product.title}
              </span>
            )}
            
            {badge && (
              <span className={`absolute top-4 left-4 text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 box-border rounded-full ${BADGE_BG[badge]} z-20`}>
                {badge}
              </span>
            )}



            {/* Quick Add Overlay */}
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="absolute bottom-4 left-4 right-4 bg-boinng-blue text-[#FFFEFA] font-display text-xs font-bold tracking-widest uppercase text-center py-4 rounded-xl shadow-md hover:bg-boinng-yellow transition-colors z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'ADDING...' : 'QUICK ADD'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className=" flex flex-col md:flex-row md:items-start justify-between gap-2 bg-boinng-bg p-3 md:p-4 rounded-xl border border-boinng-blue/5">
          <div className="flex-1">
            <h3 className="font-display text-base md:text-2xl font-bold uppercase tracking-widest text-boinng-black leading-tight mb-1 md:mb-2 line-clamp-2 md:line-clamp-none">
              {transformed.title}
            </h3>
            {transformed.tags.length > 0 && (
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-boinng-black/40">
                {transformed.tags[0]}
              </p>
            )}
          </div>
          <div className="text-left md:text-right flex flex-row items-center gap-2 md:flex-col md:gap-1">
            <p className="text-base md:text-lg font-bold text-boinng-blue">
              {displayPrice}
            </p>
            {comparePrice && (
              <p className="text-[10px] md:text-xs font-bold text-boinng-black/40 line-through">
                {comparePrice}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProductsContent({ title, products }: { title: string; products: Product[] }) {
  const { addItem } = useCart();

  const handleQuickAdd = async (product: Product) => {
    const transformed = transformProduct(product);
    // Use the default variant ID (merchandiseId), not the product ID
    const variantId = transformed.variants[0]?.id;
    if (!variantId) {
      console.error('No variant available for product:', transformed.title);
      return;
    }
    await addItem({
      id: variantId,
      quantity: 1,
      title: transformed.title,
      price: parseFloat(transformed.price),
      image: transformed.image?.url || '/logos/blue-text.png',
    });
  };

  return (
    <section className="py-12 bg-[#FFFEFA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">

        <div
          className="flex justify-between items-end mb-14 border-b border-black/10 pb-6"
        >
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-boinng-black uppercase tracking-widest leading-none">
            {title}
          </h2>
          <Link href="/collections" className="hidden sm:inline-block font-bold text-sm tracking-widest uppercase text-boinng-black hover:text-boinng-blue transition-colors">
            SHOP ALL &rarr;
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-boinng-black/50 font-medium tracking-widest uppercase">
              No products found. Check your Shopify collection setup.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((p, idx) => (
              <ProductCard 
                key={p.handle} 
                product={p} 
                onQuickAdd={() => handleQuickAdd(p)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
