import { User, Image } from "../config/db.js";
import jwt from "jsonwebtoken";

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    console.log("🔍 Getting profile for user ID:", req.user?.id);

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"], // 👈 ADD role here
      include: [
        {
          model: Image,
          as: "profileImage",
          attributes: ["id", "image_url", "alt_text"],
        },
      ],
    });

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User found:", user.toJSON());

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, //Include role in response for cart
      profileImage: user.profileImage ? user.profileImage.image_url : null,
    });
  } catch (error) {
    console.error("❗ Error retrieving user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get All Users - Admin
export const getAllUsers = async (req, res) => {
  try {
    console.log("👮 Admin requested all users. Authenticated user:", req.user);

    if (req.user.role !== 'admin') {
      console.log("🚫 Forbidden: user is not admin");
      return res.status(403).json({ message: "Admins only" });
    }

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });

    console.log(`📄 Retrieved ${users.length} users`);

    res.json(users);
  } catch (error) {
    console.error("❗ Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};


// Get Single User - Admin
export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("🔎 Fetching user with ID:", userId);
    console.log("🔐 Authenticated user:", req.user);

    if (req.user.role !== 'admin') {
      console.log("🚫 Forbidden: not an admin");
      return res.status(403).json({ message: "Admins only" });
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role']
    });

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User found:", user.toJSON());

    res.json(user);
  } catch (error) {
    console.error("❗ Error fetching single user:", error);
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

// Update Any User - Admin only
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("🛠️ Admin updating user ID:", userId);
    console.log("🔐 Authenticated user:", req.user);
    console.log("📦 Request body:", req.body);

    if (req.user.role !== "admin") {
      console.log("🚫 Forbidden: not admin");
      return res.status(403).json({ message: "Only admin can update other users" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log("❌ Target user not found");
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, role } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();
    console.log("✅ User updated:", user.toJSON());

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("❗ Error updating user:", error);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

// Delete User - Admin only
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("🗑️ Admin deleting user ID:", userId);
    console.log("🔐 Authenticated user:", req.user);

    if (req.user.role !== 'admin') {
      console.log("🚫 Forbidden: not admin");
      return res.status(403).json({ message: 'Only admin can delete users' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    console.log("✅ User deleted");

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❗ Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

// Update Current User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("✏️ User updating own profile, ID:", userId);
    console.log("📦 Request body:", req.body);

    const user = await User.findByPk(userId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    console.log("✅ User profile updated:", user.toJSON());

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage ? user.profileImage.image_url : null,
    });
  } catch (error) {
    console.error("❗ Error updating user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
