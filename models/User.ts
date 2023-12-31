//models/user.ts

class User {
  id!: number;
  username!: string;
  password!: string;
  role!: string;
  createdAt: Date;

  constructor(
    id: number,
    username: string,
    password: string,
    role: string,
    createdAt: Date
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.createdAt = createdAt;
    this.role = role;
  }
}

export { User };
