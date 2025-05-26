import React, { useState, useEffect } from "react";
import axios from "axios";
import '../adminstyle/AddProductForm.css';
const AddProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    variants: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories", {
          withCredentials: true,
        });
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to load categories", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleAddColor = () => {
    setProductData({
      ...productData,
      variants: [
        ...productData.variants,
        {
          color_name: "",
          color_code: "#000000",
          images: [],
          sizes: [],
        },
      ],
    });
  };

  const handleColorChange = (index, field, value) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[index][field] = value;
    setProductData({ ...productData, variants: updatedVariants });
  };

  const handleAddSize = (colorIndex) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[colorIndex].sizes.push({
      variant_name: "Size",
      variant_value: "",
      stock: "",
      additional_price: "",
    });
    setProductData({ ...productData, variants: updatedVariants });
  };

  const handleSizeChange = (colorIndex, sizeIndex, field, value) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[colorIndex].sizes[sizeIndex][field] = value;
    setProductData({ ...productData, variants: updatedVariants });
  };

  const handleAddImage = (colorIndex) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[colorIndex].images.push({
      image_base64: "",
      alt_text: "",
    });
    setProductData({ ...productData, variants: updatedVariants });
  };

  const handleImageChange = (colorIndex, imgIndex, file) => {
    if (!file) {
      const updatedVariants = [...productData.variants];
      updatedVariants[colorIndex].images[imgIndex].image_base64 = "";
      setProductData({ ...productData, variants: updatedVariants });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedVariants = [...productData.variants];
      updatedVariants[colorIndex].images[imgIndex].image_base64 = reader.result;
      setProductData({ ...productData, variants: updatedVariants });
    };
    reader.readAsDataURL(file);
  };

  const handleAltTextChange = (colorIndex, imgIndex, value) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[colorIndex].images[imgIndex].alt_text = value;
    setProductData({ ...productData, variants: updatedVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find selected category object by id (convert to number)
    const selectedCategory = categories.find(
      (cat) => cat.id === Number(productData.category_id)
    );

    // Transform variants to backend expected format
    const transformedVariants = productData.variants.map((variant) => ({
      color: variant.color_name,
      images: variant.images
        .map((img) =>
          typeof img === "string" ? img : img.image_base64
        )
        .filter(Boolean), // Remove empty strings
      sizes: variant.sizes.map((size) => ({
        size: size.variant_value,
        stock: Number(size.stock) || 0,
        price: Number(size.additional_price) || 0,
      })),
    }));

    const dataToSubmit = {
      ...productData,
      price: Number(productData.price) || 0,
      category_id: Number(productData.category_id) || null,
      category_name: selectedCategory ? selectedCategory.name : null,
      variants: transformedVariants,
    };

    console.log("Submitting product data:", dataToSubmit);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        dataToSubmit,
        {
          withCredentials: true,
        }
      );
      console.log("Product created:", response.data);
      alert("Product created successfully");
      // Optionally reset form here if needed
    } catch (err) {
      console.error("Failed to create product", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        alert(
          `Failed to create product: ${
            err.response.data.message || err.message
          }`
        );
      } else {
        alert("Failed to create product: Network or server error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={productData.name}
        onChange={(e) =>
          setProductData({ ...productData, name: e.target.value })
        }
        required
      />
      <textarea
        placeholder="Description"
        value={productData.description}
        onChange={(e) =>
          setProductData({ ...productData, description: e.target.value })
        }
        required
      />
      <input
        type="number"
        placeholder="Base Price"
        value={productData.price}
        onChange={(e) =>
          setProductData({ ...productData, price: e.target.value })
        }
        required
      />
      <select
        value={productData.category_id}
        onChange={(e) =>
          setProductData({ ...productData, category_id: e.target.value })
        }
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {productData.variants.map((color, idx) => (
        <div
          key={idx}
          style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
        >
          <input
            type="text"
            placeholder="Color Name"
            value={color.color_name}
            onChange={(e) => handleColorChange(idx, "color_name", e.target.value)}
            required
          />
          <input
            type="color"
            value={color.color_code || "#000000"}
            onChange={(e) => handleColorChange(idx, "color_code", e.target.value)}
            required
          />

          <h4>Images</h4>
          {color.images.map((img, imgIdx) => (
            <div key={imgIdx}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(idx, imgIdx, e.target.files[0])
                }
              />
              <input
                type="text"
                placeholder="Alt Text"
                value={img.alt_text}
                onChange={(e) =>
                  handleAltTextChange(idx, imgIdx, e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={() => handleAddImage(idx)}>
            + Add Image
          </button>

          <h4>Sizes</h4>
          {color.sizes.map((size, sizeIdx) => (
            <div key={sizeIdx}>
              <input
                type="text"
                placeholder="Size (e.g. S, M, L)"
                value={size.variant_value}
                onChange={(e) =>
                  handleSizeChange(idx, sizeIdx, "variant_value", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Stock"
                value={size.stock}
                onChange={(e) =>
                  handleSizeChange(idx, sizeIdx, "stock", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Additional Price"
                value={size.additional_price}
                onChange={(e) =>
                  handleSizeChange(idx, sizeIdx, "additional_price", e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={() => handleAddSize(idx)}>
            + Add Size
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAddColor}>
        + Add Color Variant
      </button>

      <button type="submit">Create Product</button>
    </form>
  );
};

export default AddProductForm;
