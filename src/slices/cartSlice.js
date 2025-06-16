import { createSlice } from '@reduxjs/toolkit';

// Helper functions for localStorage
const getCartFromStorage = (username) => {
  try {
    const carts = JSON.parse(localStorage.getItem('userCarts') || '{}');
    return carts[username] || [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (username, cart) => {
  try {
    const carts = JSON.parse(localStorage.getItem('userCarts') || '{}');
    carts[username] = cart;
    localStorage.setItem('userCarts', JSON.stringify(carts));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

const getWishlistFromStorage = (username) => {
  try {
    const wishlists = JSON.parse(localStorage.getItem('userWishlists') || '{}');
    return wishlists[username] || [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (username, wishlist) => {
  try {
    const wishlists = JSON.parse(localStorage.getItem('userWishlists') || '{}');
    wishlists[username] = wishlist;
    localStorage.setItem('userWishlists', JSON.stringify(wishlists));
  } catch (error) {
    console.error('Error saving wishlist to storage:', error);
  }
};

const initialState = {
  items: [], // products with seller information
  cart: [],
  wishlist: [],
  currentUser: null, // Add current user to track who is logged in
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addProduct: (state, action) => {
      const product = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.items.push(product);
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      // Also remove from cart and wishlist if present
      state.cart = state.cart.filter(item => item.id !== action.payload);
      state.wishlist = state.wishlist.filter(item => item.id !== action.payload);
    },
    addToCart: (state, action) => {
      const { product, username } = action.payload;
      if (!username) return; // Don't add to cart if no username
      
      const inCart = state.cart.find(item => item.id === product.id);
      if (inCart) {
        inCart.qty += 1;
      } else {
        state.cart.push({ ...product, qty: 1 });
      }
      // Save to localStorage
      saveCartToStorage(username, state.cart);
      // Update current user
      state.currentUser = username;
    },
    addToWishlist: (state, action) => {
      const { product, username } = action.payload;
      if (!username) return; // Don't add to wishlist if no username
      
      if (!state.wishlist.find(item => item.id === product.id)) {
        state.wishlist.push(product);
        // Save to localStorage
        saveWishlistToStorage(username, state.wishlist);
        // Update current user
        state.currentUser = username;
      }
    },
    removeFromCart: (state, action) => {
      const { productId, username } = action.payload;
      if (!username) return; // Don't remove if no username
      
      state.cart = state.cart.filter(item => item.id !== productId);
      // Save to localStorage
      saveCartToStorage(username, state.cart);
    },
    removeFromWishlist: (state, action) => {
      const { productId, username } = action.payload;
      if (!username) return; // Don't remove if no username
      
      state.wishlist = state.wishlist.filter(item => item.id !== productId);
      // Save to localStorage
      saveWishlistToStorage(username, state.wishlist);
    },
    clearCart: (state, action) => {
      const { username } = action.payload;
      if (!username) return; // Don't clear if no username
      
      state.cart = [];
      // Save to localStorage
      saveCartToStorage(username, []);
    },
    loadUserCart: (state, action) => {
      const { username } = action.payload;
      if (!username) return; // Don't load if no username
      
      // Get cart from localStorage
      const cart = getCartFromStorage(username);
      // Update state
      state.cart = cart;
      state.currentUser = username;
      
      // Log for debugging
      console.log('Loading cart for user:', username);
      console.log('Cart loaded:', cart);
    },
    loadUserWishlist: (state, action) => {
      const { username } = action.payload;
      if (!username) return; // Don't load if no username
      
      // Get wishlist from localStorage
      const wishlist = getWishlistFromStorage(username);
      // Update state
      state.wishlist = wishlist;
      state.currentUser = username;
    },
    logout: (state) => {
      // Clear cart, wishlist and current user when logging out
      state.cart = [];
      state.wishlist = [];
      state.currentUser = null;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addToCart,
  addToWishlist,
  removeFromCart,
  removeFromWishlist,
  clearCart,
  loadUserCart,
  loadUserWishlist,
  logout,
} = productsSlice.actions;

export default productsSlice.reducer;
