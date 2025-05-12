// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image_url || "/default.jpg"}
          alt={product.alt_text || product.name}
          className="product-image"
        />
        <h2 className="product-name">{product.name}</h2>
        <p className="product-price">${product.price}</p>
      </Link>
    </div>
  );
};

export default ProductCard;



// import React from "react";
// import { Link } from "react-router-dom";

// const ProductCard = ({ category }) => {
//   return (
//     <Link to={`/shop/${category.id}`} className="product-card">
//       <div
//         className="product-image"
//         style={{
//           backgroundImage: `url(${category.background_image_url})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           height: "200px", // or any preferred height
//         }}
//       />
//       <div className="product-details">
//         <h3>{category.name}</h3>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;
