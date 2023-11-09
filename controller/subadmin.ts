// SubadminService.ts

import { Knex } from "knex";
import { Subadmin } from "../models/Subadmin";

class SubadminService {
  async createSubadmin(tenantDB: Knex, subadminData: Subadmin) {
    const hasTable = await tenantDB.schema.hasTable("subadmin");
    if (!hasTable) {
      const up = async function (knex: Knex) {
        // Define your subadmin-related tables and columns here
        return knex.schema.createTable("subadmin", (table) => {
          table.increments("id").primary();
          table.string("name").notNullable();
          table.string("username").notNullable();
          table.string("password").notNullable();
          table.string("role").notNullable();
          table.json("permissions").notNullable();
          table.string("reporting").notNullable();
        });
      };
      await up(tenantDB);
    }

    try {
      const permissionsJSON = JSON.stringify(subadminData.permissions);
      console.log(permissionsJSON);
      console.log(subadminData);
      const subadminId = await tenantDB("subadmin").insert({
        ...subadminData,
        permissions: permissionsJSON,
      });

      if (subadminId.length === 0) {
        throw new Error(
          "Failed to insert subadmin data into the 'subadmin' table."
        );
      }

      return { message: "Subadmin data inserted successfully" };
    } catch (error: any) {
      throw error;
    }
  }
}

export default new SubadminService();
