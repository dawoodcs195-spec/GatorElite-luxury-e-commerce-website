import api from './api';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    return api.post('/api/orders', orderData);
  },

  // Get order by ID
  async getOrderById(id) {
    return api.get(`/api/orders/${id}`);
  },

  // Get user orders
  async getUserOrders() {
    return api.get('/api/orders/user');
  },

  // Get all orders (admin)
  async getAllOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/api/orders?${queryString}`);
  },

  // Update order status (admin)
  async updateOrderStatus(id, status) {
    return api.put(`/api/orders/${id}/status`, { status });
  },

  // Cancel order
  async cancelOrder(id) {
    return api.put(`/api/orders/${id}/cancel`);
  },
};

export default orderService;
