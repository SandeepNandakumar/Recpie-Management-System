import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";

function ViewDetails() {
  const { id } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("recipetoken");

    if (id) {
      // 1️⃣ Increment view count
      axios
        .post(
          `https://localhost:44323/api/User/viewcount/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log("View count incremented:", response.data);
        })
        .catch((error) => {
          console.error("Error updating view count:", error);
        });

      // 2️⃣ Fetch recipe details
      axios
        .get(`https://localhost:44323/api/User/GetById/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setPost(response.data);
        })
        .catch((error) => {
          console.error("Error fetching recipe:", error);
        });
    }
  }, [id]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/add.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Background Overlay */}
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

      {/* Page Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        <div className="d-flex justify-content-center align-items-start py-5">
          <div
            className="card shadow-lg"
            style={{
              maxWidth: "700px",
              width: "100%",
              borderRadius: "15px",
              overflow: "hidden",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <img
              src={post.image}
              alt="Recipe"
              className="card-img-top"
              style={{ height: "300px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h2 className="card-title mb-3">{post.title}</h2>

              <div className="mb-3">
                <strong>Preparation Time:</strong> {post.preparationTime} minutes
              </div>
              <div className="mb-3">
                <strong>Difficulty:</strong> {post.difficulty}
              </div>

              <div className="mb-3">
                <h5>Ingredients:</h5>
                <p>{post.ingredients}</p>
              </div>

              <div className="mb-3">
                <h5>Steps:</h5>
                <p>{post.steps}</p>
              </div>

              {post.viewCount !== undefined && (
                <div className="mt-4 text-muted">
                  👁 <strong>{post.viewCount}</strong> views
                </div>
              )}

              {/* Optionally, you can add edit/delete buttons here */}
              {/* <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-warning px-4">Edit</button>
                <button className="btn btn-danger px-4">Delete</button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewDetails;
