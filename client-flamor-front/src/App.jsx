// src/App.jsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import AboutUs from "./pages/AboutUs"
import ContactUs from "./pages/ContactUs"
import Cart from "./pages/Cart"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AuthForm from "./pages/AuthForm"
import Product from "./pages/Product"
import CheckoutPage from "./pages/CheckoutPage"
import ProductDetails from "./pages/ProductDetails"
import Wishlist from "./pages/Wishlist"


// Admin Pages
import AdminDashboard from "./admin/AdminDashboard"
import AdminOrders from "./admin/AdminOrders"
import AddProductForm from "./admin/AddProductForm"
import AdminUsers from "./admin/AdminUsers"
import AdminLayout from "./components/AdminLayout"
import AdminCategory from "./admin/AdminCategory"
import AdminProducts from "./admin/AdminProducts"

// Layout-aware wrapper component
function AppLayout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/Admin")

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
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />

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
          path="/AdminAddProductForm"
          element={
            <AdminLayout>
              <AddProductForm />
            </AdminLayout>
          }
        />
        <Route
          path="/AdminProducts"
          element={
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          }
        />
        <Route
          path="/AdminCategory"
          element={
            <AdminLayout>
              <AdminCategory />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminLayout>
              <Profile />
            </AdminLayout>
          }
        />
      </Routes>

      {/* Customer layout */}
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}