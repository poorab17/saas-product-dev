//graphql/typeDef

const { gql } = require("@apollo/server");

const typeDefs = `#gql
  type User {
    id: ID!
    username: String!
    password: String!
  }

  type Mutation {
    createUser(username: String!, password: String!): User
  }

  type Query {
    hello: String
  }
`;

export default typeDefs;
