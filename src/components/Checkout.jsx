import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Grid, TextField, Button, Paper,
  Divider, MenuItem, Checkbox, FormControlLabel, Stepper,
  Step, StepLabel, Card, CardContent, useTheme, useMediaQuery,
  IconButton, Alert, Fade
} from '@mui/material';
import { clearCart } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const countries = ['India', 'USA', 'UK', 'Germany', 'France', 'Australia'];

export default function Checkout() {
  const cart = useSelector(state => state.products.cart);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0; // Free shipping
  const tax = total * 0.1; // 10% tax
  const finalTotal = total + shipping + tax;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'warning');
      navigate('/');
    }
  }, [cart, navigate, showToast]);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    newsletter: false,
    shipToSame: false,
  });
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'Required';
    if (!form.lastName) newErrors.lastName = 'Required';
    if (!form.email) newErrors.email = 'Required';
    if (!form.phone) newErrors.phone = 'Required';
    if (!form.address) newErrors.address = 'Required';
    if (!form.city) newErrors.city = 'Required';
    if (!form.zip) newErrors.zip = 'Required';
    if (!form.country) newErrors.country = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleContinue = async () => {
    if (step === 0 && !validate()) return;
    if (step === 2) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOrderPlaced(true);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        dispatch(clearCart({ username: currentUser.username }));
        showToast('Order placed successfully!', 'success');
        navigate('/');
      } catch (error) {
        showToast('Failed to place order. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  if (orderPlaced) {
    return (
      <Fade in={true}>
        <Box sx={{
          maxWidth: 900,
          mx: 'auto',
          mt: 4,
          p: 4,
          bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)',
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center'
        }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: '#457B9D', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, color: '#457B9D', fontWeight: 700 }}>
            Thank you for your order!
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Your order has been placed successfully.
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <Box sx={{
      maxWidth: 1200,
      mx: 'auto',
      mt: { xs: 2, sm: 3, md: 4 },
      p: { xs: 2, sm: 3 },
      minHeight: { xs: '100vh', md: 'auto' },
      bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)'
    }}>
      <Paper sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)',
        '& .MuiCard-root': {
          bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)'
        }
      }}>
        <Typography variant="h4" sx={{
          mb: 4,
          textAlign: 'center',
          color: '#457B9D',
          fontWeight: 700
        }}>
          Checkout
        </Typography>

        <Stepper
          activeStep={step}
          alternativeLabel
          sx={{
            mb: 4,
            '& .MuiStepLabel-label': {
              color: '#457B9D',
              fontWeight: 500
            },
            '& .MuiStepIcon-root': {
              color: '#000',
              '&.Mui-active': {
                color: '#000'
              }
            }
          }}
        >
          <Step>
            <StepLabel icon={<ShoppingCartIcon />}>Cart Review</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<LocalShippingIcon />}>Shipping</StepLabel>
          </Step>
          <Step>
            <StepLabel icon={<PaymentIcon />}>Payment</StepLabel>
          </Step>
        </Stepper>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={7}>
            {step === 0 && (
              <Card sx={{ mb: 3, bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, color: '#457B9D' }}>
                    Shipping Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#457B9D'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#457B9D'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#457B9D'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#457B9D'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.address}
                        helperText={errors.address}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#457B9D'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#457B9D'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="ZIP Code"
                        name="zip"
                        value={form.zip}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.zip}
                        helperText={errors.zip}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#457B9D'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Country"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.country}
                        helperText={errors.country}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#457B9D'
                            }
                          }
                        }}
                      >
                        <MenuItem value="">Select...</MenuItem>
                        {countries.map(c => (
                          <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {step === 1 && (
              <Card sx={{ mb: 3, bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, color: '#457B9D' }}>
                    Shipping Method
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: '2px solid #457B9D',
                        '&:hover': {
                          bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Standard Shipping
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Delivery in 3-5 business days
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#457B9D', mt: 1 }}>
                        Free
                      </Typography>
                    </Paper>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Express Shipping
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Delivery in 1-2 business days
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#457B9D', mt: 1 }}>
                        $9.99
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card sx={{ mb: 3, bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3, color: '#457B9D' }}>
                    Payment Method
                  </Typography>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    This is a demo checkout. No actual payment will be processed.
                  </Alert>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: '2px solid #457B9D',
                        '&:hover': {
                          bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Credit/Debit Card
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay with your credit or debit card
                      </Typography>
                    </Paper>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        PayPal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay with your PayPal account
                      </Typography>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 3,
              gap: 2
            }}>
              {step > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    color: '#457B9D',
                    borderColor: '#457B9D',
                    '&:hover': {
                      borderColor: '#35607a',
                      bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)'
                    }
                  }}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleContinue}
                endIcon={<ArrowForwardIcon />}
                disabled={loading}
                sx={{
                  bgcolor: '#457B9D',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#35607a'
                  },
                  flex: 1
                }}
              >
                {loading ? 'Processing...' : step === 2 ? 'Place Order' : 'Continue'}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)', position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, color: '#457B9D' }}>
                  Order Summary
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {cart.map(item => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        p: 1,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'linear-gradient(135deg, #b3e0ea 0%, #5b90a7 100%)'
                        }
                      }}
                    >
                      <img
                        src={item.image || 'https://via.placeholder.com/60'}
                        alt={item.title}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 4,
                          marginRight: 12
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.qty} × ${item.price}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#457B9D' }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Subtotal</Typography>
                    <Typography>${total.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Shipping</Typography>
                    <Typography sx={{ color: 'success.main' }}>Free</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Tax (10%)</Typography>
                    <Typography>${tax.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" sx={{ color: '#457B9D' }}>
                      ${finalTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
