import React, { useState } from "react"
import "../styles/Product.css"
import ProductCard from "../components/ProductCard"
import product from "../assets/product.png"
import products from "../assets/products.json"

const Product = () => {
  const [activeTab, setActiveTab] = useState("desc")

  return (
    <div className="product-page-container">
      <div className="product-section">
        <img
          src={product} // replace with actual image path
          alt="Gold Plated Earrings"
          className="product-image"
        />
        <div className="product-details">
          <h2>Gold Plated Earrings</h2>
          <p className="price">$10.99</p>
          <p>
            Body text for describing what this product is and why this
            product is simply a must-buy.
          </p>
          <button className="add-to-cart">Add to cart</button>
          <p className="fine-print">
            Text box for additional details or fine print
          </p>
        </div>
      </div>

      <div className="toggle-wrapper">
        <div className="tab-header">
          <span
            className={`tab ${activeTab === "desc" ? "active" : ""}`}
            onClick={() => setActiveTab("desc")}
          >
            Description
          </span>
          <span
            className={`tab ${activeTab === "review" ? "active" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            Reviews
          </span>
        </div>

        <div className="tab-content">
          {activeTab === "desc" ? (
            <p>🛍️{products[1].desc}.</p>
          ) : (
            <p>❤️ {products[1].review}.</p>
          )}
        </div>
      </div>

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Product