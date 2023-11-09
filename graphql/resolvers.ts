//graphql/resolvers

import { User } from "../models/User";
import knex, { Knex } from "knex";
import axios from "axios";
import createUser from "../controller/user";
import { login } from "../controller/auth";
import TenantController from "../controller/Tenant";
import checkRole from "../middleware/checkRole";
import SubadminService from "../controller/subadmin";

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
        const { user, payload, token } = await login(username, password);
        const response = { user, payload, token };
        // console.log(response);
        return response;
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

    createSubadmin: checkRole(["tenant"])(
      async (
        _: any,
        args: {
          name: string;
          username: string;
          password: string;
          role: string;
          permissions: string[];
          reporting: string;
        },
        context: ResolverContext
      ) => {
        try {
          // Get the authenticated tenant's username from the context (assuming you have authentication implemented)
          const subadminData = {
            name: args.name,
            username: args.username,
            password: args.password,
            role: args.role,
            permissions: args.permissions,
            reporting: args.reporting,
          };

          console.log(context, "context middleare");

          const data = Object.values(context);
          console.log(data[0], "data");
          const { username, role } = data[0];
          // Find the tenant's database based on the authenticated tenant's username
          const tenantDB = knex({
            client: "mysql2",
            connection: {
              host: "localhost",
              user: "root",
              password: "root",
              database: username,
            },
          });

          // Use the SubadminService to create subadmin-related tables if not already created
          const result = await SubadminService.createSubadmin(
            tenantDB,
            subadminData
          );

          return result;
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    ),

    // New mutation to create a competition by making an HTTP request to the microservice
    createCompetition: async (
      _: any,
      args: {
        category: string;
        name: string;
        code: string;
        place: string;
        fromDate: string;
        toDate: string;
        conductedBy: string;
      }
    ) => {
      try {
        // Define the data to send in the request body
        const data = {
          category: args.category,
          name: args.name,
          code: args.code,
          place: args.place,
          fromDate: args.fromDate,
          toDate: args.toDate,
          conductedBy: args.conductedBy,
        };

        console.log(data);

        // Define the GraphQL mutation
        const graphqlMutation = `
  mutation createCompetition($category: String!, $name: String!, $code: String!, $place: String!, $fromDate: String!, $toDate: String!, $conductedBy: String!) {
    createCompetition(category: $category, name: $name, code: $code, place: $place, fromDate: $fromDate, toDate: $toDate, conductedBy: $conductedBy) {
      name
      category
      code
      conductedBy
      createdAt
      fromDate
      id
      place
      toDate
    }
  }
`;
        // Make an HTTP POST request to the microservice's createCompetition endpoint
        // console.log(graphqlMutation);

        const response = await axios.post(
          "http://localhost:4000/graphql",
          {
            query: graphqlMutation,
            variables: data,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("response data", response.data);
        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }

        return response.data.data.createCompetition;
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to create competition: ${error.message}`,
        };
      }
    },
    updateCompetition: async (
      _: any,
      args: {
        id: string;
        category: string;
        name: string;
        code: string;
        place: string;
        fromDate: string;
        toDate: string;
        conductedBy: string;
      }
    ) => {
      try {
        const {
          id,
          category,
          name,
          code,
          place,
          fromDate,
          toDate,
          conductedBy,
        } = args;

        // Define the GraphQL mutation for updating a competition
        const graphqlMutation = `
          mutation updateCompetition(
            $id: ID!
            $category: String!
            $name: String!
            $code: String!
            $place: String!
            $fromDate: String!
            $toDate: String!
            $conductedBy: String!
          ) {
            updateCompetition(
              id: $id
              category: $category
              name: $name
              code: $code
              place: $place
              fromDate: $fromDate
              toDate: $toDate
              conductedBy: $conductedBy
            ) {
              id
              category
              name
              code
              place
              fromDate
              toDate
              conductedBy
              createdAt
            }
          }
        `;

        // Make an HTTP POST request to the microservice's updateCompetition endpoint
        const response = await axios.post(
          "http://localhost:4000/graphql",
          {
            query: graphqlMutation,
            variables: {
              id,
              category,
              name,
              code,
              place,
              fromDate,
              toDate,
              conductedBy,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }

        return response.data.data.updateCompetition;
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to update competition: ${error.message}`,
        };
      }
    },

    deleteCompetition: async (
      _: any,
      args: {
        id: string;
      }
    ) => {
      try {
        const { id } = args;

        // Define the GraphQL mutation for deleting a competition
        const graphqlMutation = `
          mutation deleteCompetition($id: ID!) {
            deleteCompetition(id: $id) {
              id
              category
              name
              code
              place
              fromDate
              toDate
              conductedBy
              createdAt
            }
          }
        `;

        // Make an HTTP POST request to the microservice's deleteCompetition endpoint
        const response = await axios.post(
          "http://localhost:4000/graphql",
          {
            query: graphqlMutation,
            variables: {
              id,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }

        return response.data.data.deleteCompetition;
      } catch (error: any) {
        return {
          success: false,
          message: `Failed to delete competition: ${error.message}`,
        };
      }
    },
  },

  Query: {
    hello: () => "Hello from Apollo Server!",
    getCompetitions: async () => {
      try {
        // Define the GraphQL query
        const graphqlQuery = `
      query {
        getCompetitions {
          name
          category
          code
          conductedBy
          createdAt
          fromDate
          id
          place
          toDate
        }
      }
    `;

        const response = await axios.post(
          "http://localhost:4000/graphql",
          { query: graphqlQuery },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data.data);
        return response.data.data.getCompetitions;
      } catch (error: any) {
        throw new Error(`Failed to get competitions: ${error.message}`);
      }
    },
  },
};

export default resolvers;
