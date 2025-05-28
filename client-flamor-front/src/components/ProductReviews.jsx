import React, { useEffect, useState } from "react";
import { fetchReviewsByProductId, postReview } from "../api/review";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const ProductReviews = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await fetchReviewsByProductId(productId);
        setReviews(data);
        // toast.success("Reviews loaded successfully");
      } catch (error) {
        toast.error("Failed to load reviews");
        console.error("Failed to load reviews", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to submit a review.");
      return;
    }

    try {
      setSubmitting(true);
      const newReview = {
        productId,
        rating,
        comment,
      };
      await postReview(newReview);

      toast.success("Review submitted!");
      setComment("");
      setRating(0);

      const updated = await fetchReviewsByProductId(productId);
      setReviews(updated);
    } catch (error) {
      toast.error("Failed to submit review.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>

      {/* Display Reviews */}
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border rounded-md bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium">{review.User?.name || "User"}</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      styles={{
                        color:
                          i < Number(review.rating) ? "#facc15" : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Form */}
      <div className="bg-gray-50 p-4 border rounded-md">
        <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    value={starValue}
                    onClick={() => setRating(starValue)}
                    className="hidden"
                    styles={{ display: "none" }}
                  />
                  <FaStar
                    size={24}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                    styles={{
                      cursor: "pointer",
                      color:
                        starValue <= (hover || rating) ? "#facc15" : "#e5e7eb",
                    }}
                  />
                </label>
              );
            })}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Write your review here..."
            rows="4"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductReviews;
