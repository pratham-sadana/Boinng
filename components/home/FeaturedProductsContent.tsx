'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatMoney } from '@/lib/utils';
import { transformProduct } from '@/lib/shopify/api';
import { QuickAddModal } from '@/components/product/QuickAddModal';

const BADGE_BG: Record<string, string> = {
  'NEW': 'bg-boinng-blue text-[#FFFEFA]',
  'HOT': 'bg-boinng-yellow text-boinng-black',
  'SALE': 'bg-boinng-yellow text-boinng-black',
};

const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVars: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } }
};

function ProductCard({ product, onQuickAdd }: { product: any; onQuickAdd: () => void }) {
  const transformed = transformProduct(product);
  const displayPrice = formatMoney(transformed.price);
  const comparePrice = transformed.comparePrice && parseFloat(transformed.comparePrice) > 0 ? formatMoney(transformed.comparePrice) : null;
  
  // Check for badges based on tags
  let badge = '';
  if (product.tags?.includes('new')) badge = 'NEW';
  else if (product.tags?.includes('hot')) badge = 'HOT';
  else if (product.tags?.includes('sale')) badge = 'SALE';

  return (
    <motion.div variants={itemVars}>
      <div className="block group h-full">
        <motion.div 
          whileHover="hover"
          className="group cursor-pointer relative flex flex-col h-full rounded-2xl border border-black/5 shadow-none transition-all duration-500 hover:-translate-y-2 hover:shadow-lg overflow-hidden bg-[#1354e5] "
        >
          {/* Image Block */}
          <div className="relative aspect-[4/5] w-full border-b border-black/5 flex items-center justify-center bg-black/[0.03] overflow-hidden">
            <Link href={`/products/${product.handle}`} className="absolute inset-0 z-10" />
            {transformed.image?.url ? (
              <Image
                src={transformed.image.url}
                alt={transformed.image.alt || product.title}
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={false}
                onError={(e) => {
                  console.warn(`Failed to load image: ${transformed.image?.url}`);
                }}
              />
            ) : (
              <motion.span 
                variants={{ hover: { scale: 1.05, rotate: -2 } }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="font-display text-4xl uppercase text-center tracking-widest leading-none p-6 text-black/30"
              >
                {product.title}
              </motion.span>
            )}
            
            {badge && (
              <span className={`absolute top-4 left-4 text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 box-border rounded-full ${BADGE_BG[badge]} z-20`}>
                {badge}
              </span>
            )}

            {/* Quick Add Overlay */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd();
              }}
              variants={{ hover: { opacity: 1, y: 0 } }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 left-4 right-4 bg-boinng-blue text-[#FFFEFA] font-display text-xs font-bold tracking-widest uppercase text-center py-4 rounded-xl shadow-md hover:bg-boinng-yellow transition-colors z-20"
            >
              QUICK ADD
            </motion.button>
          </div>

          {/* Info */}
          <div className="pt-6 pb-6 px-6 flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold tracking-tight uppercase text-white">{product.title}</p>
            <div className="flex gap-2 items-baseline mt-1">
              <span className="text-sm font-medium text-white/70">{displayPrice}</span>
              {comparePrice && <span className="text-xs font-medium text-white/40 line-through">{comparePrice}</span>}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function FeaturedProductsContent({ title, products }: { title: string; products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <section className="py-12 bg-[#FFFEFA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
          className="flex justify-between items-end mb-14 border-b border-black/10 pb-6"
        >
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-boinng-black uppercase tracking-widest leading-none">
            {title}
          </h2>
          <Link href="/collections" className="hidden sm:inline-block font-bold text-sm tracking-widest uppercase text-boinng-black hover:text-boinng-blue transition-colors">
            SHOP ALL &rarr;
          </Link>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-boinng-black/50 font-medium tracking-widest uppercase">
              No products found. Check your Shopify collection setup.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVars}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((p, idx) => (
              <ProductCard 
                key={p.handle} 
                product={p} 
                onQuickAdd={() => setSelectedProduct(idx)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {selectedProduct !== null && (
        <QuickAddModal
          product={transformProduct(products[selectedProduct])}
          isOpen={selectedProduct !== null}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
