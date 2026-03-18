'use client';

import { motion } from 'framer-motion';

export function ProductCardSkeleton() {
  // Shimmer animation
  const shimmer = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  };

  return (
    <motion.div
      className="rounded-2xl border border-black/5 shadow-none bg-[#ffffff] overflow-hidden flex flex-col h-full"
      variants={shimmer}
      initial="initial"
      animate="animate"
    >
      {/* Image skeleton */}
      <div className="relative aspect-[4/5] w-full border-b border-black/5 bg-black/5" />

      {/* Content skeleton */}
      <div className="pt-6 pb-6 px-6 flex-1 flex flex-col items-center justify-center text-center gap-3">
        {/* Title skeleton */}
        <div className="w-full h-4 bg-black/5 rounded-full" />
        <div className="w-3/4 h-4 bg-black/5 rounded-full" />

        {/* Price skeleton */}
        <div className="flex gap-2 items-center justify-center mt-2">
          <div className="w-20 h-4 bg-black/5 rounded-full" />
          <div className="w-16 h-4 bg-black/5 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </motion.div>
  );
}

export function ProductDetailSkeleton() {
  const shimmer = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  };

  return (
    <motion.div
      className="grid md:grid-cols-2 gap-8 lg:gap-16"
      variants={shimmer}
      initial="initial"
      animate="animate"
    >
      {/* Image skeleton */}
      <div className="w-full bg-black/5 rounded-lg aspect-square" />

      {/* Details skeleton */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="w-full h-10 bg-black/5 rounded-lg" />
          <div className="w-3/4 h-10 bg-black/5 rounded-lg" />
        </div>

        {/* Price */}
        <div className="h-8 w-40 bg-black/5 rounded-lg" />

        {/* Description */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-black/5 rounded-lg" />
          <div className="w-full h-4 bg-black/5 rounded-lg" />
          <div className="w-2/3 h-4 bg-black/5 rounded-lg" />
        </div>

        {/* Variant selection */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-black/5 rounded-lg" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-16 bg-black/5 rounded-full" />
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="h-14 w-full bg-black/5 rounded-full" />
      </div>
    </motion.div>
  );
}
