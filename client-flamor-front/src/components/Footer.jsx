import React from "react"
import logo from "../assets/logo.png"
import "./Footer.css" // Optional: for styles
import { Link } from "react-router-dom"
import {
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa"

const Footer = () => {
  return (
    <nav className="footer-nav">
      <img id="logo" src={logo} alt="Logo" />
      <div id="footer-middle">
        <Link
          styles={{
            textDecoration: "none",
            cursor: "pointer",
          }}
          className="link"
          to="/"
        >
          Home
        </Link>
        <Link
          styles={{
            textDecoration: "none",
            cursor: "pointer",
          }}
          className="link"
          to="/shop"
        >
          Shop
        </Link>
        <Link
          styles={{
            textDecoration: "none",
            cursor: "pointer",
          }}
          className="link"
          to="/about"
        >
          About Us
        </Link>
        <Link
          styles={{
            textDecoration: "none",
            cursor: "pointer",
          }}
          className="link"
          to="/contact"
        >
          Contact Us
        </Link>
      </div>
      <div className="footer-right">
        <FaFacebook />
        <FaLinkedin />
        <FaYoutube />
        <FaInstagram />
      </div>
    </nav>
  )
}

export default Footer