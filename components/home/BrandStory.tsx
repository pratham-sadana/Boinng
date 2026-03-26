'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BrandStory() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#F6F1E7] text-boinng-black overflow-hidden relative">
      <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-boinng-yellow/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-boinng-blue/20 blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-12 lg:gap-16 items-stretch">

          {/* Left - story card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -top-3 left-5 h-8 w-28 bg-boinng-yellow/80 rotate-[-2deg] rounded-sm" />
            <div className="relative rounded-3xl border border-black/10 bg-[#fffdf8] p-6 md:p-8 lg:p-10 shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
              <p className="text-boinng-blue text-[10px] font-black tracking-[0.3em] uppercase mb-4">
                Brand Story
              </p>
              <h2 className="font-display text-[clamp(1.8rem,4.6vw,3.1rem)] uppercase tracking-[0.06em] leading-[1.02] mb-6">
                Why we started
              </h2>

              <div className="space-y-4 text-[15px] md:text-base leading-relaxed text-black/75">
                <p>
                  Boinng did not start in a big office or with a perfect plan.
                </p>
                <p>
                  It started with a simple thought - why are socks always so boring?
                </p>
                <p>
                  After leaving a fast-paced job and moving back home, I wanted to build something of my own. Something fun. Something expressive. Something that feels like you.
                </p>
                <p>
                  Because the smallest things you wear?
                  <br />
                  They should still feel like you chose them.
                </p>
                <p className="font-semibold text-black/90">
                  And that is how Boinng was born.
                </p>
              </div>

              <Link
                href="/pages/about"
                className="group mt-7 inline-flex items-center gap-2 font-bold text-xs tracking-[0.2em] uppercase text-boinng-blue hover:text-boinng-black transition-colors duration-200"
              >
                Read our full story
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right - personal visual stack */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:h-full"
          >
            <div className="rounded-3xl overflow-hidden border border-black/10 bg-black shadow-[0_12px_34px_rgba(0,0,0,0.18)] aspect-square lg:aspect-auto lg:h-full">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover opacity-90"
              >
                <source src="/hero1.mp4" type="video/mp4" />
              </video>
            </div>
            {/* <div className="rounded-2xl border border-black/10 bg-white/85 backdrop-blur px-5 py-4 mt-4 lg:mt-0 lg:absolute lg:left-4 lg:right-4 lg:bottom-4">
              <p className="text-[10px] font-black tracking-[0.24em] uppercase text-boinng-blue mb-2">
                Behind The Scenes
              </p>
              <p className="text-sm leading-relaxed text-black/70">
                Building Boinng from home, one idea, one sketch, and one bold drop at a time.
              </p>
            </div> */}
          </motion.div>

        </div>
      </div>
    </section>
  );
}