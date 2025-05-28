import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div styles={{ display: "flex", minHeight: "100vh" , marginTop:"-7rem"}}>
      {/* Sidebar */}
      <aside styles={{ 
        width: "220px", 
        background: "#D991A4", 
        color: "#fff", 
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <h2 styles={{ marginBottom: "1rem" }}>Admin Panel</h2>
        <nav styles={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* <NavLink to="/AdminDashboard" styles={linkStyle}>Dashboard</NavLink>
          <NavLink to="/AdminUsers" styles={linkStyle}>Users</NavLink>
          <NavLink to="/AdminOrders" styles={linkStyle}>Orders</NavLink> */}
          {/* <NavLink to="/AdminAddProductForm" styles={linkStyle}>Shipments</NavLink> */}
          <NavLink to="/AdminCategory" styles={linkStyle}>Category</NavLink>
          <NavLink to="/AdminProducts" styles={linkStyle}>Products</NavLink>
          <NavLink to="/admin/profile" styles={linkStyle}>Profile</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main styles={{ flex: 1, padding: "2rem", background: "#f7f7f7" }}>
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