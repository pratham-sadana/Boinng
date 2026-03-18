'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the types for your cart items and cart state
interface CartItem {
  id: string;
  quantity: number;
  // Add other product details you need
  title: string;
  price: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  checkoutUrl: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  setCheckoutUrl: (url: string) => void;
}

// Create the context with a default value
const CartContext = createContext<CartState | undefined>(undefined);

// Create the provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load cart from sessionStorage on mount (client-side only)
  useEffect(() => {
    setIsClient(true);
    try {
      const stored = sessionStorage.getItem('boinng_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
        console.log('🛒 Cart restored from sessionStorage:', parsed);
      }
    } catch (error) {
      console.error('Error loading cart from sessionStorage:', error);
    }
  }, []);

  // Save cart to sessionStorage whenever items change
  useEffect(() => {
    if (isClient) {
      try {
        sessionStorage.setItem('boinng_cart', JSON.stringify(items));
        console.log('✅ Cart saved to sessionStorage:', items);
      } catch (error) {
        console.error('Error saving cart to sessionStorage:', error);
      }
    }
  }, [items, isClient]);

  const addItem = (item: CartItem) => {
    // Logic to add item or update quantity if it already exists
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider value={{ items, isOpen, checkoutUrl, addItem, removeItem, openCart, closeCart, setCheckoutUrl }}>
      {children}
    </CartContext.Provider>
  );
}

// Create a custom hook for using the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
