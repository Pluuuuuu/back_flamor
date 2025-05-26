import { Product, Category, Image } from "../config/db.js";
import { uploadToImgBB } from "../utils/uploadToImgBB.js";
import { Op } from "sequelize";

// Admin: Add category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    // When using uploadAny, files are in req.files array
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }
    const filePath = req.files[0].path;

    // Upload image to ImgBB
    const imageUrl = await uploadToImgBB(filePath);

    // Save image URL to background_image_url column in the database
    const newCategory = await Category.create({
      name,
      background_image_url: imageUrl,
    });

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Admin: Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    console.log("Update Category called for ID:", id);
    console.log("Received name:", name);
    console.log("Files received:", req.files);

    let updatedFields = {};

    if (name) {
      updatedFields.name = name;
    }

    if (req.files && req.files.length > 0) {
      const filePath = req.files[0].path;
      if (!filePath) {
        return res.status(400).json({ message: "Invalid image file" });
      }

      console.log("Uploading new image from path:", filePath);
      const imageUrl = await uploadToImgBB(filePath);
      console.log("Image uploaded, URL:", imageUrl);
      updatedFields.background_image_url = imageUrl;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    const [updated] = await Category.update(updatedFields, {
      where: { id },
    });

    if (updated === 0) {
      return res
        .status(404)
        .json({ message: "Category not found or no changes made" });
    }

    const updatedCategory = await Category.findByPk(id);
    res.json({ message: "Category updated", data: updatedCategory });
  } catch (err) {
    console.error("Update Category Error:", err);
    res.status(500).json({
      message: "Failed to update category",
      error: err.message || "Unknown error",
    });
  }
};



// Admin: Delete category
export const deleteCategory = async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete category", error: err.message });
  }
};

// User: Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: err.message });
  }
};
// User: Get a category by ID

// export const getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findByPk(req.params.id);
//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }
//     res.json(category);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch category", error: err.message });
//   }
// };

// export const getCategoryById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("GET /categories/:id");
//     console.log("Requested ID:", id);

//     const category = await Category.findByPk(id);

//     if (!category) {
//       console.log("Category not found for ID:", id);
//       return res.status(404).json({ message: "Category not found" });
//     }

//     console.log("Category found:", category);
//     res.json(category);
//   } catch (err) {
//     console.error("Error fetching category:", err.message);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch category", error: err.message });
//   }
// };


// // User: Get all products under a specific category
// export const getProductsByCategory = async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     const { search, minPrice, maxPrice } = req.query;
//       const whereClause = {
//         category_id: categoryId,
//       };

//       if (search) {
//         whereClause.name = { [Op.like]: `%${search}%` };
//       }

//       if (minPrice) {
//         whereClause.price = {
//           ...whereClause.price,
//           [Op.gte]: parseFloat(minPrice),
//         };
//       }

//       if (maxPrice) {
//         whereClause.price = {
//           ...whereClause.price,
//           [Op.lte]: parseFloat(maxPrice),
//           ...(whereClause.price || {}),
//         };
//     }
    
//     const products = await Product.findAll({
//       where: { category_id: categoryId },
//       attributes: ["id", "name", "price"],
//       include: [
//         {
//           model: Image,
//           where: { related_type: "product" },
//           required: false,
//           attributes: ["image_url"],
//         },
//       ],
//     });

//     res.json(products);
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to fetch products for this category",
//       error: err.message,
//     });
//   }
// };


// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /categories/:id");
    console.log("Requested ID:", id);

    const category = await Category.findByPk(id, {
      paranoid: false, // include soft-deleted rows if applicable
    });

    if (!category) {
      console.log("Category not found for ID:", id);
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("Category found:", category);
    res.json(category);
  } catch (err) {
    console.error("Error fetching category:", err.message);
    res.status(500).json({ message: "Failed to fetch category", error: err.message });
  }
};

// Get all products under a specific category
export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { search, minPrice, maxPrice } = req.query;

    console.log("GET /categories/:id/products");
    console.log("Category ID:", categoryId);
    console.log("Filters:", { search, minPrice, maxPrice });

    const whereClause = {
      category_id: categoryId,
    };

    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) {
        whereClause.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice) {
        whereClause.price[Op.lte] = parseFloat(maxPrice);
      }
    }

    const products = await Product.findAll({
      where: whereClause,
      attributes: ["id", "name", "price"],
      include: [
        {
          model: Image,
          where: { related_type: "product" },
          required: false,
          attributes: ["image_url"],
        },
      ],
    });

    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({
      message: "Failed to fetch products for this category",
      error: err.message,
    });
  }
};