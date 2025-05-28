// src/context/WishlistContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../api/wishlistApi";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await fetchWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishlist(productId);
      toast.success("Added to wishlist!");
      await loadWishlist();
    } catch (err) {
      toast.error( err.response?.data?.message || "Failed to add to wishlist." );
    }
  };

  const handleRemoveFromWishlist = async (product_id) => {
    try {
      await removeFromWishlist(product_id);
      toast.success("Removed from wishlist!");
      await loadWishlist();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove from wishlist.");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        handleAddToWishlist,
        handleRemoveFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
