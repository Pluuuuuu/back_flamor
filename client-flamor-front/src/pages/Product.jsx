import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import products from "../assets/products.json";
import "../styles/Product.css";

const Product = () => {
  const { id } = useParams(); // product id from url

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("desc");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Review form state
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState(null);
  const [addingReview, setAddingReview] = useState(false);

  // Check login by trying to fetch wishlist (or any protected route)
  const checkLoginStatus = async () => {
    try {
      await axios.get("http://localhost:5000/api/wishlist", {
        withCredentials: true,
      });
      setIsLoggedIn(true);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsLoggedIn(false);
      } else {
        console.error("Error checking login status:", err);
      }
    }
  };

  useEffect(() => {
    setProduct(products.find((p) => p.id === parseInt(id)) || null);

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/reviews/product/${id}`,
          { withCredentials: true }
        );
        setReviews(res.data || []);
      } catch (err) {
        console.error("Error loading reviews:", err);
      }
    };

    const checkWishlist = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/wishlist", {
          withCredentials: true,
        });
        const found = res.data.find(
          (item) => item.product_id === parseInt(id)
        );
        setInWishlist(!!found);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setInWishlist(false);
          setIsLoggedIn(false);
        } else {
          console.error("Error checking wishlist", err);
        }
      }
    };

    checkLoginStatus();
    fetchReviews();
    checkWishlist();
  }, [id]);

  const toggleWishlist = async () => {
    if (!isLoggedIn) {
      alert("Please login to use wishlist.");
      return;
    }
    try {
      if (inWishlist) {
        // Remove from wishlist
        await axios.delete(`http://localhost:5000/api/wishlist/${id}`, {
          withCredentials: true,
        });
        setInWishlist(false);
      } else {
        // Add to wishlist
        await axios.post(
          "http://localhost:5000/api/wishlist",
          { productId: id },
          { withCredentials: true }
        );
        setInWishlist(true);
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      alert("Could not update wishlist.");
    }
  };

  const addToCart = () => {
    alert("Add to cart logic goes here");
  };

  const submitReview = async () => {
    if (!reviewText.trim()) {
      setReviewError("Review cannot be empty.");
      return;
    }
    setReviewError(null);
    setAddingReview(true);

    try {
      await axios.post(
        "http://localhost:5000/api/reviews/add",
        { productId: id, text: reviewText },
        { withCredentials: true }
      );
      setReviewText("");
      // Refresh reviews after submit
      const res = await axios.get(
        `http://localhost:5000/api/reviews/product/${id}`,
        { withCredentials: true }
      );
      setReviews(res.data || []);
    } catch (err) {
      setReviewError("Failed to add review.");
      console.error("Error adding review:", err);
    }
    setAddingReview(false);
  };

  if (!product)
    return <div>Loading product details...</div>;

  return (
    <div className="product-page-container">
      <div className="product-section">
        <img
          src={product.image || "/default-product.png"}
          alt={product.name}
          className="product-image"
        />
        <div className="product-details">
          <h2>{product.name}</h2>
          <p className="price">${product.price.toFixed(2)}</p>
          <p>{product.desc}</p>
          <button className="add-to-cart" onClick={addToCart}>
            Add to cart
          </button>
          <button onClick={toggleWishlist} style={{ marginLeft: 10 }}>
            {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
          <p className="fine-print">Additional product details or fine print here.</p>
        </div>
      </div>

      <div className="toggle-wrapper">
        <div className="tab-header">
          <span
            className={`tab ${activeTab === "desc" ? "active" : ""}`}
            onClick={() => setActiveTab("desc")}
          >
            Description
          </span>
          <span
            className={`tab ${activeTab === "review" ? "active" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            Reviews
          </span>
        </div>

        <div className="tab-content">
          {activeTab === "desc" ? (
            <p>{product.desc}</p>
          ) : (
            <div>
              {reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} style={{ borderBottom: "1px solid #ccc", marginBottom: 8 }}>
                    <p><b>{r.userName || "Anonymous"}</b></p>
                    <p>{r.text}</p>
                  </div>
                ))
              )}

              {isLoggedIn ? (
                <div style={{ marginTop: 20 }}>
                  <h4>Add a review</h4>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review here..."
                    style={{ width: "100%" }}
                  />
                  {reviewError && <p style={{ color: "red" }}>{reviewError}</p>}
                  <button onClick={submitReview} disabled={addingReview}>
                    {addingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              ) : (
                <p>Please log in to add a review.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid" style={{ marginTop: 30 }}>
        <h3>More products</h3>
        {products
          .filter((p) => p.id !== product.id)
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default Product;
