import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [popup, setPopup] = useState({ message: "", visible: false });

  // Fetch user role
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me", { withCredentials: true })
      .then((res) => {
        setUserRole(res.data.role);
      })
      .catch(() => {
        setUserRole(null);
      });
  }, []);

  // Fetch all products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const showPopup = (message) => {
    setPopup({ message, visible: true });
    setTimeout(() => setPopup({ message: "", visible: false }), 3000);
  };

  const handleAddToCart = (productId) => {
    if (userRole !== "customer") {
      showPopup("You must be logged in as a customer to add to cart.");
      return;
    }

    axios
      .post(
        "http://localhost:5000/api/cart/add",
        {
          product_id: productId,
          quantity: 1,
        },
        { withCredentials: true }
      )
      .then(() => {
        showPopup("Product added to cart!");
      })
      .catch((err) => {
        console.error("Add to cart failed:", err);
        showPopup("Failed to add to cart.");
      });
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">Shop</h1>
        <p className="shop-suptitle">Browse our exclusive collection</p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={handleAddToCart}
          />
        ))}
      </div>

      {popup.visible && <div className="popup-notification">{popup.message}</div>}
    </div>
  );
};

export default Shop;
