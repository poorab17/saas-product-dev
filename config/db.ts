import knex from "knex";

const environment = process.env.NODE_ENV || "development"; // You can set the NODE_ENV environment variable to specify the environment
const knexConfig = require("../knexfile")[environment];
const knexDB = knex(knexConfig);

// Function to connect to the database
const connectToDatabase = async () => {
  try {
    await knexDB.raw("SELECT 1"); // Check the database connection
    console.log("Database connected successfully");
    return knexDB;
  } catch (error: any) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
};

connectToDatabase()
  .then((database) => {})
  .catch((error) => {
    console.error("Database connection error:", error);
  });

export default knexDB;
