'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, Loader } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/shopify/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const handleNavigation = () => {
    window.scrollTo(0, 0);
    onClose();
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search products
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!query || query.length < 2) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    setIsLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.products || []);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      const selectedProduct = results[selectedIndex];
      if (selectedProduct?.handle) {
        window.scrollTo(0, 0);
        window.location.href = `/products/${selectedProduct.handle}`;
      }
    }
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="max-w-2xl mx-auto bg-boinng-bg rounded-2xl shadow-xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-4 p-6 border-b border-black/10">
                <SearchIcon size={24} className="text-black/40" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-lg font-semibold placeholder:text-black/40 focus:outline-none"
                />
                {isLoading && <Loader size={24} className="animate-spin text-boinng-blue" />}
                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query && results.length === 0 && !isLoading && (
                  <div className="p-8 text-center text-black/50">
                    <p>No products found for "{query}"</p>
                  </div>
                )}

                {query && results.length > 0 && (
                  <div className="divide-y divide-black/5">
                    {results.map((product, index) => (
                      <Link key={product.id} href={`/products/${product.handle}`} onClick={handleNavigation}>
                        <motion.div
                          onHoverStart={() => setSelectedIndex(index)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex gap-4 p-4 cursor-pointer transition-colors ${
                            selectedIndex === index ? 'bg-black/5' : 'hover:bg-black/2'
                          }`}
                        >
                          {/* Product Image */}
                          {product.featuredImage && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-black/5">
                              <Image
                                src={product.featuredImage.url}
                                alt={product.title}
                                width={64}
                                height={64}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm truncate">{product.title}</h3>
                            <p className="text-xs text-black/50 truncate">
                              {product.availableForSale ? 'In Stock' : 'Out of Stock'}
                            </p>
                            {product.priceRange && (
                              <p className="text-sm font-semibold text-boinng-blue mt-1">
                                ₹{product.priceRange.minVariantPrice?.amount || 'TBA'}
                              </p>
                            )}
                          </div>

                          {/* Selection Indicator */}
                          {selectedIndex === index && (
                            <motion.div
                              layoutId="searchSelection"
                              className="w-1 bg-boinng-blue rounded-full"
                              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                            />
                          )}
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}

                {!query && (
                  <div className="p-8 text-center">
                    <p className="text-black/40 text-sm">
                      Type at least 2 characters to search
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {query && results.length > 0 && (
                <div className="p-4 text-center border-t border-black/10 text-xs text-black/50">
                  Found {results.length} product{results.length !== 1 ? 's' : ''} • Use ↑↓ to navigate, Enter to select
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
