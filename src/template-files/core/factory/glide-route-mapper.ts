import fs from "fs-extra";
import path from "path";

interface RouteSetupResponse {
  totalRoutes: number;
  validRoutesCount: number;
  invalidRoutesCount: number;
}

const setUpRouteFileTemplate = ({ routes }: { routes: string[] }) => {
  return `// ! This file is auto-generated. Do not edit it.

import type { Express, Request, Response } from "express";
import { config } from "@/config";
import { glideResponseHandler } from "core/factory/glide-response";
import { errorLog } from "@/utils/logger";
${routes
  .map(
    (route) =>
      `import { ${route}Router } from "@/modules/${route}/${route}.routes";`,
  )
  .join("\n")}

const apiPrefix = config.apiPrefix;

const catchAllRouteHandler = (req: Request, res: Response) => {
  errorLog(\`[404] Route not found: \${req.method} \${req.originalUrl}\`);
  return res.send(glideResponseHandler.notFoundResponse("Route not found!"));
};

export const setupAllRoutes = async (app: Express) => {
  ${routes
    .map((route) => `app.use(\`\${apiPrefix}/${route}\`, ${route}Router);`)
    .join("\n  ")}

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the API!" });
  });

  if (apiPrefix) {
    app.get(apiPrefix, (req, res) => {
      res.status(200).json(
        glideResponseHandler.successResponse({
          message: "API is running",
        }),
      );
    });
  }

  app.use(catchAllRouteHandler);
};
`;
};

export const glideRouteMapper = async (): Promise<RouteSetupResponse> => {
  const moduleRoutes = path.resolve(__dirname, "../../src/modules");

  const allDirectoryInModuleDirectory = await fs.readdir(moduleRoutes);

  const allRoutesInModuleDirectory: (string | undefined)[] =
    allDirectoryInModuleDirectory.map((moduleName) => {
      const isRouteFile = fs.existsSync(
        path.resolve(moduleRoutes, moduleName, `${moduleName}.routes.ts`),
      );
      if (isRouteFile) {
        const availableFiles = fs.readdirSync(
          path.resolve(moduleRoutes, moduleName),
        );
        return availableFiles.find(
          (file) => file === `${moduleName}.routes.ts`,
        );
      }
    });

  const validRoutes = allRoutesInModuleDirectory.filter((filename) =>
    filename?.endsWith(".routes.ts"),
  );

  const routeNames = validRoutes.map(
    (filename) => filename?.split(".routes.ts")[0],
  );

  const setupRoutesFileContent = setUpRouteFileTemplate({
    routes: routeNames.filter((name): name is string => !!name),
  });

  const setupRoutesFilePath = path.resolve(
    __dirname,
    "../../src/plugins/setup-all-routes.ts",
  );

  const routeMappingForLogging = validRoutes.map((route) => ({
    route: `/${route?.split(".routes.ts")[0]}`,
    status: "✓ Validated",
  }));

  const unmappedFilesForLogging = allDirectoryInModuleDirectory
    .map((moduleName, index) => {
      const routeFileName = allRoutesInModuleDirectory[index];
      if (!routeFileName) {
        return {
          route: `/${moduleName}`,
          status: `✗ No route file found. Please create a route file named ${moduleName}.routes.ts in the ${moduleName} module.`,
        };
      }
    })
    .filter((item): item is { route: string; status: string } => !!item);

  const allMappings = [...routeMappingForLogging, ...unmappedFilesForLogging];
  console.table(allMappings);

  await fs.writeFile(setupRoutesFilePath, setupRoutesFileContent, "utf-8");

  return {
    totalRoutes: allRoutesInModuleDirectory.length,
    validRoutesCount: validRoutes.length,
    invalidRoutesCount: allRoutesInModuleDirectory.length - validRoutes.length,
  };
};
