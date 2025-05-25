import {
  Product,
  ProductVariant,
  ProductColor,
  Image,
  Review,
  Order,
  Category,
} from "../config/db.js";
import sequelize from "../config/sequelize.js";
import { Op } from "sequelize";

// Create a product
// Create a product
export const createProduct = async (req, res) => {
  const data = req.body || {};
  const { name, description, price, category_id, category_name, variants } = data;

  try {
    // Determine finalCategoryId from category_id or category_name
    let finalCategoryId = category_id;

    if (!finalCategoryId && category_name) {
      const category = await Category.findOne({ where: { name: category_name } });
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
      finalCategoryId = category.id;
    }

    if (!finalCategoryId) {
      return res.status(400).json({ message: "You must provide either category_id or category_name." });
    }

    // Create product with category_id
    const product = await Product.create({
      name,
      description,
      price,
      category_id: finalCategoryId,
    });

    if (Array.isArray(variants)) {
      for (const variant of variants) {
        const { color_name, color_code, images, sizes } = variant;

        const colorRecord = await ProductColor.create({
          product_id: product.id,
          color_name,
          color_code,
        });

        if (Array.isArray(images)) {
          for (const img of images) {
            await Image.create({
              related_id: colorRecord.id,
              related_type: "productColor",
              image_url: img.image_url,
              alt_text: img.alt_text,
            });
          }
        }

        if (Array.isArray(sizes)) {
          for (const size of sizes) {
            await ProductVariant.create({
              product_id: product.id,
              color_id: colorRecord.id,  // Use color_id here
              variant_name: size.variant_name,
              variant_value: size.variant_value,
              stock: parseInt(size.stock, 10),
              additional_price: parseFloat(size.additional_price),
            });
          }
        }
      }
    }

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Something went wrong while creating the product." });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Image,
          where: { related_type: "product" },
          required: false,
        },
        {
          model: ProductColor,
          include: [
            {
              model: Image,
              where: { related_type: "productColor" },
              required: false,
            },
          ],
        },
      ],
    });

    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        const reviews = await Review.findAll({
          where: { product_id: product.id },
          attributes: ["rating"],
        });

        const averageRating =
          reviews.length > 0
            ? parseFloat(
                (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              )
            : 0;

        const image =
          (product.Images && product.Images[0]?.image_url) ||
          (product.ProductColors?.[0]?.Images?.[0]?.image_url) ||
          "";

        return {
          ...product.toJSON(),
          averageRating,
          image,
        };
      })
    );

    res.json(formattedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Something went wrong while fetching products." });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: ProductVariant,
          attributes: ["id", "variant_name", "variant_value", "stock", "additional_price"],
        },
        {
          model: ProductColor,
          attributes: ["id", "color_name"],
          include: [
            {
              model: Image,
              where: { related_type: "productColor" },
              required: false,
              attributes: ["image_url", "alt_text"],
            },
          ],
        },
        {
          model: Image,
          where: { related_type: "product" },
          required: false,
          attributes: ["image_url", "alt_text"],
        },
      ],
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    const reviews = await Review.findAll({
      where: { product_id: product.id },
      attributes: ["rating"],
    });

    const averageRating =
      reviews.length > 0
        ? parseFloat(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          )
        : 0;

    res.json({ ...product.toJSON(), averageRating });
  } catch (err) {
    console.error("Error getting product by ID:", err);
    res.status(500).json({ error: "Something went wrong while fetching the product." });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price } = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.update({ name, description, price });

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Something went wrong while updating the product." });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Something went wrong while deleting the product." });
  }
};

// Get best-selling products
export const getBestSellersProducts = async (req, res) => {
  try {
    const bestSellers = await Product.findAll({
      attributes: [
        "id",
        "name",
        "price",
        [sequelize.fn("COUNT", sequelize.col("Orders.id")), "orderCount"],
      ],
      include: [
        {
          model: Order,
          attributes: [],
        },
        {
          model: Image,
          where: { related_type: "product" },
          required: false,
        },
      ],
      group: ["Product.id", "Images.id"],
      order: [[sequelize.literal("orderCount"), "DESC"]],
      limit: 10,
    });

    res.json(bestSellers);
  } catch (err) {
    console.error("Error fetching best sellers:", err);
    res.status(500).json({ error: "Something went wrong while fetching best sellers." });
  }
};

// Get product variants
export const getProductVariants = async (req, res) => {
  const productId = req.params.id;
  try {
    const variants = await ProductVariant.findAll({
      where: { product_id: productId },
    });
    res.json(variants);
  } catch (err) {
    console.error("Error fetching variants:", err);
    res.status(500).json({ error: "Something went wrong while fetching variants." });
  }
};

// Get product colors
export const getProductColors = async (req, res) => {
  const productId = req.params.id;
  try {
    const colors = await ProductColor.findAll({
      where: { product_id: productId },
      include: [
        {
          model: Image,
          where: { related_type: "productColor" },
          required: false,
          attributes: ["image_url", "alt_text"],
        },
      ],
    });
    res.json(colors);
  } catch (err) {
    console.error("Error fetching product colors:", err);
    res.status(500).json({ error: "Something went wrong while fetching product colors." });
  }
};
