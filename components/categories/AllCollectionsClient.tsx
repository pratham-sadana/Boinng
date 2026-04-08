'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import type { CollectionPreview } from '@/lib/shopify/types';

// Collections to hide from the public listing
const HIDDEN_HANDLES = ['sale', 'hidden', 'test'];

interface AllCollectionsClientProps {
  collections: CollectionPreview[];
}

export function AllCollectionsClient({ collections }: AllCollectionsClientProps) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const visible = collections.filter(
    (c) => !HIDDEN_HANDLES.includes(c.handle.toLowerCase())
  );

  return (
    <main className="bg-[#FFFEFA] min-h-screen">

      {/* Hero */}
      <section className="bg-boinng-black pt-16 pb-14 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <p className="text-boinng-blue text-[10px] font-black tracking-[0.35em] uppercase mb-4">
            Browse everything
          </p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] uppercase tracking-widest text-white leading-tight mb-3">
            All Categories
          </h1>
          <p className="text-white/45 text-sm max-w-sm mx-auto leading-relaxed">
            Every drop, every theme, every excuse to wear wild socks.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section ref={ref} className="max-w-[1400px] mx-auto px-4 md:px-10 py-14 md:py-20">
        {visible.length === 0 ? (
          <p className="text-center text-black/40 font-bold tracking-widest uppercase text-sm py-20">
            No categories found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {visible.map((collection, index) => (
              <CollectionCard
                key={collection.handle}
                collection={collection}
                index={index}
                inView={inView}
              />
            ))}
          </div>
        )}
      </section>
    </main>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/categories/${collection.handle}`} className="block h-full">
        <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-full min-h-[200px] md:min-h-[280px]">

          {/* Background image or fallback gradient */}
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

          {/* Permanent dark gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Hover darkening */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <h3 className="font-display text-sm md:text-lg lg:text-xl uppercase tracking-widest font-bold text-white leading-tight line-clamp-2 mb-1">
              {collection.title}
            </h3>

            {collection.description && (
              <p className="text-white/55 text-[10px] md:text-xs leading-relaxed line-clamp-2 hidden md:block">
                {collection.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-2">
              {productCount > 0 && (
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/45">
                  {productCount} item{productCount !== 1 ? 's' : ''}
                </span>
              )}
              <span className="ml-auto flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors duration-300">
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