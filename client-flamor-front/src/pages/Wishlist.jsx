import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchWishlist,
  removeFromWishlist,
  addToWishlist,
} from "../api/wishlistApi";
import { addToCart } from "../api/cart";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import Button from "../components/Button";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist();
        setWishlist(data);
      } catch (err) {
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, []);

  const [addingIds, setAddingIds] = useState({});

  const handleAddToCart = async (wishlistId, productId) => {
    if (addingIds[productId]) return; // prevent double click
    setAddingIds((prev) => ({ ...prev, [productId]: true }));
    try {
      await addToCart(productId, 1);
      await refreshCart();
      await handleRemoveFromWishlist(wishlistId);
      toast.success("Added to cart and removed from wishlist");
    } catch (err) {
      toast.error("product already in cart");
    } finally {
      setAddingIds((prev) => ({ ...prev, [productId]: false }));
    }
  };

 
  
  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId);
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (loading) return <p>Loading wishlist...</p>;
  if (!wishlist.length) return <p>Your wishlist is empty.</p>;

  return (
    <div
      className="wishlist-container"
      styles={{ minHeight: "calc(100vh - 3.5rem - 2.5rem)", maxWidth: "900px", margin: "auto", padding: "20px" }}
    >
      <h2 >Your Wishlist</h2>
      <ul>
        {wishlist.map((item) => (
          <li key={item.id} >
            <div

              onClick={() => navigate(`/product/${item.Product.id}`)}
            >
              <p >{item.Product.name}</p>
              <p>Price: ${item.Product.price}</p>
            </div>
            <div >
              <Button
                onClick={() => handleAddToCart(item.id, item.Product.id)}
                text={addingIds[item.Product.id] ? "Adding..." : "Add to Cart"}
                disabled={addingIds[item.Product.id]}
              />
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}

              >
                Remove
              </button>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
