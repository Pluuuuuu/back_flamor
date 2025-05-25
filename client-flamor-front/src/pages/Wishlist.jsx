import { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    loadWishlist();
  }, []);

  return (
    <div>
      <h2>My Wishlist</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        wishlistItems.map((item) => (
          <div key={item.product_id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
            <h3>{item.Product?.name}</h3>
            <p>${item.Product?.price}</p>
            {item.Product?.Images?.length > 0 && (
              <img
                src={item.Product.Images[0].image_url}
                alt={item.Product.Images[0].alt_text || "Product Image"}
                width={100}
                onError={(e) => (e.target.src = "https://placehold.co/100x100?text=No+Image")}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;
