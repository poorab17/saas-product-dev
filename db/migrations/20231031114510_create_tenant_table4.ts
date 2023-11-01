const { Knex } = require("knex");

exports.up = async function (knex) {
  return knex.schema.createTable("tenant2", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("username").notNullable().unique();
    table.string("password").notNullable();
    table.string("description");
    table.string("role").defaultTo("tenant2");
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("tenant");
};
