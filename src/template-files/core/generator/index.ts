import { DTOContent } from "./dto-generator";
import { ModelContent } from "./model-generator";
import fs from "fs-extra";
import path from "path";
import { errorLog } from "@/utils/logger";

// ? Generators
import { glideModelGenerator } from "./model-generator";
import { glideDTOGenerator } from "./dto-generator";
import { glideRouteGenerator } from "./route-generator";

interface GenerateGlideModuleOptions {
  moduleName: string;
  modelContent: ModelContent;
  dtoOptions: {
    getDTOContent: DTOContent;
    createDTOContent: DTOContent;
    updateDTOContent: DTOContent;
  };
  isAuthenticated?: boolean;
}

const MODULE_DIRECTORY = path.resolve(__dirname, "../../src/modules");

const generateGlideModule = async (
  moduleConfig: GenerateGlideModuleOptions,
) => {
  try {
    const {
      moduleName,
      modelContent,
      dtoOptions: { createDTOContent, getDTOContent, updateDTOContent },
      isAuthenticated,
    } = moduleConfig;

    const [modelFileContent, dtoFileContent, routeFileContent] =
      await Promise.all([
        // Generate Model
        glideModelGenerator({ modelName: moduleName, modelContent }),

        // Generate DTOs
        glideDTOGenerator({
          moduleName,
          getOptions: getDTOContent,
          createOptions: createDTOContent,
          updateOptions: updateDTOContent,
        }),

        // Generate Routes
        glideRouteGenerator({ moduleName, isAuthenticated }),
      ]);

    if (!modelFileContent || !dtoFileContent || !routeFileContent) {
      throw new Error("Failed to generate one or more module files.");
    }

    const modulePath = path.join(MODULE_DIRECTORY, moduleName);
    const dtoPath = path.join(modulePath, "dto");
    const routesPath = path.join(modulePath, "routes");

    // Ensure every directory exists
    await fs.ensureDir(modulePath);
    await fs.ensureDir(dtoPath);
    await fs.ensureDir(routesPath);

    // Write files - Force overwrite if they exist because they are dependent to each other
    await fs.writeFile(
      path.join(modulePath, `${moduleName}.model.ts`),
      modelFileContent,
    );
    await fs.writeFile(
      path.join(dtoPath, `${moduleName}.dto.ts`),
      dtoFileContent,
    );

    // Don't overwrite routes if they already exist
    // * If authentication is changed then it it will automatically handled in the route mapper
    // ! Above feature will be added in future implementation
    const isRouteFileExists = await fs.pathExists(
      path.join(routesPath, `${moduleName}.routes.ts`),
    );
    if (!isRouteFileExists) {
      await fs.writeFile(
        path.join(routesPath, `${moduleName}.routes.ts`),
        routeFileContent,
      );
    }
  } catch (e) {
    errorLog(
      `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error generating module ${
        moduleConfig.moduleName
      }: ${(e as Error).message}`,
    );
  }
};

export { generateGlideModule };
