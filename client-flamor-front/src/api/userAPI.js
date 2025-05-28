// src/api/userAPI.js
import axiosInstance from "./axiosInstance";

// Get current user
export const getUserProfile = async () => {
  const res = await axiosInstance.get("/api/users/me");
  return res.data;
};

// Update user profile
export const updateUserProfile = async (data) => {
  const res = await axiosInstance.put("/api/users/me", data);
  return res.data;
};

// Upload profile image
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await axiosInstance.post("/api/users/me/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  const res = await axiosInstance.put("/api/users/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};


// Admin: Fetch all users
export const fetchAllUsers = async () => {
  const res = await axiosInstance.get("/api/users", { withCredentials: true });
  return res.data;
};

// Admin: Get single user by ID
export const getSingleUser = async (id) => {
  const res = await axiosInstance.get(`/api/users/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

// Admin: Update user by ID
export const updateUser = async (id, data) => {
  const res = await axiosInstance.put(`/api/users/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

// Admin: Delete user by ID
export const deleteUser = async (id) => {
  const res = await axiosInstance.delete(`/api/users/${id}`, {
    withCredentials: true,
  });
  return res.data;
};


