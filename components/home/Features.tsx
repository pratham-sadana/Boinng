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
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0 }
  }
};

const cardVariants: Variants = {
  hidden: { y: 0, opacity: 1 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: 'tween', duration: 0 }
  }
};

const headerVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.5, type: "tween" }
  }
};

const statsVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.05 }
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

        <div
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
            <ul
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
            </ul>
          </div>
        </div>


      </div>
    </section>
  );
}
