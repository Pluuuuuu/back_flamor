import "../styles/Home.css";
import modelImage from "../assets/model.png";
import circles from "../assets/CIRCLES.png";
import ellipse from "../assets/EllipseS.svg";
import flourneck from "../assets/flowerneck.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { fetchCategories } from "../api/categoryApi";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [popup, setPopup] = useState({ message: "", visible: false });
  const [inWishlist, setInWishlist] = useState(false); // Added this to fix wishlist toggle

  // Fetch user role
  useEffect(() => {
    axiosInstance
      .get("http://localhost:5000/api/users/me", {
        withCredentials: true,
      })
      .then((res) => {
        setUserRole(res.data.role);
      })
      .catch((err) => {
        if (err.response?.status !== 401) {
          console.error("Unexpected error:", err);
        }
        setUserRole(null); // Not logged in
      });
  }, []);

  // Fetch all products with safety check
  useEffect(() => {
    axiosInstance
      .get("http://localhost:5000/api/products")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res.data.products)) {
          // Fallback if data is wrapped
          setProducts(res.data.products);
        } else {
          console.error("Expected array but got:", res.data);
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      });
  }, []);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
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

    axiosInstance
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

  const handleAddToWishlist = async (productId) => {
    if (userRole !== "customer") {
      showPopup("You must be logged in as a customer to add to wishlist.");
      return;
    }
    try {
      if (!inWishlist) {
        await axiosInstance.post(
          "http://localhost:5000/api/wishlist",
          { product_id: productId },
          { withCredentials: true }
        );
      } else {
        await axiosInstance.delete(
          `http://localhost:5000/api/wishlist/${productId}`,
          { withCredentials: true }
        );
      }
      setInWishlist(!inWishlist);
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  return (
    <>
      <section className="korean-container">
        <h3 className="add-sparkle">ADD THE SPARKLE</h3>
        <h1 className="title">FLAMORY</h1>
        <Button className="pinkBtn">Steal the Look</Button>
        <Button className="lightBtn" backgroundColor="#f2e0df" color="#d991a4">
          Learn More
        </Button>
        <button id="vertical-btn">FASHIONABLE</button>
        <button id="arrow-btn">
          <FontAwesomeIcon icon={faArrowRight} />
        </button>

        <div id="pink-square-behind"></div>
        <img src={modelImage} alt="Model" className="model-image" />
        <img src={circles} alt="circles" className="circles-image" />
        <img src={ellipse} alt="ellipse" className="ellipse-image" />

        <p className="ellipse-txt bags">BAGS</p>
        <p className="ellipse-txt necklaces">NECKLACES</p>
        <p className="ellipse-txt earings">EARINGS</p>
        <p className="ellipse-txt rings">RINGS</p>
      </section>

      <section className="home-categories-container">
        <h2 className="home-categories-title">Shop by Category</h2>
        <div className="home-categories-grid">
          {categories.map((cat, index) => (
            <div key={index} className="home-category-card">
              <img src={cat.image} alt={cat.name} />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* <section className="featured-container">
        <h2 className="featured-title">Featured Products</h2>
        <div className="featured-grid">
          {Array.isArray(products) &&
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={handleAddToCart}
                addToWishlist={handleAddToWishlist}
              />
            ))}
        </div> */}
        {popup.visible && (
          <div className="popup-notification">{popup.message}</div>
        )}
      </section>

      <section className="fashion-banner">
        <div className="fashion-banner-content">
          <div className="fashion-banner-image">
            <img src={flourneck} alt="Fashion Model" />
          </div>
          <div className="fashion-banner-text">
            <h1>FASHION</h1>
            <h2>Stylish</h2>
            <p>Beautiful, Fashionable, & Stylish</p>
            <Link
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              to="/shop"
            >
              <Button className="buttontoshop">Shop Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
