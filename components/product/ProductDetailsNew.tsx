'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart/context';
import { TransformedProduct } from '@/lib/shopify/types';
import { ChevronDown } from 'lucide-react';

export function ProductDetails({ product }: { product: TransformedProduct }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Log Shopify API fields being sent
    console.log('🛍️ Shopify Product Fields:', {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description?.substring(0, 100) + '...',
      availableForSale: product.availableForSale,
      price: product.price,
      comparePrice: product.comparePrice,
      currency: product.currency,
      image: product.image,
      variantCount: product.variants.length,
      variants: product.variants.map(v => ({
        id: v.id,
        title: v.title,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
        availableForSale: v.availableForSale,
        image: v.image?.url?.substring(0, 50) + '...',
      })),
      tags: product.tags,
    });
  }, [product]);

  // Count words for truncation
  const descriptionWords = product.description?.split(' ').length || 0;
  const wordLimit = 60;
  const shouldTruncate = descriptionWords > wordLimit;
  const truncatedDescription = product.description
    ?.split(' ')
    .slice(0, wordLimit)
    .join(' ') + '...';

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addItem({
      id: selectedVariant.id,
      title: product.title,
      quantity: 1,
      price: parseFloat(selectedVariant.price.amount),
      image: selectedVariant.image?.url || product.image?.url || '/logos/cropped.png',
    });
  };

  if (!isClient) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
      {/* Left: Product Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-4"
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-black/5">
          {selectedVariant && (
            <motion.img
              key={selectedVariant.image?.url || product.image?.url}
              src={selectedVariant.image?.url || product.image?.url || '/logos/cropped.png'}
              alt={product.title}
              className="w-full aspect-square object-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          {!selectedVariant && (
            <img
              src={product.image?.url || '/logos/cropped.png'}
              alt={product.title}
              className="w-full aspect-square object-cover"
            />
          )}
        </div>
      </motion.div>

      {/* Right: Product Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Status Badge */}
        {product.availableForSale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block mb-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full"
          >
            IN STOCK
          </motion.div>
        )}
        {!product.availableForSale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block mb-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full"
          >
            OUT OF STOCK
          </motion.div>
        )}

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-widest mb-6 leading-tight">
          {product.title}
        </h1>

        {/* Pricing */}
        <motion.div className="mb-8 pb-8 border-b border-black/10">
          <p className="text-4xl font-bold text-boinng-black">
            {selectedVariant ? (
              <>
                ₹{parseFloat(selectedVariant.price.amount).toLocaleString('en-IN')}
                {selectedVariant.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > 0 && (
                  <span className="line-through text-black/40 ml-4 text-2xl">
                    ₹{parseFloat(selectedVariant.compareAtPrice.amount).toLocaleString('en-IN')}
                  </span>
                )}
              </>
            ) : (
              <span className="text-black/40">Price unavailable</span>
            )}
          </p>
          {selectedVariant?.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > 0 && (
            <p className="text-green-600 font-bold mt-2 text-sm">
              Save ₹{(
                parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)
              ).toLocaleString('en-IN')}
            </p>
          )}
        </motion.div>

        {/* Description with Read More */}
        <motion.div className="mb-8">
          <div
            className="prose prose-lg max-w-none mb-4 text-black/70 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: expandedDescription ? product.description : truncatedDescription,
            }}
          />
          {shouldTruncate && (
            <button
              onClick={() => setExpandedDescription(!expandedDescription)}
              className="font-bold text-boinng-blue hover:text-boinng-blue/80 transition-colors flex items-center gap-2"
            >
              {expandedDescription ? 'Read Less' : 'Read More'}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  expandedDescription ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </motion.div>

        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <motion.div
            className="mb-8 p-6 bg-black/[0.02] rounded-xl border border-black/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Available Sizes</h3>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
              {product.variants.map(variant => (
                <motion.button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-3 rounded-lg font-bold uppercase text-xs tracking-widest transition-all border-2 ${
                    selectedVariant?.id === variant.id
                      ? 'border-boinng-blue bg-boinng-blue text-white shadow-lg'
                      : 'border-black/20 hover:border-boinng-blue bg-white'
                  } ${!variant.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!variant.availableForSale}
                >
                  {variant.title}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!selectedVariant || !product.availableForSale}
          className="w-full bg-boinng-blue text-white py-4 rounded-full font-bold uppercase tracking-widest text-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {!product.availableForSale ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-3 rounded-full border-2 border-black/20 font-bold uppercase tracking-widest text-sm hover:border-boinng-blue transition-colors"
          >
            💬 Ask
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-3 rounded-full border-2 border-black/20 font-bold uppercase tracking-widest text-sm hover:border-boinng-blue transition-colors"
          >
            ❤️ Save
          </motion.button>
        </div>

        {/* Info Section */}
        <motion.div
          className="mt-8 pt-8 border-t border-black/10 space-y-3 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="flex justify-between">
            <span className="text-black/60">Product Code:</span>
            <span className="font-bold">{product.handle}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-black/60">Availability:</span>
            <span className="font-bold text-green-600">{product.availableForSale ? 'In Stock' : 'Out of Stock'}</span>
          </p>
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-black/5 rounded-full text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
