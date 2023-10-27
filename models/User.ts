import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/db";

class User {
  id!: number;
  username!: string;
  password!: string | null;
  createdAt: Date;

  constructor(
    id: number,
    username: string,
    password: string | null,
    createdAt: Date
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.createdAt = createdAt;
  }
}

export { User };
