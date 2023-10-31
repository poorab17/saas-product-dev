import knex from "../config/db"; // Import your Knex instance
import bcrypt from "bcrypt";

interface User {
  id: number; // Adjust the type as per your user ID type
  username: string;
  password: string;
  role: string;
  createdAt: Date;
}

const createUser = async (
  _: any,
  {
    username,
    password,
    role,
  }: { username: string; password: string; role: string }
): Promise<User> => {
  try {
    const existingUser = await knex("user").where({ username }).first();

    if (existingUser) {
      console.log(existingUser, "exist user");
      throw new Error("Username already exists. Choose a different username.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the current timestamp for createdAt
    const createdAt = new Date();

    // Use Knex to insert the user data into the database
    const result = await knex.transaction(async (trx) => {
      const [userId] = await trx("user").insert({
        username,
        password: hashedPassword,
        role,
        createdAt,
      });

      return userId;
    });

    if (result) {
      const user: User = {
        id: result,
        username,
        password: hashedPassword,
        role,
        createdAt,
      };
      console.log(user);
      return user;
    } else {
      throw new Error("Failed to create a user");
    }
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    throw Error("Failed to create a user");
  }
};

export default createUser;
