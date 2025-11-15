import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [Username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  function registerUser(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const user = {
      Username: Username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };

    axios.post('https://localhost:44323/api/User/register', user)
      .then(response => {
        setErrorMessage('');
        navigate('/login');
      })
      .then(response=>{
            setErrorMessage('');
            navigate('/');
        }).catch(error=>{
            if(error.response.data.errors){
                setErrorMessage(Object.values(error.response.data.errors).join(' '));
            }else{
                setErrorMessage('Failed to connect to api');
            }
        })
    }

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
          maxWidth: "500px",
          width: "100%",
          padding: "30px",
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          border: "none",
        }}
      >
        <h2 className="text-center mb-4">Register</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              value={Username}
              onInput={(event) => setUserName(event.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onInput={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onInput={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onInput={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn btn-success w-100" onClick={registerUser}>
            Register
          </button>

          <p className="text-center mt-3">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
