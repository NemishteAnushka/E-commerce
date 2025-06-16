import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Props: item, onRemove, onQtyChange
const CartItemRow = ({ item, onRemove, onQtyChange }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: { xs: 'flex-start', sm: 'center' },
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      p: 1,
      borderBottom: '1px solid #eee',
      background: '#fff',
      borderRadius: 2,
      mb: 1,
      boxShadow: 1,
      gap: { xs: 1, sm: 0 },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
      <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
      <Box>
        <Typography fontWeight={600} sx={{ fontSize: { xs: 15, sm: 16 } }}>{item.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, sm: 14 } }}>{item.brand}</Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: 12, sm: 14 } }}>Qty: 
          <input
            type="number"
            min={1}
            value={item.qty}
            onChange={e => onQtyChange?.(item.id, Number(e.target.value))}
            style={{ width: 40, marginLeft: 4 }}
          />
        </Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 1, sm: 0 } }}>
      <Typography fontWeight={600} sx={{ fontSize: { xs: 15, sm: 16 } }}>${item.price * item.qty}</Typography>
      <IconButton color="error" onClick={() => onRemove(item.id)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  </Box>
);

export default CartItemRow;
