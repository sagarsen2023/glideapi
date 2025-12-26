// ! This file is auto-generated. Do not edit it.

import type { Express, Request, Response } from "express";
import { config } from "@/config";
import { glideResponseHandler } from "core/factory/glide-response";
import { errorLog } from "@/utils/logger";
import { authRouter } from "@/modules/auth/auth.routes";
import { usersRouter } from "@/modules/users/users.routes";

const apiPrefix = config.apiPrefix;

const catchAllRouteHandler = (req: Request, res: Response) => {
  errorLog(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  return res.send(glideResponseHandler.notFoundResponse("Route not found!"));
};

export const setupAllRoutes = async (app: Express) => {
  app.use(`${apiPrefix}/auth`, authRouter);
  app.use(`${apiPrefix}/users`, usersRouter);

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
