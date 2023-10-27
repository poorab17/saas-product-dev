import mysql from "mysql2";

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "saas-product",
});

// Define an async function for connecting to the database
const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        console.error("Error connecting to the database:", error.message);
        reject(error);
      } else {
        console.log("Database connected successfully");
        // Release the connection after use
        connection.release();
        resolve(pool);
      }
    });
  });
};

export { pool, connectToDatabase };
