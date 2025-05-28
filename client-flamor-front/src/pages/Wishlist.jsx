import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  fetchWishlist,
  removeFromWishlist,
  addToWishlist,
} from "../api/wishlistApi"
import { addToCart } from "../api/cart"
import { useCart } from "../context/CartContext"
import { toast } from "react-toastify"
import Button from "../components/Button"
import "../styles/Wishlist.css"

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { refreshCart } = useCart()

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist()
        setWishlist(data)
      } catch (err) {
        toast.error("Failed to load wishlist")
      } finally {
        setLoading(false)
      }
    }
    loadWishlist()
  }, [])

  const [addingIds, setAddingIds] = useState({})

  const handleAddToCart = async (wishlistId, productId) => {
    if (addingIds[productId]) return // prevent double click
    setAddingIds((prev) => ({ ...prev, [productId]: true }))
    try {
      await addToCart(productId, 1)
      await refreshCart()
      await handleRemoveFromWishlist(wishlistId)
      toast.success("Added to cart and removed from wishlist")
    } catch (err) {
      toast.error("product already in cart")
    } finally {
      setAddingIds((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleRemoveFromWishlist = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId)
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId))
      toast.success("Removed from wishlist")
    } catch (err) {
      toast.error("Failed to remove from wishlist")
    }
  }

  if (loading) return <p>Loading wishlist...</p>
  if (!wishlist.length) return <p>Your wishlist is empty.</p>

  return (<div
  className="wishlist-container"
  style={{
    minHeight: "calc(100vh - 3.5rem - 2.5rem)",
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
  }}
>
  <h2 className="wishlist-title">Your Wishlist</h2>

  {wishlist.length === 0 ? (
    <p className="empty-wishlist-msg">Your wishlist is empty.</p>
  ) : (
    <ul className="wishlist-list">
      {wishlist.map((item) => (
        <li key={item.id} className="wishlist-item">
          <div
            className="wishlist-item-info"
            onClick={() => navigate(`/product/${item.Product.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/product/${item.Product.id}`);
            }}
          >
            <p className="wishlist-item-name">{item.Product.name}</p>
            <p className="wishlist-item-price">
              Price: ${item.Product.price}
            </p>
          </div>

          <div className="wishlist-item-actions">
            {/* <Button
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering parent onClick
                handleAddToCart(item.id, item.Product.id);
              }}
              disabled={addingIds[item.Product.id]}
              className="btn-add-to-cart"
            >
              {addingIds[item.Product.id] ? "Adding..." : "Add to Cart"}
            </Button> */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromWishlist(item.id);
              }}
              className="btn-remove"
              aria-label={`Remove ${item.Product.name} from wishlist`}
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

  )
}
