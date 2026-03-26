'use client';
import { motion } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef(null);
  return (
    <div className='border-b-8 rounded-lg w-full h-[75vh] border-boinng-yellow/50 overflow-hidden relative'>
      <section ref={ref} className="relative w-full h-full bg-boinng-black overflow-hidden">

        {/* Parallax background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-boinng-black via-boinng-blue/60 to-boinng-black" />
        </div>

        {/* Video */}
        <motion.video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        />

        {/* Overlay */}
        <div
          className="absolute inset-0 z-10 bg-gradient-to-b from-black/65 via-transparent to-transparent"
        />
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center px-4"
        >
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-white uppercase tracking-widest leading-none mb-6">
            Socks that don’t feel basic
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl">
            For days when your outfit is simple but your personality isn’t.
          </p>
        </motion.div>
        {/* CTA buttons */}
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <motion.a
            href="/shop"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto text-center inline-block px-5 py-3 bg-black bg-opacity-25 text-white font-bold tracking-widest uppercase rounded-full text-xs sm:text-sm shadow-lg hover:shadow-xl transition-shadow border border-white/50"
          >
            Shop Now →
          </motion.a>

          <motion.a
            href="/collections/best-sellers"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto text-center inline-block px-5 py-3 bg-black bg-opacity-25 text-white font-bold tracking-widest uppercase rounded-full text-xs sm:text-sm shadow-lg hover:shadow-xl transition-shadow border border-white/50"
          >
            Best Sellers →
          </motion.a>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        />
      </section>
    </div>
  );
}