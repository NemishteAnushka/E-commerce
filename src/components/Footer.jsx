import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ mt: 6, py: 3, bgcolor: 'linear-gradient(90deg, rgb(227,234,235) 0%, rgb(119,174,209) 100%)', color: '#457B9D', textAlign: 'center', borderTop: '1px solid #e3eaeb' }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        &copy; {new Date().getFullYear()} E-Commerce App. All rights reserved
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Link href="/" underline="hover" sx={{ color: '#457B9D', mx: 1 }}>
          Home
        </Link>
        <Link href="/seller" underline="hover" sx={{ color: '#457B9D', mx: 1 }}>
          Seller Dashboard
        </Link>
     <Typography variant="body2" sx={{ fontWeight: 500 }}>
      </Typography>    <Link href="/cart" underline="hover" sx={{ color: '#457B9D', mx: 1 }}>
          Cart
        </Link>
        <Link href="/wishlist" underline="hover" sx={{ color: '#457B9D', mx: 1 }}>
          Wishlist
        </Link>
      </Box>
    </Box>
  );
}
