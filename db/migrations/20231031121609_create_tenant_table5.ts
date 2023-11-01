const { Knex } = require("knex");

exports.up = async function (knex) {
  return knex.schema.withSchema("tenant10").createTable("tenant10", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("username").notNullable().unique();
    table.string("password").notNullable();
    table.string("description");
    table.string("role").defaultTo("tenant10");
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("tenant10");
};
