import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = true; // Replace with real check
    if (!isAdmin) navigate("/");
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      <h1>Welcome Admin</h1>
      <p>Access users, orders, and shipments below.</p>
    </div>
  );
};

export default AdminDashboard;