import { AuthenticatedRequest } from "@/types/base-request.type";
import { glideResponseHandler } from "core/factory/glide-response";
import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";

/**
 * Middleware to verify user authentication using bearer token.
 *
 * Extracts the bearer token from the Authorization header and verifies it using the auth service.
 * If the token is valid, attaches the decoded user information to the request object.
 *
 * @param {Request} req - Express request object. Expects Authorization header in format: `Bearer <token>`
 * @param {Response} res - Express response object used to send unauthorized response if token is invalid or missing
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 *
 * @returns {void} Calls next() if authentication is successful
 *
 * @throws {Error} Throws error if no token is provided or token is invalid
 *
 * @example
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXadwJ9...
 */
export const verifyUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let glideRequest: AuthenticatedRequest;
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      throw new Error("No token provided");
    }

    const user = authService.verifyToken(token);
    if (!user) {
      throw new Error("Invalid token");
    }

    glideRequest = req as AuthenticatedRequest;
    glideRequest.user = user;

    next();
  } catch {
    return res.status(401).send(glideResponseHandler.unAuthorizedResponse());
  }
};
