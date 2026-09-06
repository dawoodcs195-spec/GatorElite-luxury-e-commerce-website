// Cart service - manages cart in localStorage
// In a real app, this would sync with the backend

const CART_KEY = 'gatorelite_cart';

export const cartService = {
  // Get cart from localStorage
  getCart() {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  // Save cart to localStorage
  saveCart(items) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },

  // Add item to cart
  addItem(item) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      (i) => i.slug === item.slug && i.size === item.size && i.color === item.color
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    this.saveCart(cart);
    return cart;
  },

  // Remove item from cart
  removeItem(slug, size, color) {
    const cart = this.getCart();
    const filtered = cart.filter(
      (i) => !(i.slug === slug && i.size === size && i.color === color)
    );
    this.saveCart(filtered);
    return filtered;
  },

  // Update item quantity
  updateQuantity(slug, size, color, quantity) {
    const cart = this.getCart();
    const item = cart.find(
      (i) => i.slug === slug && i.size === size && i.color === color
    );
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    this.saveCart(cart);
    return cart;
  },

  // Clear cart
  clearCart() {
    this.saveCart([]);
    return [];
  },

  // Get total items count
  getTotalItems() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Get subtotal
  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
};

export default cartService;
