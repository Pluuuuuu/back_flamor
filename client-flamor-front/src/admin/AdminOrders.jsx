import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/admin/orders");
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="admin-orders">
      <h2>All Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th><th>User</th><th>Total</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user?.email}</td>
              <td>${order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;