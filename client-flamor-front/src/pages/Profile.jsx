import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingField, setEditingField] = useState(null);
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic") || ""
  );

  const navigate = useNavigate();

  // Axios instance configured for cookie usage
  const axiosInstance = axios.create({
    baseURL: "https://water-back-esh3.onrender.com/api",
    withCredentials: true,
  });

  useEffect(() => {
    axiosInstance
      .get("/users/profile")
      .then((res) => {
        setUser(res.data);
        setFormData({ name: res.data.name, email: res.data.email });
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        navigate("/login");
      });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateUserProfile = async (field) => {
    if (!formData[field].trim()) return;

    try {
      const response = await axiosInstance.put("/users/update", {
        [field]: formData[field],
      });
      setUser(response.data);
      setEditingField(null);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
        localStorage.setItem("profilePic", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("profilePic");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <label htmlFor="profilePicInput" className="profile-pic-label">
          <img
            src={profilePic || "/default-avatar.png"}
            alt="Profile"
            className="profile-pic"
          />
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>

        <div className="user-info">
          {["name", "email"].map((field) => (
            <div key={field} className="input-group">
              <p>{field === "name" ? "User Name" : "Email"}</p>
              {editingField === field ? (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <input
                  type="text"
                  value={user?.[field] || "N/A"}
                  className="input-field"
                  readOnly
                />
              )}
              {editingField === field ? (
                <button
                  onClick={() => updateUserProfile(field)}
                  className="save-button"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingField(field)}
                  className="edit-button"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
