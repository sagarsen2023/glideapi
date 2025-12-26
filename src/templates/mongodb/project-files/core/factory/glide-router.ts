import {
  Router,
  Request,
  Response,
  NextFunction,
  type Router as RouterType,
  RequestHandler,
} from "express";
import type { ParsedQs } from "qs";
import { infoLog } from "@/utils/logger";
import { config } from "@/config";

const methods: (keyof RouterType)[] = [
  "get",
  "post",
  "put",
  "delete",
  "patch",
  "options",
  "head",
  "all",
];

const isDebugMode = config.debugMode;
const isDevelopmentMode = config.environment === "development";

function glideRouter() {
  const router = Router();

  methods.forEach((method: keyof RouterType) => {
    const originalMethod = router[method] as Function;

    (router[method] as any) = function (
      path: string,
      ...handlers: RequestHandler<{}, any, any, ParsedQs, Record<string, any>>[]
    ) {
      const monitoringMiddleware = function (
        req: Request,
        res: Response,
        next: NextFunction,
      ) {
        if (isDebugMode || isDevelopmentMode) {
          infoLog(
            `[GlideAPI - ${new Date().toLocaleTimeString()}]: ${method.toUpperCase()} ${path} - ${new Date().toISOString()}`,
          );
        }
        // ? Additional monitoring logic can be added just before proceeding to the actual handler.

        next();
      };

      return originalMethod.call(
        router,
        path,
        monitoringMiddleware,
        ...handlers,
      );
    };
  });

  return router;
}

export { glideRouter };
