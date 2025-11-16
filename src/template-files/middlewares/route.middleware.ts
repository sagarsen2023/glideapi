import authRouter from "@/routes/auth.route";
import categoryRouter from "@/routes/category.routes";
import collectionRouter from "@/routes/collection.route";
import fileRouter from "@/routes/file.route";
import { auramResponseHandler } from "@/utils/auram-response-handler";
import { errorLog } from "@/utils/log";
import { Request, Response, Express } from "express";

const catchAllRouteHandler = (req: Request, res: Response) => {
  errorLog(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  return res.send(auramResponseHandler.notFoundResponse("Route not found!"));
};

const setupAllRoutes = (app: Express) => {
  const apiPrefix = "/api/v1";
  app.use(`${apiPrefix}/auth`, authRouter);
  app.use(`${apiPrefix}/collections`, collectionRouter);
  app.use(`${apiPrefix}/categories`, categoryRouter);
  app.use(`${apiPrefix}/files`, fileRouter);

  app.get(apiPrefix, (_, res) => {
    return res.send(auramResponseHandler.successResponse("API is running..."));
  });

  app.use(catchAllRouteHandler);
};

export { setupAllRoutes };
