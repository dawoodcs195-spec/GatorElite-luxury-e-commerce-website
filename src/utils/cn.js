import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge class names with Tailwind CSS
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency (Pakistani Rupees)
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// Generate random order ID
export function generateOrderId() {
  return 'GE-' + Math.floor(1000 + Math.random() * 9000);
}

// Truncate text
export function truncate(str, length = 50) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// Delay function
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Deep clone object
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Slugify string
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// Validate email
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone (Pakistani format)
export function isValidPhone(phone) {
  const re = /^(\+92|0)?[0-9]{10}$/;
  return re.test(phone.replace(/\s/g, ''));
}
