// ProductCard.jsx
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.img} alt={product.name} loading="lazy"/>
      <p className="product-name">{product.name}</p>
      <p className="product-desc">{product.desc}</p>
      <p className="price">{product.price}</p>
      <button className="add-to-cart">Add to Cart</button>
    </div>
  );
};

export default ProductCard;