import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductCard = ({ product, token, addToCart }) => {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const res = await axios.get("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.find((item) => item.product_id === product.id);
        setInWishlist(!!found);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, [product.id, token]);

  const handleWishlistToggle = async () => {
    try {
      if (!inWishlist) {
        await axios.post(
          "http://localhost:5000/api/wishlist",
          { product_id: product.id }, {
  withCredentials: true
});

      } else {
        await axios.delete(`http://localhost:5000/api/wishlist/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setInWishlist(!inWishlist);
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  return (
    <div className="product-card">
      {/* Only image and name wrapped in Link for navigation */}
      <Link to={`/product/${product.id}`} className="product-link">
        <img
          src={product.image || product.images?.[0]?.url}
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://placehold.co/150x150?text=No+Image";
          }}
        />
        <h3>{product.name}</h3>
      </Link>

      <p>${product.price}</p>

      <button onClick={handleWishlistToggle} className="wishlist-btn">
        {inWishlist ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
      </button>

      <button onClick={() => addToCart(product.id)} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
