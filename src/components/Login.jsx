import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../contexts/RoleContext';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../slices/userSlice';
import { loadUserCart } from '../slices/cartSlice';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Divider, IconButton, Paper, InputAdornment } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useToast } from '../contexts/ToastContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { loginAs } = useRole();
  const dispatch = useDispatch();
  const reduxError = useSelector(state => state.user.error);
  const { showToast } = useToast();


const handleLogin = async (e) => {
  e.preventDefault();
  let valid = true;
  setUsernameError('');
  setPasswordError('');
  setError('');

  if (!username) {
    setUsernameError('Username is required');
    valid = false;
  }
  if (!password) {
    setPasswordError('Password is required');
    valid = false;
  } else if (password.length < 6) {
    setPasswordError('Password must be at least 6 characters');
    valid = false;
  }

  if (!valid) return;

  try {
    const tokenResponse = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!tokenResponse.ok) {
      const { detail } = await tokenResponse.json();
      setError(detail || 'Login failed');
      dispatch(loginFailure(detail || 'Login failed'));
      showToast(detail || 'Login failed', 'error');
      return;
    }

    const tokenData = await tokenResponse.json(); // { access, refresh }
    const { access, refresh } = tokenData;

    localStorage.setItem('accessToken', access);
    // localStorage.setItem('refreshToken', refresh);

    // 🔽 Now fetch user details using the access token
    const userResponse = await fetch('http://127.0.0.1:8000/api/user/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access}`,
        'Content-Type': 'application/json'
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json(); // Adjust fields as per your API
    console.log("userData",userData)
    // Map vendor role to seller for consistency
    // const normalizedRole = userData.role === 'vendor' ? 'seller' : userData.role;
    const user = {
      username: userData.username,
      role: userData.role,
      type: userData.role
    };
console.log("user",user)
    localStorage.setItem('currentUser', JSON.stringify(user));
    loginAs(user.role);
    dispatch(loginSuccess(user));
    dispatch(loadUserCart({ username: user.username }));

    showToast(`Welcome back, ${user.username}!`, 'success');
    if (user.role === 'vendor') {
      navigate('/seller');
    } else if (user.role === 'customer') {
      navigate('/buyer');
    } else {
      navigate('/');
    }

  } catch (err) {
    console.error('Login error:', err);
    setError('An unexpected error occurred.');
    dispatch(loginFailure('An unexpected error occurred.'));
    showToast('An unexpected error occurred.', 'error');
  }
};



  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(120deg, #e3eaeb 0%, #b7d6ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 1, sm: 0 } }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, width: { xs: '100%', sm: 370 }, maxWidth: 420, borderRadius: 4, boxShadow: 8, background: 'rgba(255,255,255,0.98)' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#457B9D', letterSpacing: 1, textAlign: 'center', fontSize: { xs: 22, sm: 26 } }}>Welcome Back</Typography>
        <Typography variant="body2" sx={{ color: '#888', mb: 3, textAlign: 'center', fontSize: { xs: 13, sm: 15 } }}>Login to your account</Typography>
        <form onSubmit={handleLogin}>
          <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth sx={{ mb: 1 }} autoFocus size="medium" InputProps={{ sx: { fontSize: { xs: 14, sm: 16 } } }} error={!!usernameError} helperText={usernameError} />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
            size="medium"
            InputProps={{
              sx: { fontSize: { xs: 14, sm: 16 } },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(s => !s)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={!!passwordError}
            helperText={passwordError}
          />
          {/* <FormControlLabel
            control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} sx={{ color: '#457B9D' }} />}
            label={<Typography variant="body2" sx={{ fontSize: { xs: 12, sm: 14 } }}>Remember me?</Typography>}
            sx={{ mb: 1 }}
          /> */}
          {error && <Typography color="error" sx={{ mb: 1, fontSize: { xs: 13, sm: 14 } }}>{error}</Typography>}
          {reduxError && <Typography color="error" sx={{ mb: 1, fontSize: { xs: 13, sm: 14 } }}>{reduxError}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ bgcolor: '#457B9D', color: '#fff', fontWeight: 700, borderRadius: 2, py: 1.2, mb: 1, mt: 1, fontSize: { xs: 15, sm: 17 }, letterSpacing: 1, boxShadow: 2, '&:hover': { bgcolor: '#35607a' } }}>
            LOGIN
          </Button>
          <Typography variant="body2" sx={{ color: '#888', textAlign: 'right', mb: 1, mt: -1, fontSize: { xs: 12, sm: 13 }, cursor: 'pointer' }} onClick={() => navigate('/forgot-password')}>
            Forgot Password?
          </Typography>
          {/* <Divider sx={{ my: 2 }}>OR</Divider> */}
          {/* <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <IconButton color="error" sx={{ bgcolor: '#fbe9e7', '&:hover': { bgcolor: '#ffcdd2' } }}><GoogleIcon /></IconButton>
            <IconButton color="primary" sx={{ bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}><FacebookIcon /></IconButton>
            <IconButton sx={{ color: '#1976d2', bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}><LinkedInIcon /></IconButton>
          </Box> */}
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#888', fontSize: { xs: 13, sm: 14 } }}>
            Need an account?{' '}
            <span style={{ color: '#457B9D', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/register')}>SIGN UP</span>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
