// // src/middleware/checkRole.ts

// import { AuthenticationError } from "apollo-server";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/auth";

const checkRole =
  (requiredRoles: string[]) =>
  (resolverFunction: any) =>
  async (parent: any, args: any, context: any, info: any) => {
    console.log(requiredRoles, "requireed role");
    console.log(context.authScope, "from app");

    if (!context.authScope) {
      throw new GraphQLError("Authentication failed. Token not found.");
    }

    if (!requiredRoles.includes(context.authScope)) {
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    }

    return resolverFunction(parent, args, context, info);
  };

export default checkRole;
