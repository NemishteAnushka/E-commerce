// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { addToCart, addToWishlist } from '../slices/cartSlice';
// import { useParams } from 'react-router-dom';
// import {
//   Button, Typography, Box, Grid, Paper, Divider, IconButton, Select, MenuItem, InputLabel, FormControl, TextField
// } from '@mui/material';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// export default function ProductDetails() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const product = useSelector(state => state.products.items.find(p => p.id === Number(id)));
//   const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || product?.image || 'https://via.placeholder.com/400');
//   const [color, setColor] = useState(product?.colors?.[0] || 'Sand');
//   const [size, setSize] = useState(product?.sizes?.[0] || 'Large');
//   const [quantity, setQuantity] = useState(1);

//   if (!product) return <div>Product not found.</div>;

//   // Simulate discount and offer
//   const discount = product.discount || 20;
//   const oldPrice = (product.price * (1 + discount / 100)).toFixed(2);
//   const inStock = (product.stock - (product.sold || 0)) > 0;

//   return (
//     <Box sx={{ bgcolor: 'rgba(168,218,220,0.15)', p: 4, borderRadius: 3, maxWidth: 1100, mx: 'auto', mt: 4, boxShadow: 2, backdropFilter: 'blur(0.5px)', border: '1px solid #A8DADC22' }}>
//       <Grid container spacing={4}>
//         {/* Left: Image Gallery */}
//         <Grid item xs={12} md={5}>
//           <Box sx={{ display: 'flex', flexDirection: 'row' }}>
//             {/* Thumbnails */}
//             <Box sx={{ display: 'flex', flexDirection: 'column', mr: 2 }}>
//               {(product.images || [product.image]).map((img, idx) => (
//                 <Paper key={idx} elevation={selectedImage === img ? 4 : 1} sx={{ mb: 1, border: selectedImage === img ? '2px solidrgb(134, 169, 190)' : '1px solid #A8DADC', cursor: 'pointer', bgcolor: '#A8DADC22' }}>
//                   <img src={img || 'https://via.placeholder.com/60'} alt="thumb" width={60} height={80} style={{ objectFit: 'cover', borderRadius: 4 }} onClick={() => setSelectedImage(img)} />
//                 </Paper>
//               ))}
//             </Box>
//             {/* Main Image */}
//             <Paper elevation={3} sx={{ p: 1, bgcolor: '#A8DADC33', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 350, minWidth: 250, border: '1.5px solid #A8DADC' }}>
//               <img src={selectedImage} alt={product.title} style={{ maxWidth: 250, maxHeight: 350, objectFit: 'contain', borderRadius: 8, background: 'linear-gradient(90deg, #A8DADC 0%,rgb(178, 211, 231) 100%)', boxShadow: '0 2px 8pxrgba(20, 45, 61, 0.2)' }} />
//             </Paper>
//           </Box>
//         </Grid>
//         {/* Right: Product Info */}
//         <Grid item xs={12} md={7}>
//           <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{product.title}</Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//             <Typography variant="h5" sx={{ color: '#6b695d', fontWeight: 700, mr: 2 }}>${product.price}</Typography>
//             <Typography variant="body1" sx={{ textDecoration: 'line-through', color: '#756868', mr: 2 }}>${oldPrice}</Typography>
//             <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 600 }}>Special offer {discount}% off on Category</Typography>
//           </Box>
//           <Divider sx={{ my: 2 }} />
//           <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
//             <FormControl size="small" sx={{ minWidth: 100 }}>
//               <InputLabel>Color</InputLabel>
//               <Select value={color} label="Color" onChange={e => setColor(e.target.value)}>
//                 {(product.colors || ['Sand']).map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
//               </Select>
//             </FormControl>
//             <FormControl size="small" sx={{ minWidth: 100 }}>
//               <InputLabel>Size</InputLabel>
//               <Select value={size} label="Size" onChange={e => setSize(e.target.value)}>
//                 {(product.sizes || ['Large']).map((s, i) => <MenuItem key={i} value={s}>{s}</MenuItem>)}
//               </Select>
//             </FormControl>
//           </Box>
//           <Typography variant="body2" sx={{ mb: 1 }}>Availability: <span style={{ color: inStock ? '#388e3c' : '#d32f2f', fontWeight: 600 }}>{inStock ? 'In Stock' : 'Out of Stock'}</span></Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <TextField
//               label="Quantity"
//               type="number"
//               size="small"
//               value={quantity}
//               onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.stock - (product.sold || 0))))}
//               inputProps={{ min: 1, max: product.stock - (product.sold || 0), style: { width: 60 } }}
//               sx={{ mr: 2 }}
//             />
//             <Button
//               variant="contained"
//               size="large"
//               sx={{ bgcolor: '#ffd600', color: '#222', fontWeight: 700, boxShadow: 1, mr: 2, '&:hover': { bgcolor: '#ffe066' } }}
//               disabled={!inStock}
//               onClick={() => dispatch(addToCart({ ...product, color, size, quantity }))}
//             >
//               ADD TO CART
//             </Button>
//             <IconButton color="primary" onClick={() => dispatch(addToWishlist(product))} sx={{ mr: 1 }}>
//               <FavoriteBorderIcon />
//             </IconButton>
//             <IconButton color="secondary" sx={{ mr: 1 }}>
//               <CompareArrowsIcon />
//             </IconButton>
//           </Box>
//           <Divider sx={{ my: 2 }} />
//           <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }




import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, addToWishlist } from '../slices/cartSlice';
import { useParams } from 'react-router-dom';
import {
  Button, Typography, Box, Grid, Paper, Divider, IconButton, Select, MenuItem, InputLabel, FormControl, TextField, useMediaQuery
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useTheme } from '@mui/material/styles';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  const product = useSelector(state => state.products.items.find(p => p.id === Number(id)));
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || product?.image || 'https://via.placeholder.com/400');
  const [color, setColor] = useState(product?.colors?.[0] || 'Sand');
  const [size, setSize] = useState(product?.sizes?.[0] || 'Large');
  const [quantity, setQuantity] = useState(1);

  if (!product) return <div>Product not found.</div>;

  const discount = product.discount || 20;
  const oldPrice = (product.price * (1 + discount / 100)).toFixed(2);
  const inStock = (product.stock - (product.sold || 0)) > 0;

  return (
    <Box
      sx={{
        bgcolor: 'rgba(168,218,220,0.15)',
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        maxWidth: 1100,
        mx: 'auto',
        mt: 4,
        boxShadow: 2,
        backdropFilter: 'blur(0.5px)',
        border: '1px solid #A8DADC22'
      }}
    >
      <Grid container spacing={isSmall ? 2 : 4} direction={isSmall ? 'column-reverse' : 'row'}>
        {/* Left: Image Gallery */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row' }}>
            {/* Thumbnails */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: isSmall ? 'row' : 'column',
                overflowX: isSmall ? 'auto' : 'visible',
                mb: isSmall ? 2 : 0,
                mr: isSmall ? 0 : 2,
                gap: 1
              }}
            >
              {(product.images || [product.image]).map((img, idx) => (
                <Paper
                  key={idx}
                  elevation={selectedImage === img ? 4 : 1}
                  sx={{
                    border: selectedImage === img ? '2px solid rgb(134, 169, 190)' : '1px solid #A8DADC',
                    cursor: 'pointer',
                    bgcolor: '#A8DADC22',
                    minWidth: 60,
                    height: 80,
                  }}
                >
                  <img
                    src={img || 'https://via.placeholder.com/60'}
                    alt="thumb"
                    width={60}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    onClick={() => setSelectedImage(img)}
                  />
                </Paper>
              ))}
            </Box>
            {/* Main Image */}
            <Paper
              elevation={3}
              sx={{
                p: 1,
                bgcolor: '#A8DADC33',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                width: '100%',
                border: '1.5px solid #A8DADC'
              }}
            >
              <img
                src={selectedImage}
                alt={product.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: 350,
                  objectFit: 'contain',
                  borderRadius: 8,
                  background: 'linear-gradient(90deg, #A8DADC 0%,rgb(178, 211, 231) 100%)',
                  boxShadow: '0 2px 8px rgba(20, 45, 61, 0.2)'
                }}
              />
            </Paper>
          </Box>
        </Grid>

        {/* Right: Product Info */}
        <Grid item xs={12} md={7}>
          <Typography variant={isSmall ? 'h5' : 'h4'} sx={{ fontWeight: 700, mb: 1 }}>{product.title}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ color: '#6b695d', fontWeight: 700, mr: 2 }}>${product.price}</Typography>
            <Typography variant="body1" sx={{ textDecoration: 'line-through', color: '#756868', mr: 2 }}>${oldPrice}</Typography>
            <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 600 }}>Special offer {discount}% off</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Color</InputLabel>
              <Select value={color} label="Color" onChange={e => setColor(e.target.value)}>
                {(product.colors || ['Sand']).map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Size</InputLabel>
              <Select value={size} label="Size" onChange={e => setSize(e.target.value)}>
                {(product.sizes || ['Large']).map((s, i) => <MenuItem key={i} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Availability: <span style={{ color: inStock ? '#388e3c' : '#d32f2f', fontWeight: 600 }}>{inStock ? 'In Stock' : 'Out of Stock'}</span>
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: 2, gap: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              size="small"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(Number(e.target.value), product.stock - (product.sold || 0))))}
              inputProps={{ min: 1, max: product.stock - (product.sold || 0), style: { width: 60 } }}
            />
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#ffd600',
                color: '#222',
                fontWeight: 700,
                boxShadow: 1,
                '&:hover': { bgcolor: '#ffe066' }
              }}
              disabled={!inStock}
              onClick={() => dispatch(addToCart({ ...product, color, size, quantity }))}
            >
              ADD TO CART
            </Button>
            <IconButton color="primary" onClick={() => dispatch(addToWishlist(product))}>
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton color="secondary">
              <CompareArrowsIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
