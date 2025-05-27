import React, { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "./ProductCard.css"
import { FaHeart, FaRegHeart } from "react-icons/fa"

const ProductCard = ({ product, addToCart, addToWishlist }) => {
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/wishlist", {
          withCredentials: true,
        })

        const wishlist = res.data.items || []
        const found = wishlist.find(
          (item) => String(item.product_id) === String(product.id)
        )
        setInWishlist(!!found)
      } catch (err) {
        console.error("Error fetching wishlist:", err)
      }
    }

    fetchWishlist()
  }, [product.id])

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="image-wrapper">
          <img
            src={product.image || product.images?.[0]?.url}
            alt={product.name}
            onError={(e) => {
              e.target.src = "https://placehold.co/150x150?text=No+Image"
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart(product.id)
            }}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
        <h3>{product.name}</h3>
      </Link>

      <h4>{product.description}</h4>
      <p>${product.price}</p>

      <button
        onClick={() => addToWishlist(product.id, inWishlist, setInWishlist)}
        className="wishlist-btn"
      >
        {inWishlist ? <FaHeart color="red" size={24} /> : <FaRegHeart size={24} />}
      </button>
    </div>
  )
}

export default ProductCard
