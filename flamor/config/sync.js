import sequelize from "./sequelize.js";
import "./db.js";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ All models synchronized.");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
};

syncDatabase();
