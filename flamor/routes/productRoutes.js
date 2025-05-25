import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getBestSellersProducts,
  getProductVariants,
  getProductColors,
} from "../controllers/productController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";
import { uploadAny } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllProducts); // Public
router.get("/best-sellers", getBestSellersProducts); // Public
router.get("/:id", getProductById); // Public
router.post("/", verifyToken, isAdmin, uploadAny, createProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);
router.get('/:id/variants', getProductVariants);
router.get('/:id/colors', getProductColors);
export default router;
