'use client';
import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
} from 'framer-motion';

const DEFAULT = ['NEW DROPS EVERY FRIDAY', 'FREE SHIPPING OVER ₹799', 'LIMITED EDITION ONLY', 'STREETWEAR FOR THE BOLD', 'MADE IN INDIA'];

export function Marquee({ items = DEFAULT, sep = '✦', dark = false, speed = 80 }: {
  items?: string[]; sep?: string; dark?: boolean; speed?: number;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [singleWidth, setSingleWidth] = useState(0);

  const singleRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useTransform(scrollY, [0, 1000], [0, 5], { clamp: false });
  const velocityFactor = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  // ✅ Measure the exact pixel width of ONE copy
  useEffect(() => {
    if (singleRef.current) {
      setSingleWidth(singleRef.current.scrollWidth);
    }
  }, [items]);

  useAnimationFrame((t, delta) => {
    if (isPaused || singleWidth === 0) return;

    const hoverSpeedFactor = isHovered ? 0.3 : 1;
    let moveBy = -speed * (delta / 1000) * hoverSpeedFactor;
    moveBy += moveBy * velocityFactor.get();

    let next = baseX.get() + moveBy;

    // ✅ Reset by exactly one copy's pixel width — zero visible jump
    if (next <= -singleWidth) {
      next += singleWidth;
    }

    baseX.set(next);
  });

  return (
    <motion.div
      className={`overflow-hidden whitespace-nowrap py-4 border-y border-boinng-black/10 cursor-pointer select-none relative ${dark ? 'bg-boinng-black' : 'bg-boinng-yellow'} ${isPaused ? 'opacity-80' : ''}`}
      onClick={() => setIsPaused(!isPaused)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      aria-hidden="true"
      title={isPaused ? 'Click to resume' : 'Click to pause'}
    >
      <motion.div className="flex items-center" style={{ x: baseX }}>
        {/* ✅ First copy — measured via ref */}
        <div ref={singleRef} className="flex items-center">
          {items.map((t, i) => (
            <span
              key={i}
              className={`font-display text-sm md:text-base font-bold tracking-[0.15em] uppercase px-8 flex items-center whitespace-nowrap ${dark ? 'text-[#FFFEFA]' : 'text-boinng-black'} ${isHovered ? 'opacity-70' : 'opacity-100'} transition-all duration-300`}
            >
              {t}
              <span className="ml-16 inline-block font-normal opacity-30">{sep}</span>
            </span>
          ))}
        </div>

        {/* ✅ Second copy — identical clone */}
        <div className="flex items-center">
          {items.map((t, i) => (
            <span
              key={i}
              className={`font-display text-sm md:text-base font-bold tracking-[0.15em] uppercase px-8 flex items-center whitespace-nowrap ${dark ? 'text-[#FFFEFA]' : 'text-boinng-black'} ${isHovered ? 'opacity-70' : 'opacity-100'} transition-all duration-300`}
            >
              {t}
              <span className="ml-16 inline-block font-normal opacity-30">{sep}</span>
            </span>
          ))}
        </div>
      </motion.div>

      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute inset-0 flex items-center justify-center text-sm font-bold tracking-widest uppercase ${dark ? 'text-[#FFFEFA]' : 'text-boinng-black'}`}
          style={{ pointerEvents: 'none' }}
        >
          PAUSED
        </motion.div>
      )}
    </motion.div>
  );
}