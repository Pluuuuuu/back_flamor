// config/initdb.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const initdb = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
  );
  console.log("✅ Database initialized (if not already).");
  await connection.end();
};

initdb();
