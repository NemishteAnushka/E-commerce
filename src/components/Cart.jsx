import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, loadUserCart } from '../slices/cartSlice';
import {
  Button,
  Typography,
  Box,
  Divider,
  TextField,
  IconButton,
  Paper,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const cart = useSelector(state => state.products.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [coupon, setCoupon] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const { showToast } = useToast();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Load user's cart only once when component mounts
  useEffect(() => {
    if (currentUser && isInitialLoad) {
      dispatch(loadUserCart({ username: currentUser.username }));
      setIsInitialLoad(false);
    }
  }, [dispatch, currentUser, isInitialLoad]);

  const handleCheckout = async () => {
    if (!currentUser) {
      showToast('Please login to checkout', 'warning');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };
  

  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === 'save10') {
      setDiscount(0.1);
      showToast('Coupon applied successfully!', 'success');
    } else {
      setDiscount(0);
      showToast('Invalid coupon code', 'error');
    }
  };

  const handleRemoveItem = (item) => {
    if (!currentUser) {
      showToast('Please login to manage cart', 'warning');
      navigate('/login');
      return;
    }
    dispatch(removeFromCart({ productId: item.id, username: currentUser.username }));
    showToast('Item removed from cart', 'info');
  };

  if (cart.length === 0) {
    return (
      <Box sx={{ p: 4, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ color: '#888' }}>Your cart is empty.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 4,
        maxWidth: 1100,
        mx: 'auto',
        my: { xs: 2, md: 5 },
        p: 0,
        boxShadow: 3,
        overflow: 'hidden',
        minHeight: 500
      }}
    >
      <Grid container direction={{ xs: 'column', md: 'row' }}>
        {/* Cart Items */}
        <Grid item xs={12} md={8} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, letterSpacing: 1 }}>YOUR CART</Typography>
          <Divider sx={{ mb: 2 }} />
          {cart.map(item => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 3,
                gap: 2
              }}
            >
              <Paper
                sx={{
                  width: { xs: 80, sm: 64 },
                  height: { xs: 80, sm: 64 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  mr: { sm: 2 },
                  boxShadow: 1,
                  flexShrink: 0
                }}
              >
                <img
                  src={item.image || 'https://via.placeholder.com/64'}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Paper>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  {item.size ? `Size: ${item.size}` : ''} {item.color ? `| Color: ${item.color}` : ''}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }}>
                  {item.description?.slice(0, 40)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" sx={{ color: '#222', fontWeight: 600, mr: 2 }}>
                    ${item.price} x {item.qty}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => handleRemoveItem(item)} sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Coupon code"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              sx={{ width: { xs: '100%', sm: 200 } }}
            />
            <Button variant="outlined" onClick={handleApplyCoupon}>APPLY</Button>
          </Box>
        </Grid>

        {/* Cart Totals */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            bgcolor: '#fafafa',
            p: { xs: 2, md: 4 },
            borderLeft: { md: '1px solid #eee' }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: { xs: 1, sm: 2 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            CART TOTALS
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">${total.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Shipping</Typography>
            <Typography variant="body2">Free</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Discount</Typography>
            <Typography variant="body2">{discount ? `- $${(total * discount).toFixed(2)}` : '-'}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>${(total - total * discount).toFixed(2)}</Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#222',
              color: '#fff',
              fontWeight: 700,
              py: 1.2,
              borderRadius: 2,
              mb: 1,
              fontSize: { xs: '0.85rem', sm: '1rem' },
              '&:hover': { bgcolor: '#444' }
            }}
            onClick={handleCheckout}
          >
            PROCEED TO CHECKOUT
          </Button>
          <Button
            fullWidth
            variant="text"
            sx={{ color: '#888', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '1rem' } }}
            onClick={() => navigate('/')}
          >
            CONTINUE SHOPPING
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
