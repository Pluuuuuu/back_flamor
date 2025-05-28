import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../api/productApi";
import { fetchAllCategories } from "../api/categoryApi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { addToCart } from "../api/cart";
import { addToWishlist } from "../api/wishlistApi";
import ProductCard from "../components/ProductCard";
import "../styles/Shop.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Search, ChevronDown, X } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const lastSearchRef = useRef("");

  const [filters, setFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 1000,
    categoryId: null,
  });

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  // New state for category menu toggle on phones
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    const minPrice = params.get("minPrice")
      ? Number(params.get("minPrice"))
      : 0;
    const maxPrice = params.get("maxPrice")
      ? Number(params.get("maxPrice"))
      : 1000;
    const categoryId = params.get("category")
      ? Number(params.get("category"))
      : null;
    const pageParam = params.get("page") ? Number(params.get("page")) : 1;
    const sortByParam = params.get("sortBy") || "name";
    const sortOrderParam = params.get("sortOrder") || "ASC";

    setFilters((prevFilters) => {
      if (
        prevFilters.search !== search ||
        prevFilters.minPrice !== minPrice ||
        prevFilters.maxPrice !== maxPrice ||
        prevFilters.categoryId !== categoryId
      ) {
        return { search, minPrice, maxPrice, categoryId };
      }
      return prevFilters;
    });

    setPage(pageParam);
    setSortBy(sortByParam);
    setSortOrder(sortOrderParam);
    setSearchInput(search);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.minPrice !== 0)
      params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== 1000)
      params.set("maxPrice", filters.maxPrice.toString());
    if (filters.categoryId !== null)
      params.set("category", filters.categoryId.toString());
    if (page !== 1) params.set("page", page.toString());
    if (sortBy !== "name") params.set("sortBy", sortBy);
    if (sortOrder !== "ASC") params.set("sortOrder", sortOrder);

    const newSearch = params.toString();
    if (newSearch !== lastSearchRef.current) {
      lastSearchRef.current = newSearch;
      navigate(
        {
          pathname: "/shop",
          search: newSearch,
        },
        { replace: true }
      );
    }
  }, [filters, page, sortBy, sortOrder, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const query = {
          search: filters.search,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          page,
          sortBy,
          sortOrder,
        };
        // let productsData = filters.categoryId
        //   ? await fetchAllProducts({ ...query, category: filters.categoryId })
        //   : await fetchAllProducts(query);
        // setProducts(productsData);
        let response = filters.categoryId
          ? await fetchAllProducts({ ...query, category: filters.categoryId })
          : await fetchAllProducts(query);
        setProducts(response.formatted);
        setTotalCount(response.totalCount);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error loading products", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(fetchProducts, 300);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [filters, page, sortBy, sortOrder]);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    try {
      await addToCart(productId, 1);
      refreshCart();
      toast.success("Product added to cart");
    } catch (err) {
      console.error("Failed to add product to cart", err);
      toast.error("Failed to add product to cart");
    }
  };

  const handleAddToWishlist = async (productId, e) => {
    e.stopPropagation();
    try {
      const res = await addToWishlist(productId);
      if (res?.alreadyAdded) {
        toast.info("Already in wishlist", { theme: "colored" });
      } else {
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Failed to add to wishlist");
    }
  };

  const handleSearchIconClick = () => {
    setFilters((prev) => ({ ...prev, search: searchInput }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
  <div className="container-shop">
    {/* Sidebar */}
    <aside className="sidebar_shop">
      <h2>
        Our Categories
        {/* Toggle button for phones */}
        <button
          className="category-toggle-button"
          aria-expanded={categoryMenuOpen}
          aria-controls="category-list"
          onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
          aria-label={categoryMenuOpen ? "Collapse categories" : "Expand categories"}
        >
          {categoryMenuOpen ? <X size={20} /> : <ChevronDown size={20} />}
        </button>
      </h2>

      {/* Category List */}
      <ul
        id="category-list"
        className={`shop-category-list ${categoryMenuOpen ? "open" : "closed"}`}
      >
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`shop-category-item ${filters.categoryId === cat.id ? "selected" : ""}`}
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                categoryId: prev.categoryId === cat.id ? null : cat.id,
              }));
              navigate(`/shop?category=${filters.categoryId === cat.id ? "" : cat.id}`);
            }}
          >
            {cat.name}
          </li>
        ))}
      </ul>

      {/* Price Range Slider */}
      <div className="price-range">
        <label>Price Range: ${filters.minPrice} - ${filters.maxPrice}</label>
        <Slider
          range
          min={0}
          max={1000}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={([min, max]) =>
            setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
          }
        />
      </div>

      {/* Search Bar */}
      <div className="shop-search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="shop-search-bar-input"
        />
        <Search
          size={20}
          className="shop-search-bar-icon"
          onClick={handleSearchIconClick}
        />
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <label htmlFor="sortBy">Sort By:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>

        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>
    </aside>

    {/* Product Grid */}
    <div className="products-section">
      <main className="product-grid">
        {loadingProducts ? (
          <div className="loading-products">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">
            No products found. Try adjusting your filters.
          </div>
        ) : (
          products.map((product) => {
            const imageUrl =
              product.image_url ||
              (product.Images?.length > 0 && product.Images[0].image_url) ||
              "";
            const altText =
              product.alt_text ||
              (product.Images?.length > 0 && product.Images[0].alt_text) ||
              product.name;

            return (
              <ProductCard
                key={product.id}
                product={product}
                imageUrl={getImageUrl(imageUrl)}
                altText={altText}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            );
          })
        )}
      </main>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
      </div>
    </div>
  </div>
);

};

export default Shop;
