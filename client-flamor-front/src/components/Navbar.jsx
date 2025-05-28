import React from "react"
import logo from "../assets/logo.png"
import cart from "../assets/cart.png"
import icon from "../assets/icon.jpg"
import heart from "../assets/heart.png"
import "./Navbar.css" // Optional: for styles
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="top-banner-nav">
      <img id="logo" src={logo} alt="Logo" />
      <div id="top-banner-right">
      <Link
      style={{
        textDecoration: "none",
            cursor: "pointer",
          }}
          className="link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          to="/"
        >
          Home
        </Link>
        <Link
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
          className="link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          to="/shop"
        >
          Shop
        </Link>
        <Link
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
          className="link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          to="/about"
        >
          About Us
        </Link>
        <Link
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
          className="link"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          to="/contact"
        >
          Contact Us
        </Link>
        <div id="icon-and-cart">
          <Link
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            to="/cart"
          >
            <img className="top-banner-img" src={cart} alt="Cart" />
          </Link>
          <Link
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            to="/wishlist"
          >
            <img className="top-banner-img" src={heart} alt="heart" />
          </Link>
          <Link
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            to="/authform"
          >
            <img
              className="top-banner-img img-usr"
              src={icon}
              alt="User Icon"
            />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar