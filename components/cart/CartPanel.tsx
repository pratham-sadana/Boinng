'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart/context';

export function CartPanel() {
  const { isOpen, closeCart, items, removeItem, updateItemQuantity, checkoutUrl, isLoading } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleRemove = async (itemId: string) => {
    await removeItem(itemId);
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
    } else {
      await updateItemQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return;
    
    setIsCheckingOut(true);
    try {
      // If we have a checkoutUrl from Shopify cart sync, use it directly
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      // Fallback to server-side API for legacy carts
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: items.map(item => ({
            merchandiseId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout');
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error('❌ No checkout URL in response:', data);
        alert('Error creating checkout. Please try again.');
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Error creating checkout. Please try again.');
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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-boinng-bg z-50 sm:z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <h2 className="font-display text-2xl uppercase tracking-widest">Your Cart ({items.length})</h2>
              <button onClick={closeCart} className="p-2" aria-label="Close cart">
                <X size={24} />
              </button>
            </div>

            {items.length > 0 ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-black/2 rounded-lg">
                    <img src={item.image} alt={item.title} width={80} height={80} loading="lazy" className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm">{item.title}</h3>
                        <p className="font-semibold text-sm text-boinng-blue">₹{item.price.toFixed(2)}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={isLoading}
                          aria-label={item.quantity === 1 ? 'Remove item from cart' : 'Decrease quantity'}
                          className="w-8 h-8 flex items-center justify-center rounded border border-black/20 hover:border-boinng-blue hover:bg-boinng-blue/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title={item.quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center rounded border border-black/20 hover:border-boinng-blue hover:bg-boinng-blue/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.id)} 
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={isLoading}
                      aria-label="Remove item"
                      title="Remove from cart"
                    >
                      <X size={18} />
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
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
