// src/App.jsx

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthForm from './pages/AuthForm';
import Product from './pages/Product';
import CheckoutPage from './pages/CheckoutPage';

// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminShipments from './admin/AdminShipments';
import AdminUsers from './admin/AdminUsers';
import AdminLayout from './components/AdminLayout';

// Layout-aware wrapper component
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/Admin');

  return (
    <>
      {/* Customer layout */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Customer-Facing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/AuthForm" element={<AuthForm />} />
        <Route path="/product" element={<Product />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Admin Routes inside AdminLayout */}
        <Route
          path="/AdminDashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/AdminUsers"
          element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          }
        />
        <Route
          path="/AdminOrders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />
        <Route
          path="/AdminShipments"
          element={
            <AdminLayout>
              <AdminShipments />
            </AdminLayout>
          }
        />
      </Routes>

      {/* Customer layout */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
