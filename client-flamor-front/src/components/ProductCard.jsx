import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Heart } from "lucide-react"
import { toast } from "react-toastify"
import { addToCart } from "../api/cart"
import { addToWishlist } from "../api/wishlistApi"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import "../styles/ProductCard.css"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { refreshCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)

  const imageUrl =
    product.image_url ||
    (product.Images?.length > 0 && product.Images[0].image_url) ||
    ""
  const altText =
    product.alt_text ||
    (product.Images?.length > 0 && product.Images[0].alt_text) ||
    product.name

  const getImageUrl = (url) => {
    if (!url) return ""
    if (url.startsWith("http") || url.startsWith("https")) return url
    return `${BASE_URL}${url}`
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate("/AuthForm")
      return
    }
    if (addingToCart) return
    setAddingToCart(true)
    try {
      const productVariantId =
        product.product_variant_id || product.variant_id || null
      await addToCart(product.id, 1, productVariantId)
      refreshCart()
      toast.success("Product added to cart")
    } catch (err) {
      console.error("Failed to add product to cart", err)
      toast.error("Failed to add product to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleAddToWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate("/AuthForm")
      return
    }
    if (addingToWishlist) return
    setAddingToWishlist(true)
    try {
      await addToWishlist(product.id)
      toast.success("Added to wishlist")
    } catch (err) {
      toast.error("Failed to add to wishlist")
    } finally {
      setAddingToWishlist(false)
    }
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="image-wrapper">
          {imageUrl && (
            <picture>
              <source
                srcSet={getImageUrl(imageUrl).replace(
                  /\.(jpg|jpeg|png)$/i,
                  ".webp"
                )}
                type="image/webp"
              />
              <img
                src={getImageUrl(imageUrl)}
                alt={altText}
                className="product-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/150x150?text=No+Image"
                }}
              />
            </picture>
          )}
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            disabled={addingToCart}
          >
            <ShoppingCart size={16} />{" "}
            {addingToCart ? "Adding..." : "Add to cart"}
          </button>
        </div>
        <div className="hover-content">
          <div className="details">
            <h3>{product.name}</h3>
            <p>
              ${product.price ? Number(product.price).toFixed(2) : "N/A"}
            </p>
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToWishlist}
        className="favorite-btn"
        disabled={addingToWishlist}
        aria-label="Add to wishlist"
      >
        <Heart size={addingToWishlist ? 30 : 20} />
      </button>
    </div>
  )
}

export default ProductCard
