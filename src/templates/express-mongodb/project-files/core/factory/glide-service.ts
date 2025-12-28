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
    if (this.isDebugMode) {
      infoLog(
        `[GlideAPI - ${new Date().toLocaleTimeString()}]: getAll method hit successfully`,
      );
    }

    const { offset, limit, search, isDeleted, ...restQuery } =
      queryParams || {};

    const pagination: BasicPaginationRequest = {
      offset: Number(offset),
      limit: Number(limit) || 10,
      search: String(search),
    };

    // Construct query filter with optional soft delete and search
    const queryFilter: Record<string, any> = {
      ...restQuery,
      ...(isDeleted === "false" && { isDeleted: false }),
    };

    // ? Calculate total count before pagination
    const totalCount = await this.model.countDocuments(queryFilter).exec();

    // ? Apply pagination and populate fields
    let query = this.model
      .find(queryFilter)
      .limit(pagination.limit ?? 10)
      .skip(pagination.offset ?? 0)
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
  }

  async getById({
    id,
    getDTO,
    populateFields,
  }: GlideServiceGetByIdParams<T>): Promise<T | null> {
    if (this.isDebugMode) {
      infoLog(
        `[GlideAPI - ${new Date().toLocaleTimeString()}]: getById service hit successfully`,
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
  }

  async insert(data: Partial<T>): Promise<T | null> {
    if (this.isDebugMode) {
      infoLog(
        `[GlideAPI - ${new Date().toLocaleTimeString()}]: insert service hit successfully`,
      );
    }

    const doc = new this.model(data);
    return await doc.save();
  }

  async update({
    id,
    data,
  }: {
    id: string;
    data: Partial<T>;
  }): Promise<T | null> {
    if (this.isDebugMode) {
      infoLog(
        `[GlideAPI - ${new Date().toLocaleTimeString()}]: update method hit successfully`,
      );
    }

    const dataFromDB = await this.model.findById(id);

    if (!dataFromDB) {
      throw new Error("Document not found");
    }

    Object.assign(dataFromDB, data);
    return await dataFromDB.save();
  }

  async delete(id: string): Promise<T | null> {
    if (this.isDebugMode) {
      infoLog(
        `[GlideAPI - ${new Date().toLocaleTimeString()}]: delete method hit successfully`,
      );
    }

    return await this.model.findByIdAndDelete(id).exec();
  }
}
