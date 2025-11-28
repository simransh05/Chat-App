import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/Api";

import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }


  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if(!passwordRegex.test(formData.password)){
      alert('invalid type! must be 8–15 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      if (!isValidEmail(formData.email)) {
        alert("Please enter a valid email!");
        return;
      }
      await api.createUser(formData);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      borderRadius={"5px"}
      fontFamily={"'Times New Roman', Times, serif"}
      mt={5}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "350px" }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Signup
        </Typography>

        <form onSubmit={handleSignup}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            Signup
          </Button>
        </form>

        <Typography mt={2} textAlign="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Signup;
