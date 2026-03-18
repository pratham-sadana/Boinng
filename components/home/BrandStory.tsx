'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const MANIFESTO_ITEMS = [
  {
    id: 1,
    title: 'BOLD IS BETTER',
    description: 'Subtle is out. We celebrate loud, unapologetic self-expression. Your fit should turn heads, not whispers.',
    icon: '⚡',
  },
  {
    id: 2,
    title: 'QUALITY OVER QUANTITY',
    description: 'Limited drops. Premium materials. Engineered to last. We\'d rather make 100 perfect pieces than 10,000 meh ones.',
    icon: '✦',
  },
  {
    id: 3,
    title: 'MADE IN INDIA',
    description: 'We support local craftsmanship and celebrate homegrown talent. Our supply chain is our pride.',
    icon: '🇮🇳',
  },
  {
    id: 4,
    title: 'COMMUNITY FIRST',
    description: 'We\'re not just selling clothes. We\'re building a streetwear movement with people who get it.',
    icon: '🤝',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 }
  }
};

export function BrandStory() {
  return (
    <section className="py-32 bg-boinng-black overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
        {/* Main Manifesto Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-boinng-yellow text-sm font-bold tracking-[0.2em] uppercase mb-6">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-display text-[clamp(3rem,8vw,5rem)] text-[#FFFEFA] uppercase tracking-tight leading-none mb-8">
            We Make <span className="text-boinng-yellow">Streetwear</span> <br /> For The <span className="text-boinng-blue">Bold</span>
          </h2>
          <p className="text-lg md:text-xl font-medium text-[#FFFEFA]/80 max-w-3xl mx-auto leading-relaxed">
            BOINNG! isn't just a brand. It's a movement for people who refuse to blend in. We believe fashion should be loud, authentic, and unapologetically you.
          </p>
        </motion.div>

        {/* Manifesto Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {MANIFESTO_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-8 md:p-10 rounded-2xl border border-boinng-blue/30 bg-gradient-to-br from-boinng-black to-boinng-black/80 backdrop-blur-sm hover:border-boinng-blue/60 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="font-display text-2xl text-[#FFFEFA] uppercase tracking-widest mb-3">
                {item.title}
              </h3>
              <p className="text-[#FFFEFA]/70 font-medium leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-[#FFFEFA]/60 text-sm md:text-base font-medium tracking-wide mb-8 uppercase">
            Ready to make it boinng?
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/collections">
              <motion.div className="inline-block px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-boinng-blue to-boinng-yellow text-boinng-black font-display font-bold tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl transition-shadow">
                JOIN THE MOVEMENT
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats or testimonial section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-boinng-blue/20 pt-12"
        >
          {[
            { number: '50K+', label: 'Happy Customers' },
            { number: '100%', label: 'Premium Quality' },
            { number: '20+', label: 'Collections' },
            { number: '365', label: 'Days Commitment' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + idx * 0.1 }}
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-boinng-yellow mb-2">
                {stat.number}
              </p>
              <p className="text-xs md:text-sm text-[#FFFEFA]/60 uppercase tracking-widest font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
