'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import type { CollectionPreview } from '@/lib/shopify/types';

const HIDDEN_HANDLES = ['sale', 'hidden', 'test'];

interface FeaturedCollectionsContentProps {
  title?: string;
  collections: CollectionPreview[];
}

export function FeaturedCollectionsContent({
  title = 'FEATURED COLLECTIONS',
  collections,
}: FeaturedCollectionsContentProps) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const HIDDEN_HANDLES = ['sale', 'hidden', 'test'];
  const visible = collections.filter(
    (c) => !HIDDEN_HANDLES.includes(c.handle.toLowerCase())
  );

  if (visible.length === 0) return null;

  return (
    <section ref={ref} className="py-10 md:py-14 bg-[#FFFEFA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-between items-center mb-6 pb-5 border-b border-black/10"
        >
          <h2 className="font-display text-[clamp(1.4rem,3.5vw,2.4rem)] text-boinng-black uppercase tracking-widest leading-none">
            {title}
          </h2>
          <Link
            href="/collections/all"
            className="group flex items-center gap-1 font-bold text-[10px] tracking-[0.2em] uppercase text-boinng-black hover:text-boinng-blue transition-colors duration-200"
          >
            View All
            <ArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {visible.map((collection, index) => (
            <CollectionCard key={collection.handle} collection={collection} index={index} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
}

function CollectionCard({
  collection,
  index,
  inView,
}: {
  collection: CollectionPreview;
  index: number;
  inView: boolean;
}) {
  const productCount = collection.products?.edges?.length || 0;

  // Make first card span 2 cols on md+ for an asymmetric editorial feel
  const isHero = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={isHero ? 'col-span-2 md:col-span-1' : ''}
    >
      <Link href={`/collections/${collection.handle}`} className="block h-full">
        <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-full min-h-[200px] md:min-h-[280px]">

          {/* Background image or gradient */}
          {collection.image ? (
            <Image
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-boinng-blue/30 to-boinng-blue/10" />
          )}

          {/* Permanent dark gradient at bottom for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Hover overlay — subtle darkening */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

          {/* Info — sits on top of the image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <h3 className="font-display text-sm md:text-lg lg:text-xl uppercase tracking-widest font-bold text-white leading-tight line-clamp-2 mb-1">
              {collection.title}
            </h3>

            {collection.description && (
              <p className="text-white/60 text-[10px] md:text-xs leading-relaxed line-clamp-2 hidden md:block">
                {collection.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-2">
              {productCount > 0 && (
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/50">
                  {productCount} item{productCount !== 1 ? 's' : ''}
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-boinng-blue group-hover:text-white transition-colors duration-300">
                Shop
                <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>

          {/* Border glow on hover */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}