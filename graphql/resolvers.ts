//graphql/resolvers

import { User } from "../models/User";
import createUser from "../controller/user";

const resolvers = {
  Mutation: {
    createUser,
  },
  Query: {
    hello: () => "Hello from Apollo Server!",
  },
};

export default resolvers;
