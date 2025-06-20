import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export default function OtpVerification() {
  const [otpInput, setOtpInput] = useState("");
  console.log(typeof otpInput);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {

    e.preventDefault();
    // const otpData = JSON.parse(localStorage.getItem('resetOtp') || '{}');
    // if (!otpData.otp || !otpData.email) {
    //   setError('No OTP request found. Please try again.');
    //   showToast('No OTP request found. Please try again.', 'error');
    //   navigate('/forgot-password');
    //   return;
    // }
    // if (Date.now() > otpData.expires) {
    //   setError('OTP expired. Please request a new one.');
    //   showToast('OTP expired. Please request a new one.', 'error');
    //   navigate('/forgot-password');
    //   return;
    // }
    // if (otpInput !== otpData.otp) {
    //   setError('Invalid OTP. Please try again.');
    //   showToast('Invalid OTP. Please try again.', 'error');
    //   return;
    // }
    // OTP is correct
    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-otp/",
        {
          otp: parseInt(otpInput),
        }
      );
      console.log(response, "res");
      if (response.status === 200) {
        showToast("OTP verified! Please reset your password.", "success");
        navigate("/reset-password");
      }
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      showToast("Invalid OTP. Please try again.", "error");
      return;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(120deg, #e3eaeb 0%, #b7d6ee 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 1, sm: 0 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          width: { xs: "100%", sm: 370 },
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: 8,
          background: "rgba(255,255,255,0.98)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: "#457B9D",
            letterSpacing: 1,
            textAlign: "center",
            fontSize: { xs: 22, sm: 26 },
          }}
        >
          OTP Verification
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#888",
            mb: 3,
            textAlign: "center",
            fontSize: { xs: 13, sm: 15 },
          }}
        >
          Enter the OTP sent to your email
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="OTP"
            type="text"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            autoFocus
            size="medium"
            InputProps={{
              sx: { fontSize: { xs: 14, sm: 16 }, letterSpacing: 4 },
            }}
          />
          {error && (
            <Typography
              color="error"
              sx={{ mb: 1, fontSize: { xs: 13, sm: 14 } }}
            >
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#457B9D",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 2,
              py: 1.2,
              mb: 2,
              fontSize: { xs: 15, sm: 17 },
              letterSpacing: 1,
              boxShadow: 2,
              "&:hover": { bgcolor: "#35607a" },
            }}
          >
            VERIFY OTP
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
