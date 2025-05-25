import { DataTypes } from "sequelize";
export default (sequelize) => {
  return sequelize.define(
    "ProductVariant",
    {
      // size: DataTypes.STRING, // instead of generic variant_name/value
      
      variant_name: DataTypes.STRING,      // e.g., "Size"
      variant_value: DataTypes.STRING,     // e.g., "M"
      additional_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      stock: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
