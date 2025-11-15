import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddRecipe = () => {
  const { id } = useParams(); // if id exists → Edit mode
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ If editing, fetch existing recipe
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("recipetoken");
      if (!token) {
        alert("Please log in first!");
        navigate("/login");
        return;
      }

      axios
        .get(`https://localhost:44323/api/User/GetById/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const recipe = res.data;
          setTitle(recipe.title);
          setIngredients(recipe.ingredients);
          setSteps(recipe.steps);
          setPreparationTime(recipe.preparationTime);
          setDifficulty(recipe.difficulty);
          setImage(recipe.image || "");
        })
        .catch((err) => {
          console.error("Error fetching recipe:", err);
          alert("Failed to load recipe details");
        });
    }
  }, [id, navigate]);

  // ✅ Submit form for Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("recipetoken");
    if (!token) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }

    const recipeData = {
      title,
      ingredients,
      steps,
      preparationTime: parseInt(preparationTime),
      difficulty,
      image,
    };

    try {
      if (id) {
        // 🖊 Edit recipe
        await axios.put(`https://localhost:44323/api/User/${id}`, recipeData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Recipe updated successfully!");
      } else {
        // ➕ Add recipe
        await axios.post("https://localhost:44323/api/User/Add", recipeData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Recipe added successfully!");
      }

      navigate("/userprofile");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/add.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <div className="d-flex justify-content-center align-items-start pt-5 pb-5">
        <div
          className="card shadow-lg"
          style={{
            maxWidth: "600px",
            width: "100%",
            padding: "30px",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
          }}
        >
          <h2 className="text-center mb-4">
            {id ? "Edit Recipe" : "Add New Recipe"}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Recipe Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Ingredients */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Ingredients</label>
              <textarea
                className="form-control"
                rows="3"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Steps */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Steps</label>
              <textarea
                className="form-control"
                rows="4"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Time + Difficulty */}
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label fw-semibold">Preparation Time</label>
                <input
                  type="number"
                  className="form-control"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Difficulty</label>
                <select
                  className="form-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Image */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Recipe Image URL</label>
              <input
                type="text"
                className="form-control"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL or leave blank"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-success btn-lg px-4"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : id
                  ? "Update Recipe"
                  : "Add Recipe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
