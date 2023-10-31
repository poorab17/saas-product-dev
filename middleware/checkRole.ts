// src/middleware/checkRole.ts

import { AuthenticationError, ForbiddenError } from "apollo-server";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/auth";
import { User } from "../models/User";
import { Tenant } from "../models/Tenant";
import { Request } from "express";

const checkRole = (roles: string[]) => async (req: Request, context: any) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new AuthenticationError("Authentication failed. Token not found.");
  }

  const token = authorizationHeader.replace("Bearer ", "");

  if (!token) {
    throw new AuthenticationError("Authentication failed. Token not found.");
  }

  try {
    const decoded: any = jwt.verify(token, jwtSecret);

    if (!roles.includes(decoded.role)) {
      throw new AuthenticationError("Insufficient role privileges.");
    }
  } catch (error) {
    throw new AuthenticationError("Authentication failed. Token is not valid.");
  }
};

export default checkRole;
