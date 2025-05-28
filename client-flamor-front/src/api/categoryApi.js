import axios from "axios";
import axiosInstance from "./axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllCategories = async () => {
  const response = await axiosInstance.get("/api/categories");
  return response.data;
};

export const fetchCategoryById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching category with id ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
export const fetchCategories = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/categories", {
      withCredentials: true,
    });

    // Fix here: use correct property name
    return res.data
      .map(({ name, background_image_url }) => ({
        name,
        image: background_image_url, // alias it to `image` for consistent use
      }))
      .slice(0, 5); // Limit to 5 categories
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
};
export const createCategory = async (formData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/categories`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating category:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateCategory = async (id, data, token) => {
  try {
    const config = {
      withCredentials: true,
    };
    if (data instanceof FormData) {
      config.headers = {
        "Content-Type": "multipart/form-data",
      };
    }
    const response = await axios.put(
      `${BASE_URL}/api/categories/${id}`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating category with id ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};


export const deleteCategory = async (id, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/categories/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting category with id ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchProductsByCategory = async (categoryId, filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.minPrice !== undefined) {
      params.append("minPrice", filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      params.append("maxPrice", filters.maxPrice);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }

    const response = await axios.get(
      `${BASE_URL}/api/categories/${categoryId}/products?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching products for category id ${categoryId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
