import api from './api';

export const authService = {
  // Login
  async login(email, password) {
    const data = await api.post('/api/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Register
  async register(userData) {
    const data = await api.post('/api/auth/register', userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Update profile
  async updateProfile(userData) {
    return api.put('/api/auth/profile', userData);
  },

  // Change password
  async changePassword(passwordData) {
    return api.put('/api/auth/password', passwordData);
  },

  // Forgot password
  async forgotPassword(email) {
    return api.post('/api/auth/forgot-password', { email });
  },

  // Reset password
  async resetPassword(token, password) {
    return api.post('/api/auth/reset-password', { token, password });
  },
};

export default authService;
