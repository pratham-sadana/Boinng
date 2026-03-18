'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  'FREE SHIPPING ON ORDERS OVER ₹799',
  'NEW DROPS EVERY FRIDAY — DON\'T SLEEP',
  'LIMITED STOCK — GRAB IT BEFORE IT\'S GONE',
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prevIdx) => (prevIdx + 1) % MESSAGES.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, []);
  
  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div 
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
          className="bg-boinng-black text-boinng-bg px-4 py-2 flex justify-center items-center relative z-[60]"
        >
          <div className="text-[10px] font-medium tracking-[0.2em] uppercase text-center w-full px-8">
            {MESSAGES[idx]}
          </div>
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm opacity-60 hover:opacity-100 transition-opacity p-1" 
              onClick={() => setDismissed(true)} 
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
