'use client';

import { motion, Variants } from 'framer-motion';
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

const containerVars: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { type: 'tween', duration: 0.4 } },
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
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
        {products.map((product, index) => (
          <ProductCard key={product.handle} product={product} index={index} />
        ))}
      </motion.div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem, isLoading } = useCart();
  const transformed = transformProduct(product);
  const displayPrice  = formatMoney(transformed.price);
  const comparePrice  = transformed.comparePrice && parseFloat(transformed.comparePrice) > 0
    ? formatMoney(transformed.comparePrice)
    : null;

  const [isAdding,          setIsAdding]          = useState(false);
  const [addedSuccess,      setAddedSuccess]      = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mousePos,          setMousePos]          = useState({ x: 50, y: 50 });
  const [imagesReady,       setImagesReady]       = useState(false);

  const allImages    = transformed.images?.length > 0 ? transformed.images : (transformed.image ? [transformed.image] : []);
  const currentImage = allImages[currentImageIndex];

  // Preload all images
  useEffect(() => {
    if (allImages.length <= 1) { setImagesReady(true); return; }
    let loaded = 0;
    const total = allImages.length;
    allImages.forEach((img) => {
      if (!img?.url) { loaded++; if (loaded === total) setImagesReady(true); return; }
      const el = new window.Image();
      el.onload  = () => { loaded++; if (loaded === total) setImagesReady(true); };
      el.onerror = () => { loaded++; if (loaded === total) setImagesReady(true); };
      el.src = img.url;
    });
  }, []);

  let badge = '';
  if (product.tags?.includes('new'))  badge = 'NEW';
  else if (product.tags?.includes('hot'))  badge = 'HOT';
  else if (product.tags?.includes('sale')) badge = 'SALE';

  const discountPct = comparePrice
    ? Math.round(((parseFloat(transformed.comparePrice!) - parseFloat(transformed.price)) / parseFloat(transformed.comparePrice!)) * 100)
    : null;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || !product.variants?.edges?.[0]?.node) return;
    
    setIsAdding(true);
    try {
      const variant = product.variants.edges[0].node;
      await addItem({
        id: variant.id,
        title: product.title,
        quantity: 1,
        price: parseFloat(variant.price.amount),
        image: variant.image?.url || transformed.image?.url || '/logos/cropped.png',
      });
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1800);
    } finally {
      setIsAdding(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    });
  };

  return (
    <motion.div variants={itemVars}>
      <div
        className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-black/[0.07] transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 cursor-pointer h-full"
        onMouseEnter={() => imagesReady && allImages.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
        onMouseMove={handleMouseMove}
      >
        {/* Image area */}
        <div className="relative aspect-[3/4] overflow-hidden bg-black/[0.03]">
          <Link href={`/products/${product.handle}`} className="absolute inset-0 z-10" aria-label={transformed.title} />

          {/* Main image */}
          {currentImage ? (
            <Image
              key={currentImage.url}
              src={currentImage.url}
              alt={currentImage.alt}
              fill
              className="w-full h-full object-cover transition-transform duration-300"
              priority={index < 4}
            />
          ) : (
            <div className="w-full h-full bg-black/5 flex items-center justify-center text-black/20">
              No Image
            </div>
          )}

          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${BADGE_BG[badge]}`}
            >
              {badge}
            </motion.div>
          )}

          {/* Discount percentage */}
          {discountPct && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{discountPct}%
            </div>
          )}

          {/* Quick add button */}
          <motion.button
            onClick={handleQuickAdd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!product.availableForSale || isAdding || isLoading}
            className="absolute bottom-3 right-3 bg-boinng-blue hover:bg-boinng-blue/90 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed z-20"
            aria-label="Add to cart"
          >
            {addedSuccess ? (
              <Check size={18} className="text-white" />
            ) : (
              <ShoppingBag size={18} />
            )}
          </motion.button>
        </div>

        {/* Product info */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col">
          <Link href={`/products/${product.handle}`} className="relative z-20">
            <h3 className="font-bold uppercase tracking-wider text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-boinng-blue transition-colors">
              {transformed.title}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-bold text-sm sm:text-base text-boinng-black">
                ₹{parseFloat(displayPrice).toLocaleString('en-IN')}
              </span>
              {comparePrice && (
                <span className="line-through text-xs text-black/40">
                  ₹{parseFloat(comparePrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Availability */}
            <span className={`text-xs font-bold uppercase tracking-widest ${
              product.availableForSale ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.availableForSale ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
