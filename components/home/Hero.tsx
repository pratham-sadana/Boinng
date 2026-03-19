'use client';
import { motion } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end center"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);
  console.log('DOMAIN:', process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN)
  console.log('TOKEN:', process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN)
  return (
    <div className='border-b-8 rounded-lg w-full h-[75vh] border-boinng-yellow/50 overflow-hidden relative'>
      <section ref={ref} className="relative w-full h-full bg-boinng-black overflow-hidden">

        {/* Parallax background */}
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <div className="absolute inset-0 bg-gradient-to-br from-boinng-black via-boinng-blue/60 to-boinng-black" />
        </motion.div>

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
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-b from-boinng-black/20 via-transparent to-transparent"
          style={{ opacity }}
        />

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          style={{ opacity }}
        />
      </section>
    </div>
  );
}