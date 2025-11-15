import React from "react";
import { Link } from "react-router-dom";

const CardRow = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-light fs-5 mt-5">
        No posts available
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">
        {posts.map((post, index) => (
          <div className="col-md-4" key={index}>
            <div
              className="card h-100 shadow-lg"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,0,0,0.15)";
              }}
            >
              {/* ✅ Post Image */}
              <img
                src={
                  post.image ||
                  "https://via.placeholder.com/400x200?text=No+Image"
                }
                className="card-img-top"
                alt={post.title || "Post Image"}
                style={{ height: "200px", objectFit: "cover" }}
              />

              {/* ✅ Card Body */}
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{post.title || "Untitled Post"}</h5>
                  <p className="card-text text-muted">
                    {post.steps
                      ? post.steps.substring(0, 100) + "..."
                      : "No description available."}
                  </p>
                  {post.author && (
                    <p
                      className="text-secondary"
                      style={{ fontSize: "0.9rem" }}
                    >
                      👤 {post.author}
                    </p>
                  )}
                </div>

                {/* ✅ Corrected Link */}
                <Link
                  to={`/viewdetails/${post.id}`}
                  className="btn btn-info float-right"
                >
                  View More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardRow;
