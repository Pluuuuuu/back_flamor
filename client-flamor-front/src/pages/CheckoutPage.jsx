import React, { useState } from "react";
import axios from "axios";

const Checkout = ({ cartItems = [], total }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      // Save shipping info
      const shippingRes = await axios.post(
        "http://localhost:5000/api/shipping",
        formData,
        { withCredentials: true }
      );

      const shipping_id = shippingRes.data.shipping?.id;
      if (!shipping_id) {
        throw new Error("Shipping ID not returned from server.");
      }

      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      // Place order
      const orderRes = await axios.post(
        "http://localhost:5000/api/orders",
        { shipping_id, items: orderItems },
        { withCredentials: true }
      );

      const { totalAmount } = orderRes.data;

      let finalMsg = "Order placed! Delivery in 3–7 business days.";
      if (totalAmount >= 125) {
        finalMsg += " You got free delivery!";
      }

      setMessage(finalMsg);
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

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Checkout;
