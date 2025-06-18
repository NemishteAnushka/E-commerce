import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const cartService = {
  // Get cart items
  getCart: async () => {
    try {
      const response = await api.get('/cart/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity) => {
    try {
      // First get the product details to check stock
      const productResponse = await api.get(`/products/${productId}/`);
      const product = productResponse.data;
      
      // Get current cart to check if item already exists
      const cartResponse = await api.get('/cart/');
      const cartItems = cartResponse.data;
      
      // Find if product is already in cart
      const existingItem = cartItems.find(item => item.product === productId);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      
      // Calculate total quantity after adding
      const totalQuantity = currentQuantity + quantity;
      
      // Check if total quantity exceeds stock
      if (totalQuantity > product.stock) {
        throw new Error(`Not enough stock. Available: ${product.stock}, Already in cart: ${currentQuantity}`);
      }

      // If all checks pass, add to cart
      const response = await api.post('/cart/', {
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
      const response = await api.delete(`/cart/${cartItemId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId, quantity) => {
    try {
      // Get the cart item to check product details
      const cartResponse = await api.get('/cart/');
      const cartItem = cartResponse.data.find(item => item.id === cartItemId);
      
      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      // Get product details to check stock
      const productResponse = await api.get(`/products/${cartItem.product}/`);
      const product = productResponse.data;

      // Check if new quantity exceeds stock
      if (quantity > product.stock) {
        throw new Error(`Not enough stock. Available: ${product.stock}`);
      }

      const response = await api.patch(`/cart/${cartItemId}/`, {
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 