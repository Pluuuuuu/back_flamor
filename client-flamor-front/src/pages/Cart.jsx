import React from "react";
import { useCart } from "../context/CartContext";
import { updateCartItem, deleteCartItem } from "../api/cart";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import Button from "../components/Button"; 
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function getImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("https")) {
    return url;
  }
  return `${BASE_URL}${url}`;
}

export default function Cart() {
  const { cart, loading, error, refreshCart, totalAmount, updateCartItemLocally, deleteCartItemLocally } = useCart();
  const navigate = useNavigate();

  const handleIncrement = async (item) => {
    try {
      await updateCartItem(item.id, item.quantity + 1);
      updateCartItemLocally(item.id, item.quantity + 1);
      // Removed refreshCart call to prevent full reload
    } catch (err) {
      console.error("Failed to increment quantity", err);
    }
  };

  const handleDecrement = async (item) => {
    if (item.quantity <= 1) return; // Prevent quantity less than 1
    try {
      await updateCartItem(item.id, item.quantity - 1);
      updateCartItemLocally(item.id, item.quantity - 1);
      // Removed refreshCart call to prevent full reload
    } catch (err) {
      console.error("Failed to decrement quantity", err);
    }
  };

  const handleDelete = async (item) => {
    try {
      await deleteCartItem(item.id);
      deleteCartItemLocally(item.id);
      // Removed refreshCart call to prevent full reload
    } catch (err) {
      console.error("Failed to delete cart item", err);
    }
  };

  const [checkingOut, setCheckingOut] = React.useState(false);

  const handleCheckout = () => {
    if (checkingOut) return;
    setCheckingOut(true);
    navigate("/shipping");
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error loading cart: {error}</p>;
  if (!cart || cart.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="cart-container">
      <h2 class="cart-title" >Your Cart</h2>
      <ul>
        {cart.map((item) => {
          // console.log("Cart item:", item); // Debug log to inspect cart item structure
          const product = item.Product;
          let imageUrl = "";
          if (
            item.ProductVariant &&
            item.ProductVariant.ProductColor &&
            item.ProductVariant.ProductColor.Images &&
            item.ProductVariant.ProductColor.Images.length > 0
          ) {
            imageUrl = getImageUrl(
              item.ProductVariant.ProductColor.Images[0].image_url
            );
          } else if (
            item.product_color_id &&
            item.ProductColor &&
            item.ProductColor.Images &&
            item.ProductColor.Images.length > 0
          ) {
            imageUrl = getImageUrl(item.ProductColor.Images[0].image_url);
          } else if (
            item.ProductVariant &&
            item.ProductVariant.Images &&
            item.ProductVariant.Images.length > 0
          ) {
            imageUrl = getImageUrl(item.ProductVariant.Images[0].image_url);
          } else if (product) {
            if (product.image_url) {
              imageUrl = getImageUrl(product.image_url);
            } else if (product.Images && product.Images.length > 0) {
              imageUrl = getImageUrl(product.Images[0].image_url);
            }
          }
          return (
            <li key={item.id} class="cart-item">
              <div class="cart-item-info">
            {imageUrl && (
              <picture>
                <source
                  srcSet={imageUrl.replace(/\.(jpg|jpeg|png)$/i, ".webp")}
                  type="image/webp"
                />
                <img
                  src={imageUrl}
                  alt={product ? product.name : "Product image"}
                  className="cart-image"
                  loading="lazy"
                />
              </picture>
            )}
                <div>
                  <p class="cart-product-name">
                    {product ? product.name : "Unknown Product"}
                  </p>
                  {/* <p >
                  Quantity:
                  <button onClick={() => handleDecrement(item)}>-</button>
                  {item.quantity}
                  <button onClick={() => handleIncrement(item)}>+</button>
                </p> */}
                  <p class="cart-product-price">
                    Price: ${product ? product.price : "N/A"}
                  </p>
                </div>

                {/* <button onClick={() => handleDelete(item)}>Remove</button> */}
              </div>
              <div class="cart-actions">
                {/* <p class="cart-btn"> */}
                <button onClick={() => handleDecrement(item)} class="cart-btn">
                  -
                </button>
                <span class="cart-quantity">{item.quantity}</span>
                <button onClick={() => handleIncrement(item)} class="cart-btn">
                  +
                </button>
                {/* </p> */}
                <button
                  onClick={() => handleDelete(item)}
                  class="cart-remove-btn"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      
      <div class="cart-footer">
      <p class="cart-total">Total: ${totalAmount.toFixed(2)}</p>
        <Button
          text={checkingOut ? "Processing..." : "Checkout"}
          onClick={handleCheckout}
          className="cart-checkout-btn"
          disabled={checkingOut}
        />
        <Button
          text="Continue Shopping"
          onClick={() => navigate("/shop")}
          className="cart-continue-shopping-btn"/>
    </div>
    </div>
  );
}
