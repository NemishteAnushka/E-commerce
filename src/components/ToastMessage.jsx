import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export default function ToastMessage({ open, message, severity, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
      sx={{
        '& .MuiAlert-root': {
          minWidth: 280,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: 2,
          '&.MuiAlert-standardSuccess': {
            bgcolor: '#4caf50',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          },
          '&.MuiAlert-standardError': {
            bgcolor: '#f44336',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          },
          '&.MuiAlert-standardWarning': {
            bgcolor: '#ff9800',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          },
          '&.MuiAlert-standardInfo': {
            bgcolor: '#2196f3',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          }
        }
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            fontWeight: 500,
            fontSize: '0.95rem'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
} 