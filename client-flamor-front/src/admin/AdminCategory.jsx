import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import CategoryCard from "../components/CategoryCard";
import "../adminstyle/AdminCategory.css";

const AdminCategories = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:5000/api/categories", {
        withCredentials: true,
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Please provide a category name");
    if (!imageFile) return alert("Please upload an image");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("files", imageFile);

      await axiosInstance.post("http://localhost:5000/api/categories", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setName("");
      setImageFile(null);
      setFileInputKey(Date.now());
      fetchAllCategories();
    } catch (err) {
      console.error("Failed to add category", err);

      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data?.error?.toLowerCase().includes("already exists")
      ) {
        alert("Category name already exists. Please choose a different name.");
      } else {
        alert("Error creating category");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axiosInstance.delete(`http://localhost:5000/api/categories/${id}`, {
        withCredentials: true,
      });
      fetchAllCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Error deleting category");
    }
  };

  return (
    <div className="admin-categories-container">
      <h1>Manage Categories</h1>

      <form onSubmit={handleAddCategory} className="add-category-form">
        <div>
          <label>Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>

        <div>
          <label>Upload Image</label>
          <input
            key={fileInputKey}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files?.[0] || null)
            }
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      <div className="categories-grid">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onDelete={handleDelete}
            onUpdate={fetchAllCategories}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;