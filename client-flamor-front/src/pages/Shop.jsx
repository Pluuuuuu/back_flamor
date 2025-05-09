import React from "react"
import "../styles/shop.css"
import ProductCard from "../components/ProductCard"
import products from "../assets/products.json"

const Shop = () => {
  return (
    <div className="container">
      <header className="shop-header">
        <h1 className="shop-title">FLAMOR</h1>
        <h2 className="shop-suptitle">SHOP</h2>
      </header>

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Shop