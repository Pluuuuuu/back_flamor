import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation
import axios from "axios";
import "../styles/cart.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [popup, setPopup] = useState({ message: "", visible: false });

  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios
      .get("http://localhost:5000/api/cart", { withCredentials: true })
      .then((res) => {
        console.log("🧾 Cart API response:", res.data);
        setCartItems(res.data.items);
        setTotal(res.data.total);
      })
      .catch((err) => console.error("Failed to fetch cart:", err));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;

    axios
      .put(
        `http://localhost:5000/api/cart/${itemId}`,
        { quantity },
        { withCredentials: true }
      )
      .then(fetchCart)
      .catch((err) => {
        console.error("Failed to update quantity:", err);
        showPopup("Failed to update quantity.");
      });
  };

  const removeItem = (itemId) => {
    axios
      .delete(`http://localhost:5000/api/cart/${itemId}`, {
        withCredentials: true,
      })
      .then(fetchCart)
      .catch((err) => {
        console.error("Failed to remove item:", err);
        showPopup("Failed to remove item.");
      });
  };

  const showPopup = (message) => {
    setPopup({ message, visible: true });
    setTimeout(() => setPopup({ message: "", visible: false }), 3000);
  };

  console.log("🛒 Cart Items:", cartItems);

  return (
    <div className="cart-page-body">
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h1>Your cart is empty.</h1>
        </div>
      ) : (
        <div className="cart-page">
          <div className="cart-container">
            <h2>Cart - {cartItems.length} items</h2>
            <div className="cart-items">
              {cartItems.map((item) => {
                const price = Number(item.Product?.price) || 0;
                const subtotal = price * item.quantity;
                return (
                  <div key={item.id} className="cart-item">
                    <img
                      src={
                        item.Product?.Image?.image_url ||
                        "https://placehold.co/100x100?text=No+Image"
                      }
                      alt={
                        item.Product?.Image?.alt_text ||
                        item.Product?.name ||
                        "Product"
                      }
                      className="cart-item-image"
                      onError={(e) =>
                        (e.target.src =
                          "https://placehold.co/100x100?text=No+Image")
                      }
                    />
                    <div className="product-details">
                      <strong>{item.Product?.name || "Unnamed Product"}</strong>
                      <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p>
                      <div className="buttons">
                        <button
                          className="trash"
                          onClick={() => removeItem(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="quantity-price">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input type="text" value={item.quantity} readOnly />
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className="price">
                        Subtotal: ${subtotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="summary">
            <h3>Summary</h3>
            <div className="summary-details">
              <div className="row">
                <span>Products</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="row">
                <span>Shipping</span>
                <span>Gratis</span>
              </div>
              <div className="row total">
                <strong>Total amount (including VAT)</strong>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <div className="buttons-container">
                <button
                  className="checkout"
                  onClick={() => navigate("/checkout")}
                >
                  GO TO CHECKOUT
                </button>
                <button
                  className="checkout to-shop"
                  onClick={() => (window.location.href = "/shop")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {popup.visible && <div className="popup-notification">{popup.message}</div>}
    </div>
  );
};

export default CartPage;
