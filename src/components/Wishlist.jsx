import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist, addToCart, loadUserWishlist } from '../slices/cartSlice';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Button,
  Card,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const wishlist = useSelector(state => state.products.wishlist);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  // Load user's wishlist when component mounts
  useEffect(() => {
    if (currentUser && isInitialLoad) {
      dispatch(loadUserWishlist({ username: currentUser.username }));
      setIsInitialLoad(false);
    }
  }, [dispatch, currentUser, isInitialLoad]);

  const handleRemoveFromWishlist = (item) => {
    if (!currentUser) {
      showToast('Please login to manage wishlist', 'warning');
      navigate('/login');
      return;
    }
    dispatch(removeFromWishlist({ productId: item.id, username: currentUser.username }));
    showToast(`${item.title} removed from wishlist`, 'info');
  };

  const handleAddToCart = (item) => {
    if (!currentUser) {
      showToast('Please login to add items to cart', 'warning');
      navigate('/login');
      return;
    }
    dispatch(addToCart({ product: item, username: currentUser.username }));
    dispatch(removeFromWishlist({ productId: item.id, username: currentUser.username }));
    showToast(`${item.title} added to cart`, 'success');
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 4, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ color: '#888', textAlign: 'center' }}>
          Please login to view your wishlist.
        </Typography>
      </Box>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Box sx={{ p: 4, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ color: '#888', textAlign: 'center' }}>
          Your wishlist is empty.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'transparent',
        borderRadius: 4,
        maxWidth: 1300,
        mx: 'auto',
        my: 5,
        px: { xs: 1, sm: 2, md: 2 },
        py: { xs: 2, md: 3 },
        minHeight: 500
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 4,
          letterSpacing: 1,
          color: '#457B9D',
          textAlign: 'center',
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
        }}
      >
        YOUR WISHLIST
      </Typography>

      <Grid container spacing={isLaptop ? 4 : 2} justifyContent="center">
        {wishlist.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Card
              sx={{
                borderRadius: 5,
                boxShadow: '0 2px 12px #457B9D22',
                border: '2px solid #A8DADC',
                bgcolor: 'rgba(113, 155, 182, 0.18)',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 390,
                maxWidth: 270,
                m: 'auto',
                transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.15s',
                '&:hover': {
                  boxShadow: '0 8px 32px #457B9D44',
                  borderColor: '#457B9D',
                  transform: 'translateY(-6px) scale(1.03)',
                },
              }}
            >
              {/* Product Image */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 3,
                    p: 1,
                    width: 140,
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 6px #457B9D22',
                  }}
                >
                  <img
                    src={item.image || 'https://via.placeholder.com/140'}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 12,
                    }}
                  />
                </Box>
              </Box>

              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#457B9D',
                  mb: 1,
                  textAlign: 'center',
                  fontSize: 18,
                  minHeight: 28,
                }}
              >
                {item.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: '#555',
                  mb: 2,
                  textAlign: 'center',
                  minHeight: 36,
                }}
              >
                {item.description?.slice(0, 50)}{item.description?.length > 50 ? '...' : ''}
              </Typography>

              {/* Price */}
              <Typography
                variant="h6"
                sx={{
                  color: '#163c45',
                  fontWeight: 700,
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                ${item.price}
              </Typography>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 'auto' }}>
                <Button
                  variant="contained"
                  size="medium"
                  sx={{
                    bgcolor: '#457B9D',
                    color: '#fff',
                    fontWeight: 700,
                    flex: 1,
                    borderRadius: 2,
                    boxShadow: 1,
                    '&:hover': { bgcolor: '#35607a' },
                    textTransform: 'none',
                    fontSize: 15,
                  }}
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </Button>
                <IconButton
                  color="primary"
                  onClick={() => handleRemoveFromWishlist(item)}
                  sx={{
                    bgcolor: '#A8DADC33',
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#457B9D22' },
                    width: 44,
                    height: 44,
                  }}
                >
                  <FavoriteIcon fontSize="medium" sx={{ color: '#457B9D' }} />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
