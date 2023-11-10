// SubadminService.ts
import knex, { Knex } from "knex";
import { Subadmin } from "../models/Subadmin";
import bcrypt from "bcrypt";

class SubadminService {
  async createTenantSubadminDB() {
    const tenantSubadminDB = knex({
      client: "mysql2",
      connection: {
        host: "localhost",
        user: "root",
        password: "root",
        database: "tenant_subadmin",
      },
    });

    // Create tenant_subadmin database if not exists
    const hasDatabase = await tenantSubadminDB.raw(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'tenant_subadmin'`
    );

    if (hasDatabase.length === 0) {
      await tenantSubadminDB.raw(
        `CREATE DATABASE IF NOT EXISTS tenant_subadmin`
      );
    }

    // Create tenant_subadmin table if not exists
    const hasSubadminTable = await tenantSubadminDB.schema.hasTable(
      "tenant_subadmin"
    );

    if (!hasSubadminTable) {
      await tenantSubadminDB.schema.createTable("tenant_subadmin", (table) => {
        table.increments("id").primary();
        table.string("username").notNullable();
        table.string("role").notNullable();
        table.string("reporting").notNullable();
      });
    }
  }

  async getSubadminByUsername(username: string) {
    try {
      // Connect to the tenant_subadmin database
      const tenantSubadminDB = knex({
        client: "mysql2",
        connection: {
          host: "localhost",
          user: "root",
          password: "root",
          database: "tenant_subadmin",
        },
      });

      // Query the tenant_subadmin table for the subadmin
      const subadminInDB = await tenantSubadminDB<Subadmin>("tenant_subadmin")
        .where({ username })
        .first();

      return subadminInDB;
    } catch (error: any) {
      throw error;
    }
  }

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
      await this.createTenantSubadminDB();

      // Connect to the tenant_subadmin database
      const tenantSubadminDB = knex({
        client: "mysql2",
        connection: {
          host: "localhost",
          user: "root",
          password: "root",
          database: "tenant_subadmin", // Use a single database for all subadmins
        },
      });

      // Insert common subadmin information into tenant_subadmin table
      const tenantSubadminData = {
        username: subadminData.username,
        role: subadminData.role,
        reporting: subadminData.reporting,
      };

      const tenantSubadminInsert = await tenantSubadminDB(
        "tenant_subadmin"
      ).insert(tenantSubadminData);

      if (tenantSubadminInsert.length === 0) {
        throw new Error(
          "Failed to insert subadmin data into the 'tenant_subadmin' table."
        );
      }

      const permissionsJSON = JSON.stringify(subadminData.permissions);
      const hashedPassword = await bcrypt.hash(subadminData.password, 10);
      console.log(permissionsJSON);
      console.log(subadminData);
      console.log(hashedPassword);
      const subadminId = await tenantDB("subadmin").insert({
        ...subadminData,
        permissions: permissionsJSON,
        password: hashedPassword,
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

  async getSubadminData(
    dbName: string | undefined,
    username: string
  ): Promise<Subadmin | null> {
    try {
      if (!dbName) {
        throw new Error("Database name is not provided.");
      }

      // Connect to the specified database
      const tenantSubadminDB = knex({
        client: "mysql2",
        connection: {
          host: "localhost",
          user: "root",
          password: "root",
          database: dbName,
        },
      });

      // Check if the 'subadmin' table exists in the specified database
      const hasTable = await tenantSubadminDB.schema.hasTable("subadmin");

      if (!hasTable) {
        throw new Error(
          `The 'subadmin' table does not exist in the database '${dbName}'.`
        );
      }

      // Query the 'subadmin' table for the subadmin
      const subadminInDB = await tenantSubadminDB<Subadmin>("subadmin")
        .where({ username })
        .first();

      return subadminInDB || null;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new SubadminService();
