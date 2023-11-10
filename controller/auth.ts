import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/auth";
import knex from "../config/db";
import SubadminService from "../controller/subadmin";
import { User } from "../models/User";
import { Tenant } from "../models/Tenant";
import { Subadmin } from "../models/Subadmin";

export const login = async (username: string, password: string) => {
  try {
    let user: Tenant | User | Subadmin | null = null; // Initialize as null
    let userType: "superadmin" | "tenant" | "subadmin" | null = null;

    user = (await knex<User>("user").where({ username }).first())!; // Use the non-null assertion operator

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        userType = "superadmin";
      }
    }

    if (!user || userType === null) {
      const tenant = await knex<Tenant>("tenant").where({ username }).first();
      if (tenant) {
        const passwordMatch = await bcrypt.compare(password, tenant.password);

        if (passwordMatch) {
          userType = "tenant";
          user = tenant;
        }
      }
    }

    // if (!user || userType === null) {
    //   const subadminInDB = await SubadminService.getSubadminByUsername(
    //     username
    //   );
    //   const dbname = subadminInDB?.reporting;
    //   const subadmin = await SubadminService.getSubadminData(dbname, username);
    //   console.log(subadmin?.password);

    //   if (subadmin) {
    //     const passwordMatch = await bcrypt.compare(
    //       password,
    //       subadmin?.password
    //     );

    //     if (password === subadmin?.password) {
    //       userType = "subadmin";
    //     }
    //   }
    // }

    if (!user || userType === null) {
      const subadminInDB = await SubadminService.getSubadminByUsername(
        username
      );

      if (subadminInDB) {
        const dbname = subadminInDB.reporting;
        const subadmin = await SubadminService.getSubadminData(
          dbname,
          username
        );

        if (subadmin) {
          const passwordMatch = await bcrypt.compare(
            password,
            subadmin.password || ""
          );

          if (passwordMatch) {
            userType = "subadmin";
            user = subadmin;
          }
        }
      }
    }

    console.log(userType);

    if (user && userType) {
      const role = user.role;
      console.log(role);
      let payload: any;

      if (userType === "superadmin") {
        payload = { userId: user.id, username, role };
      } else if (userType === "tenant") {
        payload = { tenantId: user.id, username, role };
      } else if (userType === "subadmin") {
        payload = { subadminId: user.id, username, role };
      }

      const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
      const response: any = { user, payload, token };
      return response;
    } else {
      // Handle the case where none of the conditions are met
      throw new Error(
        "User or tenant or subadmin not found or incorrect password"
      );
    }
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

// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { jwtSecret } from "../config/auth";
// import knex from "knex";
// // import knex, { Knex } from "knex";
// import { User } from "../models/User";
// import { Tenant } from "../models/Tenant";
// import { Subadmin } from "../models/Subadmin";
// import SubadminService from "../controller/subadmin";
// export const login = async (username: string, password: string) => {
//   try {
//     let user: Tenant | User | Subadmin | null = null;
//     let userType: "superadmin" | "tenant" | "subadmin" | null = null;

//     user = (await knex<User>("user").where({ username }).first())!;

//     const tenantsubadminDB = SubadminService.getSubadminByUsername(username);
//     console.log(tenantsubadminDB);

//     if (user) {
//       const passwordMatch = await bcrypt.compare(password, user.password);

//       if (passwordMatch) {
//         userType = "superadmin";
//       }
//     }

//     if (!user || userType === null) {
//       const tenant = await knex<Tenant>("tenant").where({ username }).first();
//       if (tenant) {
//         const passwordMatch = await bcrypt.compare(password, tenant.password);

//         if (passwordMatch) {
//           userType = "tenant";
//           user = tenant;
//         }
//       }
//     }

//     if (!user || userType === null) {
//       const tenantSubadminDB = knex({
//         client: "mysql2",
//         connection: {
//           host: "localhost",
//           user: "root",
//           password: "root",
//           database: "tenant_subadmin",
//         },
//       });

//       // Query the tenant_subadmin table for the subadmin
//       const subadminInDB = await tenantSubadminDB<Subadmin>("tenant_subadmin")
//         .where({ username })
//         .first();
//       console.log(subadminInDB);
//       // const tenantsubadminDB = SubadminService.getSubadminByUsername(username);
//       // console.log(tenantsubadminDB);
//       // const tenantsubadminDB =SubadminService.getSubadminByUsername(username);
//       // console.log(tenantsubadminDB);
//       // const subadminInDBTenant = await tenantsubadminDB<Subadmin>(
//       //   "tenant_subadmin"
//       // )
//       //   .where({ username })
//       //   .first();
//       // console.log(subadminInDBTenant);
//       // if (subadminInDBTenant) {
//       //   // Retrieve reporting data
//       //   const reportingData = subadminInDBTenant.reporting;
//       //   // Establish connection with the corresponding tenant database
//       //   const tenantDB = knex({
//       //     client: "mysql2",
//       //     connection: {
//       //       host: "localhost",
//       //       user: "root",
//       //       password: "root",
//       //       database: reportingData,
//       //     },
//       //   });
//       //   // Verify subadmin credentials in the tenant database
//       //   const subadminInDB = await tenantDB<Subadmin>("subadmin")
//       //     .where({ username })
//       //     .first();
//       //   if (subadminInDB) {
//       //     const passwordMatch = await bcrypt.compare(
//       //       password,
//       //       subadminInDB.password
//       //     );
//       //     if (passwordMatch) {
//       //       userType = "subadmin";
//       //       user = subadminInDB;
//       //     }
//       //   }
//       // }
//     }

//     if (user && userType) {
//       const role = user.role;
//       let payload: any;

//       if (userType === "superadmin") {
//         payload = { userId: user.id, username, role };
//       } else if (userType === "tenant") {
//         payload = { tenantId: user.id, username, role };
//       } else if (userType === "subadmin") {
//         payload = { subadminId: user.id, username, role };
//       }

//       const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
//       const response: any = { user, payload, token };
//       return response;
//     }

//     throw new Error(
//       "User or tenant or subadmin not found or incorrect password"
//     );
//   } catch (error) {
//     throw error;
//   }
// };

// // Function to verify a JWT token
// export const verifyToken = (token: string) => {
//   try {
//     // console.log("verify_token", token);
//     return jwt.verify(token, jwtSecret);
//   } catch (error) {
//     return null; // Token is not valid
//   }
// };

// // Function to retrieve the user's role from a decoded token
// export const getUserRole = (decodedToken: any) => {
//   //console.log("getRole", decodedToken.username)
//   return { role: decodedToken.role, username: decodedToken.username };
// };
