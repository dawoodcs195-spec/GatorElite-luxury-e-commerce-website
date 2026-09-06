import api from './api';

export const productService = {
  // Get all products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/api/products?${queryString}`);
  },

  // Get single product by slug
  async getProductBySlug(slug) {
    return api.get(`/api/products?slug=${slug}`);
  },

  // Get single product by ID
  async getProductById(id) {
    return api.get(`/api/products/${id}`);
  },

  // Create product (admin)
  async createProduct(productData) {
    return api.post('/api/products', productData);
  },

  // Update product (admin)
  async updateProduct(id, productData) {
    return api.put(`/api/products/${id}`, productData);
  },

  // Delete product (admin)
  async deleteProduct(id) {
    return api.delete(`/api/products/${id}`);
  },

  // Get featured products
  async getFeaturedProducts() {
    return api.get('/api/products?featured=true');
  },

  // Get products by color
  async getProductsByColor(color) {
    return api.get(`/api/products?color=${color}`);
  },

  // Search products
  async searchProducts(query) {
    return api.get(`/api/products?search=${encodeURIComponent(query)}`);
  },
};

export default productService;
