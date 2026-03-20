'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart/context';
import { TransformedProduct } from '@/lib/shopify/types';
import { ChevronDown, ShoppingBag, Check } from 'lucide-react';

export function ProductDetails({ product }: { product: TransformedProduct }) {
  const { addItem, isLoading } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [cursorSide, setCursorSide] = useState<'left' | 'right' | null>(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const displayImages = selectedVariant?.image
    ? [
        {
          url: selectedVariant.image.url,
          alt: selectedVariant.image.altText || product.title,
          width: selectedVariant.image.width,
          height: selectedVariant.image.height,
        },
        ...product.images.filter((img) => img.url !== selectedVariant.image?.url),
      ]
    : product.images;

  const currentImage = displayImages[selectedImageIndex];

  useEffect(() => { setIsClient(true); }, []);

  const handleVariantChange = (variant: typeof product.variants[0]) => {
    setSelectedVariant(variant);
    setSelectedImageIndex(0);
  };

  const handlePrevImage = () =>
    setSelectedImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));

  const handleNextImage = () =>
    setSelectedImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
  const safeDescription = stripHtml(product.description || '');
  const wordLimit = 30;
  const shouldTruncate = safeDescription.split(' ').length > wordLimit;
  const displayDescription = expandedDescription
    ? safeDescription
    : safeDescription.split(' ').slice(0, wordLimit).join(' ') + (shouldTruncate ? '...' : '');

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      await addItem({
        id: selectedVariant.id,
        title: product.title,
        quantity: 1,
        price: parseFloat(selectedVariant.price.amount),
        image: selectedVariant.image?.url || product.image?.url || '/logos/cropped.png',
      });
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const discountPercent =
    selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > 0
      ? Math.round(
          ((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) /
            parseFloat(selectedVariant.compareAtPrice.amount)) * 100
        )
      : null;

  if (!isClient) {
    return (
      <div className="grid md:grid-cols-2 gap-8 lg:gap-20 items-start animate-pulse">
        <div className="space-y-3">
          <div className="rounded-3xl bg-black/5 aspect-square w-full" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl bg-black/5 aspect-square" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 pt-2">
          <div className="h-12 bg-black/5 rounded-xl w-3/4" />
          <div className="h-10 bg-black/5 rounded-xl w-1/3" />
          <div className="h-24 bg-black/5 rounded-xl w-full" />
          <div className="h-14 bg-boinng-blue/20 rounded-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-20 items-start pb-24 md:pb-0 overflow-visible">

      {/* ── LEFT COLUMN: Image Gallery ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="md:sticky md:top-6 relative"
      >
        <div className="flex gap-3">

          {/* Thumbnail strip — vertical on desktop, hidden on mobile */}
          {displayImages.length > 1 && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="hidden md:flex flex-col gap-2 w-16 shrink-0"
            >
              {displayImages.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? 'border-boinng-blue shadow-md ring-2 ring-boinng-blue/20'
                      : 'border-black/10 hover:border-black/25 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Main Image — cursor nav + live zoom */}
          <div
            ref={imageRef}
            className="relative rounded-3xl overflow-hidden bg-black/[0.03] border border-black/[0.06] aspect-square flex-1 select-none"
            style={{
              cursor: cursorSide === 'left'
                ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Ccircle cx='22' cy='22' r='20' fill='rgba(0,0,0,0.65)'/%3E%3Ctext x='22' y='29' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3E%E2%86%90%3C/text%3E%3C/svg%3E") 22 22, w-resize`
                : cursorSide === 'right'
                ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Ccircle cx='22' cy='22' r='20' fill='rgba(0,0,0,0.65)'/%3E%3Ctext x='22' y='29' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3E%E2%86%92%3C/text%3E%3C/svg%3E") 22 22, e-resize`
                : 'zoom-in',
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setZoomPos({ x, y });
              setCursorSide(displayImages.length > 1 ? (x < 50 ? 'left' : 'right') : null);
              setIsZooming(true);
            }}
            onMouseLeave={() => { setIsZooming(false); setCursorSide(null); }}
            onClick={(e) => {
              if (displayImages.length <= 1) return;
              const rect = e.currentTarget.getBoundingClientRect();
              e.clientX - rect.left < rect.width / 2 ? handlePrevImage() : handleNextImage();
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage?.url || 'fallback'}
                src={currentImage?.url || product.image?.url || '/logos/cropped.png'}
                alt={currentImage?.alt || product.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>

            {/* Discount badge */}
            {discountPercent && (
              <div className="absolute top-4 left-4 bg-boinng-blue text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide shadow-md z-10">
                -{discountPercent}%
              </div>
            )}

            {/* Image counter */}
            {displayImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold tabular-nums z-10">
                {selectedImageIndex + 1} / {displayImages.length}
              </div>
            )}

            {/* Swipe dots — mobile only */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden z-10">
                {displayImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === selectedImageIndex ? 'w-5 bg-boinng-blue' : 'w-1.5 bg-black/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Live zoom magnifier — desktop only, tracks cursor */}
          <AnimatePresence>
            {isZooming && currentImage?.url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:block absolute top-0 left-[calc(100%+1.25rem)] w-[340px] aspect-square rounded-2xl overflow-hidden border border-black/10 shadow-2xl shadow-black/15 z-[60] pointer-events-none"
                style={{
                  backgroundImage: `url(${currentImage.url})`,
                  backgroundSize: '250%',
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
          </AnimatePresence>

        </div>
      </motion.div>

      {/* ── RIGHT COLUMN: Product Info ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col"
      >
        {/* Tags above title */}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-boinng-blue/8 text-boinng-blue rounded-full text-xs font-semibold tracking-wide uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-widest mb-5 leading-tight">
          {product.title}
        </h1>

        {/* Price */}
        <div className="mb-6 pb-6 border-b border-black/10">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-bold text-boinng-black">
              {selectedVariant
                ? `₹${parseFloat(selectedVariant.price.amount).toLocaleString('en-IN')}`
                : <span className="text-black/40">Price unavailable</span>}
            </span>
            {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > 0 && (
              <span className="line-through text-black/35 text-xl">
                ₹{parseFloat(selectedVariant.compareAtPrice.amount).toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > 0 && (
            <p className="text-emerald-600 font-semibold mt-1.5 text-sm">
              You save ₹{(parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)).toLocaleString('en-IN')}
            </p>
          )}
        </div>

        {/* Description */}
        {safeDescription && (
          <div className="mb-7">
            <p className="text-black/65 leading-relaxed text-base">{displayDescription}</p>
            {shouldTruncate && (
              <button
                onClick={() => setExpandedDescription(!expandedDescription)}
                className="mt-2 font-semibold text-sm text-boinng-blue hover:text-boinng-blue/75 transition-colors flex items-center gap-1.5"
              >
                {expandedDescription ? 'Show less' : 'Read more'}
                <ChevronDown size={15} className={`transition-transform duration-200 ${expandedDescription ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        )}

        {/* Product specs */}
        {(product.fabric || product.activity || product.accessorySize || product.clothingFeatures || product.targetGender) && (
          <div className="mb-8 space-y-3 pb-7 border-b border-black/10">
            {product.fabric && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-black/50">Fabric</span>
                <span className="text-sm text-black/75">{product.fabric}</span>
              </div>
            )}
            {product.activity && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-black/50">Activity</span>
                <span className="text-sm text-black/75">{product.activity}</span>
              </div>
            )}
            {product.accessorySize && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-black/50">Size</span>
                <span className="text-sm text-black/75">{product.accessorySize}</span>
              </div>
            )}
            {product.clothingFeatures && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-black/50">Features</span>
                <span className="text-sm text-black/75">{product.clothingFeatures}</span>
              </div>
            )}
            {product.targetGender && (
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-black/50">For</span>
                <span className="text-sm text-black/75">{product.targetGender}</span>
              </div>
            )}
          </div>
        )}

        {/* Variant selector */}
        {product.variants.length > 1 && (
          <motion.div
            className="mb-8 p-5 bg-black/[0.025] rounded-2xl border border-black/[0.06]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/50">Size</h3>
              {selectedVariant && (
                <span className="text-xs font-semibold text-boinng-blue">{selectedVariant.title}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                const unavailable = !variant.availableForSale;
                return (
                  <motion.button
                    key={variant.id}
                    onClick={() => !unavailable && handleVariantChange(variant)}
                    whileHover={!unavailable ? { scale: 1.05 } : {}}
                    whileTap={!unavailable ? { scale: 0.95 } : {}}
                    className={`relative px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-boinng-blue bg-boinng-blue text-white shadow-md'
                        : unavailable
                        ? 'border-black/10 bg-black/5 text-black/25 cursor-not-allowed'
                        : 'border-black/15 bg-white hover:border-boinng-blue/60 hover:bg-boinng-blue/5'
                    }`}
                    disabled={unavailable}
                  >
                    {variant.title}
                    {unavailable && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-px bg-black/20 rotate-45 absolute" />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Add to Cart — sticky on mobile, static on desktop */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-black/10 z-20 md:static md:p-0 md:bg-transparent md:border-none md:backdrop-blur-none md:z-10">
          <motion.button
            onClick={handleAddToCart}
            whileHover={!isAdding && product.availableForSale ? { scale: 1.015 } : {}}
            whileTap={!isAdding && product.availableForSale ? { scale: 0.985 } : {}}
            disabled={!selectedVariant || !product.availableForSale || isAdding || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-boinng-blue text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg hover:shadow-xl hover:bg-boinng-blue/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AnimatePresence mode="wait">
              {addedSuccess ? (
                <motion.span key="success" className="flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <Check size={18} strokeWidth={2.5} /> Added to Cart
                </motion.span>
              ) : isAdding || isLoading ? (
                <motion.span key="loading" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Adding...
                </motion.span>
              ) : !product.availableForSale ? (
                <motion.span key="oos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Out of Stock</motion.span>
              ) : (
                <motion.span key="add" className="flex items-center gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <ShoppingBag size={18} strokeWidth={2} /> Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}