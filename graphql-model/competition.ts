// import axios from "axios";
// import createUser from "../controller/user";
// import { login } from "../controller/auth";
// import TenantController from "../controller/Tenant";
// import checkRole from "../middleware/checkRole";
// import CompetitionController from "../controller/"; // Import your competition controller

// const graphqlBaseUrl = "http://localhost:4000/graphql"; // Set your GraphQL API URL

// type ResolverContext = {
//   req: any; // Replace with the actual request context type
// };

// async function performGraphQLRequest(graphqlMutation: string, variables: Record<string, any>) {
//   try {
//     const response = await axios.post(
//       graphqlBaseUrl,
//       {
//         query: graphqlMutation,
//         variables,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.data.errors) {
//       throw new Error(response.data.errors[0].message);
//     }

//     return response.data.data;
//   } catch (error: any) {
//     throw new Error(`GraphQL request failed: ${error.message}`);
//   }
// }

// // Define a common field selection set for competition
// const competitionFields = `
//   id
//   category
//   name
//   code
//   place
//   fromDate
//   toDate
//   conductedBy
//   createdAt
// `;

// type CompetitionInput = {
//   category: string;
//   name: string;
//   code: string;
//   place: string;
//   fromDate: string;
//   toDate: string;
//   conductedBy: string;
// };

// const resolvers = {
//   Mutation: {
//     createUser,
//     login: async (_: any, { username, password }: { username: string; password: string }) => {
//       try {
//         const { user, token } = await login(username, password);
//         return { user, token };
//       } catch (error: any) {
//         throw Error(error.message);
//       }
//     },
//     createTenant: checkRole(["superadmin"])(
//       async (_: any, args: {
//         name: string;
//         username: string;
//         password: string;
//         role: string;
//         description: string;
//       },
//       context: ResolverContext
//     ) => {
//       try {
//         const result = await TenantController.createTenant(args);
//         return result;
//       } catch (error: any) {
//         throw Error(error.message);
//       }
//     },
//     createCompetition: async (_: any, args: { input: CompetitionInput }) => {
//       const graphqlMutation = `
//         mutation createCompetition($input: CompetitionInput!) {
//           createCompetition(input: $input) {
//             ${competitionFields}
//           }
//         }
//       `;
//       return performGraphQLRequest(graphqlMutation, { input: args.input });
//     },
//     updateCompetition: async (_: any, args: { id: string; input: CompetitionInput }) => {
//       const graphqlMutation = `
//         mutation updateCompetition($id: ID!, $input: CompetitionInput!) {
//           updateCompetition(id: $id, input: $input) {
//             ${competitionFields}
//           }
//         `;
//       return performGraphQLRequest(graphqlMutation, args);
//     },
//     deleteCompetition: async (_: any, args: { id: string }) => {
//       const graphqlMutation = `
//         mutation deleteCompetition($id: ID!) {
//           deleteCompetition(id: $id) {
//             ${competitionFields}
//           }
//         `;
//       return performGraphQLRequest(graphqlMutation, args);
//     },
//   },
//   Query: {
//     hello: () => "Hello from Apollo Server!",
//     getCompetitions: async () => {
//       try {
//         const graphqlQuery = `
//           query {
//             getCompetitions {
//               ${competitionFields}
//             }
//           }
//         `;
//         const response = await axios.post(
//           graphqlBaseUrl,
//           { query: graphqlQuery },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         return response.data.data.getCompetitions;
//       } catch (error: any) {
//         throw new Error(`Failed to get competitions: ${error.message}`);
//       }
//     },
//   },
// };

// export default resolvers;
