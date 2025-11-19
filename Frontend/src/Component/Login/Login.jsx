import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/Api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const alreadyUser = localStorage.getItem('login-info');
    if (alreadyUser) navigate('/chat')
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.createUserInfo(formData);
      const data = res.data;

      localStorage.setItem(
        "login-info",
        JSON.stringify({
          token: data.token,
          user: data.user,
        })
      );
      const info = JSON.parse(localStorage.getItem('login-info'))
      const userId = info.user.id;
      console.log("Login successful!");
      console.log(userId)
      if (info) {
        navigate(`/chat`);
      }
    } catch (err) {
      if (err.response?.status == '404') {
        navigate('/signup')
      } else {
        alert(err.response?.data?.message || "Login failed!");
      }

    }
  };


  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>Don’t have an account? <Link to="/signup">Signup</Link></p>
    </div>
  );
}

export default Login;
