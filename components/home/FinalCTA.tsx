'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const pulseStyle = `
  @keyframes slowPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.15; }
  }
`;

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-boinng-yellow via-yellow-400 to-boinng-yellow py-10 md:py-10">
      <style dangerouslySetInnerHTML={{ __html: pulseStyle }} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl" style={{ animation: 'slowPulse 4s ease-in-out infinite' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl" style={{ animation: 'slowPulse 4s ease-in-out 2s infinite' }} />
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl" style={{ animation: 'slowPulse 4s ease-in-out 4s infinite' }} />
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-12">

          {/* Text */}
          <div
            className="flex-1 text-center md:text-left"
          >
            <h2 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-boinng-blue uppercase tracking-widest font-black">
              CAN'T WAIT<br />TO HUG<br />YOUR FEET
            </h2>
          </div>

          {/* Logo Center - Rotating Photo with Static Symbol */}
          <div
            className="flex-shrink-0 relative flex items-center justify-center w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
          >
            {/* Rotating background image */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <img
                src="/logos/bg-logo.png"
                alt="Background"
                width={200}
                height={200}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Static symbol on top */}
            <div className="relative z-10 w-[60px] h-[60px] md:w-[100px] md:h-[100px]">
              <Image
                src="/logos/blue-symbol.png"
                alt="BOINNG!"
                fill
                loading="lazy"
                className="object-contain"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div
            className="flex-1 flex justify-center md:justify-end"
          >
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 md:px-12 md:py-5 bg-boinng-blue text-white font-display font-bold tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl transition-all whitespace-nowrap text-base md:text-lg"
              >
                Shop Now
              </motion.button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}