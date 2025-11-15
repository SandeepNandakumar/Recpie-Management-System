import React, { useEffect, useState } from "react";
import CardRow from "./Cards";
import Navbar from "./navbar";
import axios from "axios";

function UserFeed() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("recipetoken"); // ✅ get token correctly
      const response = await axios.get("https://localhost:44323/api/User/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token with header if needed
        },
      });
      console.log("✅ API Response:", response.data);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div
      style={{
        backgroundImage: "url('/images/add.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      {/* Optional overlay for readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 0,
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        <div className="container mt-5">
          <h1
            className="text-center mb-5"
            style={{
              color: "#fff",
              fontFamily: "Poppins, sans-serif",
              fontWeight: "600",
              fontSize: "2.5rem",
              textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            User Feed
          </h1>

          {/* ✅ Pass the fetched posts to CardRow */}
          <CardRow posts={posts} />
        </div>
      </div>
    </div>
  );
}

export default UserFeed;
