import { UserType } from "@/modules/users/users.model";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: UserType;
}

export interface BasicPaginationRequest {
  skip?: number;
  limit?: number;
  search?: string;
}
