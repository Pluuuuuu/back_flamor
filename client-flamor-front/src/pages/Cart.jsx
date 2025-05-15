import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/cart.css';

const CartPage = () => {
  // State to hold cart items
  const [cartItems, setCartItems] = useState([]);

  // State to manage popup notifications
  const [popup, setPopup] = useState({ message: '', visible: false });

  // Fetch the cart items from the server when the component loads
  useEffect(() => {
    fetchCart();
  }, []);

  // Function to get cart items from the API
  const fetchCart = () => {
    axios.get('http://localhost:5000/api/cart', { withCredentials: true })
      .then(res => setCartItems(res.data)) // Set cart items from server response
      .catch(err => console.error('Failed to fetch cart:', err));
  };

  // Function to update the quantity of a cart item
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return; // Prevent setting quantity below 1

    axios.put(`http://localhost:5000/api/cart/${itemId}`, { quantity }, { withCredentials: true })
      .then(fetchCart) // Re-fetch cart after successful update
      .catch(err => {
        console.error('Failed to update quantity:', err);
        showPopup('Failed to update quantity.');
      });
  };

  // Function to remove an item from the cart
  const removeItem = (itemId) => {
    axios.delete(`http://localhost:5000/api/cart/${itemId}`, { withCredentials: true })
      .then(fetchCart) // Re-fetch cart after item is removed
      .catch(err => {
        console.error('Failed to remove item:', err);
        showPopup('Failed to remove item.');
      });
  };

  // Display a temporary popup message
  const showPopup = (message) => {
    setPopup({ message, visible: true });
    setTimeout(() => setPopup({ message: '', visible: false }), 3000); // Hide popup after 3 seconds
  };

  // Calculate total price of all items in the cart
  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Shopping Cart</h1>

      {/* If cart is empty, show message */}
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div>
          {/* List of cart items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="cart-item-image"
                  onError={(e) => e.target.src = 'https://placehold.co/100x100?text=No+Image'} // Placeholder if image fails to load
                />
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p>${item.product.price} each</p>

                  {/* Quantity controls */}
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>

                  {/* Subtotal for current item */}
                  <p className="item-subtotal">Subtotal: ${item.product.price * item.quantity}</p>

                  {/* Remove item button */}
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart total and action buttons */}
          <div className="cart-summary">
            <h2>Total: ${total.toFixed(2)}</h2>

            <div className="cart-buttons">
              <button
                className="continue-btn"
                onClick={() => window.location.href = "/shop"} // Navigate to shop
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

      {/* Popup notification for feedback */}
      {popup.visible && (
        <div className="popup-notification">{popup.message}</div>
      )}
    </div>
  );
};

export default CartPage;
