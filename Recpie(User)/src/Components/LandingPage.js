import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate('');
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url('/images/login.jpg')", // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
      }}
    >
      {/* Website Name */}
      <h1 style={{ fontSize: "4rem", marginBottom: "10px" }}>🍽️ Recipe</h1>

      {/* Welcome Note */}
      <p
        style={{
          fontSize: "1.5rem",
          maxWidth: "600px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Welcome to <strong>Recipe</strong>! Discover, cook, and enjoy delicious
        dishes from around the world. Let’s make cooking fun and easy!
      </p>

      {/* Buttons */}
      <div>
        <button
          style={{
            padding: "12px 30px",
            margin: "10px",
            fontSize: "1.1rem",
            borderRadius: "30px",
            border: "none",
            backgroundColor: "#ff7043",
            color: "white",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#ff5722")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ff7043")}
          onClick={()=>navigate("/login")}
        >
          Login
        </button>

        <button
          style={{
            padding: "12px 30px",
            margin: "10px",
            fontSize: "1.1rem",
            borderRadius: "30px",
            border: "none",
            backgroundColor: "#66bb6a",
            color: "white",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#43a047")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#66bb6a")}
          onClick={()=>navigate('/register')}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
