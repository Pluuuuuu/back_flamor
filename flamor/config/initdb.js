// config/initdb.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const initdb = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );
    console.log("✅ Database initialized (if not already).");
    await connection.end();
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
  }
};

initdb();
