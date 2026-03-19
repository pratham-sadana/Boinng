'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
  submenu?: NavLink[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const handleNavigation = () => {
    window.scrollTo(0, 0);
    onClose();
  };

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
            className="fixed top-0 left-0 h-full w-full max-w-xs bg-boinng-bg z-40 md:hidden flex flex-col p-6 pt-24"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavigation}
                  className="text-2xl font-bold uppercase tracking-widest hover:text-boinng-blue transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-black/10">
              <Link
                href="/collections/all"
                onClick={handleNavigation}
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