import { Cart, Product } from "../config/db.js"; // Import models from Sequelize setup

// ✅ Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id; // Get logged-in user's ID from cookie-based session

    // 🔍 Check if the product exists before adding to cart
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔄 Add to cart or update quantity if item already exists
    const [cartItem, created] = await Cart.findOrCreate({
      where: { user_id, product_id },
      defaults: { quantity }, // If new, set quantity
    });

    if (!created) {
      // If it already exists, increment the quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    // ✅ Respond with success message and updated cart item
    res.status(200).json({ message: "Product added to cart", cartItem });
  } catch (err) {
    // ❌ Handle server errors
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
};

// ✅ Get all items in the user's cart
export const getCart = async (req, res) => {
  try {
    const user_id = req.user.id; // Get the logged-in user's ID

    // 📦 Find all cart items for the user, include product info (name, price, images)
    const cart = await Cart.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "images"], // Limit to key product info
        },
      ],
    });

    // ✅ Send full cart with product details
    res.status(200).json(cart);
  } catch (err) {
    // ❌ Handle server errors
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
};

// ✅ Update the quantity of a specific cart item
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findByPk(req.params.id); // Find by cart item ID

    // ❌ If item doesn't exist or doesn't belong to the user, block access
    if (!cartItem || cartItem.user_id !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }

    // 🔁 Update quantity and save
    cartItem.quantity = quantity;
    await cartItem.save();

    // ✅ Respond with success message
    res.status(200).json({ message: "Cart updated", cartItem });
  } catch (err) {
    // ❌ Handle server errors
    res.status(500).json({ message: "Error updating cart", error: err.message });
  }
};

// ✅ Remove a cart item
export const deleteCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findByPk(req.params.id); // Find by cart item ID

    // ❌ If not found or not owned by user, block the deletion
    if (!cartItem || cartItem.user_id !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }

    // 🗑️ Delete the item
    await cartItem.destroy();

    // ✅ Confirm deletion
    res.status(200).json({ message: "Cart item removed" });
  } catch (err) {
    // ❌ Handle server errors
    res.status(500).json({ message: "Error deleting cart item", error: err.message });
  }
};
