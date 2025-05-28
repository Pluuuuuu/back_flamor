import React, { useEffect, useState } from "react"
import { fetchReviewsByProductId, postReview } from "../api/review"
import { FaStar } from "react-icons/fa"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import "./ProductReviews.css"

const ProductReviews = ({ productId }) => {
  const { user, isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Review form state
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const data = await fetchReviewsByProductId(productId)
        setReviews(data)
        // toast.success("Reviews loaded successfully");
      } catch (error) {
        toast.error("Failed to load reviews")
        console.error("Failed to load reviews", error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) fetchReviews()
  }, [productId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error("Please login to submit a review.")
      return
    }

    try {
      setSubmitting(true)
      const newReview = {
        productId,
        rating,
        comment,
      }
      await postReview(newReview)

      toast.success("Review submitted!")
      setComment("")
      setRating(0)

      const updated = await fetchReviewsByProductId(productId)
      setReviews(updated)
    } catch (error) {
      toast.error("Failed to submit review.")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="product-reviews-container">
      <h2>Reviews</h2>

      {loading ? (
        <p className="loading-message">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet.</p>
      ) : (
        <>
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <h3 className="review-username">
                  {review.User?.name || "User"}
                </h3>
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Number(review.rating)
                          ? "star-filled"
                          : "star-empty"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </>
      )}

      <div className="review-form">
        <h3>Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    value={starValue}
                    onClick={() => setRating(starValue)}
                  />
                  <FaStar
                    className={
                      starValue <= (hover || rating)
                        ? "star-selected"
                        : ""
                    }
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              )
            })}
          </div>

          <textarea
            className="review-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            rows="5"
          />
          <button
            type="submit"
            disabled={submitting}
            className="review-submit-btn"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProductReviews
