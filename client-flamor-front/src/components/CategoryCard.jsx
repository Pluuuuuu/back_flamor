import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "../adminstyle/AdminCategoryCard.css";

const CategoryCard = ({ category, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [useUrl, setUseUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);

      if (useUrl && imageUrl.trim()) {
        // If using image URL input
        formData.append("background_image_url", imageUrl.trim());
        console.log("Using image URL:", imageUrl.trim());
      } else if (imageFile) {
        // If using uploaded file
        formData.append("files", imageFile);
        console.log("Using image file:", imageFile.name);
      } else {
        console.log("No new image provided, keeping existing");
        // Do NOT append any image field — backend will keep existing image URL
      }

      console.log("Sending update request for category id:", category.id);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axiosInstance.put(
        `http://localhost:5000/api/categories/${category.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("Update response:", response.data);
      onUpdate(); // Notify parent to refresh categories
      setIsEditing(false);
      setImageFile(null);
      setImageUrl("");
      setUseUrl(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-card">
      <img src={category.background_image_url} alt={category.name} />
      <p className="category-id">ID: {category.id}</p>

      {isEditing ? (
        <form
          className="category-edit-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            required
          />

          <div>
            <label>
              <input
                type="radio"
                checked={!useUrl}
                onChange={() => setUseUrl(false)}
              />
              Upload Image
            </label>
            <label>
              <input
                type="radio"
                checked={useUrl}
                onChange={() => setUseUrl(true)}
              />
              Image URL
            </label>
          </div>

          {!useUrl ? (
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              accept="image/*"
            />
          ) : (
            <input
              type="text"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          )}

          <div className="category-edit-form-actions">
            <button
              type="submit"
              className="category-button edit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="category-button delete"
              onClick={() => {
                setIsEditing(false);
                setImageFile(null);
                setImageUrl("");
                setUseUrl(false);
                setName(category.name);
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="category-info">
          <h2 className="category-name">{category.name}</h2>
          <div className="category-buttons">
            <button
              className="category-button edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="category-button delete"
              onClick={() => onDelete(category.id)}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
