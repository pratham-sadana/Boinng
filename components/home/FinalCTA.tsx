'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-boinng-yellow via-yellow-400 to-boinng-yellow py-16 md:py-24">
      {/* Gradient blobs background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
        <div className="flex items-center justify-between gap-8 md:gap-12">
          
          {/* Text left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="font-display text-[clamp(1.5rem,4vw,3rem)] leading-tight text-boinng-blue uppercase tracking-widest font-black">
              CAN'T WAIT<br/>TO HUG<br/>YOUR FEET
            </h2>
          </motion.div>

          {/* Logo Center - Rotating Photo with Static Symbol */}
          <motion.div
            initial={{ opacity: 0, scale: 1.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            viewport={{ once: true }}
            className="flex-shrink-0 relative flex items-center justify-center"
          >
            {/* Rotating background image */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-[200px] h-[200px]"
            >
              <img 
                src="/logos/bg-logo.png" 
                alt="Background" 
                className="object-contain"
              />
            </motion.div>

            {/* Static symbol on top */}
            <div className="relative z-10">
              <Image 
                src="/logos/blue-symbol.png" 
                alt="BOINNG!" 
                width={100}
                height={100}
                className="pl-4 object-contain"
              />
            </div>
          </motion.div>

          {/* CTA Button Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            viewport={{ once: true }}
            className="flex-1 flex justify-end"
          >
            <Link href="/collections/best-sellers">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 md:px-12 py-4 md:py-5 bg-boinng-blue text-white font-display font-bold tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
