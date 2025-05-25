import { Wishlist, Product, Image } from "../config/db.js";

// ✅ Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;

    // 🔍 Check if the product is already in the wishlist
    const exists = await Wishlist.findOne({ where: { user_id, product_id } });
    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    // ➕ Add to wishlist
    const item = await Wishlist.create({ user_id, product_id });
    res.status(201).json({ message: "Added to wishlist", item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all wishlist items for the logged-in user
export const getWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log("🔍 Wishlist - Logged-in user ID:", user_id);

    const wishlist = await Wishlist.findAll({
      where: { user_id },
      include: {
        model: Product,
        attributes: ["id", "name", "price"],
        include: [
          {
            model: Image,
            where: { related_type: "product" },
            required: false,
            attributes: ["image_url", "alt_text"],
          },
        ],
      },
    });

    res.status(200).json({ items: wishlist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Remove an item from wishlist (with user authorization check)
export const removeFromWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.params;

    // 🔍 Check if the item exists and belongs to the user
    const item = await Wishlist.findOne({ where: { user_id, product_id } });

    if (!item) {
      return res.status(404).json({ message: "Wishlist item not found or unauthorized" });
    }

    // 🗑️ Delete the item
    await item.destroy();

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
