import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./graphql/typeDef";
import resolvers from "./graphql/resolvers";
import knexDB from "./config/db";
import { verifyToken, getUserRole } from "./controller/auth";
import { Request } from "express";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const authorizationHeader = req.headers?.authorization;
      console.log(authorizationHeader);
      let authScope = null; // Default value when the user is not authenticated

      if (authorizationHeader) {
        // const token = authorizationHeader.replace("Bearer ", "");
        const token = authorizationHeader;
        // console.log(token);
        // Verify the JWT token
        const decodedToken = verifyToken(token);
        console.log(decodedToken);
        if (decodedToken) {
          // Retrieve the user's role from the decoded token
          authScope = getUserRole(decodedToken);
        }
      }

      return { authScope };
    },

    listen: { port: 5000 },
  });

  console.log("Server listening at", url);
};

startServer();

console.log("Server listening at port 5000");

// import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import typeDefs from "./graphql/typeDef";
// import resolvers from "./graphql/resolvers";
// import knexDB from "./config/db";

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// const startServer = async () => {
//   // Wait for the database connection to be established
//   const { url } = await startStandaloneServer(server, {
//     listen: { port: 5000 },
//   });

//   console.log("Server listening at", url);
// };

// startServer();

// console.log("server listening at port 5000");
