import jwt from "jsonwebtoken";
import { User } from "../config/db.js"; // Sequelize User model (capitalized by convention)

// Middleware: Verifies JWT from either cookie or Authorization header
export const verifyToken = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header if present
    const authHeader = req.headers["authorization"];
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    // 2. Fallback to cookie if header not found
    const token = tokenFromHeader || req.cookies.token;

    // Optional logging for development/debugging (won't show in production)
    if (process.env.NODE_ENV !== "production") {
      console.log("Authorization Header:", authHeader);
      console.log("Cookies:", req.cookies);
      console.log("Extracted Token:", token);
    }

    // 3. If no token is found, deny access
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. No token provided." });
    }

    // 4. Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Find the user associated with the token's decoded ID
    const foundUser = await User.findByPk(decoded.id);
    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    // 6. Attach user info to the request object so other routes can access it
    req.user = {
      id: foundUser.id,
      role: foundUser.role,
    };

    // 7. Move to the next middleware or route
    next();
  } catch (error) {
    // If token verification fails (e.g., expired, invalid), return an error
    if (process.env.NODE_ENV !== "production") {
      console.error("JWT verification error:", error.message);
    }
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Middleware: Checks if the user is an admin before allowing access
export const isAdmin = (req, res, next) => {
  // If user is not an admin, deny access
  if (req.user?.role !== "admin") {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Access denied. User role: ${req.user?.role}`);
    }
    return res.status(403).json({ message: "Admins only." });
  }

  // User is an admin → proceed to the next middleware/route
  next();
};
