import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout
  const logoutHandler = () => {
    // Remove token and any stored user info
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userid");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold fs-4" to="/">
        Recipe
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/userprofile">
              Profile
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/addrecipe">
              Add Recipe
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/changepassword">
              Change Password
            </Link>
          </li>
          <li className="nav-item mx-2">
            <button
              onClick={logoutHandler}
              className="btn btn-link nav-link text-danger fw-semibold"
              style={{ textDecoration: "none" }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
