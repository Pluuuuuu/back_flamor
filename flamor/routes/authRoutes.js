import express from "express";
import { signup, login, logout } from "../controllers/authcontrollers.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { User } from "../config/db.js"; // Correct import

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected route: Example for fetching user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Welcome to Flamor!", user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin protected route
router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Admin access granted." });
});

export default router;
