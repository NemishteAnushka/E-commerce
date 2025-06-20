import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
//     const users = JSON.parse(localStorage.getItem("users") || "[]");
//     const user = users.find((u) => u.username === email);
// console.log(user)
//     if (!user) {
//       setError("No account found with this email");
//       showToast("No account found with this email", "error");
//       return;
//     }

    // // Generate a 6-digit OTP
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // localStorage.setItem('resetOtp', JSON.stringify({
    //   otp,
    //   email,
    //   expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    // }));

    const response = await axios.post(
      "http://127.0.0.1:8000/api/send-otp/",
      {
        email: email,
      },
     
    );
    console.log("res",response.data)

    if (response.status === 200) {
      showToast("OTP sent to your email (simulated)", "success");
      navigate("/otp-verification");
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
          Forgot Password
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
          Enter your email to reset your password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            autoFocus
            size="medium"
            InputProps={{ sx: { fontSize: { xs: 14, sm: 16 } } }}
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
            SEND OTP
          </Button>
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#888",
              fontSize: { xs: 13, sm: 14 },
            }}
          >
            Remember your password?{" "}
            <span
              style={{ color: "#457B9D", cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
