import jwt from "jsonwebtoken";
import { User } from "../config/db.js"; // Sequelize User model (PascalCase is standard for models)

// Middleware to verify JWT from cookie or Authorization header
export const verifyToken = async (req, res, next) => {
  try {
    // Extract the Authorization header if it exists (format: 'Bearer <token>')
    const authHeader = req.headers["authorization"];
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    // Token can be from cookie OR Authorization header
    const token = tokenFromHeader || req.cookies.token;

    console.log("Incoming cookies:", req.cookies);
    console.log("Authorization header:", authHeader);
    console.log("Extracted token:", token);

    // If no token found, block access
    if (!token) {
      console.log("No token found in cookies or headers.");
      return res.status(401).json({ message: "Unauthorized. No token." });
    }

    // Verify token using secret key and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token payload:", decoded);

    // Find the user by ID in the database
    const foundUser = await User.findByPk(decoded.id);
    console.log("Found user from DB:", foundUser?.dataValues || null);

    // If user doesn't exist, deny access
    if (!foundUser) {
      console.log("User not found in the database.");
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    // Attach essential user data to request object for use in next middlewares/routes
    req.user = {
      id: foundUser.id,
      role: foundUser.role,
    };
    console.log("Authenticated user:", req.user);

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or expired token
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Middleware to restrict access to users with a specific role (e.g., admin)
export const requireRole = (role) => {
  return (req, res, next) => {
    console.log(`Checking if user has role: ${role}`);
    console.log("Current user role:", req.user?.role);

    // If user's role doesn't match the required one, block access
    if (req.user?.role !== role) {
      console.warn(`Access denied. Required role: ${role}, found: ${req.user?.role}`);
      return res
        .status(403)
        .json({ message: `Access denied. ${role}s only.` });
    }

    // Proceed to next middleware or route
    next();
  };
};


//Clear status codes: 401 for auth issues, 403 for role-based access issues.