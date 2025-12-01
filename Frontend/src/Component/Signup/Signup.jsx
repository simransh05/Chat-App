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
import { useSelector } from "react-redux";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;
  const users = useSelector((state) => state.user.users);
  const [passwordRules, setPasswordRules] = useState({
    lower: false,
    upper: false,
    number: false,
    length: false,
    symbol: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    if (name === "password") {
      setPasswordRules({
        lower: /[a-z]/.test(value),
        upper: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        length: value.length >= 8,
        symbol: /[\W_]/.test(value),
      });
    }
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

    if (!passwordRegex.test(formData.password)) {
      alert('invalid type! must be 8–15 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      if (!isValidEmail(formData.email)) {
        alert("Please enter a valid email!");
        return;
      }
      if (users.find(u => u.email == formData.email)) {
        return alert('Email already exists.')
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
          <h4>Password must contains :- </h4>
          <ul style={{ fontSize: "13px", marginTop: "5px", paddingLeft: "15px" }}>
            <li style={{ color: passwordRules.lower ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.lower ? "✔" : "✖"} At least one lowercase letter
            </li>
            <li style={{ color: passwordRules.upper ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.upper ? "✔" : "✖"} At least one uppercase letter
            </li>
            <li style={{ color: passwordRules.number ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.number ? "✔" : "✖"} At least one number
            </li>
            <li style={{ color: passwordRules.symbol ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.symbol ? "✔" : "✖"} At least one special character (# @ % $ ! & *)
            </li>
            <li style={{ color: passwordRules.length ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.length ? "✔" : "✖"} Minimum 8 characters
            </li>
          </ul>


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
          <h4>Password must contains :- </h4>
          <ul style={{ fontSize: "13px", marginTop: "5px", paddingLeft: "15px" }}>
            <li style={{ color: passwordRules.lower ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.lower ? "✔" : "✖"} At least one lowercase letter
            </li>
            <li style={{ color: passwordRules.upper ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.upper ? "✔" : "✖"} At least one uppercase letter
            </li>
            <li style={{ color: passwordRules.number ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.number ? "✔" : "✖"} At least one number
            </li>
            <li style={{ color: passwordRules.symbol ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.symbol ? "✔" : "✖"} At least one special character (# @ % $ ! & *)
            </li>
            <li style={{ color: passwordRules.length ? "green" : "red", listStyle: 'none' }}>
              {passwordRules.length ? "✔" : "✖"} Minimum 8 characters
            </li>
          </ul>

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
