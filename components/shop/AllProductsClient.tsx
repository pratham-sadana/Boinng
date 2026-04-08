'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useRef, useEffect } from 'react';
import { formatMoney } from '@/lib/utils';
import { transformProduct } from '@/lib/shopify/api';
import { useCart } from '@/lib/cart/context';
import { ShoppingBag, Check, Filter, ArrowUpDown, RotateCcw, Search } from 'lucide-react';

import type { Product } from '@/lib/shopify/types';

const BADGE_BG: Record<string, string> = {
  'NEW':  'bg-boinng-blue text-[#FFFEFA]',
  'HOT':  'bg-boinng-yellow text-boinng-black',
  'SALE': 'bg-red-500 text-white',
};

interface AllProductsClientProps {
  products: Product[];
}

export function AllProductsClient({ products }: AllProductsClientProps) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('featured');
  const [availability, setAvailability] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!controlRef.current) return;
      if (!controlRef.current.contains(event.target as Node)) {
        setShowFilters(false);
        setShowSort(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const productMeta = useMemo(() => {
    return products.map((product, idx) => {
      const transformed = transformProduct(product);
      const price = Number.parseFloat(transformed.price || '0');
      return {
        product,
        transformed,
        price: Number.isFinite(price) ? price : 0,
        index: idx,
      };
    });
  }, [products]);

  const availableTags = useMemo(() => {
    const counts = new Map<string, number>();
    productMeta.forEach(({ transformed }) => {
      transformed.tags.forEach((tag) => {
        const normalized = tag.trim().toLowerCase();
        if (!normalized) return;
        counts.set(normalized, (counts.get(normalized) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [productMeta]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const parsedMaxPrice = Number.parseFloat(maxPrice);

    const filtered = productMeta.filter(({ product, transformed, price }) => {
      if (normalizedQuery && !transformed.title.toLowerCase().includes(normalizedQuery)) {
        return false;
      }

      if (availability === 'in-stock' && !product.availableForSale) {
        return false;
      }

      if (availability === 'out-of-stock' && product.availableForSale) {
        return false;
      }

      if (selectedTags.length > 0) {
        const tags = transformed.tags.map((tag) => tag.toLowerCase());
        const hasAnySelectedTag = selectedTags.some((tag) => tags.includes(tag));
        if (!hasAnySelectedTag) {
          return false;
        }
      }

      if (Number.isFinite(parsedMaxPrice) && parsedMaxPrice > 0 && price > parsedMaxPrice) {
        return false;
      }

      return true;
    });

    const sorted = [...filtered];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      sorted.sort((a, b) => a.transformed.title.localeCompare(b.transformed.title));
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) => b.transformed.title.localeCompare(a.transformed.title));
    }

    return sorted;
  }, [availability, maxPrice, productMeta, query, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setQuery('');
    setSortBy('featured');
    setAvailability('all');
    setSelectedTags([]);
    setMaxPrice('');
  };

  const sortLabels: Record<typeof sortBy, string> = {
    featured: 'Featured',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A to Z',
    'name-desc': 'Name: Z to A',
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-24 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <p className="text-2xl text-black/60">No products found.</p>
      </div>
    );
  }

  return (
    <section className="py-2 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-black/50 pt-2">
          Showing {filteredProducts.length} of {products.length}
        </p>

        <div ref={controlRef} className="relative ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowSort((prev) => !prev);
              setShowFilters(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest text-black/75 hover:border-boinng-blue hover:text-boinng-blue transition-colors"
            aria-label="Open sort options"
          >
            <ArrowUpDown size={14} />
            <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowFilters((prev) => !prev);
              setShowSort(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest text-black/75 hover:border-boinng-blue hover:text-boinng-blue transition-colors"
            aria-label="Open filters"
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {(query || availability !== 'all' || selectedTags.length > 0 || maxPrice) && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-full border border-black/15 bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest text-black/65 hover:border-red-400 hover:text-red-500 transition-colors"
              aria-label="Reset filters"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {showSort && (
            <div className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-black/10 bg-white p-2 shadow-xl shadow-black/10">
              {(
                [
                  ['featured', 'Featured'],
                  ['price-asc', 'Price: Low to High'],
                  ['price-desc', 'Price: High to Low'],
                  ['name-asc', 'Name: A to Z'],
                  ['name-desc', 'Name: Z to A'],
                ] as Array<[typeof sortBy, string]>
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setSortBy(value);
                    setShowSort(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
                    sortBy === value ? 'bg-boinng-blue text-white' : 'text-black/70 hover:bg-black/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {showFilters && (
            <div className="absolute right-0 top-12 z-30 w-[min(92vw,360px)] rounded-2xl border border-black/10 bg-white p-4 shadow-xl shadow-black/10">
              <div className="space-y-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products"
                    className="w-full rounded-xl border border-black/15 pl-9 pr-3 py-2.5 text-sm font-medium focus:outline-none focus:border-boinng-blue"
                  />
                </div>

                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as 'all' | 'in-stock' | 'out-of-stock')}
                  className="w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:border-boinng-blue"
                >
                  <option value="all">Availability: All</option>
                  <option value="in-stock">In stock</option>
                  <option value="out-of-stock">Out of stock</option>
                </select>

                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max price (INR)"
                  className="w-full rounded-xl border border-black/15 px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-boinng-blue"
                />

                {availableTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                    {availableTags.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                            active
                              ? 'bg-boinng-blue text-white border-boinng-blue'
                              : 'bg-transparent text-black/70 border-black/20 hover:border-boinng-blue hover:text-boinng-blue'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
      >
        {filteredProducts.map(({ product }, index) => (
          <ProductCard key={product.handle} product={product} index={index} />
        ))}
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-black/55 text-lg font-semibold">No products match these filters.</p>
        </div>
      )}
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const transformed = transformProduct(product);
  const displayPrice = formatMoney(transformed.price);
  const comparePrice = transformed.comparePrice && parseFloat(transformed.comparePrice) > 0
    ? formatMoney(transformed.comparePrice) : null;

  const [isAdding,          setIsAdding]          = useState(false);
  const [addedSuccess,      setAddedSuccess]      = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages,      setLoadedImages]      = useState<Record<number, boolean>>({});

  const allImages = transformed.images?.length > 0
    ? transformed.images
    : (transformed.image ? [transformed.image] : []);

  let badge = '';
  if (product.tags?.includes('new'))       badge = 'NEW';
  else if (product.tags?.includes('hot'))  badge = 'HOT';
  else if (product.tags?.includes('sale')) badge = 'SALE';

  const discountPct = comparePrice
    ? Math.round(((parseFloat(transformed.comparePrice!) - parseFloat(transformed.price)) / parseFloat(transformed.comparePrice!)) * 100)
    : null;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    await addItem({
      id: transformed.variants[0]?.id || '',
      quantity: 1,
      title: transformed.title,
      price: parseFloat(transformed.price),
      image: transformed.image?.url || '/logos/blue-text.png',
    });
    setIsAdding(false);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-black/[0.07] h-full transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/10 cursor-pointer"
        onMouseEnter={() => allImages.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-black/[0.03]">
          <Link href={`/products/${product.handle}`} className="absolute inset-0 z-10" aria-label={transformed.title} />

          {allImages[currentImageIndex]?.url && !loadedImages[currentImageIndex] && (
            <div className="absolute inset-0 z-[5] animate-pulse bg-gradient-to-br from-black/[0.06] via-black/[0.03] to-black/[0.06]" />
          )}

          {allImages[0]?.url ? (
            <>
              <Image
                src={allImages[0].url}
                alt={allImages[0].alt || product.title}
                fill
                priority={index < 3}
                className="object-cover group-hover:scale-[1.05]"
                onLoad={() => setLoadedImages((prev) => ({ ...prev, 0: true }))}
                style={{ opacity: currentImageIndex === 0 ? 1 : 0, transition: 'opacity 0.5s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                sizes="220px"
              />
              {allImages[1]?.url && (
                <Image
                  src={allImages[1].url}
                  alt={allImages[1].alt || product.title}
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-[1.05]"
                  onLoad={() => setLoadedImages((prev) => ({ ...prev, 1: true }))}
                  style={{ opacity: currentImageIndex === 1 ? 1 : 0, transition: 'opacity 0.5s ease, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
                  sizes="220px"
                />
              )}
            </>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-display text-lg uppercase tracking-widest text-black/20 p-4 text-center leading-tight">
              {product.title}
            </span>
          )}

          {/* Badge */}
          {(badge || discountPct) && (
            <span className={`absolute top-2 left-2 text-[8px] font-black tracking-[0.15em] uppercase px-2 py-0.5 rounded-full z-20 ${badge ? BADGE_BG[badge] : 'bg-red-500 text-white'}`}>
              {badge || `-${discountPct}%`}
            </span>
          )}

          {/* Quick Add — slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] p-2">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-[10px] tracking-[0.15em] uppercase transition-all duration-200 shadow-lg ${
                addedSuccess ? 'bg-emerald-500 text-white' : 'bg-boinng-blue text-white hover:bg-boinng-blue/90'
              } disabled:opacity-70`}
            >
              {addedSuccess ? (
                <><Check size={11} strokeWidth={3} /> Added!</>
              ) : isAdding ? (
                <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Adding...</>
              ) : (
                <><ShoppingBag size={11} strokeWidth={2} /> Quick Add</>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[11px] font-bold uppercase tracking-widest text-boinng-black leading-snug line-clamp-2 group-hover:text-boinng-blue transition-colors duration-300">
              {transformed.title}
            </h3>
            {transformed.tags.length > 0 && (
              <p className="text-[9px] font-semibold uppercase tracking-widest text-black/30 mt-0.5 truncate">
                {transformed.tags[0]}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] font-bold text-boinng-blue tabular-nums">{displayPrice}</p>
            {comparePrice && (
              <p className="text-[9px] font-semibold text-black/30 line-through tabular-nums">{comparePrice}</p>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-boinng-blue group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </div>
    </motion.div>
  );
}
