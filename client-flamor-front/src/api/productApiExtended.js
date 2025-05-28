import axiosInstance from "./axiosInstance";

// Product Color APIs
export const fetchAllProductColors = async () => {
  const response = await axiosInstance.get("/api/productColors");
  return response.data;
};

// Updated createProductColor to accept FormData and send multipart/form-data
export const createProductColor = async (formData) => {
  const response = await axiosInstance.post("/api/productColors", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return response.data;
};

export const updateProductColor = async (colorId, updateData) => {
  const response = await axiosInstance.put(
    `/api/productColors/${colorId}`,
    updateData,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const deleteProductColor = async (colorId) => {
  const response = await axiosInstance.delete(`/api/productColors/${colorId}`, {
    withCredentials: true,
  });
  return response.data;
};

// Product Variant APIs
export const fetchAllVariants = async (productId) => {
  const params = new URLSearchParams();
  if (productId) {
    params.append("product_id", productId);
  }
  const response = await axiosInstance.get(
    `/api/variants?${params.toString()}`
  );
  return response.data;
};

export const createVariant = async (variantData) => {
  const response = await axiosInstance.post("/api/variants", variantData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return response.data;
};

export const updateVariant = async (variantId, updateData) => {
  const response = await axiosInstance.put(
    `/api/variants/${variantId}`,
    updateData,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const deleteVariant = async (variantId) => {
  const response = await axiosInstance.delete(`/api/variants/${variantId}`, {
    withCredentials: true,
  });
  return response.data;
};
