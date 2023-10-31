// auth.ts

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/auth"; // Import your JWT secret from the configuration file
import knex from "../config/db"; // Import your Knex instance
import { User } from "../models/User"; // Import the User model

// Function to handle user login
export const login = async (username: string, password: string) => {
  try {
    // Check if a user with the provided username exists in the database
    const existingUser = await knex<User>("user").where({ username }).first();

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    const role = existingUser.role;

    // Create a JSON Web Token (JWT) for the user
    const token = jwt.sign(
      { userId: existingUser.id, username, role },
      jwtSecret,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    return { user: existingUser, token };
  } catch (error) {
    throw error;
  }
};
