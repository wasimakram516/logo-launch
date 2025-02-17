import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/assets/aims-logo.png"; // Make sure you have a logo asset

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.data.token); // Store token
        router.push("/admin"); // Redirect to CMS page
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Optional: Centered Logo */}
      <Image src={logo} alt="Logo" width={100} height={100} style={{ marginBottom: 16 }} />

      <Box sx={{ boxShadow: 3, p: 4, borderRadius: 3, textAlign: "center", bgcolor: "#ffffff", width: "100%" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Welcome Back
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            sx={{ borderRadius: 2 }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            sx={{ borderRadius: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: 2,
              bgcolor: "#1976D2",
              "&:hover": { bgcolor: "#1565C0" },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
