const { product, category } = require("../models");

// GET all products with category name
const getAllProducts = async (req, res) => {
  try {
    const products = await product.findAll({
      attributes: ["id", "name", "price", "category_id"],
      include: [
        {
          model: category,
          attributes: ["name"],
        },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

// GET product by ID with category name
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const singleProduct = await product.findByPk(id, {
      attributes: ["id", "name", "price", "category_id"],
      include: [
        {
          model: category,
          attributes: ["name"],
        },
      ],
    });

    if (!singleProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(singleProduct);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server error while fetching product" });
  }
};

// POST create new product
const createProduct = async (req, res) => {
  const { name, price, category_id } = req.body;

  try {
    const newProduct = await product.create({
      name,
      price,
      category_id,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error while creating product" });
  }
};

// PUT update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category_id } = req.body;

  try {
    const existingProduct = await product.findByPk(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await existingProduct.update({
      name,
      price,
      category_id,
    });

    res.status(200).json({ message: "Product updated", product: existingProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const existingProduct = await product.findByPk(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await existingProduct.destroy();

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
