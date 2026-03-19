'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import type { CollectionPreview } from '@/lib/shopify/types';

interface AllCollectionsClientProps {
  collections: CollectionPreview[];
}

export function AllCollectionsClient({ collections }: AllCollectionsClientProps) {
  return (
    <div className="min-h-screen pt-8 pb-24">
      {/* Hero Section */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto mb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-boinng-blue font-bold uppercase tracking-widest mb-8 hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl uppercase tracking-widest font-bold mb-4 leading-tight">
            All Collections
          </h1>
          <p className="text-xl text-black/60 max-w-2xl">
            Explore all of BOINNG!'s premium streetwear collections. From bold basics to limited drops, find your next favorite piece.
          </p>
        </motion.div>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {collections.map((collection, index) => (
              <CollectionCard
                key={collection.handle}
                collection={collection}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="px-4 md:px-8 max-w-7xl mx-auto py-24 text-center">
          <p className="text-xl text-black/60">No collections found.</p>
        </div>
      )}
    </div>
  );
}

function CollectionCard({
  collection,
  index,
}: {
  collection: CollectionPreview;
  index: number;
}) {
  const productCount = collection.products?.edges?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/collections/${collection.handle}`}>
        <div className="relative rounded-2xl overflow-hidden bg-black/5 border border-black/[0.07] transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
          {/* Image Container */}
          {collection.image ? (
            <div className="relative aspect-[4/3] overflow-hidden bg-black/[0.03]">
              <Image
                src={collection.image.url}
                alt={collection.image.altText || collection.title}
                fill
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-gradient-to-br from-boinng-blue/20 to-boinng-blue/5 flex items-center justify-center">
              <span className="text-boinng-blue/50 text-center px-4">No Image</span>
            </div>
          )}

          {/* Content Container */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl lg:text-3xl uppercase tracking-wider font-bold mb-2 group-hover:text-boinng-blue transition-colors line-clamp-2">
                {collection.title}
              </h3>
              {collection.description && (
                <p className="text-black/60 text-sm leading-relaxed line-clamp-2">
                  {collection.description}
                </p>
              )}
            </div>

            {/* Product Count Badge */}
            {productCount > 0 && (
              <div className="mt-4 pt-4 border-t border-black/10">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-boinng-blue">
                  {productCount} Product{productCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Overlay Arrow */}
          <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <ArrowRight size={20} className="text-boinng-blue" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
