import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { username, role, type: 'seller' | 'buyer', connections: [] }
  isAuthenticated: false,
  error: null,
  connections: [], // For sellers: list of connected buyers, For buyers: list of connected sellers
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = {
        ...action.payload,
        type: action.payload.role // Set type to match role
      };
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.connections = [];
    },
    addConnection: (state, action) => {
      if (!state.connections.includes(action.payload)) {
        state.connections.push(action.payload);
      }
    },
    removeConnection: (state, action) => {
      state.connections = state.connections.filter(
        (connection) => connection !== action.payload
      );
    },
  },
});

export const { 
  loginSuccess, 
  loginFailure, 
  logout, 
  addConnection, 
  removeConnection 
} = userSlice.actions;

export default userSlice.reducer;
