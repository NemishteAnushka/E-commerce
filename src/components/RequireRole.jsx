import React from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { Navigate } from 'react-router-dom';

// Usage: <RequireRole role="seller"><SellerDashboard /></RequireRole>
export default function RequireRole({ role: requiredRole, children }) {
  const { role } = useRole();
  if (role === requiredRole) return children;
  return <Navigate to="/login" replace />;
}
