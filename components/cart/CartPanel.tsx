'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart/context';
import { shopifyFetch } from '@/lib/shopify/client';
import { CREATE_CART } from '@/lib/shopify/queries';

export function CartPanel() {
  const { isOpen, closeCart, items, removeItem } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsCheckingOut(true);
    try {
      // Create cart with all items
      const response = await shopifyFetch<any>({
        query: CREATE_CART,
        variables: {
          input: {
            lines: items.map(item => ({
              merchandiseId: item.id,
              quantity: item.quantity,
            })),
          },
        },
      });

      if (response?.cartCreate?.cart?.checkoutUrl) {
        window.location.href = response.cartCreate.cart.checkoutUrl;
      } else {
        console.error('❌ No checkout URL in response:', response);
        alert('Error creating checkout. Please try again.');
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      alert('Error creating checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-boinng-bg z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <h2 className="font-display text-2xl uppercase tracking-widest">Your Cart ({items.length})</h2>
              <button onClick={closeCart} className="p-2">
                <X size={24} />
              </button>
            </div>

            {items.length > 0 ? (
              <div className="flex-1 overflow-y-auto p-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 mb-4">
                    <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-md" />
                    <div className="flex-1">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-black/60">Qty: {item.quantity}</p>
                      <p className="font-semibold">₹{item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-black/50">Your cart is empty.</p>
              </div>
            )}

            <div className="p-6 border-t border-black/10">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || isCheckingOut}
                className="block w-full bg-boinng-blue text-white text-center py-4 rounded-full font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isCheckingOut ? 'Processing...' : 'Checkout on Shopify'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
