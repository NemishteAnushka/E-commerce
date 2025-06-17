import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const cartService = {
  // Get cart items
  getCart: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity) => {
    try {
      const response = await axios.post(`${API_URL}/cart/`, {
        product: productId,
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/${cartItemId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId, quantity) => {
    try {
      const response = await axios.patch(`${API_URL}/cart/${cartItemId}/`, {
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 