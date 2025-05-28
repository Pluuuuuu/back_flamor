import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";;
import { useNavigate } from "react-router-dom";
import { createShipping } from "../api/shippingApi";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/orderApi";
import "../styles/ShippingForm.css";
import Button from "./Button"; 

export default function ShippingForm() {
  const { refreshCart, clearCart, cart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    country: "Lebanon",
  });
  const [payOnDelivery, setPayOnDelivery] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      // Do not allow changing country
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // 1️⃣ Save shipping info
      const shipping = await createShipping(formData);
      // toast.success("Shipping info saved");
      // 2️⃣ Place the order
      const orderPayload = {
        shipping_id: shipping.id, // Make sure your backend returns shipping.id
        items: cart.map((item) => ({
          product_id: item.product_id, // your cart items must have product_id
          quantity: item.quantity,
        })),
      };
      const order = await placeOrder(orderPayload); // using your helper API
      toast.success("Order placed successfully");

      // 3️⃣ Clear cart & refresh
      clearCart();
      await refreshCart();

      // 4️⃣  navigate to home
      navigate("/");
      // Optional: redirect or reset form
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save shipping / place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {["full_name", "phone", "address", "city"].map((field) => (
          <div key={field} className="flex flex-col">
            <label htmlFor={field} className="mb-1 font-medium text-gray-700">
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              id={field}
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.replace("_", " ").toUpperCase()}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label htmlFor="country" className="mb-1 font-medium text-gray-700">
            COUNTRY
          </label>
          <input
            id="country"
            type="text"
            name="country"
            value="Lebanon"
            disabled
            className="w-full p-3 border border-gray-300 rounded bg-gray-100"
          />
        </div>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={payOnDelivery}
            onChange={(e) => setPayOnDelivery(e.target.checked)}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="select-none">Payment on Delivery</span>
        </label>

        {/* <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded transition duration-300"
          onClick={handleSubmit}
        >
          Save Shipping Info
        </button> */}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded transition duration-300"
          onClick={handleSubmit}
          text={isSubmitting ? "Processing..." : "Save Shipping Info"}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
}
