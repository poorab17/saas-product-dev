//graphql/typeDef

import gql from "@apollo/server";

const typeDefs = `

  type User {
    id: ID!
    username: String!
    password: String!
    role:String!
  }

    type Tenant {
    id: ID!
    name: String!
    username: String!
    password: String!
    description: String
    role: String!
  }

   type Subadmin {
    id: ID!
    name: String!
    username: String!
    password: String!
    role: String!
    permissions: [String]!
    reporting: String!
  }

  type Module{
     id: ID!
    ModuleName:String!
    Routes:[String]!
  }

   type AuthPayload {
    user: User
    tenant:Tenant
    token: String
  }

   input CompetitionInput {
    category: String!
    name: String!
    code: String!
    place: String!
    fromDate: String!
    toDate: String!
    conductedBy: String!
  }

type Competition {
  id: ID!
  category: String!
  name: String!
  code: String!
  place: String!
  fromDate: String!
  toDate: String!
  conductedBy: String!
  createdAt:String
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

createModule(
    ModuleName:String!
    Routes:[String]!
    ):Module 


     createSubadmin(
      name: String!
      username: String!
      password: String!
      role: String!
      permissions: [String]!
      reporting: String!
    ): Subadmin

     createCompetition(data: CompetitionInput): Competition
    updateCompetition(id: ID!, data: CompetitionInput): Competition
    deleteCompetition(id: ID!): Competition
  }

  type Query {
    hello: String
     getCompetitions: [Competition] 
  }
`;

export default typeDefs;
