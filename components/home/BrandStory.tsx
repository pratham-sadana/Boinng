'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BrandStory() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const stats = [
    { value: '50+',  label: 'Wild designs' },
    { value: '100%', label: 'Made in India' },
    { value: '10K+', label: 'Happy feet' },
    { value: 'New',  label: 'Drop every Friday' },
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-boinng-black text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-boinng-blue text-[10px] font-black tracking-[0.3em] uppercase mb-4">
              Our Story
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] uppercase tracking-widest leading-tight mb-6">
              Life's too short<br />for boring socks.
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-4">
              BOINNG! was born from a simple frustration — why is the most expressive inch of your outfit always a plain white tube? We said no. Loud prints, wild patterns, zero apologies.
            </p>
            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8">
              Every pair is designed and made right here in India. So whether you're showing them off or hiding them in sneakers, your feet are always having more fun than everyone else's.
            </p>

            <Link
              href="/pages/about"
              className="group inline-flex items-center gap-2 font-bold text-xs tracking-[0.2em] uppercase text-boinng-blue hover:text-white transition-colors duration-200"
            >
              Read our full story
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right — stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white/[0.04] hover:bg-white/[0.08] transition-colors duration-300 p-8 flex flex-col gap-1"
              >
                <span className="font-display text-3xl md:text-4xl font-bold text-boinng-blue leading-none">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}