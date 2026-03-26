'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { formatMoney } from '@/lib/utils';
import { transformProduct } from '@/lib/shopify/api';
import { useCart } from '@/lib/cart/context';
import { ShoppingBag, Check } from 'lucide-react';

import type { Product } from '@/lib/shopify/types';

const BADGE_BG: Record<string, string> = {
  'NEW':  'bg-boinng-blue text-[#FFFEFA]',
  'HOT':  'bg-boinng-yellow text-boinng-black',
  'SALE': 'bg-red-500 text-white',
};

interface AllProductsClientProps {
  products: Product[];
}

export function AllProductsClient({ products }: AllProductsClientProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-24 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <p className="text-2xl text-black/60">No products found.</p>
      </div>
    );
  }

  return (
    <section className="py-2 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
      >
        {products.map((product, index) => (
          <ProductCard key={product.handle} product={product} index={index} />
        ))}
      </motion.div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const transformed = transformProduct(product);
  const displayPrice = formatMoney(transformed.price);
  const comparePrice = transformed.comparePrice && parseFloat(transformed.comparePrice) > 0
    ? formatMoney(transformed.comparePrice) : null;

  const [isAdding,          setIsAdding]          = useState(false);
  const [addedSuccess,      setAddedSuccess]      = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesReady,       setImagesReady]       = useState(false);

  const allImages = transformed.images?.length > 0
    ? transformed.images
    : (transformed.image ? [transformed.image] : []);

  // Preload all images on mount — no blank flash on hover
  useEffect(() => {
    if (allImages.length <= 1) { setImagesReady(true); return; }
    let loaded = 0;
    allImages.forEach((img) => {
      if (!img?.url) { loaded++; if (loaded === allImages.length) setImagesReady(true); return; }
      const el = new window.Image();
      el.onload = el.onerror = () => { loaded++; if (loaded === allImages.length) setImagesReady(true); };
      el.src = img.url;
    });
  }, []);

  let badge = '';
  if (product.tags?.includes('new'))       badge = 'NEW';
  else if (product.tags?.includes('hot'))  badge = 'HOT';
  else if (product.tags?.includes('sale')) badge = 'SALE';

  const discountPct = comparePrice
    ? Math.round(((parseFloat(transformed.comparePrice!) - parseFloat(transformed.price)) / parseFloat(transformed.comparePrice!)) * 100)
    : null;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    await addItem({
      id: transformed.variants[0]?.id || '',
      quantity: 1,
      title: transformed.title,
      price: parseFloat(transformed.price),
      image: transformed.image?.url || '/logos/blue-text.png',
    });
    setIsAdding(false);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-black/[0.07] h-full transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/10 cursor-pointer"
        onMouseEnter={() => imagesReady && allImages.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-black/[0.03]">
          <Link href={`/products/${product.handle}`} className="absolute inset-0 z-10" aria-label={transformed.title} />

          {allImages[0]?.url ? (
            <>
              <Image
                src={allImages[0].url}
                alt={allImages[0].alt || product.title}
                fill
                loading="eager"
                priority={index < 3}
                className="object-cover group-hover:scale-[1.05]"
                style={{ opacity: currentImageIndex === 0 ? 1 : 0, transition: 'opacity 0.5s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                sizes="220px"
              />
              {allImages[1]?.url && (
                <Image
                  src={allImages[1].url}
                  alt={allImages[1].alt || product.title}
                  fill
                  loading="eager"
                  className="object-cover group-hover:scale-[1.05]"
                  style={{ opacity: currentImageIndex === 1 ? 1 : 0, transition: 'opacity 0.5s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                  sizes="220px"
                />
              )}
            </>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-display text-lg uppercase tracking-widest text-black/20 p-4 text-center leading-tight">
              {product.title}
            </span>
          )}

          {/* Badge */}
          {(badge || discountPct) && (
            <span className={`absolute top-2 left-2 text-[8px] font-black tracking-[0.15em] uppercase px-2 py-0.5 rounded-full z-20 ${badge ? BADGE_BG[badge] : 'bg-red-500 text-white'}`}>
              {badge || `-${discountPct}%`}
            </span>
          )}

          {/* Quick Add — slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] p-2">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-[10px] tracking-[0.15em] uppercase transition-all duration-200 shadow-lg ${
                addedSuccess ? 'bg-emerald-500 text-white' : 'bg-boinng-blue text-white hover:bg-boinng-blue/90'
              } disabled:opacity-70`}
            >
              {addedSuccess ? (
                <><Check size={11} strokeWidth={3} /> Added!</>
              ) : isAdding ? (
                <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Adding...</>
              ) : (
                <><ShoppingBag size={11} strokeWidth={2} /> Quick Add</>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[11px] font-bold uppercase tracking-widest text-boinng-black leading-snug line-clamp-2 group-hover:text-boinng-blue transition-colors duration-300">
              {transformed.title}
            </h3>
            {transformed.tags.length > 0 && (
              <p className="text-[9px] font-semibold uppercase tracking-widest text-black/30 mt-0.5 truncate">
                {transformed.tags[0]}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] font-bold text-boinng-blue tabular-nums">{displayPrice}</p>
            {comparePrice && (
              <p className="text-[9px] font-semibold text-black/30 line-through tabular-nums">{comparePrice}</p>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-boinng-blue group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </div>
    </motion.div>
  );
}
