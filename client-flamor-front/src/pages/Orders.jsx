import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";;
import { useNavigate } from "react-router-dom";

const Orders = ({ onReorder }) => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [reordered, setReordered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("http://localhost:5000/api/orders/my", {
          withCredentials: true,
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load orders.");
      }
    };

    fetchOrders();
  }, []);

  const handleReorder = async (order) => {
    const reorderedItems = order.items.map((item) => ({
      id: item.product_id,
      quantity: item.quantity,
      name: item.product?.name,
      price: item.product?.price,
      // Add other fields as needed
    }));

    if (onReorder) {
      onReorder(reorderedItems);
    }

    setReordered(true);
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {message && <p>{message}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h4>Order #{order.id}</h4>
            <p>Total: ${order.totalAmount}</p>
            <p>Delivery to: {order.shipping?.address}, {order.shipping?.city}, {order.shipping?.country}</p>

            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product?.name || "Product"} × {item.quantity}
                </li>
              ))}
            </ul>

            <button onClick={() => handleReorder(order)}>
              Reorder
            </button>
          </div>
        ))
      )}

      {reordered && (
        <button onClick={() => navigate("/cart")} styles={{ marginTop: "1rem" }}>
          Go to Cart
        </button>
      )}
    </div>
  );
};

export default Orders;
