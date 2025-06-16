import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import ProductList from './components/ProductList';
import SellerDashboard from './components/SellerDashboard';
import { useRole, ROLES } from './contexts/RoleContext';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import RequireRole from './components/RequireRole';
import { useNavigate } from 'react-router-dom';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import ProductByCategory from './components/ProductByCategory';
import Wishlist from './components/Wishlist';
import BackButton from './components/BackButton';
import SearchResults from './components/SearchResults';

function RoleSwitcher() {
  const { role, loginAs, logout } = useRole();
  const navigate = useNavigate();
  // Always show current role for debugging
  return (
    <div style={{ margin: '1rem 0', color: '#457B9D', fontWeight: 600, textAlign: 'center' }}>
      {role ? (
        <>
          Current role: <b>{role}</b>
          <button style={{ marginLeft: 12, padding: '4px 12px', borderRadius: 4, border: 'none', background: '#b7d6ee', color: '#222', cursor: 'pointer', fontWeight: 600 }} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  );
}

const PageWithBackButton = ({ children }) => {
  const location = useLocation();
  const showBackButton = !['/', '/login'].includes(location.pathname);
  
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {showBackButton && <BackButton />}
      {children}
    </Box>
  );
};

export default function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: '#fcfbfb', overflow: 'auto', zIndex: 0 }}>
        <Header />
        <RoleSwitcher />
        <Container maxWidth="lg" sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          py: { xs: 1, sm: 2 },
          px: { xs: 0.5, sm: 2 },
          width: '100%',
          minWidth: 0
        }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={
              <PageWithBackButton>
                <Register />
              </PageWithBackButton>
            } />
            <Route path="/forgot-password" element={
              <PageWithBackButton>
                <ForgotPassword />
              </PageWithBackButton>
            } />
            <Route path="/reset-password" element={
              <PageWithBackButton>
                <ResetPassword />
              </PageWithBackButton>
            } />
            <Route path="/seller" element={
              <RequireRole role="seller">
                <SellerDashboard />
              </RequireRole>
            } />
            <Route path="/product/:id" element={
              <PageWithBackButton>
                <ProductDetails />
              </PageWithBackButton>
            } />
            <Route path="/cart" element={
              <PageWithBackButton>
                <Cart />
              </PageWithBackButton>
            } />
            <Route path="/wishlist" element={
              <PageWithBackButton>
                <RequireRole role="buyer">
                  <Wishlist />
                </RequireRole>
              </PageWithBackButton>
            } />
            <Route path="/checkout" element={
              <PageWithBackButton>
                <Checkout />
              </PageWithBackButton>
            } />
            <Route path="/category/:categoryName" element={
              <PageWithBackButton>
                <ProductByCategory />
              </PageWithBackButton>
            } />
            <Route path="/search" element={
              <PageWithBackButton>
                <SearchResults />
              </PageWithBackButton>
            } />
            <Route path="/" element={
              <RequireRole role="buyer">
                <ProductList />
              </RequireRole>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </Router>
  );
}
