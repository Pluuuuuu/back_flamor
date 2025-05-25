// // src/pages/Shop.jsx

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom'; // ✅ IMPORT Link to enable navigation
// import "../styles/shop.css";

// const Shop = () => {
//   const [products, setProducts] = useState([]);
//   const [userRole, setUserRole] = useState(null);
//   const [popup, setPopup] = useState({ message: '', visible: false });

//   // ✅ Fetch current user role (to check if they’re a customer)
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/users/me', { withCredentials: true })
//       .then(res => {
//         setUserRole(res.data.role);
//       })
//       .catch(() => {
//         setUserRole(null);
//       });
//   }, []);

//   // ✅ Fetch all products
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/products')
//       .then(res => {
//         setProducts(res.data);
//       })
//       .catch(err => {
//         console.error(err);
//       });
//   }, []);

//   // ✅ Fallback if image fails to load
//   const handleImageError = (e) => {
//     e.target.src = 'https://placehold.co/150x150?text=No+Image';
//   };

//   // ✅ Reusable popup message
//   const showPopup = (message) => {
//     setPopup({ message, visible: true });
//     setTimeout(() => setPopup({ message: '', visible: false }), 3000);
//   };

//   // ✅ Add to cart logic
//   const handleAddToCart = (productId) => {
//     if (userRole !== 'customer') {
//       showPopup('You must be logged in as a customer to add to cart.');
//       return;
//     }

//     axios.post('http://localhost:5000/api/cart/add', {
//       product_id: productId,
//       quantity: 1,
//     }, { withCredentials: true })
//     .then(() => {
//       showPopup('Product added to cart!');
//     })
//     .catch(err => {
//       console.error('Add to cart failed:', err);
//       showPopup('Failed to add to cart.');
//     });
//   };

//   return (
//     <div className="shop-page">
//       <div className="shop-header">
//         <h1 className="shop-title">Shop</h1>
//         <p className="shop-suptitle">Browse our exclusive collection</p>
//       </div>

//       <div className="product-grid">
//         {products.map(product => (
//           <div key={product.id} className="product-container">
//             {/* ✅ Wrap product details in a Link to the product details page */}
//             <Link to={`/product/${product.id}`} className="product-card">
//               <img
//                 src={product.image || (product.images?.[0]?.url)}
//                 alt={product.name}
//                 onError={handleImageError}
//               />
//               <h3>{product.name}</h3>
//               <p>{product.price} USD</p>
//             </Link>

//             {/* ✅ Keep Add to Cart button outside the Link so it doesn't trigger navigation */}
//             <button
//               onClick={() => handleAddToCart(product.id)}
//               className="add-to-cart-btn"
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>

//       {popup.visible && (
//         <div className="popup-notification">
//           {popup.message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Shop;
// src/pages/Shop.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [popup, setPopup] = useState({ message: "", visible: false });
  const [token, setToken] = useState(null);

  // Get token from localStorage or context or cookie
  useEffect(() => {
    // Example using localStorage:
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Fetch user role to verify if customer
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me", { withCredentials: true })
      .then((res) => {
         setToken(res.data.token);
        setUserRole(res.data.role);
      })
      .catch(() => {
        setToken(null);
        setUserRole(null);
      });
  }, []);

  // Fetch all products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Popup helper
  const showPopup = (message) => {
    setPopup({ message, visible: true });
    setTimeout(() => setPopup({ message: "", visible: false }), 3000);
  };

  // Add to cart handler passed to ProductCard
  const handleAddToCart = (productId) => {
    if (userRole !== "customer") {
      showPopup("You must be logged in as a customer to add to cart.");
      return;
    }

    axios
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

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">Shop</h1>
        <p className="shop-suptitle">Browse our exclusive collection</p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            token={token}
            addToCart={handleAddToCart}
          />
        ))}
      </div>

      {popup.visible && <div className="popup-notification">{popup.message}</div>}
    </div>
  );
};

export default Shop;
