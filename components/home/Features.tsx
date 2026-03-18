'use client';
import { motion, Variants } from 'framer-motion';
import { Check, Shield, Award } from 'lucide-react';

const FEATURES = [
  {
    id: 1,
    title: 'PREMIUM COTTON',
    desc: 'Ethically sourced, combed cotton with proven breathability. Tested to 100+ wash cycles without degradation.',
    icon: <Check size={24} strokeWidth={1.5} />,
    stat: '100%',
    statDesc: 'Satisfaction'
  },
  {
    id: 2,
    title: 'ENGINEERED DURABILITY',
    desc: 'Advanced reinforced heel and toe construction. Maintains shape and elasticity through continuous wear.',
    icon: <Shield size={24} strokeWidth={1.5} />,
    stat: '2YR',
    statDesc: 'Warranty'
  },
  {
    id: 3,
    title: 'QUALITY ASSURED',
    desc: 'Third-party tested for materials, durability, and safety standards. Every batch verified before shipping.',
    icon: <Award size={24} strokeWidth={1.5} />,
    stat: '1K+',
    statDesc: 'Happy Customers'
  }
];

const TRUST_SIGNALS = [
  { label: 'Eco-Friendly Materials', value: 'GOTS Certified' },
  { label: 'Quality Control', value: '99.2% Pass Rate' },
  { label: 'Lifetime Support', value: 'Free Replacements' },
  { label: 'Returns', value: '60-Day Guarantee' }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const cardVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

const headerVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.7, type: "spring", bounce: 0.4 }
  }
};

const statsVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
};

const QUALITY_POINTS = [
  'Third-party tested materials',
  'Ethically sourced cotton',
  'Reinforced heel & toe',
  'Certified durability standards',
  'Lifetime customer support'
];

export function Features() {
  return (
    <section className="py-16 bg-boinng-yellow overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">

        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row gap-12 justify-between items-center mb-20 ml-32"
        >
          <div className="flex-1">
            <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-tight text-boinng-black uppercase tracking-widest">
              BUILT ON<br/>QUALITY &<br/><span className="text-boinng-blue">INTEGRITY</span>
            </h2>
            <p className="font-medium text-base tracking-wide text-boinng-black/70 max-w-lg mt-6 leading-relaxed">
              We stand behind every pair. Our commitment to quality means rigorous testing, ethical sourcing, and unwavering customer support.
            </p>
          </div>

          <div className="flex-1">
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-4"
            >
              {QUALITY_POINTS.map((point, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  variants={statsVariants}
                  className="flex items-start ml-28 gap-4"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-boinng-blue text-white flex items-center justify-center text-sm font-bold mt-1">
                    ✓
                  </span>
                  <span className="font-medium text-boinng-black/80 text-base leading-relaxed">
                    {point}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

        {/* Core Features */}
        {/* <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.id}
              variants={cardVariants}
              className="relative group h-full rounded-2xl overflow-hidden border border-black/8 shadow-sm bg-white transition-all duration-500 hover:shadow-lg hover:border-boinng-blue/20 p-10 flex flex-col"
            >
              <div className="flex items-start justify-between mb-8">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-3 bg-boinng-bg border border-boinng-blue/10 rounded-lg text-boinng-blue"
                >
                  {f.icon}
                </motion.div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-boinng-blue tracking-wide">
                    {f.stat}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-boinng-black/50 font-medium">
                    {f.statDesc}
                  </div>
                </div>
              </div>

              <h3 className="font-display text-lg font-bold tracking-widest uppercase mb-4 text-boinng-black">
                {f.title}
              </h3>
              <p className="text-sm font-medium text-boinng-black/65 leading-relaxed mb-6 flex-grow">
                {f.desc}
              </p>
              <div className="h-1 w-12 bg-boinng-yellow rounded-full" />
            </motion.div>
          ))}
        </motion.div> */}

        {/* Trust Signals
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-50px" }}
          className="bg-boinng-black text-white rounded-3xl p-12 md:p-16 mb-20"
        >
          <h3 className="font-display text-3xl font-bold uppercase tracking-widest mb-12 text-center">
            Why You Can Trust Us
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {TRUST_SIGNALS.map((signal, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={statsVariants}
                className="text-center"
              >
                <div className="font-display text-sm uppercase tracking-widest text-boinng-yellow mb-2">
                  {signal.label}
                </div>
                <div className="text-xl md:text-2xl font-bold text-white">
                  {signal.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div> */}

      </div>
    </section>
  );
}
