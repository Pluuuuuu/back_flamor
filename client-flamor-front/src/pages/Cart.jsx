import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/cart.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [popup, setPopup] = useState({ message: '', visible: false });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios
      .get('http://localhost:5000/api/cart', { withCredentials: true })
      .then(res => {
        console.log("🧾 Cart API response:", res.data);
        setCartItems(res.data.items);
        setTotal(res.data.total);
      })
      .catch(err => console.error('Failed to fetch cart:', err));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;

    axios
      .put(`http://localhost:5000/api/cart/${itemId}`, { quantity }, { withCredentials: true })
      .then(fetchCart)
      .catch(err => {
        console.error('Failed to update quantity:', err);
        showPopup('Failed to update quantity.');
      });
  };

  const removeItem = (itemId) => {
    axios
      .delete(`http://localhost:5000/api/cart/${itemId}`, { withCredentials: true })
      .then(fetchCart)
      .catch(err => {
        console.error('Failed to remove item:', err);
        showPopup('Failed to remove item.');
      });
  };

  const showPopup = (message) => {
    setPopup({ message, visible: true });
    setTimeout(() => setPopup({ message: '', visible: false }), 3000);
  };

  console.log("🛒 Cart Items:", cartItems);

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.Product?.Image?.image_url || 'https://placehold.co/100x100?text=No+Image'}
                  alt={item.Product?.Image?.alt_text || item.Product?.name || 'Product'}
                  className="cart-item-image"
                  onError={(e) => e.target.src = 'https://placehold.co/100x100?text=No+Image'}
                />
                <div className="cart-item-info">
                  <h3>{item.Product?.name || "Unnamed Product"}</h3>
                  <p>${Number(item.Product?.price).toFixed(2)} each</p>

                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <p className="item-subtotal">
                    Subtotal: ${(Number(item.Product?.price) * item.quantity).toFixed(2)}
                  </p>

                  <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: ${total.toFixed(2)}</h2>

            <div className="cart-buttons">
              <button
                className="continue-btn"
                onClick={() => window.location.href = "/shop"}
              >
                Continue Shopping
              </button>

              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {popup.visible && (
        <div className="popup-notification">{popup.message}</div>
      )}
    </div>
  );
};

export default CartPage;
