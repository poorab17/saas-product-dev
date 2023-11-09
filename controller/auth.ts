// auth.ts

// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { jwtSecret } from "../config/auth"; // Import your JWT secret from the configuration file
// import knex from "../config/db"; // Import your Knex instance
// import { User } from "../models/User"; // Import the User model
// import { Tenant } from "../models/Tenant";

// // Function to handle user login
// export const login = async (username: string, password: string) => {
//   try {
//     // Check if a user with the provided username exists in the database
//     const existingUser = await knex<User>("user").where({ username }).first();

//     if (!existingUser) {
//       throw new Error("User not found");
//     }

//     // Compare the provided password with the hashed password in the database
//     const passwordMatch = await bcrypt.compare(password, existingUser.password);

//     if (!passwordMatch) {
//       throw new Error("Incorrect password");
//     }

//     const role = existingUser.role;

//     // Create a JSON Web Token (JWT) for the user
//     const token = jwt.sign(
//       { userId: existingUser.id, username, role },
//       jwtSecret,
//       {
//         expiresIn: "1h", // Token expires in 1 hour
//       }
//     );

//     return { user: existingUser, token };
//   } catch (error) {
//     throw error;
//   }
// };

// auth.ts

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/auth";
import knex from "../config/db";
import { User } from "../models/User";
import { Tenant } from "../models/Tenant";

export const login = async (username: string, password: string) => {
  try {
    let user: Tenant | User | null = null; // Initialize as null
    let userType: "superadmin" | "tenant" | null = null;

    // Check if a user with the provided username exists in the "user" table
    user = (await knex<User>("user").where({ username }).first())!; // Use the non-null assertion operator

    if (user) {
      // Compare the provided password with the hashed password in the "user" table
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        userType = "superadmin";
      }
    }

    if (!user || userType === null) {
      // If the user was not found in the "user" table, check the "tenant" table
      const tenant = await knex<Tenant>("tenant").where({ username }).first();
      if (tenant) {
        // Compare the provided password with the hashed password in the "tenant" table
        const passwordMatch = await bcrypt.compare(password, tenant.password);

        if (passwordMatch) {
          userType = "tenant";
          user = tenant; // Assign the tenant as the user
        }
      }
    }
    // console.log(userType);
    if (user && userType) {
      const role = user.role;
      const payload =
        userType === "superadmin"
          ? { userId: user.id, username, role } // Use "userId" for the superadmin
          : { tenantId: user.id, username, role }; // Use "tenantId" for the tenant
      //console.log(payload);
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
      const response: any = { user, payload, token };
      return response;
    }

    throw new Error("User or tenant not found or incorrect password");
  } catch (error) {
    throw error;
  }
};

// Function to verify a JWT token
export const verifyToken = (token: string) => {
  try {
    // console.log("verify_token", token);
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null; // Token is not valid
  }
};

// Function to retrieve the user's role from a decoded token
export const getUserRole = (decodedToken: any) => {
  //console.log("getRole", decodedToken.username)
  return { role: decodedToken.role, username: decodedToken.username };
};
