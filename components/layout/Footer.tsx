'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

const LINKS = {
  COLLECTIONS: [
    { label: 'All Products', href: '/shop' },
    { label: 'All Collections', href: '/collections' },
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: 'Best Sellers', href: '/collections/best-sellers' },
    { label: 'Sale', href: '/collections/sale' },
  ],
  INFORMATION: [
    { label: 'About Us', href: '/pages/about' },
    {label: 'FAQs', href: '/pages/faqs' },
    { label: 'Contact Us', href: '/pages/contact' },
    { label: 'Returns & Refunds', href: '/pages/returns' },
    { label: 'Shipping Info', href: '/pages/shipping' },
    { label: 'Track Order', href: '/' },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Subscription failed');
      }

      setSubmitted(true);
      setEmail('');
      
      // Reset after 3 seconds so they can sign up again if they want
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Newsletter signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-blue-800 text-white overflow-hidden relative">
      {/* Main content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* Brand + Newsletter — 4 cols */}
          <div className="md:col-span-4 flex flex-col gap-10">

            {/* Logo */}
            <Link href="/" aria-label="BOINNG! Home">
              <motion.div
                whileHover={{ scale: 1.04, rotate: -1 }}
                whileTap={{ scale: 0.96 }}
                className="w-fit"
              >
                <Image
                  src="/logos/white-text.png"
                  alt="BOINNG!"
                  width={180}
                  height={60}
                  loading="lazy"
                  className="h-15 w-auto object-contain"
                />
              </motion.div>
            </Link>

            {/* Tagline */}
            <p className="text-sm leading-relaxed text-white/75 font-medium max-w-xs">
              Quirky socks for the beautiful feets. Limited drops, exclusive collabs, and a community
            </p>

            {/* Instagram */}
            <motion.a
              href="https://instagram.com/boinng_"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 w-fit group"
            >
              <div className="w-10 h-10 rounded-full border border-white/30 text-white/85 flex items-center justify-center group-hover:bg-boinng-yellow group-hover:border-black group-hover:text-boinng-black transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs uppercase tracking-widest text-white group-hover:text-boinng-yellow transition-colors">
                  @boinng_
                </span>
                <span className="text-[10px] text-white/65 uppercase tracking-widest">Follow us</span>
              </div>
            </motion.a>

            {/* Newsletter */}
            <div className="flex flex-col gap-4 pt-6 border-t border-white/20">
              <div>
                <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-boinng-yellow mb-1">
                  Join the Club
                </h3>
                <p className="text-xs text-white/70 uppercase tracking-widest">
                  Early access. Exclusive drops.
                </p>
              </div>

              {submitted ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold uppercase tracking-widest text-boinng-yellow"
                >
                  You're in. 🎉
                </motion.p>
              ) : error ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold uppercase tracking-widest text-red-200"
                >
                  {error}
                </motion.p>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-0 border-b border-white/30 focus-within:border-white transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="YOUR EMAIL"
                    className="flex-1 bg-transparent py-3 text-xs font-bold tracking-widest text-white placeholder:text-white/45 focus:outline-none"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="py-3 px-2 text-xs font-bold text-boinng-yellow hover:text-white transition-colors tracking-widest disabled:opacity-50"
                  >
                    {isLoading ? '⏳' : '→'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Links — 3 cols each */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className="pl-10 md:col-span-2 flex flex-col gap-6 relative">
              <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-boinng-yellow">
                {group}
              </h3>
              <ul className="flex flex-col gap-4">
                {items.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs font-medium tracking-widest uppercase text-white/75 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Payment / Trust badges col */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-boinng-yellow">
              We Accept
            </h3>
            <div className="flex flex-col gap-2">
              {['UPI', 'Cards'].map(method => (
                <span key={method} className="text-xs font-bold uppercase tracking-widest text-white/80 border border-white/30 px-3 py-1.5 w-fit">
                  {method}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-white/70">
            © {new Date().getFullYear()} BOINNG! All rights reserved.
          </p>

          <div className="flex gap-6 text-[10px] font-medium tracking-widest uppercase text-white/70">
            <Link href="/pages/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/pages/terms" className="hover:text-white transition-colors">Terms</Link>
            <a
              href="https://sixty9.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Built by Sixty9 Developers
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}