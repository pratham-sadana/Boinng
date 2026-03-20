'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { CartPanel } from '@/components/cart/CartPanel';
import { SearchModal } from '@/components/layout/SearchModal';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useCart } from '@/lib/cart/context';

interface NavLink {
  label: string;
  href: string;
  submenu?: NavLink[];
}

const FALLBACK_NAV_LINKS: NavLink[] = [
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Sale',         href: '/collections/sale' },
  { label: 'Valentines',   href: '/collections/valentines' },
];

const FALLBACK_ANNOUNCEMENTS = [
  '🎉 Free shipping over ₹799',
  '✨ New drops every Friday',
  '🇮🇳 Proudly made in India',
  '🛍️ Easy returns within 7 days',
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>(FALLBACK_NAV_LINKS);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [announcements, setAnnouncements] = useState<string[]>(FALLBACK_ANNOUNCEMENTS);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const { openCart, items } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavigation = () => {
    window.scrollTo(0, 0);
  };

  // Fetch dynamic announcements from Shopify
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements');
        const data = await response.json();
        if (data.announcements && data.announcements.length > 0) {
          setAnnouncements(data.announcements);
        }
      } catch (error) {
        console.warn('Failed to fetch announcements, using fallback:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  // Rotate announcements every 5 seconds
  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  // Fetch dynamic menu from Shopify
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu', {
          next: { revalidate: 3600 },
        });
        const data = await response.json();
        if (data.menu?.items && data.menu.items.length > 0) {
          setNavLinks(data.menu.items);
        }
      } catch (error) {
        console.warn('Failed to fetch dynamic menu, using fallback:', error);
      } finally {
        setIsLoadingMenu(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-boinng-blue text-[#FFFEFA] overflow-hidden"
      >
        <div className="relative flex items-center justify-center py-2 px-4 h-7 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={announcementIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute text-[10px] font-bold tracking-[0.25em] uppercase text-center whitespace-nowrap"
            >
              {announcements[announcementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.15 }}
        className={`sticky top-0 z-40 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-boinng-bg/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]'
            : 'bg-boinng-bg border-b border-black/5'
        }`}
        role="navigation"
        aria-label="Main"
      >
        <div className="flex items-center justify-between h-16 md:h-18 px-6 md:px-10 max-w-[1400px] mx-auto">

          {/* Logo */}
          <Link href="/" onClick={handleNavigation} aria-label="BOINNG! Home" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.04, rotate: -1.5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <img
                src="/logos/blue-text.png"
                alt="BOINNG!"
                className="h-7 md:h-8 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">

            {/* Permanent links — always visible */}
            {[
              { label: 'All',       href: '/shop' },
              { label: 'Collections', href: '/collections' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={handleNavigation}
                  onMouseEnter={() => setActiveLink(l.href)}
                  onMouseLeave={() => setActiveLink(null)}
                  className="relative px-4 py-2 text-xs font-bold tracking-[0.18em] text-boinng-blue uppercase hover:text-boinng-blue/70 transition-colors duration-200 flex items-center gap-1.5"
                >
                  {l.label}
                  <motion.span
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-boinng-blue rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeLink === l.href ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                </Link>
              </li>
            ))}

            {/* Divider */}
            {navLinks.length > 0 && (
              <li aria-hidden="true" className="w-px h-4 bg-black/10 mx-1" />
            )}

            {/* Dynamic Shopify menu links */}
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={handleNavigation}
                  onMouseEnter={() => setActiveLink(l.href)}
                  onMouseLeave={() => setActiveLink(null)}
                  className="relative px-4 py-2 text-xs font-bold tracking-[0.18em] text-boinng-black uppercase hover:text-boinng-blue transition-colors duration-200 flex items-center gap-1.5"
                >
                  {l.label}
                  <motion.span
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-boinng-blue rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeLink === l.href ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Search — desktop only */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex p-2 text-boinng-black/50 hover:text-boinng-blue transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-boinng-black hover:text-boinng-blue transition-colors"
              aria-label={`Open cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
              onClick={openCart}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>

              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="absolute -top-1 -right-1.5 flex items-center justify-center w-4 h-4 text-[9px] font-black rounded-full bg-boinng-blue text-[#FFFEFA] leading-none"
                    aria-hidden="true"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Burger — mobile */}
            <button
              className="flex flex-col gap-[5px] p-1.5 md:hidden z-50 relative w-9 h-9 justify-center items-center ml-1"
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              <motion.span
                className="block w-5 h-0.5 bg-boinng-black rounded-full"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 5.5 : 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="block w-5 h-0.5 bg-boinng-black rounded-full"
                animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block w-5 h-0.5 bg-boinng-black rounded-full"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -5.5 : 0 }}
                transition={{ duration: 0.25 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} navLinks={navLinks} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartPanel />
    </>
  );
}