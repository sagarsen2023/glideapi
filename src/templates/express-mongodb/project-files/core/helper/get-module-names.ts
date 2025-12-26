import fs from "fs-extra";
import path from "path";

export const getGlideApiModuleNames = async (): Promise<string[]> => {
  const moduleRoutes = path.resolve(__dirname, "../../src/modules");
  console.log(moduleRoutes);
  return await fs.readdir(moduleRoutes);
};

export const getGlideApiModuleNamesForFrontend = async (): Promise<
  string[]
> => {
  const projectRoot = path.resolve(process.cwd(), "../..");
  const moduleRoutes = path.resolve(projectRoot, "src/modules");
  console.log(moduleRoutes);
  return await fs.readdir(moduleRoutes);
};
