import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductsByCategory, fetchCategoryById } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";

const ShopCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 1000,
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryData = await fetchCategoryById(categoryId);
        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching category data", error);
      }
    };
    fetchCategoryData();
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const query = {
          search: filters.search,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        };
        const productsData = await fetchProductsByCategory(categoryId, query);
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading products", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [categoryId, filters]);

  return (
    <div className="container-shop">
      <aside className="sidebar_shop">
        <h2>{category ? category.name : "Category"}</h2>
        {/* Filters can be added here if needed */}
      </aside>

      <main className="product-grid">
        {loadingProducts ? (
          <div className="loading-products">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">No products found.</div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </main>
    </div>
  );
};

export default ShopCategory;
