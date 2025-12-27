import type { AuthenticatedRequest } from "@/types/base-request.type";
import type { Response } from "express";
import { config } from "@/config";
import { glideResponseHandler } from "./glide-response";
import * as z from "zod";
import { GlideService } from "./glide-service";
import { errorLog, infoLog } from "@/utils/logger";

interface GlideControllerConstructorType {
  endPoint: string;
  dtoConfig: {
    insertDTO?: z.ZodTypeAny;
    updateDTO?: z.ZodTypeAny;
    getDTO?: z.ZodTypeAny;
  };
  service: GlideService<any>;
}

// ? Debug mode flag
const isDebugMode = config.debugMode;

export class GlideController {
  private endpoint: string;

  private dtoConfig?: GlideControllerConstructorType["dtoConfig"];
  protected service: GlideService<any>;

  constructor({
    endPoint,
    dtoConfig,
    service,
  }: GlideControllerConstructorType) {
    this.endpoint = endPoint;
    this.dtoConfig = dtoConfig;
    this.service = service;

    // Bind methods because due to express the value of 'this' changes to undefined.
    this.getAll = this.getAll.bind(this);
    this.insert = this.insert.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async insert(req: AuthenticatedRequest, res: Response) {
    try {
      if (isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: insert controller hit successfully`,
        );
      }
      const data = req.body;

      console.log(req.body);

      if (!data) {
        throw new Error("No data provided for insertion");
      }

      const validatedData = this.dtoConfig?.insertDTO?.parse(data) ?? data;

      const result = await this.service.insert(validatedData);
      return res.status(200).send(glideResponseHandler.successResponse(result));
    } catch (error) {
      if (isDebugMode) {
        errorLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in insert controller - ${
            (error as Error).message
          }`,
        );
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      if (isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: getAll controller hit successfully`,
        );
      }

      const queryParams = req.query;

      const result = (await this.service?.getAll({
        queryParams,
        getDTO: this.dtoConfig?.getDTO,
      })) ?? {
        message: "No service configured for getAll",
      };

      return res
        .status(200)
        .send(glideResponseHandler.successResponseWithCount(result));
    } catch (error) {
      if (isDebugMode) {
        errorLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in getAll controller - ${
            (error as Error).message
          }`,
        );
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      if (isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: getById controller hit successfully`,
        );
      }

      const { id } = req.params;
      const result = (await this.service?.getById?.({
        id,
        getDTO: this.dtoConfig?.getDTO,
      })) ?? {
        message: "No service configured for getById",
      };

      return res.status(200).send(glideResponseHandler.successResponse(result));
    } catch (error) {
      if (isDebugMode) {
        errorLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in getById controller - ${
            (error as Error).message
          }`,
        );
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      if (isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: update controller hit successfully`,
        );
      }

      const { id } = req.params;
      const data = req.body;
      const result = (await this.service?.update?.({ id, data })) ?? {
        message: "No service configured for update",
      };

      return res.status(200).send(glideResponseHandler.successResponse(result));
    } catch (error) {
      if (isDebugMode) {
        errorLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in update controller - ${
            (error as Error).message
          }`,
        );
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      if (isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: delete controller hit successfully`,
        );
      }
      const { id } = req.params;
      const result = (await this.service?.delete?.(id)) ?? {
        message: "No service configured for delete",
      };

      return res.status(200).send(glideResponseHandler.successResponse(result));
    } catch (error) {
      if (isDebugMode) {
        errorLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in delete controller - ${
            (error as Error).message
          }`,
        );
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }
}
