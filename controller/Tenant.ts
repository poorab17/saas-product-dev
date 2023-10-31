import knex, { Knex } from "knex";
import bcrypt from "bcrypt";
import { Tenant } from "../models/Tenant";

class TenantController {
  tenantDB: Knex;

  constructor() {
    // Initialize the common database connection
    this.tenantDB = knex({
      client: "mysql2",
      connection: {
        host: "localhost",
        user: "root",
        password: "root",
        database: "saas-product", // Use the common database
      },
    });
  }

  async createTenant(args: {
    name: string;
    username: string;
    password: string;
    role: string;
    description: string;
  }) {
    try {
      const { name, username, password, role, description } = args;

      // Generate a schema name based on the tenant's name
      const schemaName = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");

      // Create a schema within the common database for the tenant
      await this.tenantDB.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

      // Check if the tenant already exists in the common database
      const existingTenant = await this.tenantDB("tenant")
        .where({ username })
        .first();

      if (existingTenant) {
        throw new Error(
          "Tenant username already exists. Choose a different username."
        );
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new tenant record using your Tenant model
      const newTenant = new Tenant(
        0,
        name,
        username,
        hashedPassword,
        role,
        description
      );

      // Insert the tenant record into the 'tenant' table within the common database
      await this.tenantDB("tenant").insert(newTenant);

      return { message: "Tenant and schema created successfully" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new TenantController();
