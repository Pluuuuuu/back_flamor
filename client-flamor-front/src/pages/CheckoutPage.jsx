import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";
import "../styles/checkout.css";

const CheckoutPage = () => {
  const [shippingInfo, setShippingInfo] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    country: "Lebanon",
    postal_code: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cartTotal, setCartTotal] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCartTotal();
  }, []);

  const fetchCartTotal = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cart`, {
        withCredentials: true,
      });
      setCartTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching cart total:", err);
    }
  };

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    const { full_name, phone, address, city, country, postal_code } =
      shippingInfo;
    if (!full_name || !phone || !address || !city || !country || !postal_code) {
      setMessage("Please fill in all shipping information.");
      return;
    }

    try {
      // Save shipping info
      const shippingRes = await axios.post(`${BASE_URL}/api/shipping`, shippingInfo, {
        withCredentials: true,
      });
      const shipping = shippingRes.data.shipping;

      // Place order
      const orderPayload = {
        shipping_id: shipping.id,
        items: [], // You may need to fetch cart items here or pass them as props/context
        payment_method: paymentMethod,
      };

      await axios.post(`${BASE_URL}/api/orders`, orderPayload, { withCredentials: true });

      setMessage("✅ Order placed successfully!");
    } catch (err) {
      console.error("Error placing order:", err);
      setMessage("❌ Failed to place order.");
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <h2>Shipping Information</h2>
      <div className="shipping-form">
        {["full_name", "phone", "address", "city", "postal_code"].map(
          (field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              value={shippingInfo[field]}
              onChange={handleChange}
              required
            />
          )
        )}
      </div>

      <h2>Payment Method</h2>
      <div className="payment-options">
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Pay on Delivery
        </label>
      </div>

      <h3>Total: ${cartTotal.toFixed(2)}</h3>

      <button className="place-order-btn" onClick={placeOrder}>
        Place Order
      </button>

      {message && <p className="order-message">{message}</p>}
    </div>
  );
};

export default CheckoutPage;