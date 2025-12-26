export interface BaseResponseType {
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

class GlideResponseHandler {
  successResponse(data?: any) {
    return {
      error: false,
      statusCode: 200,
      status: true,
      responseTimestamp: new Date().toISOString(),
      data,
    } as BaseResponseType;
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
    } as BaseResponseType;
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
    } as BaseResponseType;
  }

  createResponse(data?: any) {
    return {
      error: false,
      statusCode: 201,
      status: true,
      created: true,
      responseTimestamp: new Date().toISOString(),
      data,
    } as BaseResponseType;
  }

  updateResponse(data?: any) {
    return {
      error: false,
      statusCode: 200,
      status: true,
      updated: true,
      responseTimestamp: new Date().toISOString(),
      data,
    } as BaseResponseType;
  }

  deleteResponse(data?: any) {
    return {
      error: false,
      statusCode: 200,
      status: true,
      deleted: true,
      responseTimestamp: new Date().toISOString(),
      data,
    } as BaseResponseType;
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
    } as BaseResponseType;
  }

  notFoundResponse(message?: string) {
    return {
      error: true,
      statusCode: 404,
      status: false,
      data: null,
      responseTimestamp: new Date().toISOString(),
      message,
    } as BaseResponseType;
  }

  insertionErrorResponse(error?: any) {
    try {
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
        } as BaseResponseType;
      }
      return this.standardErrorResponse(error, 400);
    } catch (err) {
      return this.standardErrorResponse(err, 400);
    }
  }
}

export const glideResponseHandler = new GlideResponseHandler();
