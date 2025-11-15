import React, { useState } from "react";
import Navbar from "./navbar";
import axios from "axios";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    const token = localStorage.getItem("recipetoken");
    if (!token) {
      setMessage("User not logged in");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:44323/api/User/ChangePassword",
        {
         OldPassword: currentPassword,
         NewPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Error changing password");
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: "url('/images/add.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="card shadow-lg"
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "30px",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            border: "none",
          }}
        >
          <h2 className="text-center mb-4">Change Password</h2>

          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmNewPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmNewPassword"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-warning w-100">
              Change Password
            </button>
          </form>

          {message && (
            <p className="text-center mt-3" style={{ color: "red" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
