import React from 'react';
import { useRole, ROLES } from '../contexts/RoleContext';
import { Navigate } from 'react-router-dom';

// Usage: <RequireRole role="seller"><SellerDashboard /></RequireRole>
export default function RequireRole({ role: requiredRole, children }) {
  console.log('RequireRole component rendered with role:', requiredRole);
  const { role } = useRole();
  console.log('Current user role:', role);
  if (role === requiredRole) return children;
  return <Navigate to="/login" replace />;
}
