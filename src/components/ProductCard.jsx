import React from 'react';
import {
  Card, Typography, Button, Box, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, addToWishlist } from '../slices/cartSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useToast } from '../contexts/ToastContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const image = product.image || 'https://via.placeholder.com/150';
  const remaining = product.stock - (product.sold || 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
      showToast('Please login to add items to cart', 'warning');
      navigate('/login');
      return;
    }

    dispatch(addToCart({ product, username: currentUser.username }));
    showToast('Added to cart', 'success');
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
      showToast('Please login to add items to wishlist', 'warning');
      navigate('/login');
      return;
    }

    dispatch(addToWishlist({ product, username: currentUser.username }));
    showToast('Added to wishlist', 'success');
  };

  return (
    <Card
      sx={{
        bgcolor: 'rgba(168,218,220,0.18)',
        border: '1.5px solid #A8DADC',
        boxShadow: '0 4px 24px #457B9D22',
        borderRadius: 4,
        p: { xs: 1.5, sm: 2 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.15s',
        '&:hover': {
          boxShadow: '0 16px 40px #457B9D55',
          borderColor: '#457B9D',
          transform: 'translateY(-8px) scale(1.05) rotate(-1deg)',
          transition: 'transform 0.3s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s, border-color 0.2s',
        },
        animation: 'fadeInUp 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' }
        },
        minHeight: 370,
        maxWidth: { xs: '100%', sm: 250 },
        width: '100%',
        m: 'auto',
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Product Image */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <img
          src={image}
          alt={product.title}
          style={{
            width: '100%',
            maxWidth: 180,
            height: 'auto',
            aspectRatio: '1',
            objectFit: 'cover',
            borderRadius: 8,
            background: 'linear-gradient(90deg, #A8DADC 0%,rgb(113, 155, 182) 100%)',
            boxShadow: '0 2px 8px #457B9D22',
            border: '1px solid #A8DADC',
          }}
        />
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#457B9D',
          mb: 1,
          textAlign: 'center',
          minHeight: 48,
          lineHeight: 1.2,
          fontSize: { xs: 16, sm: 17 }
        }}
      >
        {product.title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          color: '#555',
          mb: 1,
          textAlign: 'center',
          fontSize: { xs: 13, sm: 14 },
          minHeight: 36
        }}
      >
        {product.description?.slice(0, 50)}{product.description?.length > 50 ? '...' : ''}
      </Typography>

      {/* Price Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="h6" sx={{ color: '#163c45', fontWeight: 700, fontSize: { xs: 16, sm: 18 } }}>
          ${product.price}
        </Typography>
        {product.discount && (
          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#aaa', fontSize: 13 }}>
            ${(product.price * (1 + product.discount / 100)).toFixed(2)}
          </Typography>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, mt: 'auto', width: '100%' }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#457B9D',
            color: '#fff',
            fontWeight: 700,
            flex: 1,
            borderRadius: 2,
            boxShadow: 1,
            '&:hover': { bgcolor: '#35607a' },
            textTransform: 'none',
            fontSize: { xs: 13, sm: 15 }
          }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <IconButton
          color="primary"
          onClick={handleAddToWishlist}
          sx={{
            bgcolor: '#A8DADC33',
            borderRadius: 2,
            '&:hover': { bgcolor: '#457B9D22' },
            width: 40,
            height: 40
          }}
        >
          <FavoriteBorderIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}
