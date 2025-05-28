// handles fetching the orders data from the backend API, manages loading and error states, and passes the data and handlers to the OrdersTable component
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "../api/orderApi";
import OrdersTable from "../components/OrdersTable";


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleEdit = async (order) => {
    try {
      // Example: toggle status between 'pending' and 'completed'
      const newStatus = order.status === 'pending' ? 'shipped' : 'pending';
      await updateOrderStatus(order.id, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.id ? { ...o, status: newStatus } : o
        )
      );
      toast.success(`Order ${order.id} status updated to ${newStatus}`);
    } catch (error) {
      toast.error(`Failed to update order status: ${error.message}`);
    }
  };

  const handleDelete = async (order) => {
    try {
      await deleteOrder(order.id);
      setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));
      toast.success(`Order deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete order: ${error.message}`);
    }
  };


  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Orders</h1>
      <OrdersTable
        orders={orders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        // onAdd={handleAdd}
      />
      <ToastContainer />
    </div>
  );
};

export default AdminOrders;