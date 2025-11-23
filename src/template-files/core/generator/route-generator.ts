import { errorLog } from "@/utils/logger";

export const glideRouteGenerator = async ({
  moduleName,
  isAuthenticated,
}: {
  moduleName: string;
  isAuthenticated?: boolean;
}): Promise<string | undefined> => {
  try {
    const routeName = `${moduleName.toLowerCase()}Router`;
    const routeContent = `import { glideRouter } from "core/factory/glide-router";
import { ${moduleName}Controller } from "./${moduleName}.controller";
${
  isAuthenticated &&
  'import { verifyUserMiddleware } from "@/modules/auth/auth.middleware";'
}

const ${routeName} = glideRouter();

${routeName}.get("/",${
      isAuthenticated && "verifyUserMiddleware,"
    } ${moduleName}Controller.getAll);
${routeName}.post("/",${
      isAuthenticated && "verifyUserMiddleware,"
    } ${moduleName}Controller.insert);
${routeName}.get("/:id",${
      isAuthenticated && "verifyUserMiddleware,"
    } ${moduleName}Controller.getById);
${routeName}.put("/:id",${
      isAuthenticated && "verifyUserMiddleware,"
    } ${moduleName}Controller.updateById);
${routeName}.delete("/:id",${
      isAuthenticated && "verifyUserMiddleware,"
    } ${moduleName}Controller.deleteById);


export { ${routeName} };
`;
    return routeContent;
  } catch (e) {
    errorLog(`Error generating route ${moduleName}: ${(e as Error).message}`);
    return undefined;
  }
};
