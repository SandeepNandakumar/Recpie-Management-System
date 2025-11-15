import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const attemptLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('https://localhost:44323/api/User/login', {
        username,
        password
      });

      const { token, isAdmin, isActive } = response.data;

      if (!token) {
        setErrorMessage("Invalid response from server — token missing.");
        return;
      }

      // 🔒 Check if admin
      if (isAdmin === true) {
        setErrorMessage("Admin cannot log in here.");
        return;
      }

      // 🚫 Check if inactive
      if (isActive === false) {
        setErrorMessage("Your account has been blocked by admin.");
        return;
      }

      // ✅ Store login info
      localStorage.setItem("recipetoken", token);
      localStorage.setItem("isAdmin", isAdmin);
      localStorage.setItem("isActive", isActive);

      console.log("✅ Login success:", { isAdmin, isActive });

      // 🚀 Redirect to user feed
      navigate("/userfeed");

    } catch (error) {
      console.error("❌ Login Error:", error);

      if (error.response?.data) {
        const { message, errors } = error.response.data;
        setErrorMessage(
          errors ? Object.values(errors).join(' ') :
          message || "Login failed. Please try again."
        );
      } else {
        setErrorMessage("No response from server. Check if API is running and CORS is enabled.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('/images/login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "30px",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          border: "none",
        }}
      >
        <h2 className="text-center mb-4">Login</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={attemptLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <p className="text-center mt-3">
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
