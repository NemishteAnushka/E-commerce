import React from 'react';
import { Box, Button, Typography } from '@mui/material';

// Props: label, icon, selected, onClick
const CategoryButton = ({ label, icon, selected, onClick }) => {
  return (
    <Button
      variant={selected ? 'contained' : 'outlined'}
      onClick={onClick}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        borderRadius: 2,
        p: 2,
        textTransform: 'none',
        background: selected 
          ? 'linear-gradient(135deg, #457B9D 0%, #1D3557 100%)'
          : 'rgba(255, 255, 255, 0.9)',
        color: selected ? '#fff' : '#1D3557',
        border: selected ? 'none' : '1px solid #E0E0E0',
        boxShadow: selected ? 3 : 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: selected 
            ? 'linear-gradient(135deg, #1D3557 0%, #457B9D 100%)'
            : 'rgba(69, 123, 157, 0.1)',
          transform: 'translateY(-2px)',
          boxShadow: selected ? 4 : 2,
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: selected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(69, 123, 157, 0.1)',
          p: 0.5,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          fontSize: '1rem',
          textAlign: 'center',
        }}
      >
        {label}
      </Typography>
    </Button>
  );
};

export default CategoryButton;
