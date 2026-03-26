'use client';
import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useAnimationFrame,
} from 'framer-motion';

const DEFAULT = [''];

export function Marquee({ items = DEFAULT, sep = '✦', white = false, speed = 80 }: {
  items?: string[]; sep?: string; white?: boolean; speed?: number;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [singleWidth, setSingleWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const singleRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);

  // Removed scroll listeners for performance (TBT reduction)
  // const velocityFactor = useSpring(0, { damping: 50, stiffness: 400 });

  // ✅ Measure the exact pixel width of ONE copy
  useEffect(() => {
    const measure = () => {
      if (singleRef.current) {
        setSingleWidth(singleRef.current.scrollWidth);
      }
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    measure();
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
    };
  }, [items]);

  const repeatCount = singleWidth > 0
    ? Math.max(3, Math.ceil(containerWidth / singleWidth) + 2)
    : 3;

  useAnimationFrame((t, delta) => {
    if (isPaused || singleWidth === 0) return;

    const hoverSpeedFactor = isHovered ? 0.3 : 1;
    let moveBy = -speed * (delta / 1000) * hoverSpeedFactor;

    let next = baseX.get() + moveBy;

    // ✅ Reset by exactly one copy's pixel width — zero visible jump
    if (next <= -singleWidth) {
      next += singleWidth;
    }

    baseX.set(next);
  });

  return (
    <motion.div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap py-4 border-y border-boinng-black/10 cursor-pointer select-none relative ${white ? 'bg-white' : 'bg-boinng-yellow'} ${isPaused ? 'opacity-80' : ''}`}
      onClick={() => setIsPaused(!isPaused)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      aria-hidden="true"
      title={isPaused ? 'Click to resume' : 'Click to pause'}
    >
      <motion.div className="flex items-center" style={{ x: baseX }}>
        {Array.from({ length: repeatCount }).map((_, copyIndex) => (
          <div
            key={copyIndex}
            ref={copyIndex === 0 ? singleRef : undefined}
            className="flex items-center"
          >
            {items.map((t, i) => (
              <span
                key={`${copyIndex}-${i}-${t}`}
                className={`font-display text-sm md:text-base font-bold tracking-[0.15em] uppercase px-8 flex items-center whitespace-nowrap ${white ? 'text-boinng-blue' : 'text-boinng-black'} ${isHovered ? 'opacity-70' : 'opacity-100'} transition-all duration-300`}
              >
                {t}
                <span className="ml-16 inline-block font-normal opacity-30">{sep}</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>

      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute inset-0 flex items-center justify-center text-sm font-bold tracking-widest uppercase ${white ? 'text-boinng-black' : 'text-boinng-yellow'}`}
          style={{ pointerEvents: 'none' }}
        >
        </motion.div>
      )}
    </motion.div>
  );
}