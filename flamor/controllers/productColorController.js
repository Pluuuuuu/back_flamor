import { ProductColor, Product, ProductVariant, Image } from "../config/db.js";

// Create a new product color
export const createProductColor = async (req, res) => {
  try {
    const { color_name, color_code, product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "product_id is required" });
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    const existing = await ProductColor.findOne({ where: { color_name, product_id } });
    if (existing) {
      return res.status(400).json({ message: "Color already exists for this product" });
    }

    const newColor = await ProductColor.create({ color_name, color_code, product_id });

    const normalize = (str) => str.trim().replace(/\s+/g, " ").toLowerCase();
    const normalizedColor = normalize(color_name);

    const variantsToUpdate = await ProductVariant.findAll({
      where: {
        product_id,
        product_color_id: null,
      },
    });

    let updatedCount = 0;

    for (const variant of variantsToUpdate) {
      const name = normalize(variant.variant_name || "");
      const value = normalize(variant.variant_value || "");

      if (
        name === normalizedColor ||
        value === normalizedColor ||
        name.includes(normalizedColor) ||
        value.includes(normalizedColor)
      ) {
        variant.product_color_id = newColor.id;
        await variant.save();
        updatedCount++;
      }
    }

    res.status(201).json({
      message: `Color created and linked to ${updatedCount} variant(s)`,
      color: newColor,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create color", error: err.message });
  }
};

// Get all product colors
export const getAllProductColors = async (req, res) => {
  try {
    const colors = await ProductColor.findAll({
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
    res.status(500).json({ message: "Failed to fetch colors", error: err.message });
  }
};

// Get one color
export const getProductColorById = async (req, res) => {
  try {
    const color = await ProductColor.findByPk(req.params.id, {
      include: [
        {
          model: Image,
          where: { related_type: "productColor" },
          required: false,
          attributes: ["image_url", "alt_text"],
        },
      ],
    });

    if (!color) return res.status(404).json({ message: "Color not found" });

    res.json(color);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch color", error: err.message });
  }
};

// Update color
export const updateProductColor = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ProductColor.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: "Color not found or no changes made" });
    }

    res.json({ message: "Color updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update color", error: err.message });
  }
};

// Delete color
export const deleteProductColor = async (req, res) => {
  try {
    const { id } = req.params;

    const usedInVariants = await ProductVariant.findOne({ where: { product_color_id: id } });
    if (usedInVariants) {
      return res.status(400).json({ message: "Cannot delete: Color is used in a variant" });
    }

    await ProductColor.destroy({ where: { id } });
    res.json({ message: "Color deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete color", error: err.message });
  }
};
