import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Paper,
  IconButton,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeFromCartAsync,
  updateCartItemAsync,
} from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error } = useSelector((state) => state.products);
  const [discount, setDiscount] = useState(0);
  const [code, setCode] = useState("");
  const [shipping, setShipping] = useState(5.0);
  const { showToast } = useToast();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      showToast("Please login to view your cart", "error");
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, navigate, showToast]);

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await dispatch(removeFromCartAsync(cartItemId)).unwrap();
      showToast("Item removed from cart", "success");
    } catch (error) {
      showToast(error.message || "Failed to remove item from cart", "error");
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(
        updateCartItemAsync({ cartItemId, quantity: newQuantity })
      ).unwrap();
    } catch (error) {
      showToast(error.message || "Failed to update quantity", "error");
    }
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + parseFloat(item.product_detail.price) * item.quantity,
    0
  );
  const total = subtotal - discount + shipping;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6">Your cart is empty.</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/buyer")}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  const handleCheckOut = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/checkout/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.data) {
        showToast("Checkout successful!", "success");
        window.location.href = "/checkout";
      }
      // navigate("/checkout")
    } catch (error) {
      console.error("Checkout error:", error);
      showToast("Checkout failed. Please try again.", "error");
    }
  };
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: 4,
        maxWidth: 1200,
        mx: "auto",
        my: { xs: 2, md: 5 },
        p: 0,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      <Grid container direction={{ xs: "column", md: "row" }}>
        {/* Cart Items Section */}
        <Grid item xs={12} md={8} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Your Cart
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              pb: 2,
              "&::-webkit-scrollbar": { height: 8 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#ccc",
                borderRadius: 4,
              },
            }}
          >
            {cart.map((item) => (
              <Box
                key={item.id}
                sx={{
                  minWidth: 300,
                  maxWidth: 320,
                  bgcolor: "#f9f9f9",
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Paper
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={`http://127.0.0.1:8000${item.product_detail.image}`}
                      alt={item.product_detail.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Paper>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.product_detail.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      {item.product_detail.description?.slice(0, 40)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <FaMinus />
                    </IconButton>
                    <Typography variant="body2" sx={{ mx: 1 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <FaPlus />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    €{" "}
                    {(
                      parseFloat(item.product_detail.price) * item.quantity
                    ).toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <IconButton onClick={() => handleRemoveFromCart(item.id)}>
                    <FaTrash />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Coupon */}
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              size="small"
              placeholder="Enter your code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              sx={{ width: { xs: "100%", sm: 200 } }}
            />
            <Button variant="outlined" onClick={() => setDiscount(5)}>
              Apply
            </Button>
          </Box>
          <Button variant="text" onClick={() => navigate("/")}>
            ← Continue Shopping
          </Button>
        </Grid>

        {/* Summary Section */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            bgcolor: "#fafafa",
            p: { xs: 2, md: 4 },
            borderTop: { xs: "1px solid #eee", md: "none" },
            borderLeft: { md: "1px solid #eee" },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Summary
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Items ({itemCount})</Typography>
            <Typography variant="body2">€ {subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Shipping</Typography>
            <Typography variant="body2">€ {shipping.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Discount</Typography>
            <Typography variant="body2">- € {discount.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Total
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              € {total.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#000",
              color: "#fff",
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              "&:hover": { bgcolor: "#333" },
            }}
            onClick={handleCheckOut}
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cart;
