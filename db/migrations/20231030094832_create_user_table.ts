// import { Knex } from "knex";

// export async function up(knex: Knex): Promise<void> {
//   return knex.schema.createTable("user", function (table) {
//     table.increments("id").primary();
//     table.string("username").notNullable();
//     table.string("password").notNullable();
//     table.string("role").notNullable();
//     table.timestamp("createdAt").defaultTo(knex.fn.now());
//   });
// }

// export async function down(knex: Knex): Promise<void> {}
