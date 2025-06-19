import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useToast } from '../contexts/ToastContext';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const otpData = JSON.parse(localStorage.getItem('resetOtp') || '{}');
    if (!otpData.email) {
      setError('No reset request found. Please try again.');
      showToast('No reset request found. Please try again.', 'error');
      navigate('/forgot-password');
      return;
    }
    // Update user password in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === otpData.email);
    if (userIndex === -1) {
      setError('User not found.');
      showToast('User not found.', 'error');
      navigate('/forgot-password');
      return;
    }
    users[userIndex].password = password;
    localStorage.setItem('users', JSON.stringify(users));
    // Clean up OTP
    localStorage.removeItem('resetOtp');
    showToast('Password reset successful! Please login.', 'success');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(120deg, #e3eaeb 0%, #b7d6ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 1, sm: 0 } }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, width: { xs: '100%', sm: 370 }, maxWidth: 420, borderRadius: 4, boxShadow: 8, background: 'rgba(255,255,255,0.98)' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#457B9D', letterSpacing: 1, textAlign: 'center', fontSize: { xs: 22, sm: 26 } }}>Reset Password</Typography>
        <Typography variant="body2" sx={{ color: '#888', mb: 3, textAlign: 'center', fontSize: { xs: 13, sm: 15 } }}>Enter your new password</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            size="medium"
            InputProps={{ sx: { fontSize: { xs: 14, sm: 16 } } }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            size="medium"
            InputProps={{ sx: { fontSize: { xs: 14, sm: 16 } } }}
          />
          {error && <Typography color="error" sx={{ mb: 1, fontSize: { xs: 13, sm: 14 } }}>{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#457B9D',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              py: 1.2,
              mb: 2,
              fontSize: { xs: 15, sm: 17 },
              letterSpacing: 1,
              boxShadow: 2,
              '&:hover': { bgcolor: '#35607a' }
            }}
          >
            RESET PASSWORD
          </Button>
        </form>
      </Paper>
    </Box>
  );
} 