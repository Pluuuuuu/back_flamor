import React, { Suspense, lazy } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import "./App.css"

import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"

// Lazy load components
const Navbar = lazy(() => import("./components/Navbar"))
const Footer = lazy(() => import("./components/Footer"))

// Pages
const Home = lazy(() => import("./pages/Home"))
const Shop = lazy(() => import("./pages/Shop"))
const AboutUs = lazy(() => import("./pages/AboutUs"))
const ContactUs = lazy(() => import("./pages/ContactUs"))
const Cart = lazy(() => import("./pages/Cart"))
const Profile = lazy(() => import("./pages/Profile"))
const Login = lazy(() => import("./pages/Login"))
const Signup = lazy(() => import("./pages/Signup"))
const AuthForm = lazy(() => import("./pages/AuthForm"))
const Product = lazy(() => import("./pages/Product"))
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"))
const ProductDetails = lazy(() => import("./pages/ProductDetails"))
const Wishlist = lazy(() => import("./pages/Wishlist"))
const ProductReviews = lazy(() => import("./pages/ProductReviews"))

// Admin Pages
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"))
const AdminOrders = lazy(() => import("./admin/AdminOrders"))
const AddProductForm = lazy(() => import("./admin/AddProductForm"))
const AdminUsers = lazy(() => import("./admin/AdminUsers"))
const AdminCategory = lazy(() => import("./admin/AdminCategory"))
const AdminProducts = lazy(() => import("./admin/AdminProducts"))
const AdminLayout = lazy(() => import("./components/AdminLayout"))
const AdminReview = lazy(() => import("./admin/AdminReview"))
const AdminShippingPage = lazy(() => import("./admin/AdminShippingPage"))
const ShippingList = lazy(() => import("./admin/ShippingList"))

// Layout-aware component
function AppLayout() {
  const location = useLocation()
  const isAdminRoute = location.pathname
    .toLowerCase()
    .startsWith("/admin")

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/authform" element={<AuthForm />} />
        <Route path="/product" element={<Product />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/reviews" element={<ProductReviews />} />

        {/* Admin Routes */}
        <Route
          path="/adminDashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/adminUsers"
          element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          }
        />
        <Route
          path="/adminOrders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />
        <Route
          path="/adminAddProductForm"
          element={
            <AdminLayout>
              <AddProductForm />
            </AdminLayout>
          }
        />
        <Route
          path="/adminProducts"
          element={
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          }
        />
        <Route
          path="/adminCategory"
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
        <Route
          path="/adminReview"
          element={
            <AdminLayout>
              <AdminReview />
            </AdminLayout>
          }
        />
        <Route
          path="/adminShippingPage"
          element={
            <AdminLayout>
              <AdminShippingPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/shippingList"
          element={
            <AdminLayout>
              <ShippingList />
            </AdminLayout>
          }
        />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  )
}

// Main App
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <AppLayout />
              <ToastContainer position="top-center" autoClose={3000} />
            </Suspense>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}
