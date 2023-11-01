import { Request, Response } from "express";
import knex, { Knex } from "knex"; // Assuming you have your Knex configuration correctly set up
import bcrypt from "bcrypt";
import { Tenant } from "../models/Tenant"; // Import your Tenant model

class TenantController {
  async createTenant(args: {
    name: string;
    username: string;
    password: string;
    role: string;
    description: string;
  }) {
    try {
      const { name, username, password, role, description } = args;

      // Generate a database name based on the tenant's name
      const dbName = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");

      const systemDB = knex({
        client: "mysql2",
        connection: {
          host: "localhost",
          user: "root",
          password: "root",
          database: "saas-product", // Replace with your system database name
        },
      });

      await systemDB.raw(`CREATE DATABASE IF NOT EXISTS ${dbName}`);

      const tenantDB = knex({
        client: "mysql2",
        connection: {
          host: "localhost",
          user: "root",
          password: "root",
          database: dbName,
        },
      });

      await tenantDB.raw("SELECT 1");
      console.log("Tenant Database connected successfully");

      // Define the migration functions directly within the controller

      const up = async function (knex: Knex) {
        return knex.schema.createTable("tenant", (table) => {
          table.increments("id").primary();
          table.string("name").notNullable();
          table.string("username").notNullable().unique();
          table.string("password").notNullable();
          table.string("description");
          table.string("role").defaultTo("tenant");
        });
      };

      const down = async function (knex: Knex) {
        return knex.schema.dropTable("tenant");
      };

      await up(tenantDB);

      const existingTenant = await tenantDB("tenant")
        .where({ username })
        .first();

      if (existingTenant) {
        throw new Error(
          "Tenant username already exists. Choose a different username."
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newTenant = new Tenant(
        0,
        name,
        username,
        hashedPassword,
        role,
        description
      );

      const tenantId = await tenantDB("tenant").insert(newTenant);

      if (tenantId.length === 0) {
        throw new Error(
          "Failed to insert tenant data into the 'tenant' table."
        );
      }

      return { message: "Tenant and database created successfully" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new TenantController();
