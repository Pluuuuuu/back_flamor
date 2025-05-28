import axiosInstance from "./axiosInstance";

// Add product to wishlist
export const addToWishlist = async (product_id) => {
  const response = await axiosInstance.post(
    `/api/wishlist`,
    { product_id },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Get wishlist for current user
export const fetchWishlist = async () => {
  const response = await axiosInstance.get(`/api/wishlist`, {
    withCredentials: true,
  });
  return response.data;
};

export const removeFromWishlist = async (wishlist_id) => {
  const response = await axiosInstance.delete(`/api/wishlist/${wishlist_id}`, {
    withCredentials: true,
  });
  return response.data;
};
