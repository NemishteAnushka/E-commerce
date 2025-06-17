import React, { createContext, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout as clearCart } from '../slices/cartSlice';

// Helper to simulate JWT encode/decode (for demo only)
function fakeJwtEncode(payload) {
  return btoa(JSON.stringify(payload));
}
function fakeJwtDecode(token) {
  try { return JSON.parse(atob(token)); } catch { return null; }
}

// Define available roles
export const ROLES = {
  SELLER: 'vendor',
  BUYER: 'customer',
};

// Create context
const RoleContext = createContext();

const getStoredToken = () => localStorage.getItem('jwt');
const setStoredToken = (token) => localStorage.setItem('jwt', token);
const clearStoredToken = () => localStorage.removeItem('jwt');

export const RoleProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  // Get role from JWT if present
  const [role, setRole] = useState(() => {
    const token = getStoredToken();
    if (!token) return null;
    const payload = fakeJwtDecode(token);
    return payload?.role || null;
  });

  const loginAs = (newRole) => {
    setRole(newRole);
    const token = fakeJwtEncode({ role: newRole, exp: Date.now() + 1000 * 60 * 60 });
    setStoredToken(token);
  };

  const logout = () => {
    setRole(null);
    clearStoredToken();
    localStorage.removeItem('currentUser');
    dispatch(clearCart()); // Clear cart when logging out
  };

  return (
    <RoleContext.Provider value={{ role, loginAs, logout }}>
      {children}
    </RoleContext.Provider>
  );
};
export const useRole = () => useContext(RoleContext);

