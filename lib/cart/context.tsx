'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string; // merchandiseId
  lineId?: string; // Shopify cart line ID (gid://shopify/CartLine/...)
  quantity: number;
  title: string;
  price: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  checkoutUrl: string | null;
  cartId: string | null;
  isLoading: boolean;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  setCheckoutUrl: (url: string) => void;
}

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem('boinng_cart');
      const storedCartId = localStorage.getItem('boinng_cartId');
      if (stored) {
        setItems(JSON.parse(stored));
      }
      if (storedCartId) {
        setCartId(storedCartId);
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Save cart and cartId to localStorage
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('boinng_cart', JSON.stringify(items));
        if (cartId) {
          localStorage.setItem('boinng_cartId', cartId);
        }
      } catch {
        // ignore quota exceeded
      }
    }
  }, [items, cartId, isClient]);

  // Create a new Shopify cart via API
  const createShopifyCart = async (merchandiseId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchandiseId, quantity }),
      });

      const data = await response.json() as { cartId: string; checkoutUrl?: string; lines?: Array<{ id: string; merchandise: { id: string } }> };

      if (!response.ok) {
        return null;
      }

      const newCartId = data.cartId;
      setCartId(newCartId);
      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
      }

      // Update items with lineIds from the response
      if (data.lines && Array.isArray(data.lines) && data.lines.length > 0) {
        setItems(prevItems =>
          prevItems.map(item => {
            const line = data.lines?.find(
              (l) => l.merchandise.id === item.id
            );
            if (line) {
              return { ...item, lineId: line.id };
            }
            return item;
          })
        );
      }

      return newCartId;
    } catch (error) {
      return null;
    }
  };

  // Add item to Shopify cart
  const addToShopifyCart = async (merchandiseId: string, quantity: number) => {
    if (!cartId) return;
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, merchandiseId, quantity }),
      });

      const data = await response.json() as { checkoutUrl?: string; lines?: Array<{ id: string; merchandise: { id: string } }> };

      if (!response.ok) {
        return;
      }

      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
      }

      // Update items with lineIds from the response
      if (data.lines && Array.isArray(data.lines) && data.lines.length > 0) {
        setItems(prevItems =>
          prevItems.map(item => {
            const line = data.lines?.find(
              (l) => l.merchandise.id === item.id
            );
            if (line) {
              return { ...item, lineId: line.id };
            }
            return item;
          })
        );
      }
    } catch (error) {
      // ignore error
    }
  };

  // Remove item from Shopify cart
  const removeFromShopifyCart = async (lineId: string) => {
    if (!cartId) return;
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, lineIds: [lineId] }),
      });

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      if (data.cart?.checkoutUrl) {
        setCheckoutUrl(data.cart.checkoutUrl);
      }
    } catch (error) {
      // ignore error
    }
  };

  // Update item quantity in Shopify cart
  const updateShopifyCartQuantity = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, lineId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      if (data.cart?.checkoutUrl) {
        setCheckoutUrl(data.cart.checkoutUrl);
      }
    } catch (error) {
      // ignore error
    }
  };

  const addItem = async (item: CartItem) => {
    setIsLoading(true);
    try {
      // Update local state first for immediate UI feedback
      setItems(prevItems => {
        const existingItem = prevItems.find(i => i.id === item.id);
        if (existingItem) {
          return prevItems.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        }
        return [...prevItems, item];
      });

      // Create Shopify cart if this is the first item
      let currentCartId = cartId;
      if (!currentCartId) {
        currentCartId = await createShopifyCart(item.id, item.quantity);
      } else {
        // Add to existing Shopify cart
        await addToShopifyCart(item.id, item.quantity);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      // Find the item to get its lineId
      const item = items.find(i => i.id === itemId);
      const lineIdToRemove = item?.lineId || itemId;

      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      if (cartId) {
        await removeFromShopifyCart(lineIdToRemove);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      if (quantity <= 0) {
        await removeItem(itemId);
        return;
      }

      setItems(prevItems =>
        prevItems.map(item => item.id === itemId ? { ...item, quantity } : item)
      );

      if (cartId) {
        // Find the item to get its lineId
        const item = items.find(i => i.id === itemId);
        const lineIdToUpdate = item?.lineId || itemId;
        await updateShopifyCartQuantity(lineIdToUpdate, quantity);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        checkoutUrl,
        cartId,
        isLoading,
        addItem,
        removeItem,
        updateItemQuantity,
        openCart,
        closeCart,
        setCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
