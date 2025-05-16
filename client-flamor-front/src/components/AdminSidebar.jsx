import { Link } from "react-router-dom";

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <ul>
      <li><Link to="/admin/dashboard">Dashboard</Link></li>
      <li><Link to="/admin/users">Users</Link></li>
      <li><Link to="/admin/orders">Orders</Link></li>
      <li><Link to="/admin/shipments">Shipments</Link></li>
    </ul>
  </aside>
);

export default AdminSidebar;
