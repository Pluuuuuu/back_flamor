import React, { useEffect, useState, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../api/axiosInstance";
import {
  fetchAllProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../api/productApi";
import {
  fetchAllProductColors,
  createProductColor,
  updateProductColor,
  deleteProductColor,
} from "../api/productApiExtended";
import { fetchAllCategories } from "../api/categoryApi";
import { DataGrid } from "react-data-grid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-data-grid/lib/styles.css";


const ActionsFormatter = ({
  row,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  isEditing,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
      {!isEditing ? (
        <>
          <button
            onClick={() => onEdit(row.id)}
            title="Edit Product"
            aria-label="Edit Product"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#007bff",
              padding: 4,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="#594548"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(row.id)}
            title="Delete Product"
            aria-label="Delete Product"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "red",
              padding: 4,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="red"
            >
              <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z" />
            </svg>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => onSave(row.id)}
            title="Save Product"
            aria-label="Save Product"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "green",
              padding: 4,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="green"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </button>
          <button
            onClick={() => onCancel(row.id)}
            title="Cancel Edit"
            aria-label="Cancel Edit"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "red",
              padding: 4,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="red"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

const AdminProducts = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for editing row id and row modes model
  const [editingRowId, setEditingRowId] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});

  // Form state for adding color
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("#000000");
  const [newColorImages, setNewColorImages] = useState([]);

  // Form state for adding product
  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [newProductImages, setNewProductImages] = useState([]);
  const [newProductFormVisible, setNewProductFormVisible] = useState(false);

  // Form state for editing product
  const [editProductId, setEditProductId] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductDescription, setEditProductDescription] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editProductStock, setEditProductStock] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductImages, setEditProductImages] = useState([]);
  const [editProductColors, setEditProductColors] = useState([]);
  const [editColorName, setEditColorName] = useState("");
  const [editColorCode, setEditColorCode] = useState("#000000");
  const [editColorImages, setEditColorImages] = useState([]);
  const [editColorId, setEditColorId] = useState(null);
  const [showAddColorInputs, setShowAddColorInputs] = useState(false);

  // Filter state
  const [filterName, setFilterName] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  // Products and colors state
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);

  // Expanded row for adding color
  const [expandedRow, setExpandedRow] = useState(null);

  // Ref for hidden file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await fetchAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to load categories");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let allProducts = [];
      let page = 1;
      while (true) {
        const productData = await fetchAllProducts({ page });
        const productsPage = productData.formatted || productData;
        if (!productsPage || productsPage.length === 0) {
          break;
        }
        allProducts = allProducts.concat(productsPage);
        page++;
      }
      setProducts(allProducts);

      const colorData = await fetchAllProductColors();
      setColors(colorData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load data");
    }
    setLoading(false);
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditProductName(product.name);
    setEditProductDescription(product.description);
    setEditProductPrice(product.price);
    setEditProductStock(product.stock);
    setEditProductCategory(product.category_name);
    setEditProductImages([]); // Images editing not implemented yet
    // Filter colors for this product
    const productColors = colors.filter((c) => c.product_id === product.id);
    setEditProductColors(productColors);
  };

  const handleCancelEdit = () => {
    setEditProductId(null);
    setEditProductName("");
    setEditProductDescription("");
    setEditProductPrice("");
    setEditProductStock("");
    setEditProductCategory("");
    setEditProductImages([]);
    setEditProductColors([]);
  };
  // console.log("Edit Product ID:", setEditProductColors);
  const handleNewProductImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewProductImages(Array.from(e.target.files));
    }
  };

  const handleCreateProduct = async () => {
    if (
      !newProductName.trim() ||
      !newProductDescription.trim() ||
      !newProductPrice ||
      !newProductStock ||
      !newProductCategory.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", newProductName);
      formData.append("description", newProductDescription);
      formData.append("price", newProductPrice);
      formData.append("stock", newProductStock);
      formData.append("category_name", newProductCategory);
      if (newProductImages.length > 0) {
        newProductImages.forEach((image) => {
          formData.append("images", image);
        });
      }

      await createProduct(formData);

      toast.success("Product created successfully");
      setNewProductName("");
      setNewProductDescription("");
      setNewProductPrice("");
      setNewProductStock("");
      setNewProductCategory("");
      setNewProductImages([]);
      setNewProductFormVisible(false);
      fetchData();
    } catch (error) {
      console.error("Failed to create product", error);
      toast.error("Failed to create product");
    }
  };

  const handleEditProductImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditProductImages(Array.from(e.target.files));
    }
  };

  const handleEditColorImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditColorImages(Array.from(e.target.files));
    }
  };

  const handleAddColorToEdit = () => {
    if (!editColorCode.trim()) {
      toast.error("Please fill all required fields for color");
      return;
    }
    const newColor = {
      id: `new-${Date.now()}`, // temporary id for new color
      color_name: editColorCode, // use hex code as color name
      color_code: editColorCode,
      images: editColorImages,
      isNew: true,
    };
    setEditProductColors([...editProductColors, newColor]);
    setEditColorName("");
    setEditColorCode("#000000");
    setEditColorImages([]);
    setShowAddColorInputs(false);
  };

  const handleEditColorChange = (colorId, field, value) => {
    setEditProductColors((prevColors) =>
      prevColors.map((color) =>
        color.id === colorId
          ? { ...color, [field]: value, isEdited: true }
          : color
      )
    );
    // console.log("Edited color:", colorId, field, value);
  };

  const handleDeleteColorFromEdit = (colorId) => {
    setEditProductColors((prevColors) =>
      prevColors.map((color) =>
        color.id === colorId ? { ...color, isDeleted: true } : color
      )
    );
    // console.log( "Deleted color with ID:", colorId );
  };

  const handleSaveEditProduct = async () => {
    if (
      !editProductName.trim() ||
      !editProductDescription.trim() ||
      !editProductPrice ||
      !editProductStock ||
      !editProductCategory.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    // console.log("Saving product with ID:", editProductId);

    // Validate category_name before update
    if (!categories.some((cat) => cat.name === editProductCategory)) {
      toast.error("Invalid category selected");
      return;
    }
    try {
      setLoading(true);
      // Update product fields
      const updateData = {
        name: editProductName,
        description: editProductDescription,
        price: editProductPrice,
        stock: editProductStock,
        category_name: editProductCategory,
      };
      try {
        try {
          const response = await updateProduct(editProductId, updateData);
          // console.log("Update product response:", response);
        } catch (error) {
          console.error(
            "Update product error response:",
            error.response || error
          );
          throw error;
        }
      } catch (error) {
        console.error("Failed to update product", error);
        toast.error("Failed to update product");
      }

      // Handle product colors CRUD
      for (const color of editProductColors) {
        try {
          if (color.isNew) {
            // Create new color
            const formData = new FormData();
            formData.append("color_name", color.color_name);
            formData.append("color_code", color.color_code);
            formData.append("product_name", editProductName);
            if (color.images && color.images.length > 0) {
              color.images.forEach((img) => {
                formData.append("images", img);
              });
            }
            await createProductColor(formData);
          } else if (color.isDeleted) {
            // Delete color
            if (!color.id.toString().startsWith("new-")) {
              await deleteProductColor(color.id);
            }
          } else if (color.isEdited) {
            // Update color
            if (!color.id.toString().startsWith("new-")) {
              const updateData = {
                color_name: color.color_name,
                color_code: color.color_code,
              };
              await updateProductColor(color.id, updateData);
              // Image update for colors not handled here for simplicity
            }
          }
        } catch (error) {
          console.error("Failed to update product color", error);
          toast.error("Failed to update product color");
          throw error; // stop further processing and prevent success toast
        }
      }

      toast.success("Product updated successfully");
      handleCancelEdit();
      fetchData();
    } catch (error) {
      console.error("Failed to update product", error);
      toast.error("Failed to update product");
      return; // prevent success toast if error
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (productId) => {
    setExpandedRow((prev) => (prev === productId ? null : productId));
    setNewColorName("");
    setNewColorCode("#000000");
    setNewColorImages([]);
  };

  const handleSaveColor = async (productId) => {
    if (!newColorCode.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        toast.error("Product not found");
        return;
      }
      const formData = new FormData();
      formData.append("color_name", newColorName || newColorCode);
      formData.append("color_code", newColorCode);
      formData.append("product_name", product.name);
      if (newColorImages.length > 0) {
        newColorImages.forEach((image) => {
          formData.append("images", image);
        });
      }

      await createProductColor(formData);

      toast.success("Color added successfully");
      setExpandedRow(null);
      fetchData();
    } catch (error) {
      // console.error("Failed to add color", error);
      toast.error("Color already exists");
    }
  };

  // Remove inline editing handlers and DataGrid inline editing props
  // Add new handlers for edit form open and cancel

  const handleEdit = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      handleEditClick(product);
    }
    // console.log( "Edit button clicked for product ID:", productId );
  };

  const handleCancel = () => {
    handleCancelEdit();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewColorImages(Array.from(e.target.files));
    }
  };

  const handleImageButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const columns = [
    {
      key: "count",
      name: "#",
      formatter: ({ row }) => row.count,
      resizable: true,
    },
    { key: "name", name: "Product Name", resizable: true, editable: true },
    {
      key: "description",
      name: "Description",
      resizable: true,
      editable: true,
      width: 200,
      renderCell: ({ row }) => {
        const words = row.description ? row.description.split(" ") : [];
        const truncated =
          words.length > 5
            ? words.slice(0, 5).join(" ") + "..."
            : row.description;
        return <span title={row.description}>{truncated}</span>;
      },
    },
    { key: "price", name: "Price", resizable: true, editable: true },
    { key: "category_name", name: "Category", resizable: true, editable: true },
    // { key: "stock", name: "Stock", resizable: true, editable: true },
    {
      key: "image",
      name: "Image",
      resizable: true,
      renderCell: ({ row }) => {
        const imageUrl =
          (row.Images && row.Images.length > 0 && row.Images[0].image_url) ||
          row.image_url;
        return (
          <picture>
            <source
              srcSet={imageUrl.replace(/\.(jpg|jpeg|png)$/i, ".webp")}
              type="image/webp"
            />
            <img
              src={imageUrl}
              alt={row.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                border: "1px solid #ccc",
              }}
              loading="lazy"
            />
          </picture>
        );
      },
    },
    {
      key: "colors",
      name: "Colors",
      renderCell: ({ row, columns }) => {
        const productColors = colors.filter((c) => c.product_id === row.id);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {productColors.map((color) => (
              <div
                key={color.id}
                title={color.color_name}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: color.color_code,
                  borderRadius: "50%",
                  border:
                    color.color_code.toLowerCase() === "#ffffff" ||
                    color.color_code.toLowerCase() === "white"
                      ? "none"
                      : "1px solid #ccc",
                  boxShadow: "none",
                }}
              />
            ))}
            {/* <button
              onClick={() => handleAddClick(row.id)}
              title="Add Color"
              aria-label="Add Color"
            >
              +
            </button> */}
            {/* {expandedRow === row.id && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="hidden"
                  placeholder="Color name"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  style={{ padding: "4px", width: 100 }}
                />
                <input
                  type="color"
                  value={newColorCode}
                  onChange={(e) => {
                    setNewColorCode(e.target.value);
                    setNewColorName(e.target.value);
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <button
                  onClick={handleImageButtonClick}
                  title="Upload Image"
                  aria-label="Upload Image"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="#007bff"
                  >
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM5 5h14v14H5V5zm7 3c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3zm0 8c-2.33 0-7 1.17-7 3.5V19h14v-1.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </button>
                <button onClick={() => handleSaveColor(row.id)}>Save</button>
              </div>
            )} */}
          </div>
        );
      },
    },
    {
      key: "actions",
      name: "Actions",
      width: 100,
      resizable: false,
      renderCell: (props) => (
        <ActionsFormatter
          row={props.row}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={editingRowId === props.row.id}
        />
      ),
    },
  ];

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Failed to delete product", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleSave = async (productId) => {
    // alert("Save button clicked for product ID: " + productId);
    const row = products.find((p) => p.id === productId);
    if (!row) return;
    try {
      console.log("handleSave updating product with ID:", productId);
      const updateData = {
        name: row.name,
        description: row.description,
        price: row.price,
        category_name: row.category_name,
      };

      await updateProduct(productId, updateData);
      toast.success(`Product ${row.name} updated`);
      await fetchData();
      setRowModesModel({
        ...rowModesModel,
        [productId]: { mode: "view" },
      });
      setEditingRowId(null);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  // Filter products by product name
  const filteredRows = products.filter((product) =>
    product.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRows.length / pageSize);

  const currentRows = filteredRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div>
      <h1>Manage Products</h1>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setNewProductFormVisible((prev) => !prev)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#D991A4",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {newProductFormVisible ? "Cancel" : "Add New Product"}
        </button>
      </div>
      {newProductFormVisible && (
        <div
          style={{
            marginBottom: 20,
            padding: 16,
            border: "1px solid #ccc",
            borderRadius: 4,
            maxWidth: 600,
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="newProductName" style={{ display: "block" }}>
              Product Name:
            </label>
            <input
              id="newProductName"
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              style={{ width: "50%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="newProductDescription" style={{ display: "block" }}>
              Description:
            </label>
            <textarea
              id="newProductDescription"
              value={newProductDescription}
              onChange={(e) => setNewProductDescription(e.target.value)}
              style={{ width: "50%", padding: 8 }}
              rows={3}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="newProductPrice" style={{ display: "block" }}>
              Price:
            </label>
            <input
              id="newProductPrice"
              type="number"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              style={{ width: "10%", padding: 8 }}
              min="0"
              step="0.01"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="newProductStock" style={{ display: "block" }}>
              Stock:
            </label>
            <input
              id="newProductStock"
              type="number"
              value={newProductStock}
              onChange={(e) => setNewProductStock(e.target.value)}
              style={{ width: "10%", padding: 8 }}
              min="0"
              step="1"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="newProductCategory" style={{ display: "block" }}>
              Category:
            </label>
            <select
              id="newProductCategory"
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value)}
              style={{ width: "50%", padding: 8 }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="newProductImage" style={{ display: "block" }}>
              Image:
            </label>
            <input
              id="newProductImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewProductImageChange}
            />
          </div>
      <button
        onClick={handleCreateProduct}
        disabled={loading}
        style={{
          padding: "8px 16px",
          backgroundColor: loading ? "#6c757d" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {loading ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: 4 }}
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-repeat spin"
              viewBox="0 0 16 16"
            >
              <path d="M2 2a.5.5 0 0 1 .5.5V5a.5.5 0 0 1-1 0V3.707A6.002 6.002 0 0 1 8 2a6 6 0 0 1 5.996 5.775.5.5 0 0 1-.998.05A5 5 0 0 0 8 3a5.002 5.002 0 0 0-4.9 4H4.5a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 7.5v-5z"/>
              <path d="M14 14a.5.5 0 0 1-.5-.5V11a.5.5 0 0 1 1 0v1.293A6.002 6.002 0 0 1 8 14a6 6 0 0 1-5.996-5.775.5.5 0 0 1 .998-.05A5 5 0 0 0 8 13a5.002 5.002 0 0 0 4.9-4H11.5a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5v5z"/>
            </svg>
            Creating...
          </>
        ) : (
          "Create Product"
        )}
      </button>
        </div>
      )}
      {editProductId && (
        <div
          style={{
            marginBottom: 20,
            padding: 16,
            border: "1px solid #ccc",
            borderRadius: 4,
            maxWidth: 600,
          }}
        >
          <h2>Edit Product</h2>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="editProductName" style={{ display: "block" }}>
              Product Name:
            </label>
            <input
              id="editProductName"
              type="text"
              value={editProductName || ""}
              onChange={(e) => setEditProductName(e.target.value)}
              style={{ width: "50%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label
              htmlFor="editProductDescription"
              style={{ display: "block" }}
            >
              Description:
            </label>
            <textarea
              id="editProductDescription"
              value={editProductDescription || ""}
              onChange={(e) => setEditProductDescription(e.target.value)}
              style={{ width: "50%", padding: 8 }}
              rows={3}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="editProductPrice" style={{ display: "block" }}>
              Price:
            </label>
            <input
              id="editProductPrice"
              type="number"
              value={editProductPrice || ""}
              onChange={(e) => setEditProductPrice(e.target.value)}
              style={{ width: "10%", padding: 8 }}
              min="0"
              step="0.01"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="editProductStock" style={{ display: "block" }}>
              Stock:
            </label>
            <input
              id="editProductStock"
              type="number"
              value={editProductStock || ""}
              onChange={(e) => setEditProductStock(e.target.value)}
              style={{ width: "10%", padding: 8 }}
              min="0"
              step="1"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="editProductCategory" style={{ display: "block" }}>
              Category:
            </label>
            <select
              id="editProductCategory"
              value={editProductCategory || ""}
              onChange={(e) => setEditProductCategory(e.target.value)}
              style={{ width: "50%", padding: 8 }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Colors:</label>
            {editProductColors
              .filter((color) => !color.isDeleted)
              .map((color) => (
                <div
                  key={color.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <input
                    type="hidden"
                    value={color.color_name}
                    readOnly
                    placeholder="Color Name"
                    style={{
                      width: 120,
                      padding: 4,
                      backgroundColor: "#e9ecef",
                      cursor: "not-allowed",
                    }}
                  />
                  <input
                    type="color"
                    value={color.color_code}
                    onChange={(e) =>
                      handleEditColorChange(
                        color.id,
                        "color_code",
                        e.target.value
                      )
                    }
                    style={{
                      width: 50,
                      height: 30,
                      padding: 0,
                      border: "none",
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditColorImageChange}
                  />
                  <button
                    onClick={() => handleDeleteColorFromEdit(color.id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      padding: "4px 8px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            {showAddColorInputs ? (
              <div style={{ marginTop: 8 }}>
                <input
                  type="color"
                  value={editColorCode}
                  onChange={(e) => setEditColorCode(e.target.value)}
                  style={{ width: 50, height: 30, padding: 0, border: "none" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditColorImageChange}
                />
                <button
                  onClick={handleAddColorToEdit}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    padding: "4px 8px",
                    marginLeft: 8,
                  }}
                >
                  Save Color
                </button>
                <button
                  onClick={() => setShowAddColorInputs(false)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    padding: "4px 8px",
                    marginLeft: 8,
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddColorInputs(true)}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: "4px 8px",
                  marginTop: 8,
                }}
              >
                Add Color
              </button>
            )}
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              onClick={handleSaveEditProduct}
              disabled={loading}
              style={{
                padding: "8px 16px",
                backgroundColor: loading ? "#6c757d" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={loading}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="filterName">Filter by Product Name: </label>
            <input
              id="filterName"
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Enter product name"
              style={{ padding: 4, width: 200 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="pageSize">Show entries: </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="data-grid-container" style={{ width: "100%" }}>
            <DataGrid
              className="rdg-light"
              columns={columns}
              rows={currentRows.map((row, index) => ({
                ...row,
                count: (currentPage - 1) * pageSize + index + 1,
              }))}
              rowKeyGetter={(row) => row.id}
              editMode="row"
              onRowsChange={async (rows, data) => {
                const updatedRow = rows[data.index];
                try {
                  console.log("Updating product with ID:", updatedRow.id);
                  // Validate category_name before update
                  if (
                    !categories.some(
                      (cat) => cat.name === updatedRow.category_name
                    )
                  ) {
                    toast.error("Invalid category selected");
                    return;
                  }
                  const updateData = {
                    name: updatedRow.name,
                    description: updatedRow.description,
                    price: updatedRow.price,
                    stock: updatedRow.stock,
                    category_name: updatedRow.category_name,
                  };
                  await updateProduct(updatedRow.id, updateData);
                  toast.success(`Product ${updatedRow.name} updated`);
                  await fetchData();
                  setEditingRowId(null);
                } catch (error) {
                  console.error("Error updating product:", error);
                }
              }}
              rowModesModel={{
                [editingRowId]: { mode: "edit" },
              }}
              onRowModesChange={(rowModes) => {
                if (
                  !rowModes[editingRowId] ||
                  rowModes[editingRowId].mode !== "edit"
                ) {
                  setEditingRowId(null);
                }
              }}
            />
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminProducts;