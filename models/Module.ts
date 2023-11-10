// models/Subadmin.ts

class Module {
  id?: number;
  ModuleName: string;
  Routes: string[] = [];

  constructor(id: number, ModuleName: string, Routes: string[]) {
    this.id = id;
    this.ModuleName = ModuleName;
    this.Routes = Routes;
  }
}

export { Module };
