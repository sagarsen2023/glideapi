import type {
  AuthenticatedRequest,
  BasicPaginationRequest,
} from "@/types/base-request.type";
import type { Response } from "express";
import { GlideMonitor } from "./glide-monitoring";
import { config } from "@/config";
import { glideResponseHandler } from "./glide-response";
import * as z from "zod";
import { GlideServiceGetAllParams } from "./glide-service";

interface GlideControllerConstructorType {
  endPoint: string;
  dtoConfig: {
    insertDTO?: z.ZodTypeAny;
    updateDTO?: z.ZodTypeAny;
    getDTO?: z.ZodTypeAny;
  };
  serviceConfig?: {
    getAll: (props: GlideServiceGetAllParams<any>) => Promise<any>;
    getById?: (id: string) => Promise<any>;
    insert?: (data: any) => Promise<any>;
    update?: (id: string, data: any) => Promise<any>;
    delete?: (id: string) => Promise<any>;
  };
}

/**
 * GlideController - A base controller class for handling CRUD operations with monitoring and debugging capabilities.
 *
 * This controller provides a standardized implementation for common REST API operations (Create, Read, Update, Delete).
 * It includes built-in monitoring, debug mode support, and error handling with standardized response formatting.
 *
 * @class GlideController
 *
 * @example
 * // Basic usage
 * const controller = new GlideController({ endPoint: '/api/users' });
 *
 * // Configure with custom service and DTO
 * controller.serviceConfig = {
 *   getAll: async (params) => {
 *     // Custom business logic
 *     return fetchDataFromDatabase(params);
 *   }
 * };
 *
 * controller.dtoConfig = {
 *   getDTO: (data) => ({
 *     id: data.id,
 *     name: data.name,
 *     // Map fields as needed
 *   })
 * };
 *
 * @property {string} endpoint - The API endpoint for this controller
 * @property {GlideMonitor} monitoring - Monitor instance for tracking method execution steps
 * @property {boolean} isDebugMode - Flag to enable/disable debug logging
 * @property {GlideControllerConstructorType["dtoConfig"]} [dtoConfig] - Optional Data Transfer Object configuration for response mapping
 * @property {Object} [serviceConfig] - Optional service configuration containing business logic handlers
 * @property {Function} serviceConfig.getAll - Custom handler for retrieving all records with pagination support
 *
 * @method insert - Insert a new record (POST)
 * @method getAll - Retrieve all records with pagination and search capabilities (GET)
 * @method getById - Retrieve a single record by ID (GET)
 * @method update - Update an existing record (PUT)
 * @method delete - Delete a record (DELETE)
 *
 * @customization
 * - Override individual methods to implement custom business logic
 * - Set `serviceConfig` to provide custom service implementations
 * - Configure `dtoConfig` to transform responses according to your data model
 * - Debug mode can be enabled via `config.debugMode` for production troubleshooting
 */
export class GlideController {
  private endpoint: string;

  private monitoring = new GlideMonitor();
  private isDebugMode = config.debugMode;
  private dtoConfig?: GlideControllerConstructorType["dtoConfig"];
  protected serviceConfig?: {
    getAll: (props: GlideServiceGetAllParams<any>) => Promise<any>;
    getById?: (id: string) => Promise<any>;
    insert?: (data: any) => Promise<any>;
    update?: (id: string, data: any) => Promise<any>;
    delete?: (id: string) => Promise<any>;
  };

  constructor({ endPoint }: GlideControllerConstructorType) {
    this.endpoint = endPoint;
  }

  async insert(req: AuthenticatedRequest, res: Response) {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          info: "Insert method hit successfully",
        });
      }
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          error: (error as Error).message ?? "Error in insert method",
        });
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          info: "GetAll method hit successfully",
        });
      }

      const { skip, limit, search } = req.query;

      const pagination: BasicPaginationRequest = {
        skip: Number(skip) || 1,
        limit: Number(limit) || 10,
        search: String(search) || "",
      };
      const result = (await this.serviceConfig?.getAll({
        pagination,
        getDTO: this.dtoConfig?.getDTO,
      })) ?? {
        message: "No service configured for getAll",
      };

      return res.status(200).send(glideResponseHandler.successResponse(result));
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          error: (error as Error).message ?? "Error in getAll method",
        });
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          info: "GetById method hit successfully",
        });
      }

      const { id } = req.params;
      const result = (await this.serviceConfig?.getById?.(id)) ?? {
        message: "No service configured for getById",
      };

      return res.status(200).send(glideResponseHandler.successResponse(result));
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          error: (error as Error).message ?? "Error in getById method",
        });
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          info: "Update method hit successfully",
        });
      }

      const { id } = req.params;
      const data = req.body;
      const result = (await this.serviceConfig?.update?.(id, data)) ?? {
        message: "No service configured for update",
      };

      return res.status(200).send(glideResponseHandler.successResponse(result));
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          error: (error as Error).message ?? "Error in update method",
        });
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          info: "Delete method hit successfully",
        });
      }
      const { id } = req.params;
      const result = (await this.serviceConfig?.delete?.(id)) ?? {
        message: "No service configured for delete",
      };

      return res.status(200).send(glideResponseHandler.successResponse(result));
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "controller-hit",
          error: (error as Error).message ?? "Error in delete method",
        });
      }
      return res
        .status(500)
        .send(glideResponseHandler.standardErrorResponse(error));
    }
  }
}
