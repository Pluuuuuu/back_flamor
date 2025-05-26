import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        withCredentials: true,
      });
      setWishlistItems(res.data);
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setError("Failed to load wishlist.");
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
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const handleNavigate = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div>
      <h2>My Wishlist</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        wishlistItems.map((item) => (
          <div
            key={item.product_id}
            style={{
              borderBottom: "1px solid #ccc",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div
              style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
              onClick={() => handleNavigate(item.product_id)}
            >
              {item.Product?.Images?.[0]?.image_url && (
                <img
                  src={item.Product.Images[0].image_url}
                  alt={item.Product.Images[0].alt_text || "Product Image"}
                  width={100}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100?text=No+Image";
                  }}
                />
              )}
              <div>
                <h3>{item.Product?.name}</h3>
                <p>${item.Product?.price}</p>
              </div>
            </div>
            <button onClick={() => handleRemove(item.product_id)} style={{ marginLeft: "auto" }}>
              ❌ Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
