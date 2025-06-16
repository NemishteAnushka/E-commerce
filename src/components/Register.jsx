import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole, ROLES } from '../contexts/RoleContext';
import { Box, Typography, TextField, Button, Divider, IconButton, Paper, MenuItem, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../slices/userSlice';
import { useToast } from '../contexts/ToastContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(ROLES.BUYER);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();
  const { loginAs } = useRole();
  const dispatch = useDispatch();
  const reduxError = useSelector(state => state.user.error);
  const { showToast } = useToast();

  const handleRegister = (e) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setFullNameError('');
    setEmailError('');
    setPhoneError('');
    setError('');
    let valid = true;
    if (!fullName) {
      setFullNameError('Full Name is required');
      valid = false;
    }
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Invalid email address');
      valid = false;
    }
    if (!phone) {
      setPhoneError('Phone is required');
      valid = false;
    } else if (!/^\d{10,}$/.test(phone)) {
      setPhoneError('Phone must be at least 10 digits');
      valid = false;
    }
    if (!username) {
      setUsernameError('Username is required');
      valid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
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
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === username)) {
      setError('Username already exists');
      dispatch(loginFailure('Username already exists'));
      showToast('Username already exists', 'error');
      return;
    }
    const newUser = { username, password, role, fullName, email, phone };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showToast('Registration successful! Please login to continue.', 'success');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(120deg, #e3eaeb 0%, #b7d6ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 1, sm: 0 } }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, width: { xs: '100%', sm: 370 }, maxWidth: 420, borderRadius: 4, boxShadow: 8, background: 'rgba(255,255,255,0.98)' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#457B9D', letterSpacing: 1, textAlign: 'center', fontSize: { xs: 22, sm: 26 } }}>Create Account</Typography>
        <Typography variant="body2" sx={{ color: '#888', mb: 3, textAlign: 'center', fontSize: { xs: 13, sm: 15 } }}>Sign up to get started</Typography>
        <form onSubmit={handleRegister}>
          <TextField label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} fullWidth sx={{ mb: 1 }} size="medium" InputProps={{ sx: { fontSize: { xs: 14, sm: 16 } } }} error={!!fullNameError} helperText={fullNameError} />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 1 }} size="medium" InputProps={{ sx: { fontSize: { xs: 14, sm: 16 } } }} error={!!emailError} helperText={emailError} />
          <TextField label="Phone" value={phone} onChange={e => setPhone(e.target.value)} fullWidth sx={{ mb: 1 }} size="medium" InputProps={{ sx: { fontSize: { xs: 14, sm: 16 } } }} error={!!phoneError} helperText={phoneError} />
          <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth sx={{ mb: 1 }} autoFocus size="medium" InputProps={{ sx: { fontSize: { xs: 14, sm: 16 } } }} error={!!usernameError} helperText={usernameError} />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
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
          <TextField select label="Role" value={role} onChange={e => setRole(e.target.value)} fullWidth sx={{ mb: 2 }} size="medium" InputProps={{ sx: { fontSize: { xs: 14, sm: 16 } } }}>
            <MenuItem value={ROLES.BUYER}>Buyer</MenuItem>
            <MenuItem value={ROLES.SELLER}>Seller</MenuItem>
          </TextField>
          {error && <Typography color="error" sx={{ mb: 1, fontSize: { xs: 13, sm: 14 } }}>{error}</Typography>}
          {reduxError && <Typography color="error" sx={{ mb: 1, fontSize: { xs: 13, sm: 14 } }}>{reduxError}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ bgcolor: '#457B9D', color: '#fff', fontWeight: 700, borderRadius: 2, py: 1.2, mb: 2, mt: 1, fontSize: { xs: 15, sm: 17 }, letterSpacing: 1, boxShadow: 2, '&:hover': { bgcolor: '#35607a' } }}>
            SIGN UP
          </Button>
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#888', fontSize: { xs: 13, sm: 14 } }}>
            Need an account?{' '}
            <span style={{ color: '#457B9D', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>Sign In</span>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
