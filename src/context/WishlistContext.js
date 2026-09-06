'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

const WISHLIST_KEY = 'gatorelite_wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem(WISHLIST_KEY);
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist));
      }
    }
    setLoading(false);
  }, []);

  const saveWishlist = (newItems) => {
    setItems(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newItems));
    }
  };

  const addItem = (product) => {
    const exists = items.find((item) => item.slug === product.slug);
    if (!exists) {
      saveWishlist([...items, product]);
    }
  };

  const removeItem = (slug) => {
    saveWishlist(items.filter((item) => item.slug !== slug));
  };

  const toggleItem = (product) => {
    const exists = items.find((item) => item.slug === product.slug);
    if (exists) {
      removeItem(product.slug);
    } else {
      addItem(product);
    }
  };

  const isInWishlist = (slug) => {
    return items.some((item) => item.slug === slug);
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  const value = {
    items,
    loading,
    totalItems: items.length,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export default WishlistContext;
