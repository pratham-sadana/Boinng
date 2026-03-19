'use client';
import { motion, Variants } from 'framer-motion';
import { Check } from 'lucide-react';

const REVIEWS = [
  { id: 1, text: "Minimalist streetwear at its peak. The quality and the fit are unmatched.", author: "RHEA K.", role: "Verified Buyer" },
  { id: 2, text: "Finally, a brand that gets subtle design. Completely elevated my daily rotation.", author: "KABIR S.", role: "Verified Buyer" },
  { id: 3, text: "The cap is on fire. Wore it to a concert and had 3 people ask where I got it from. BOINNG! is the real deal.", author: "ARYAN K.", role: "Verified Buyer" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const Star = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FCB116" className="" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export function Testimonials() {
  return (
    <section className="py-24 bg-[#f8f8f8] overflow-hidden">

      <div className="max-w-[1400px] mx-auto px-4 md:px-10">

        <div
          className="text-center mb-16"
        >
          <h2 className="font-sans text-[clamp(2rem,5vw,3.5rem)] text-boinng-black uppercase tracking-widest leading-none mb-4">
            WORD ON THE STREET
          </h2>
          <p className="font-medium text-sm tracking-widest text-boinng-black/50 uppercase">
            Don't just take our word for it
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {REVIEWS.map((r) => (
            <motion.div
              key={r.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className={`p-10 md:p-12 h-full flex flex-col justify-between rounded-2xl border border-black/5 shadow-sm transition-all duration-300 hover:shadow-xl bg-[#ffffff] text-boinng-black relative`}
            >
              <div className="flex gap-1 text-boinng-black mb-6">
                <Star /><Star /><Star /><Star /><Star />
              </div>

              <p className="text-xl md:text-2xl font-sans font-medium leading-relaxed tracking-wide opacity-90">
                "{r.text}"
              </p>

              <div className="flex flex-col gap-1 pt-6 mt-auto border-t border-black/5">
                <span className="text-[10px] font-medium tracking-[0.15em] text-boinng-black uppercase">
                  {r.author}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] tracking-[0.2em] text-boinng-black/40 uppercase">
                    {r.role}
                  </span>
                  <Check size={14} className="text-green-500 flex-shrink-0 stroke-[3]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
