import React, { useEffect, useState } from "react";
import axios from "axios";
import "../adminstyle/AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category_id: "",
    variants: [],
    images: [],
  });

  // Fetch all products with variants/colors/images
  useEffect(() => {
    console.log("Fetching all products...");
    axios
      .get("http://localhost:5000/api/products", { withCredentials: true })
      .then((res) => {
        console.log("Products fetched:", res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Fetch full product details by id (for editing)
  const fetchProductDetails = async (id) => {
    console.log("Fetching product details for edit, id:", id);
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
        withCredentials: true,
      });
      console.log("Product details fetched:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  // Open edit modal/form and load product data
  const handleEdit = async (id) => {
    const productDetails = await fetchProductDetails(id);
    if (!productDetails) {
      alert("Failed to load product details for editing.");
      return;
    }

    // Map product details to editForm state
    setEditForm({
      name: productDetails.name || "",
      category_id: productDetails.category_id || "",
      variants: productDetails.ProductColors?.map((color) => ({
        id: color.id,
        color_name: color.color_name,
        images: color.Images || [],
        // Note: ProductVariants linked by color are fetched in main productVariant model
      })) || [],
      images: productDetails.Images || [],
    });

    setEditingProduct(productDetails.id);
  };

  // Handle input changes for editing form fields (name, category_id)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update variants and colors images in the form (simple example)
  const handleVariantChange = (index, field, value) => {
    setEditForm((prev) => {
      const variants = [...prev.variants];
      variants[index] = {
        ...variants[index],
        [field]: value,
      };
      return {
        ...prev,
        variants,
      };
    });
  };

  // Submit update product request
  const handleSave = async () => {
    console.log("Saving product with data:", editForm);

    try {
      // Update main product info
      await axios.put(
        `http://localhost:5000/api/products/${editingProduct}`,
        {
          name: editForm.name,
          category_id: editForm.category_id,
          // Add other product-level fields as needed
        },
        { withCredentials: true }
      );

      // For each variant/color, update color info & images
      for (const color of editForm.variants) {
        // Update color
        await axios.put(
          `http://localhost:5000/api/product-colors/${color.id}`,
          {
            color_name: color.color_name,
          },
          { withCredentials: true }
        );
        console.log(`Updated color id ${color.id}`);

        // For images, you might want to implement upload or delete logic here.
        // This example assumes you send images via separate calls or as part of update if supported.
      }

      alert("Product updated successfully.");
      setEditingProduct(null);

      // Refresh product list
      const res = await axios.get("http://localhost:5000/api/products", {
        withCredentials: true,
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingProduct(null);
  };

  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        withCredentials: true,
      });
      setProducts(products.filter((prod) => prod.id !== id));
      console.log(`Product ${id} deleted.`);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="admin-products">
      <h2>Manage Products</h2>
      <button className="add-product-button">+ Add Product</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {!editingProduct && (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category ID</th>
                  <th>Stock</th>
                  <th>Price Range</th>
                  <th>Variants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => {
                  const allPrices =
                    prod.variants?.flatMap((v) => v.sizes?.map((s) => s.price) || []) || [];

                  const allStock =
                    prod.variants?.flatMap((v) => v.sizes?.map((s) => s.stock) || []) || [];

                  const minPrice = allPrices.length ? Math.min(...allPrices) : null;
                  const maxPrice = allPrices.length ? Math.max(...allPrices) : null;
                  const totalStock = allStock.reduce((sum, s) => sum + (s || 0), 0);

                  // Use product main image or fallback
                  const firstImage =
                    (prod.Images && prod.Images[0]?.image_url) ||
                    (prod.ProductColors?.[0]?.Images?.[0]?.image_url) ||
                    "https://placehold.co/100x100?text=No+Image";

                  return (
                    <tr key={prod.id}>
                      <td>
                        <img
                          src={firstImage}
                          alt={prod.name || "Product"}
                          className="product-img"
                        />
                      </td>
                      <td>{prod.name || "Untitled"}</td>
                      <td>{prod.category_id || "N/A"}</td>
                      <td>{totalStock}</td>
                      <td>
                        {minPrice !== null && maxPrice !== null
                          ? `$${minPrice} - $${maxPrice}`
                          : "N/A"}
                      </td>
                      <td>
                        {prod.ProductColors?.length > 0 ? (
                          prod.ProductColors.map((v, i) => (
                            <div key={i}>
                              {v.color_name || "No color"} (
                              {v.Images?.length || 0} images)
                            </div>
                          ))
                        ) : (
                          "No variants"
                        )}
                      </td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEdit(prod.id)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(prod.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Editing form */}
          {editingProduct && (
            <div className="edit-form">
              <h3>Edit Product ID: {editingProduct}</h3>

              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Category ID:
                <input
                  type="text"
                  name="category_id"
                  value={editForm.category_id}
                  onChange={handleInputChange}
                />
              </label>

              {/* Variants (Colors) Edit */}
              <h4>Variants (Colors):</h4>
              {editForm.variants.map((variant, i) => (
                <div key={variant.id} className="variant-edit">
                  <label>
                    Color Name:
                    <input
                      type="text"
                      value={variant.color_name}
                      onChange={(e) => handleVariantChange(i, "color_name", e.target.value)}
                    />
                  </label>

                  <div>
                    Images:
                    {variant.images?.map((img, idx) => (
                      <div key={idx}>
                        <img
                          src={img.image_url}
                          alt={img.alt_text || ""}
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminProducts;
