//controller/Tenant

import { Request, Response } from "express";
import knex, { Knex } from "knex"; // Assuming you have your Knex configuration correctly set up
import bcrypt from "bcrypt";
import { Module } from "../models/Module"; // Import your Tenant model

class ModuleController {
  async createModule(args: { ModuleName: string; Routes: string[] }) {
    try {
      const { ModuleName, Routes } = args;

      const systemDB = knex({
        client: "mysql2",
        connection: {
          host: "localhost",
          user: "root",
          password: "root",
          database: "saas-product", // Replace with your system database name
        },
      });

      // Define the migration functions directly within the controller

      const up = async function (knex: Knex) {
        const hasTable = await systemDB.schema.hasTable("module");
        if (!hasTable) {
          return knex.schema.createTable("module", (table) => {
            table.increments("id").primary();
            table.string("ModuleName").notNullable();
            table.json("Routes").notNullable();
          });
        }
        await up(systemDB);
      };

      const down = async function (knex: Knex) {
        return knex.schema.dropTable("module");
      };

      const existingModule = await systemDB("module")
        .where({ ModuleName })
        .first();

      if (existingModule) {
        throw new Error(
          "Module already exist . Choose a different moduleName."
        );
      }

      const routeJSON: any = JSON.stringify(Routes);
      console.log(routeJSON);
      const newModule = new Module(0, ModuleName, routeJSON);

      const moduleinfo = await systemDB("module").insert(newModule);

      if (moduleinfo.length === 0) {
        throw new Error(
          "Failed to insert module data into the 'master' table."
        );
      }

      return { message: "Module inserted successfully" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new ModuleController();
