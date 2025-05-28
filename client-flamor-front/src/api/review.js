import axiosInstance from "./axiosInstance";

// Fetch all reviews for a product by product ID
export const fetchReviewsByProductId = async (productId) => {
  const response = await axiosInstance.get(`/api/reviews/product/${productId}`);
  return response.data;
};

// Post a new review
export const postReview = async (review) => {
  const response = await axiosInstance.post(`/api/reviews/add`, review, {
    withCredentials: true,
  });
  return response.data;
};

// Admin: Fetch all reviews
export const fetchAllReviews = async () => {
  const response = await axiosInstance.get("/api/reviews", { withCredentials: true });
  return response.data;
};

// Admin: Delete review by ID
export const deleteReview = async (id) => {
  const response = await axiosInstance.delete(`/api/reviews/${id}`, { withCredentials: true });
  return response.data;
};
