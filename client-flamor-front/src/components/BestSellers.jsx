import React, { useEffect, useState } from "react";
import { fetchBestSellers } from "../api/productApi";
import ProductCard from "./ProductCard";

import "../styles/BestSellers.css";

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestSellers = async () => {
      const data = await fetchBestSellers();
      setBestSellers(data);
      setLoading(false);
    };
    loadBestSellers();
  }, []);

  if (loading) {
    return <p className="text-center my-8">Loading best sellers...</p>;
  }

  if (bestSellers.length === 0) {
    return <p className="text-center my-8">No best sellers found.</p>;
  }

  return (
    <div className="best-sellers-container">
      <h2 className="best-sellers-heading">Best Sellers</h2>
      <div className="best-sellers-grid">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;