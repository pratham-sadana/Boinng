'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: 'Collections', href: '/collections/all' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Sale', href: '/collections/sale' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-full max-w-xs bg-boinng-bg z-40 md:hidden flex flex-col p-6 pt-32"
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="text-2xl font-bold uppercase tracking-widest hover:text-boinng-blue transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-black/10">
              <Link
                href="/collections/all"
                onClick={onClose}
                className="block w-full bg-boinng-blue text-white text-center py-3 rounded-full font-bold uppercase tracking-widest"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
