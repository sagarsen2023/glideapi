import { type Request, type Response } from "express";
import { glideResponseHandler } from "core/factory/glide-response";
import { UserLoginDTO, UserRegistrationDTO } from "../users/users.dto";
import { authService } from "./auth.service";
import { AuthenticatedRequest } from "@/types/base-request.type";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const payload = req.body;
      const validatedData = UserRegistrationDTO.parse(payload);
      const newUserResponse = await authService.registerUser(validatedData);

      return res
        .status(201)
        .send(glideResponseHandler.successResponse(newUserResponse));
    } catch (error) {
      console.log(error);
      res.status(400).send(glideResponseHandler.insertionErrorResponse(error));
    }
  }

  async login(req: Request, res: Response) {
    try {
      const payload = req.body;
      const validatedData = UserLoginDTO.parse(payload);
      const loginResponse = await authService.loginUser(validatedData);

      return res
        .status(200)
        .send(glideResponseHandler.successResponse(loginResponse));
    } catch (error) {
      console.log(error);
      res.status(400).send(glideResponseHandler.insertionErrorResponse(error));
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?._id;
      const userProfile = await authService.getUserProfile(userId?.toString());

      return res
        .status(200)
        .send(glideResponseHandler.successResponse(userProfile));
    } catch (error) {
      console.log(error);
      res.status(400).send(glideResponseHandler.insertionErrorResponse(error));
    }
  }
}

export const authController = new AuthController();
