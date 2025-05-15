import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [popup, setPopup] = useState({ message: '', visible: false });

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/me', { withCredentials: true })
      .then(res => {
        setUserRole(res.data.role);
      })
      .catch(() => {
        setUserRole(null);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/150x150?text=No+Image';
  };

  const showPopup = (message) => {
    setPopup({ message, visible: true });
    setTimeout(() => setPopup({ message: '', visible: false }), 3000);
  };

  const handleAddToCart = (productId) => {
    if (userRole !== 'customer') {
      showPopup('You must be logged in as a customer to add to cart.');
      return;
    }

    axios.post('http://localhost:5000/api/cart/add', {
      product_id: productId,
      quantity: 1,
    }, { withCredentials: true })
    .then(() => {
      showPopup('Product added to cart!');
    })
    .catch(err => {
      console.error('Add to cart failed:', err);
      showPopup('Failed to add to cart.');
    });
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">Shop</h1>
        <p className="shop-suptitle">Browse our exclusive collection</p>
      </div>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img
              src={product.image_url}
              alt={product.name}
              onError={handleImageError}
            />
            <h3>{product.name}</h3>
            <p>{product.price} USD</p>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="add-to-cart-btn"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {popup.visible && (
        <div className="popup-notification">
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default Shop;



//gd

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import "../styles/shop.css";
// const Shop = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/products')
//       .then(res => {
//         setProducts(res.data);
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   }, []);

//   const handleImageError = (e) => {
//     e.target.src = 'https://placehold.co/150x150?text=No+Image';
//   };

//   return (
//     <div className="shop-page">
//       <div className="shop-header">
//         <h1 className="shop-title">Shop</h1>
//         <p className="shop-suptitle">Browse our exclusive collection</p>
//       </div>
//       <div className="product-grid">
//         {products.map(product => (
//           <div key={product.id} className="product-card">
//             <img
//               src={product.image_url}
//               alt={product.name}
//               onError={handleImageError}
//             />
//             <h3>{product.name}</h3>
//             <p>{product.price} USD</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Shop;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// 
// const Shop = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/products')
//       .then(res => {
//         setProducts(res.data);
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   }, []);

//   const handleImageError = (e) => {
//     e.target.src = 'https://placehold.co/150x150?text=No+Image';
//   };

//   return (
//     <div className="shop-page">
//       <h1>Shop</h1>
//       <div className="product-grid">
//         {products.map(product => (
//           <div key={product.id} className="product-card">
//             <img
//               src={product.image_url}
//               alt={product.name}
//               onError={handleImageError}
//             />
//             <h3>{product.name}</h3>
//             <p>{product.price} USD</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Shop;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "../components/ProductCard";
// import "../styles/shop.css";
// import { Link } from "react-router-dom";

// const Shop = () => {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [user, setUser] = useState(null); // simulate auth (replace with context or actual user logic)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log("Fetching categories and products...");
//         const [catRes, prodRes] = await Promise.all([
//           axios.get("/api/categories"),
//           axios.get("/api/products"),
//         ]);

//         console.log("Categories response:", catRes.data);
//         console.log("Products response:", prodRes.data);

//         setCategories(Array.isArray(catRes.data) ? catRes.data : []);
//         setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
//       } catch (err) {
//         console.error("Error fetching shop data:", err.response || err);
//         setCategories([]);
//         setProducts([]);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredProducts = Array.isArray(products)
//     ? selectedCategory === "all"
//       ? products
//       : products.filter(
//           (prod) =>
//             prod.category === selectedCategory ||
//             (prod.category && prod.category.name === selectedCategory)
//         )
//     : [];

//   console.log("Selected Category:", selectedCategory);
//   console.log("Filtered Products:", filteredProducts);

//   return (
//     <div className="shop-page">
//       <h1>Shop Accessories</h1>

//       {/* Category Filters */}
//       <div className="category-filters">
//         <button onClick={() => setSelectedCategory("all")}>All</button>
//         {Array.isArray(categories) &&
//           categories.map((cat) => (
//             <button key={cat.id} onClick={() => setSelectedCategory(cat.name)}>
//               {cat.name}
//             </button>
//           ))}
//       </div>

//       {/* Disclaimer if not logged in */}
//       {!user && (
//         <div className="login-disclaimer">
//           <p>To add items to your cart or favorites, please log in first.</p>
//           <Link to="/authform">
//             <button className="login-btn">Login</button>
//           </Link>
//         </div>
//       )}

//       {/* Product Grid */}
//       <div className="product-grid">
//         {filteredProducts.map((product) => (
//           <ProductCard
//             key={product.id}
//             product={product}
//             isLoggedIn={!!user}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Shop;
