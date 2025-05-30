// config/initdb.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const initDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_NAME ,
      connectTimeout: 10000,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );
    console.log("Database initialized (if not already)");
    await connection.end();
  } catch (error) {
    console.error("Error initializing database:", error.message, "Code:", error.code);
  }
};

initDB();
