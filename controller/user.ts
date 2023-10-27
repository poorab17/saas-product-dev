// Import the mysql2 pool
import { pool } from "../config/db";
import { format } from "date-fns";

// Function to create a new user
const createUser = async (
  _: any,
  { username, password }: { username: string; password: string | null }
) => {
  try {
    // Create a new user with the current timestamp for createdAt
    const createdAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    password = password || null;
    // Execute the INSERT query
    const query =
      "INSERT INTO user (username, password, createdAt) VALUES (?, ?, ?)";
    await pool.promise().execute(query, [username, password, createdAt]);

    // If execution completes without errors, the user has been created.
    return {
      username,
      createdAt,
    };
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    throw new Error("Failed to create a user");
  }
};

export default createUser;
