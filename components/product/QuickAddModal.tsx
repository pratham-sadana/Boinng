'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart/context';
import { TransformedProduct } from '@/lib/shopify/types';

interface QuickAddModalProps {
  product: TransformedProduct;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddModal({ product, isOpen, onClose }: QuickAddModalProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      id: selectedVariant.id,
      title: product.title,
      quantity: 1,
      price: parseFloat(selectedVariant.price.amount),
      image: selectedVariant.image?.url || product.image?.url || '/logos/cropped.png',
    });
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-boinng-bg rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-black/10">
                <h2 className="font-display text-2xl uppercase tracking-widest">Quick Add</h2>
                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Product Image */}
                {selectedVariant && (
                  <motion.img
                    key={selectedVariant.image?.url || product.image?.url}
                    src={selectedVariant.image?.url || product.image?.url || '/logos/cropped.png'}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {!selectedVariant && (
                  <img
                    src={product.image?.url || '/logos/cropped.png'}
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                {/* Product Info */}
                <div>
                  <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                  <p className="text-2xl font-bold">
                    {selectedVariant ? (
                      <>
                        ₹{selectedVariant.price.amount}
                        {selectedVariant.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > 0 && (
                          <span className="line-through text-black/50 ml-2 text-lg">
                            ₹{selectedVariant.compareAtPrice.amount}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-black/40">Price unavailable</span>
                    )}
                  </p>
                </div>

                {/* Variant Selection */}
                {product.variants.length > 1 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Size</h4>
                    <div className="flex gap-2 flex-wrap">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-3 py-2 rounded-full border-2 text-sm transition-all ${
                            selectedVariant?.id === variant.id
                              ? 'border-boinng-blue bg-boinng-blue text-white'
                              : 'border-black/20 hover:border-boinng-blue'
                          }`}
                        >
                          {variant.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!selectedVariant || !product.availableForSale}
                  className="w-full bg-boinng-blue text-white py-3 rounded-full font-bold uppercase tracking-widest mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!product.availableForSale ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
