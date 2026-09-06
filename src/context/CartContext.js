'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import cartService from '@/services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = cartService.getCart();
    setItems(savedCart);
    setLoading(false);
  }, []);

  const addItem = (item) => {
    const updated = cartService.addItem(item);
    setItems(updated);
  };

  const removeItem = (slug, size, color) => {
    const updated = cartService.removeItem(slug, size, color);
    setItems(updated);
  };

  const updateQuantity = (slug, size, color, quantity) => {
    const updated = cartService.updateQuantity(slug, size, color, quantity);
    setItems(updated);
  };

  const clearCart = () => {
    const updated = cartService.clearCart();
    setItems(updated);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = {
    items,
    loading,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
