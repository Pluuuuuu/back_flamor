import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", marginTop: "-7rem" }}>
      {/* Sidebar */}
      <aside style={{ 
        width: "220px", 
        background: "#D991A4", 
        color: "#fff", 
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <h2 style={{ marginBottom: "1rem" }}>Admin Panel</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Uncomment these if needed */}
          {/* <NavLink to="/AdminDashboard" style={linkStyle}>Dashboard</NavLink>
          <NavLink to="/AdminUsers" style={linkStyle}>Users</NavLink>
          <NavLink to="/AdminOrders" style={linkStyle}>Orders</NavLink>
          <NavLink to="/AdminAddProductForm" style={linkStyle}>Shipments</NavLink> */}
          <NavLink to="/AdminCategory" style={linkStyle}>Category</NavLink>
          <NavLink to="/AdminProducts" style={linkStyle}>Products</NavLink>
          <NavLink to="/admin/profile" style={linkStyle}>Profile</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", background: "#f7f7f7" }}>
        {children}
      </main>
    </div>
  );
};

// Link styles function to make active links bold
const linkStyle = ({ isActive }) => ({
  color: "#fff",
  textDecoration: "none",
  fontWeight: isActive ? "bold" : "normal"
});

export default AdminLayout;
