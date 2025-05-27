import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/wishlist.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        withCredentials: true,
      });

      // Ensure the response is an array
      const data = Array.isArray(res.data) ? res.data : [];
      setWishlistItems(data);
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setError("Failed to load wishlist.");
      setWishlistItems([]); // fallback to empty array on error
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        withCredentials: true,
      });
      setWishlistItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const handleNavigate = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="wishlist-page-body">
      <h2 className="wishlist-title">My Wishlist</h2>

      <div className="wishlist-container">
        {error && <p style={{ color: "red" }}>{error}</p>}
        {wishlistItems.length === 0 ? (
          <p>No items in wishlist.</p>
        ) : (
          wishlistItems.map((item) => (
            <div key={item.product_id} className="wishlist-item">
              <div
                className="wishlist-item-content"
                onClick={() => handleNavigate(item.product_id)}
              >
                {item.Product?.Images?.[0]?.image_url && (
                  <img
                    src={item.Product.Images[0].image_url}
                    alt={item.Product.Images[0].alt_text || "Product Image"}
                    className="wishlist-item-image"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100x100?text=No+Image";
                    }}
                  />
                )}
                <div className="wishlist-item-details">
                  <h3>{item.Product?.name}</h3>
                  <p>${item.Product?.price}</p>
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemove(item.product_id)}
              >
                ❌ Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
