import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      position: 'fixed',
      left: { xs: 16, sm: 32 },
      top: { xs: 80, sm: 100 },
      zIndex: 1000,
    }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
      </IconButton>
    </Box>
  );
};

export default BackButton; 