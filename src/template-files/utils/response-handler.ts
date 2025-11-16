export interface GlideApiBaseResponseType {
  error: boolean;
  statusCode: number;
  status: boolean;
  message: string;
  data: any;
  totalCount?: number;
  created?: boolean;
  updated?: boolean;
  deleted?: boolean;
  responseTimestamp: string;
}

class GlideApiResponseHandler {
  successResponse(data?: any) {
    return {
      error: false,
      statusCode: 200,
      status: true,
      responseTimestamp: new Date().toISOString(),
      data,
    } as GlideApiBaseResponseType;
  }

  successResponseWithCount({
    data,
    totalCount,
  }: {
    data: any;
    totalCount: number;
  }) {
    return {
      error: false,
      statusCode: 200,
      status: true,
      totalCount,
      responseTimestamp: new Date().toISOString(),
      data,
    } as GlideApiBaseResponseType;
  }

  standardErrorResponse(error?: unknown, statusCode = 500) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error! See the server logs.";

    return {
      error: true,
      statusCode,
      status: false,
      responseTimestamp: new Date().toISOString(),
      message,
    } as GlideApiBaseResponseType;
  }

  createResponse(data?: any) {
    return {
      error: false,
      statusCode: 201,
      status: true,
      created: true,
      responseTimestamp: new Date().toISOString(),
      data,
    } as GlideApiBaseResponseType;
  }

  updateResponse(data?: any) {
    return {
      error: false,
      statusCode: 200,
      status: true,
      updated: true,
      responseTimestamp: new Date().toISOString(),
      data,
    } as GlideApiBaseResponseType;
  }

  createErrorResponse(error?: any) {
    try {
      // Considering MongoDB duplicate key error code 11000
      const errorCode = error?.code || 11000;
      if (errorCode === 11000 && error?.keyValue) {
        return {
          error: true,
          statusCode: 409,
          status: false,
          data: null,
          responseTimestamp: new Date().toISOString(),
          message: `This ${
            Object.keys(error?.keyValue)?.[0]
          } is already registered.`,
        } as GlideApiBaseResponseType;
      }
      return this.standardErrorResponse(error, 400);
    } catch (err) {
      return this.standardErrorResponse(err, 400);
    }
  }

  deleteResponse(data?: any) {
    return {
      error: false,
      statusCode: 200,
      status: true,
      deleted: true,
      responseTimestamp: new Date().toISOString(),
      data,
    } as GlideApiBaseResponseType;
  }

  unAuthorizedResponse(error?: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unauthorized Access! Please provide valid credentials.";
    return {
      error: true,
      statusCode: 401,
      status: false,
      data: error,
      responseTimestamp: new Date().toISOString(),
      message,
    } as GlideApiBaseResponseType;
  }

  notFoundResponse(message?: string) {
    return {
      error: true,
      statusCode: 404,
      status: false,
      data: null,
      responseTimestamp: new Date().toISOString(),
      message,
    } as GlideApiBaseResponseType;
  }
}

export const glideApiResponseHandler = new GlideApiResponseHandler();
