import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Props: icon, label, selected, onClick
const CategoryIconBox = ({ icon, label, selected, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 1.5,
      m: 1,
      borderRadius: 2,
      cursor: 'pointer',
      boxShadow: selected ? 3 : 1,
      background: selected ? 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)' : '#fff',
      color: selected ? '#fff' : '#1976d2',
      transition: 'all 0.2s',
      '&:hover': {
        boxShadow: 4,
        background: 'linear-gradient(90deg, #1565c0 60%, #42a5f5 100%)',
        color: '#fff',
      },
    }}
  >
    {icon}
    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
      {label}
    </Typography>
  </Box>
);

export default CategoryIconBox;
