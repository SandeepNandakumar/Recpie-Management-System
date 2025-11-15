import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("recipetoken");
    // const userId = localStorage.getItem("userId");

    if (!token) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }

    axios
      .get("https://localhost:44323/api/User/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRecipes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    const token = localStorage.getItem("recipetoken");

    try {
      await axios.delete(`https://localhost:44323/api/User/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Recipe deleted successfully!");
      setRecipes(recipes.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete recipe.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/addrecipe/${id}`);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/add.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "relative",
        paddingBottom: "50px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 0,
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        <div className="container mt-5">
          <h1
            className="text-center mb-5 text-white"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "600",
              textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            My Recipes
          </h1>

          {loading ? (
            <p className="text-center text-white">Loading recipes...</p>
          ) : recipes.length === 0 ? (
            <p className="text-center text-white">No recipes found.</p>
          ) : (
            <div className="row">
              {recipes.map((recipe) => (
                <div className="col-md-4 mb-4" key={recipe.id}>
                  <div className="card shadow-sm">
                    <img
                      src={recipe.image || "/images/placeholder.jpg"}
                      className="card-img-top"
                      alt={recipe.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{recipe.title}</h5>
                      <p className="card-text text-muted">
                        Difficulty: {recipe.difficulty} <br />
                        Time: {recipe.preparationTime} mins
                      </p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(recipe.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(recipe.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
