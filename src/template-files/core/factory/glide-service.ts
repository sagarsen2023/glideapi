import { Model, Document, PopulateOptions } from "mongoose";
import { GlideMonitor } from "./glide-monitoring";
import { config } from "@/config";
import { BasicPaginationRequest } from "@/types/base-request.type";
import * as z from "zod";

// Interface for pagination and search parameters
export interface GlideServiceGetAllParams<T> {
  pagination: BasicPaginationRequest;
  getDTO?: z.ZodType<T>;
  populateFields?: PopulateOptions[]; // Use Mongoose's PopulateOptions type
  additionalOptions?: Record<string, any>;
  queryParams?: Partial<{ isDeleted: boolean }>;
}

// Constructor config type for GlideService
export interface GlideServiceConstructorType<T> {
  endPoint: string;
  model: Model<T & Document>; // Mongoose model generic with document typed
}

// Generic base service class for CRUD operations on Mongoose models
export class GlideService<T extends Document> {
  private endpoint: string;
  private monitoring = new GlideMonitor();
  private isDebugMode = config.debugMode;
  private model: Model<T>;

  constructor({ endPoint, model }: GlideServiceConstructorType<T>) {
    this.endpoint = endPoint;
    this.model = model;
  }

  async getAll({
    pagination,
    getDTO,
    populateFields,
    queryParams,
  }: GlideServiceGetAllParams<T>): Promise<{ data: T[]; totalCount: number }> {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          info: "getAll method hit successfully",
        });
      }

      // Construct query filter with optional soft delete and search
      const queryFilter: Record<string, any> = {
        ...(queryParams?.isDeleted === false && { isDeleted: false }),
      };

      if (pagination.search) {
        queryFilter.title = {
          $regex: `.*${pagination.search}.*`,
          $options: "i",
        };
      }

      const totalCount = await this.model.countDocuments(queryFilter).exec();
      const limit = pagination.limit ?? 10;
      let query = this.model
        .find(queryFilter)
        .skip(((pagination.skip ?? 1) - 1) * limit)
        .limit(limit);

      if (populateFields && populateFields.length > 0) {
        populateFields.forEach((pop) => {
          query = query.populate(pop);
        });
      }

      const docs = await query.exec();

      const data = getDTO
        ? docs.map((doc) => getDTO.parse(doc.toObject()))
        : docs;

      return {
        data,
        totalCount,
      };
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          error: (error as Error).message ?? "Error in getAll method",
        });
      }
      throw error;
    }
  }

  async getById(
    id: string,
    populateFields?: PopulateOptions[],
  ): Promise<T | null> {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          info: "getById method hit successfully",
        });
      }

      let query = this.model.findById(id);
      if (populateFields && populateFields.length > 0) {
        populateFields.forEach((pop) => {
          query = query.populate(pop);
        });
      }
      return await query.exec();
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          error: (error as Error).message ?? "Error in getById method",
        });
      }
      throw error;
    }
  }

  async insert(data: Partial<T>): Promise<T> {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          info: "insert method hit successfully",
        });
      }

      const doc = new this.model(data);
      return await doc.save();
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          error: (error as Error).message ?? "Error in insert method",
        });
      }
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          info: "update method hit successfully",
        });
      }

      return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          error: (error as Error).message ?? "Error in update method",
        });
      }
      throw error;
    }
  }

  async delete(id: string): Promise<T | null> {
    try {
      if (this.isDebugMode) {
        await this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          info: "delete method hit successfully",
        });
      }

      return await this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      if (this.isDebugMode) {
        this.monitoring.addStep({
          endPoint: this.endpoint,
          stepName: "service-hit",
          error: (error as Error).message ?? "Error in delete method",
        });
      }
      throw error;
    }
  }
}
