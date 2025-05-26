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

  // New states for Add Product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    category_id: "",
    images: [],
    variants: [], // variants = [{ color_name, images: [], sizes: [] }]
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

    setEditForm({
      name: productDetails.name || "",
      category_id: productDetails.category_id || "",
      variants:
        productDetails.ProductColors?.map((color) => ({
          id: color.id,
          color_name: color.color_name,
          images: color.Images || [],
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

  // Update variants and colors images in the edit form (simple example)
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

  // Handle main product images change for editing form
  const handleEditProductImageChange = (e, imgIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64 for preview, could also upload here
    const reader = new FileReader();
    reader.onload = () => {
      setEditForm((prev) => {
        const newImages = [...prev.images];
        newImages[imgIndex] = { ...newImages[imgIndex], image_url: reader.result };
        return {
          ...prev,
          images: newImages,
        };
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle variant image change for editing form
  const handleEditVariantImageChange = (variantIndex, imgIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditForm((prev) => {
        const variants = [...prev.variants];
        const images = [...variants[variantIndex].images];
        images[imgIndex] = { ...images[imgIndex], image_url: reader.result };
        variants[variantIndex] = { ...variants[variantIndex], images };
        return { ...prev, variants };
      });
    };
    reader.readAsDataURL(file);
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
        await axios.put(
          `http://localhost:5000/api/product-colors/${color.id}`,
          {
            color_name: color.color_name,
          },
          { withCredentials: true }
        );
        console.log(`Updated color id ${color.id}`);
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

  // -----------------------
  // New handlers for Add Product modal below
  // -----------------------

  const openAddModal = () => {
    setAddForm({
      name: "",
      category_id: "",
      images: [],
      variants: [],
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  // Handle add form input change (name, category)
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding main images for new product
  const handleAddProductImageChange = (e) => {
    const files = e.target.files;
    if (!files.length) return;

    // We support multiple images
    const fileArray = Array.from(files);

    Promise.all(
      fileArray.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({ image_url: reader.result });
            };
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setAddForm((prev) => ({
        ...prev,
        images: [...prev.images, ...images],
      }));
    });
  };

  // Add variant (color)
  const addVariant = () => {
    setAddForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { color_name: "", images: [], sizes: [] }],
    }));
  };

  // Remove variant
  const removeVariant = (index) => {
    setAddForm((prev) => {
      const variants = [...prev.variants];
      variants.splice(index, 1);
      return { ...prev, variants };
    });
  };

  // Handle variant color name change in add form
  const handleAddVariantColorChange = (index, value) => {
    setAddForm((prev) => {
      const variants = [...prev.variants];
      variants[index].color_name = value;
      return { ...prev, variants };
    });
  };

  // Handle variant images upload in add form
  const handleAddVariantImagesChange = (index, e) => {
    const files = e.target.files;
    if (!files.length) return;

    const fileArray = Array.from(files);

    Promise.all(
      fileArray.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({ image_url: reader.result });
            };
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setAddForm((prev) => {
        const variants = [...prev.variants];
        variants[index].images = [...variants[index].images, ...images];
        return { ...prev, variants };
      });
    });
  };

  // Remove variant image from add form
  const removeAddVariantImage = (variantIndex, imgIndex) => {
    setAddForm((prev) => {
      const variants = [...prev.variants];
      variants[variantIndex].images.splice(imgIndex, 1);
      return { ...prev, variants };
    });
  };

  // Remove main product image from add form
  const removeAddProductImage = (imgIndex) => {
    setAddForm((prev) => {
      const images = [...prev.images];
      images.splice(imgIndex, 1);
      return { ...prev, images };
    });
  };

  // Submit new product creation
  const handleAddSave = async () => {
    try {
      // 1. Create product with name & category
      const resProduct = await axios.post(
        "http://localhost:5000/api/products",
        {
          name: addForm.name,
          category_id: addForm.category_id,
        },
        { withCredentials: true }
      );

      const productId = resProduct.data.id;
      console.log("Created product id:", productId);

      // 2. Upload product images (assuming your backend supports batch upload or individual upload)
      for (const img of addForm.images) {
        await axios.post(
          "http://localhost:5000/api/product-images",
          {
            product_id: productId,
            image_url: img.image_url,
          },
          { withCredentials: true }
        );
      }

      // 3. For each variant, create variant, upload variant images
      for (const variant of addForm.variants) {
        // Create variant color
        const resColor = await axios.post(
          "http://localhost:5000/api/product-colors",
          {
            product_id: productId,
            color_name: variant.color_name,
          },
          { withCredentials: true }
        );
        const colorId = resColor.data.id;

        // Upload variant images
        for (const img of variant.images) {
          await axios.post(
            "http://localhost:5000/api/product-color-images",
            {
              product_color_id: colorId,
              image_url: img.image_url,
            },
            { withCredentials: true }
          );
        }

        // If you want to add sizes etc, you can extend here
      }

      alert("Product added successfully!");
      setShowAddModal(false);

      // Refresh product list
      const res = await axios.get("http://localhost:5000/api/products", {
        withCredentials: true,
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="admin-products">
      <h2>Manage Products</h2>
      <button className="add-product-button" onClick={openAddModal}>
        + Add Product
      </button>

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
                              {v.color_name || "No color"} ({v.Images?.length || 0} images)
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

              {/* Main Images Edit */}
              <h4>Product Images:</h4>
              <div className="edit-images">
                {editForm.images.map((img, idx) => (
                  <div key={idx} className="image-edit-wrapper">
                    <img
                      src={img.image_url}
                      alt={img.alt_text || ""}
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleEditProductImageChange(e, idx)}
                    />
                  </div>
                ))}
              </div>

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
                      <div key={idx} className="image-edit-wrapper">
                        <img
                          src={img.image_url}
                          alt={img.alt_text || ""}
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleEditVariantImageChange(i, idx, e)}
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Product</h3>
            <label>
              Product Name:
              <input
                type="text"
                name="name"
                value={addForm.name}
                onChange={handleAddInputChange}
              />
            </label>
            <label>
              Category ID:
              <input
                type="text"
                name="category_id"
                value={addForm.category_id}
                onChange={handleAddInputChange}
              />
            </label>

            <label>
              Product Images:
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddProductImageChange}
              />
            </label>

            <div className="add-images-preview">
              {addForm.images.map((img, idx) => (
                <div key={idx} className="image-edit-wrapper">
                  <img
                    src={img.image_url}
                    alt=""
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                  <button onClick={() => removeAddProductImage(idx)}>Remove</button>
                </div>
              ))}
            </div>

            {/* Variants (Colors) */}
            <h4>Variants (Colors):</h4>
            {addForm.variants.map((variant, i) => (
              <div key={i} className="variant-add">
                <label>
                  Color Name:
                  <input
                    type="text"
                    value={variant.color_name}
                    onChange={(e) => handleAddVariantColorChange(i, e.target.value)}
                  />
                </label>

                <label>
                  Variant Images:
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleAddVariantImagesChange(i, e)}
                  />
                </label>

                <div className="add-images-preview">
                  {variant.images.map((img, idx) => (
                    <div key={idx} className="image-edit-wrapper">
                      <img
                        src={img.image_url}
                        alt=""
                        style={{ width: 80, height: 80, objectFit: "cover" }}
                      />
                      <button onClick={() => removeAddVariantImage(i, idx)}>Remove</button>
                    </div>
                  ))}
                </div>

                <button onClick={() => removeVariant(i)}>Remove Variant</button>
              </div>
            ))}
            <button onClick={addVariant}>+ Add Variant</button>

            <div className="modal-buttons">
              <button onClick={handleAddSave}>Save Product</button>
              <button onClick={closeAddModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
