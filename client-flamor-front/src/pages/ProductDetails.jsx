import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  // Use first product image or placeholder
  const productImage = product.Images?.[0]?.image_url || 'https://placehold.co/300x300';

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <img src={productImage} alt={product.name} style={{ maxWidth: 300 }} />
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Average Rating:</strong> {product.averageRating}</p>

      <h3>Colors & Variants</h3>
      {product.ProductColors && product.ProductColors.length > 0 ? (
        product.ProductColors.map((color) => (
          <div key={color.id} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  backgroundColor: color.color_code,
                  width: 30,
                  height: 30,
                  border: '1px solid #ccc',
                  borderRadius: 4,
                }}
              />
              <h4>{color.color_name}</h4>
            </div>

            {/* Color images */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 8 }}>
              {color.Images && color.Images.map((img, i) => (
                <img
                  key={i}
                  src={img.image_url}
                  alt={img.alt_text || color.color_name}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                />
              ))}
            </div>

            {/* Variants for this color */}
            {color.ProductVariants && color.ProductVariants.length > 0 && (
              <ul style={{ marginTop: 8 }}>
                {color.ProductVariants.map(variant => (
                  <li key={variant.id}>
                    {variant.variant_name} — Stock: {variant.stock} — +${variant.additional_price}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p>No colors/variants available</p>
      )}
    </div>
  );
};

export default ProductDetails;
