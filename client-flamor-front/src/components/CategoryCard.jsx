import React, { useState } from "react";
import axios from "axios";
import "../adminstyle/AdminCategoryCard.css";

const CategoryCard = ({ category, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // For image URL input
  const [useUrl, setUseUrl] = useState(false);  // Toggle between file / url

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);

      if (useUrl && imageUrl) {
        formData.append("background_image_url", imageUrl); // Send URL as string field
        console.log("Using image URL:", imageUrl);
      } else if (imageFile) {
        formData.append("files", imageFile); //backend expects "files"
        console.log("Using image file:", imageFile.name);
      } else {
        console.log("No new image provided, keeping existing");
      }

      console.log("Sending update request for category id:", category.id);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.put(
        `http://localhost:5000/api/categories/${category.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("Update response:", response.data);
      onUpdate(); // Refresh list from parent
      setIsEditing(false);
      setImageFile(null);
      setImageUrl("");
      setUseUrl(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update category.");
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
            <button type="submit" className="category-button edit">
              Save
            </button>
            <button
              type="button"
              className="category-button delete"
              onClick={() => {
                setIsEditing(false);
                setImageFile(null);
                setImageUrl("");
                setUseUrl(false);
                setName(category.name); // reset
              }}
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
