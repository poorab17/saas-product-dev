const { Knex } = require("knex");

exports.up = async function (knex) {
  return knex.schema.createTable("user", function (table) {
    table.increments("id").primary();
    table.string("username").notNullable();
    table.string("password").notNullable();
    table.string("role").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("user");
};
