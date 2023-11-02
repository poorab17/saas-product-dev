//graphql/resolvers

import { User } from "../models/User";
import createUser from "../controller/user";
import { login } from "../controller/auth";
import TenantController from "../controller/Tenant";
import checkRole from "../middleware/checkRole";

type ResolverContext = {
  req: any; // Replace with the actual request context type
};

const resolvers = {
  Mutation: {
    createUser,

    login: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      try {
        const { user, token } = await login(username, password);
        return { user, token };
      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    createTenant: checkRole(["superadmin"])(
      async (
        _: any,
        args: {
          name: string;
          username: string;
          password: string;
          role: string;
          description: string;
        },
        context: ResolverContext
      ) => {
        try {
          const result = await TenantController.createTenant(args);
          return result;
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    ),
  },

  Query: {
    hello: () => "Hello from Apollo Server!",
  },
};

export default resolvers;
