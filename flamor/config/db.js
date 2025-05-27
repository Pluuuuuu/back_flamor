import sequelize from "./sequelize.js";

import defineUser from "../models/user.js";
import defineCategory from "../models/category.js";
import defineProduct from "../models/product.js";
import defineProductColor from "../models/productColor.js";
import defineProductVariant from "../models/productVariant.js";
import defineImage from "../models/image.js";
import defineCart from "../models/cart.js";
import defineWishlist from "../models/wishlist.js";
import defineShipping from "../models/shipping.js";
import definePayment from "../models/payment.js";
import defineOrder from "../models/order.js";
import defineOrderItem from "../models/orderitem.js";
import defineReview from "../models/review.js";
import defineActivityLog from "../models/activitylog.js";
// import defineProductTag from "../models/producttag.js";

// Initialize models
const User = defineUser(sequelize);
const Category = defineCategory(sequelize);
const Product = defineProduct(sequelize);
const ProductColor = defineProductColor(sequelize);
const ProductVariant = defineProductVariant(sequelize);
const Image = defineImage(sequelize);
const Cart = defineCart(sequelize);
const Wishlist = defineWishlist(sequelize);
const Shipping = defineShipping(sequelize);
const Payment = definePayment(sequelize);
const Order = defineOrder(sequelize);
const OrderItem = defineOrderItem(sequelize);
const Review = defineReview(sequelize);
const ActivityLog = defineActivityLog(sequelize);
// const ProductTag = defineProductTag(sequelize);

// Associations
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Wishlist, { foreignKey: "user_id" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(ActivityLog, { foreignKey: "user_id" });
ActivityLog.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Image, { foreignKey: "user_id", as: "profileImage" });
Image.belongsTo(User, { foreignKey: "user_id" });

Category.hasMany(Product, { foreignKey: "category_id" });
Product.belongsTo(Category, { foreignKey: "category_id" });

//
// 🛠 PRODUCT RELATIONS
//

// Product has many colors
Product.hasMany(ProductColor, { foreignKey: "product_id" });
ProductColor.belongsTo(Product, { foreignKey: "product_id" });

// Product has many variants (independent list)
Product.hasMany(ProductVariant, { foreignKey: "product_id" });
ProductVariant.belongsTo(Product, { foreignKey: "product_id" });

// Color has many variants (e.g., sizes per color)
ProductColor.hasMany(ProductVariant, { foreignKey: "color_id" });
ProductVariant.belongsTo(ProductColor, { foreignKey: "color_id" });

// ProductColor-specific images
ProductColor.hasMany(Image, {
  foreignKey: "related_id",
  constraints: false,
  scope: {
    related_type: "productcolor",
  },
});
Image.belongsTo(ProductColor, {
  foreignKey: "related_id",
  constraints: false,
});

// Product-level images
Product.hasMany(Image, {
  foreignKey: "related_id",
  constraints: false,
  scope: {
    related_type: "product",
  },
});
Image.belongsTo(Product, {
  foreignKey: "related_id",
  constraints: false,
});

// Product linked to order items
Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

// Product reviews
Product.hasMany(Review, { foreignKey: "product_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });

// Product in carts
Product.hasMany(Cart, { foreignKey: "product_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

// Wishlist relation
Product.hasMany(Wishlist, { foreignKey: "product_id" });
Wishlist.belongsTo(Product, { foreignKey: "product_id" });

//
// 🛒 ORDER RELATIONS
//
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Order.belongsTo(Shipping, { foreignKey: "shipping_id" });
Shipping.hasOne(Order, { foreignKey: "shipping_id" });

Order.belongsTo(Payment, { foreignKey: "payment_id" });
Payment.hasOne(Order, { foreignKey: "payment_id" });

//
// 📦 EXPORT ALL MODELS
//
export {
  User,
  Category,
  Product,
  ProductColor,
  ProductVariant,
  Image,
  Cart,
  Wishlist,
  Shipping,
  Payment,
  Order,
  OrderItem,
  Review,
  ActivityLog,
  // ProductTag,
};