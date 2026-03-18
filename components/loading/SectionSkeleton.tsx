'use client';

import { motion } from 'framer-motion';

export function HeroSkeleton() {
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
      className="h-screen bg-black/5 rounded-lg relative overflow-hidden"
      variants={shimmer}
      initial="initial"
      animate="animate"
    />
  );
}

export function FeatureSkeleton() {
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
      className="rounded-2xl border border-black/5 shadow-sm bg-[#ffffff] p-10 space-y-4"
      variants={shimmer}
      initial="initial"
      animate="animate"
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-black/5 rounded-2xl" />

      {/* Title */}
      <div className="h-6 w-3/4 bg-black/5 rounded-lg" />

      {/* Description lines */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-black/5 rounded-lg" />
        <div className="w-full h-4 bg-black/5 rounded-lg" />
        <div className="w-2/3 h-4 bg-black/5 rounded-lg" />
      </div>
    </motion.div>
  );
}

export function TestimonialSkeleton() {
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
      className="rounded-2xl border border-black/5 shadow-sm bg-[#ffffff] p-10 space-y-4"
      variants={shimmer}
      initial="initial"
      animate="animate"
    >
      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-4 h-4 bg-black/5 rounded-full" />
        ))}
      </div>

      {/* Text lines */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-black/5 rounded-lg" />
        <div className="w-full h-4 bg-black/5 rounded-lg" />
        <div className="w-3/4 h-4 bg-black/5 rounded-lg" />
      </div>

      {/* Author info */}
      <div className="pt-4 border-t border-black/5 space-y-2">
        <div className="h-3 w-1/2 bg-black/5 rounded-lg" />
        <div className="h-3 w-1/3 bg-black/5 rounded-lg" />
      </div>
    </motion.div>
  );
}

export function SectionHeaderSkeleton() {
  return (
    <div className="space-y-4 mb-6">
      <div className="h-12 w-2/3 bg-black/5 rounded-lg" />
      <div className="h-4 w-1/2 bg-black/5 rounded-lg" />
    </div>
  );
}
