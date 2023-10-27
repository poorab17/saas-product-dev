import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./graphql/typeDef";
import resolvers from "./graphql/resolvers";
import { connectToDatabase } from "./config/db";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await connectToDatabase(); // Wait for the database connection to be established
  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
  });
  console.log("Server listening at", url);
};

startServer();

console.log("server listening at port 5000");
