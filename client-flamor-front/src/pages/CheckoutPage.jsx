import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = ({ cartItems = [], total, onClearCart }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
  });

  const [message, setMessage] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isPhoneValid = (phone) => /^\d+$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isPhoneValid(formData.phone)) {
      return setMessage("Phone number must contain only digits.");
    }

    if (cartItems.length === 0) {
      return setMessage("Your cart is empty.");
    }

    setLoading(true);
    try {
      // 1. Save shipping info
      const shippingRes = await axios.post(
        "http://localhost:5000/api/shipping",
        formData,
        { withCredentials: true }
      );

      const shipping_id = shippingRes.data.shipping?.id;
      if (!shipping_id) throw new Error("Shipping ID not returned from server.");

      // 2. Prepare order items
      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      // 3. Place the order
      const orderRes = await axios.post(
        "http://localhost:5000/api/orders",
        { shipping_id, items: orderItems },
        { withCredentials: true }
      );

      const { totalAmount } = orderRes.data;

      let finalMsg = "Order placed! Delivery in 3–7 business days.";
      if (totalAmount >= 125) finalMsg += " You got free delivery!";

      setMessage(finalMsg);
      setOrderPlaced(true);

      // 4. Clear cart
      if (onClearCart) onClearCart();
    } catch (err) {
      console.error(err);
      setMessage(
        "Failed to place order: " + (err.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  return (
    <div className="checkout-form">
      <h2>Delivery Information</h2>

      <input name="full_name" placeholder="Full Name" onChange={handleChange} />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="country" placeholder="Country" onChange={handleChange} />
      <input name="postal_code" placeholder="Postal Code" onChange={handleChange} />

      <h3>Payment Method</h3>
      <label>
        <input type="radio" checked disabled /> Cash on Delivery
      </label>

      {!orderPlaced ? (
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      ) : (
        <button onClick={() => navigate("/orders")}>
          View My Orders
        </button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Checkout;
