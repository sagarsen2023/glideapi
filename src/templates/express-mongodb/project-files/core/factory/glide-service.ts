import { Model, Document, PopulateOptions } from "mongoose";
import { config } from "@/config";
import { BasicPaginationRequest } from "@/types/base-request.type";
import * as z from "zod";
import { ParsedQs } from "qs";
import { infoLog } from "@/utils/logger";

// Interface for pagination and search parameters
export interface GlideServiceGetAllParams<T> {
  getDTO?: z.ZodType<T>;
  populateFields?: PopulateOptions[]; // Use Mongoose's PopulateOptions type
  additionalOptions?: Record<string, any>;
  queryParams?: {
    [key: string]: string | ParsedQs | (string | ParsedQs)[] | undefined;
  };
}

export interface GlideServiceGetByIdParams<T> {
  id: string;
  getDTO?: z.ZodType<T>;
  populateFields?: PopulateOptions[];
}

// Constructor config type for GlideService
export interface GlideServiceConstructorType<T> {
  endPoint: string;
  model: Model<T & Document>; // Mongoose model generic with document typed
}

// Generic base service class for CRUD operations on Mongoose models
export class GlideService<T extends Document> {
  private endpoint: string;
  private isDebugMode = config.debugMode;
  private model: Model<T>;

  constructor({ endPoint, model }: GlideServiceConstructorType<T>) {
    this.endpoint = endPoint;
    this.model = model;
  }

  async getAll({
    getDTO,
    populateFields,
    queryParams,
  }: GlideServiceGetAllParams<T>): Promise<{
    data: T[];
    totalCount: number;
  }> {
    try {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: getAll method hit successfully`,
        );
      }

      const { skip, limit, search, isDeleted } = queryParams || {};

      const pagination: BasicPaginationRequest = {
        skip: Number(skip),
        limit: Number(limit) || 10,
        search: String(search),
      };

      // Construct query filter with optional soft delete and search
      const queryFilter: Record<string, any> = {
        ...(isDeleted === "false" && { isDeleted: false }),
      };

      // ? Calculate total count before pagination
      const totalCount = await this.model.countDocuments(queryFilter).exec();

      // ? Apply pagination and populate fields
      let query = this.model
        .find(queryFilter)
        .limit(pagination.limit ?? 10)
        .skip(pagination.skip ?? 0)
        .sort({ createdAt: -1 }); // Latest first

      if (populateFields && populateFields.length > 0) {
        populateFields.forEach((field) => {
          query = query?.populate(field);
        });
      }

      const docs = await query.exec();

      // ? Parse documents if getDTO is provided
      const data = getDTO
        ? docs.map((doc) => getDTO.parse(doc.toObject()))
        : docs;

      return {
        data,
        totalCount,
      };
    } catch (error) {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in getAll method - ${
            (error as Error).message
          }`,
        );
      }
      throw error;
    }
  }

  async getById({
    id,
    getDTO,
    populateFields,
  }: GlideServiceGetByIdParams<T>): Promise<T | null> {
    try {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: getById method hit successfully`,
        );
      }

      let query = this.model.findById(id);

      if (populateFields && populateFields.length > 0) {
        populateFields.forEach((pop) => {
          query = query.populate(pop);
        });
      }

      const doc = await query.exec();
      if (!doc) {
        return null;
      }

      // ? Parse document if getDTO is provided
      const parsedData = getDTO ? getDTO.parse(doc.toObject()) : doc;

      return parsedData;
    } catch (error) {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in getById method - ${
            (error as Error).message
          }`,
        );
      }
      throw error;
    }
  }

  async insert(data: Partial<T>): Promise<T> {
    try {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: insert method hit successfully`,
        );
      }

      const doc = new this.model(data);
      return await doc.save();
    } catch (error) {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in insert method - ${
            (error as Error).message
          }`,
        );
      }
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: update method hit successfully`,
        );
      }

      return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in update method - ${
            (error as Error).message
          }`,
        );
      }
      throw error;
    }
  }

  async delete(id: string): Promise<T | null> {
    try {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: delete method hit successfully`,
        );
      }

      return await this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      if (this.isDebugMode) {
        infoLog(
          `[GlideAPI - ${new Date().toLocaleTimeString()}]: Error in delete method - ${
            (error as Error).message
          }`,
        );
      }
      throw error;
    }
  }
}
