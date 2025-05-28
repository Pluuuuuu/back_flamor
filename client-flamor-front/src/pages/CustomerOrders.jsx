import React, { useEffect, useState } from "react";
import { fetchCustomerOrders } from "../api/orderApi";
import "../styles/UserProfile.css"; 

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchCustomerOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              {/* <th>Order ID</th> */}
              <th>Total Amount</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Shipping Address</th>
              <th>Payment Method</th>
              {/* <th>Payment Status</th> */}
              <th>Order Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                {/* <td>{order.id}</td> */}
                {/* <td>${order.total_amount.toFixed(2)}</td> */}
                <td>
                  $
                  {order.total_amount
                    ? Number(order.total_amount).toFixed(2)
                    : "0.00"}
                </td>

                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  {order.Shipping
                    ? `${order.Shipping.address}, ${order.Shipping.city}, ${order.Shipping.state}, ${order.Shipping.zip}`
                    : "N/A"}
                </td>
                <td>{order.Payment ? order.Payment.payment_method : "N/A"}</td>
                {/* <td>{order.Payment ? order.Payment.status : "N/A"}</td> */}
                <td>
                  <ul>
                    {order.OrderItems && order.OrderItems.length > 0 ? (
                      order.OrderItems.map((item) => (
                        <li key={item.id}>
                          {item.Product ? item.Product.name : "Product"} - Qty: {item.quantity} - Price: ${item.price ? Number(item.price).toFixed(2) : "0.00"}

                        </li>
                      ))
                    ) : (
                      <li>No items</li>
                    )}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerOrders;
