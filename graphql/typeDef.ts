//graphql/typeDef

import gql from "@apollo/server";

const typeDefs = `

  type User {
    id: ID!
    username: String!
    password: String!
    role:String!
  }
 type AuthPayload {
    user: User
    token: String
  }

    type Tenant {
    id: ID!
    name: String!
    username: String!
    password: String!
    description: String
    role: String!
  }

  type Mutation {
    createUser(username: String!, password: String!,role:String!): User
     login(username: String!, password: String!): AuthPayload # Add the login mutation
     createTenant(
      name: String!
      username: String!
      password: String!
      role: String!
      description: String
    ): Tenant
  }

  type Query {
    hello: String
  }
`;

export default typeDefs;
