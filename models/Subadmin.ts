// models/Subadmin.ts

class Subadmin {
  id?: number;
  name!: string;
  username!: string;
  password!: string;
  role!: string;
  permissions: string[] = [];
  reporting!: string;
  // Add other fields as needed

  constructor(
    id: number,
    name: string,
    username: string,
    password: string,
    role: string,
    permissions: string[],
    reporting: string
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.role = role;
    this.permissions = permissions;
    this.reporting = reporting;
    // Initialize other fields here
  }
}

export { Subadmin };
