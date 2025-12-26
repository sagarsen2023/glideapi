import fs from "fs-extra";
import path from "path";
import { successLog, errorLog, infoLog } from "../../utils/logger";
import textToCamelCase from "../../utils/text-to-camel-case";
import { upperCamelCase } from "../../utils/text-to-upper-camel-case";

const cwd = process.cwd();

/**
 * Generates a model file for a given module name.
 * @param moduleName - The name of the module (e.g., "blogs")
 */
const generateModel = (moduleName: string) => {
  const modulePath = path.join(cwd, "src", "modules", moduleName);
  fs.ensureDirSync(modulePath);

  const modelPath = `${modulePath}/${moduleName}.model.ts`;
  const isModelExists = fs.existsSync(modelPath);

  if (!isModelExists) {
    const typeNamePascal = upperCamelCase({ str: moduleName, separator: "-" });
    const modelName = typeNamePascal + "s";

    fs.writeFileSync(
      modelPath,
      `import { Schema, model, models, type Document, type Model } from "mongoose";

export interface ${typeNamePascal}Type extends Document {
  name: string;
  // Add your model properties here
}

const ${typeNamePascal}Schema = new Schema<${typeNamePascal}Type>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Add your schema fields here
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ${modelName}: Model<${typeNamePascal}Type> =
  models.${modelName} || model<${typeNamePascal}Type>("${modelName}", ${typeNamePascal}Schema);
`,
    );
    successLog(`Generated model file: ${modelPath}`);
  } else {
    infoLog("Skipping model file because it already exists");
  }
};

/**
 * Generates a DTO file for a given module name.
 * @param moduleName - The name of the module (e.g., "blogs")
 */
const generateDTO = (moduleName: string) => {
  const modulePath = path.join(cwd, "src", "modules", moduleName);
  fs.ensureDirSync(modulePath);

  const dtoPath = `${modulePath}/${moduleName}.dto.ts`;
  const isDTOExists = fs.existsSync(dtoPath);

  if (!isDTOExists) {
    const typeNamePascal = upperCamelCase({ str: moduleName, separator: "-" });

    fs.writeFileSync(
      dtoPath,
      `import * as z from "zod";

export const ${typeNamePascal}GetDTO = z.object({
  _id: z.any(),
  name: z.string(),
  // Add your GET DTO fields here
});

export const ${typeNamePascal}InsertDTO = z.object({
  name: z.string().min(1, "Name is required"),
  // Add your INSERT DTO fields here
});

export type ${typeNamePascal}GetDTOType = z.infer<typeof ${typeNamePascal}GetDTO>;
export type ${typeNamePascal}InsertDTOType = z.infer<typeof ${typeNamePascal}InsertDTO>;
`,
    );
    successLog(`Generated DTO file: ${dtoPath}`);
  } else {
    infoLog("Skipping DTO file because it already exists");
  }
};

/**
 * Generates a service file for a given module name.
 * @param moduleName - The name of the module (e.g., "blogs")
 */
const generateService = (moduleName: string) => {
  const modulePath = path.join(cwd, "src", "modules", moduleName);
  fs.ensureDirSync(modulePath);

  const servicePath = `${modulePath}/${moduleName}.service.ts`;
  const isServiceExists = fs.existsSync(servicePath);

  if (!isServiceExists) {
    const typeNamePascal = upperCamelCase({ str: moduleName, separator: "-" });
    const serviceNameCamel = textToCamelCase({
      str: moduleName,
      separator: "-",
    });
    const modelName = typeNamePascal + "s";

    fs.writeFileSync(
      servicePath,
      `import { GlideService } from "core/factory/glide-service";
import { ${typeNamePascal}Type, ${modelName} } from "./${moduleName}.model";

export class ${typeNamePascal}Service extends GlideService<${typeNamePascal}Type> {
  constructor() {
    super({
      endPoint: "${moduleName}",
      model: ${modelName},
    });
  }
}

export const ${serviceNameCamel}Service = new ${typeNamePascal}Service();
`,
    );
    successLog(`Generated service file: ${servicePath}`);
  } else {
    infoLog("Skipping service file because it already exists");
  }
};

/**
 * Generates a controller file for a given module name.
 * @param moduleName - The name of the module (e.g., "blogs")
 */
const generateController = (moduleName: string) => {
  const modulePath = path.join(cwd, "src", "modules", moduleName);
  fs.ensureDirSync(modulePath);

  const controllerPath = `${modulePath}/${moduleName}.controller.ts`;
  const isControllerExists = fs.existsSync(controllerPath);

  if (!isControllerExists) {
    const typeNamePascal = upperCamelCase({ str: moduleName, separator: "-" });
    const controllerNameCamel = textToCamelCase({
      str: moduleName,
      separator: "-",
    });
    const serviceNameCamel = textToCamelCase({
      str: moduleName,
      separator: "-",
    });

    fs.writeFileSync(
      controllerPath,
      `import { GlideController } from "core/factory/glide-controller";
import { ${typeNamePascal}GetDTO, ${typeNamePascal}InsertDTO } from "./${moduleName}.dto";
import { ${serviceNameCamel}Service } from "./${moduleName}.service";

export class ${typeNamePascal}Controller extends GlideController {
  constructor() {
    super({
      endPoint: "${moduleName}",
      dtoConfig: {
        getDTO: ${typeNamePascal}GetDTO,
        insertDTO: ${typeNamePascal}InsertDTO,
        updateDTO: ${typeNamePascal}InsertDTO,
      },
      service: ${serviceNameCamel}Service,
    });
  }
}

export const ${controllerNameCamel}Controller = new ${typeNamePascal}Controller();
`,
    );
    successLog(`Generated controller file: ${controllerPath}`);
  } else {
    infoLog("Skipping controller file because it already exists");
  }
};

/**
 * Generates a routes file for a given module name.
 * @param moduleName - The name of the module (e.g., "blogs")
 */
const generateRoutes = (moduleName: string) => {
  const modulePath = path.join(cwd, "src", "modules", moduleName);
  fs.ensureDirSync(modulePath);

  const routesPath = `${modulePath}/${moduleName}.routes.ts`;
  const isRoutesExists = fs.existsSync(routesPath);

  if (!isRoutesExists) {
    const controllerNameCamel = textToCamelCase({
      str: moduleName,
      separator: "-",
    });
    const routerNameCamel = textToCamelCase({
      str: moduleName,
      separator: "-",
    });

    fs.writeFileSync(
      routesPath,
      `import { glideRouter } from "core/factory/glide-router";
import { ${controllerNameCamel}Controller } from "./${moduleName}.controller";

const ${routerNameCamel}Router = glideRouter();

${routerNameCamel}Router.get("/", ${controllerNameCamel}Controller.getAll);
${routerNameCamel}Router.post("/", ${controllerNameCamel}Controller.insert);
${routerNameCamel}Router.get("/:id", ${controllerNameCamel}Controller.getById);
${routerNameCamel}Router.put("/:id", ${controllerNameCamel}Controller.update);
${routerNameCamel}Router.delete("/:id", ${controllerNameCamel}Controller.delete);

export { ${routerNameCamel}Router };
`,
    );
    successLog(`Generated routes file: ${routesPath}`);
  } else {
    infoLog("Skipping routes file because it already exists");
  }
};

/**
 * Main route generator function that creates all necessary files for a module.
 * @param moduleName - The name of the module (e.g., "blogs")
 */
export const expressMongodbRouteGenerator = (moduleName: string) => {
  try {
    // Validate module name
    if (!moduleName || moduleName.trim() === "") {
      throw new Error("Module name is required");
    }

    // Normalize module name (convert to lowercase and replace spaces with hyphens)
    const normalizedModuleName = moduleName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    infoLog(`Generating module: ${normalizedModuleName}`);

    // Generate all files
    generateModel(normalizedModuleName);
    generateDTO(normalizedModuleName);
    generateService(normalizedModuleName);
    generateController(normalizedModuleName);
    generateRoutes(normalizedModuleName);

    successLog(`\n✓ Module "${normalizedModuleName}" generated successfully!`);
    infoLog(`\nNext steps:`);
    infoLog(`1. Update the schema in ${normalizedModuleName}.model.ts`);
    infoLog(`2. Update the DTOs in ${normalizedModuleName}.dto.ts`);
    infoLog(`3. Register the router in src/plugins/setup-all-routes.ts`);
  } catch (e) {
    const error = e as Error;
    errorLog(error.message ?? "Unable to generate module");
  }
};
