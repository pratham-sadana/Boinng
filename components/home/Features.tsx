'use client';
import { motion } from 'framer-motion';

const VALUE_BLOCKS = [
  {
    title: 'Not your basic socks',
    description: 'Designs that actually stand out (without trying too hard)',
  },
  {
    title: 'Comfort that lasts all day',
    description: 'Soft, breathable, and made for real life - not just photos',
  },
  {
    title: 'Made to match your vibe',
    description: "Whether you're chill, chaotic, or a little bit of both",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-32 bg-[#FFFEFA] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 md:mb-20 flex flex-col items-center text-center"
        >
          <span className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-black/40 mb-4 block">
            The Difference
          </span>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] text-boinng-black tracking-[0.04em] uppercase max-w-2xl">
            Why Boinng?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {VALUE_BLOCKS.map((block, idx) => (
            <motion.article
              key={block.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-[2rem] border border-black/[0.06] bg-white p-8 md:p-12 transition-all duration-500 hover:shadow-2xl hover:shadow-black/[0.04] hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.02] rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150 group-hover:bg-black/[0.03]" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-[2px] bg-black/10 mb-8 transition-all duration-500 group-hover:w-16 group-hover:bg-black/30" />
                
                <h3 className="font-display text-2xl md:text-3xl text-boinng-black uppercase tracking-[0.04em] leading-tight mb-4">
                  {block.title}
                </h3>
                <p className="text-base md:text-lg text-black/60 leading-relaxed font-light mt-auto">
                  {block.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
