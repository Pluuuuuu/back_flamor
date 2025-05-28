import axiosInstance from "./axiosInstance";

// Fetch all products with optional filters
export const fetchAllProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category) {
    params.append("category", filters.category);
  }
  if (filters.minPrice !== undefined) {
    params.append("minPrice", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    params.append("maxPrice", filters.maxPrice);
  }
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.page) {
    params.append("page", filters.page);
  }
  if (filters.sortBy) {
    params.append("sortBy", filters.sortBy);
  }
  if (filters.sortOrder) {
    params.append("sortOrder", filters.sortOrder);
  }

  const response = await axiosInstance.get(`/api/products?${params.toString()}`);
  return response.data;
};


// Fetch product by ID
export const fetchProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};


export const fetchBestSellers = async (productId) => {
  const response = await axiosInstance.get(`/api/products/best-sellers`);
  return response.data;
};

//  Create a product (requires formData for images & variants)
export const createProduct = async (formData) => {
  const response = await axiosInstance.post("/api/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true, // required for sending cookies
  });
  return response.data;
};

//  Update a product by ID
export const updateProduct = async (productId, updateData) => {
  const response = await axiosInstance.put(
    `/api/products/${productId}`,
    updateData,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

//  Delete a product by ID
export const deleteProduct = async (productId) => {
  const response = await axiosInstance.delete(`/api/products/${productId}`, {
    withCredentials: true,
  });
  return response.data;
};
