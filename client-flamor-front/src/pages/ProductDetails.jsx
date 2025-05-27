import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "../styles/ProductDetails.css"

const ProductDetails = () => {
  const { id } = useParams()

  // Move hooks to the top level
  const [product, setProduct] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [popup, setPopup] = useState({ message: "", visible: false })
  const [inWishlist, setInWishlist] = useState(false) // added wishlist state to fix your wishlist handler

  // Fetch product details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
  }, [id])

  // Fetch user role
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me", {
        withCredentials: true,
      })
      .then((res) => {
        setUserRole(res.data.role)
      })
      .catch(() => {
        setUserRole(null)
      })
  }, [])

  if (!product) return <div>Loading...</div>

  const productImage =
    product.Images[0]?.image_url || "https://placehold.co/300x300"

  const showPopup = (message) => {
    setPopup({ message, visible: true })
    setTimeout(() => setPopup({ message: "", visible: false }), 3000)
  }

  const handleAddToCart = (productId) => {
    if (userRole !== "customer") {
      showPopup("You must be logged in as a customer to add to cart.")
      return
    }

    axios
      .post(
        "http://localhost:5000/api/cart/add",
        {
          product_id: productId,
          quantity: 1,
        },
        { withCredentials: true }
      )
      .then(() => {
        showPopup("Product added to cart!")
      })
      .catch((err) => {
        console.error("Add to cart failed:", err)
        showPopup("Failed to add to cart.")
      })
  }

  const handleAddToWishlist = async (productId) => {
    if (userRole !== "customer") {
      showPopup("You must be logged in as a customer to add to wishlist.")
      return
    }
    try {
      if (!inWishlist) {
        await axios.post(
          "http://localhost:5000/api/wishlist",
          { product_id: productId },
          { withCredentials: true }
        )
      } else {
        await axios.delete(
          `http://localhost:5000/api/wishlist/${productId}`,
          {
            withCredentials: true,
          }
        )
      }
      setInWishlist(!inWishlist)
    } catch (err) {
      console.error("Error updating wishlist:", err)
      showPopup("Failed to update wishlist.")
    }
  }

  return (
    <div className="product-container">
      <div className="product-image">
        <img
          src={productImage}
          alt={product.Images[0]?.alt_text || product.name}
        />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        <p className="price">${product.price}</p>
        <p className="stock">In stock: {product.stock}</p>

        {product.ProductVariants.length > 0 && (
          <div className="variant">
            <strong>Variant:</strong>{" "}
            {product.ProductVariants[0].variant_name} (+$
            {product.ProductVariants[0].additional_price})
          </div>
        )}

        {product.ProductColors.length > 0 && (
          <div className="color">
            <strong>Color:</strong> {product.ProductColors[0].color_name}
          </div>
        )}

        <div className="buttons">
          {/* pass product.id here */}
          <button
            className="cart-button"
            onClick={() => handleAddToCart(product.id)}
          >
            Add to Cart
          </button>
          <button
            className="wishlist-button"
            onClick={() => handleAddToWishlist(product.id)}
          >
            {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
      {popup.visible && (
        <div className="popup-notification">{popup.message}</div>
      )}
    </div>
  )
}

export default ProductDetails
