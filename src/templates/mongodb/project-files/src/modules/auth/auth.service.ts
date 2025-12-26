import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { Users, UserType } from "../users/users.model";
import { UserLoginDTOType, UserRegistrationDTOType } from "../users/users.dto";
import { RegistrationOrLoginResponse } from "./auth.type";

export class AuthService {
  hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(config.saltRounds);
    return await bcrypt.hash(password, salt);
  };

  verifyPassword = async ({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
  };

  createToken(user: UserType): string | null {
    if (!config.jwtSecret) return null;
    return jwt.sign(
      {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: "30d" },
    );
  }

  verifyToken(token: string): UserType | null {
    if (!config.jwtSecret) return null;
    try {
      return jwt.verify(token, config.jwtSecret) as UserType;
    } catch {
      return null;
    }
  }

  registerUser = async (
    user: UserRegistrationDTOType,
  ): Promise<RegistrationOrLoginResponse> => {
    const { email, password } = user;

    const existingUser = await Users.findOne({ email });

    const hashedPassword = await this.hashPassword(password);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser = new Users({
      ...user,
      password: hashedPassword,
    });

    const token = this.createToken(newUser);

    if (!token) {
      throw new Error("Failed to create authentication token");
    }

    const newUserResponse = await newUser.save();
    return {
      user: newUserResponse,
      token,
    };
  };

  loginUser = async (
    user: UserLoginDTOType,
  ): Promise<RegistrationOrLoginResponse> => {
    const { email, password } = user;
    const existingUser = await Users.findOne({ email });

    if (!existingUser) {
      throw new Error("User with this email does not exist");
    }

    const isPasswordValid = await this.verifyPassword({
      password,
      hashedPassword: existingUser.password,
    });

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = this.createToken(existingUser);

    if (!token) {
      throw new Error("Failed to create authentication token");
    }

    return {
      user: existingUser,
      token,
    };
  };

  getUserProfile = async (
    userId: string | undefined,
  ): Promise<UserType | null> => {
    if (!userId) {
      throw new Error("User ID is required to fetch profile");
    }
    const userProfile = await Users.findById(userId).select("-password");
    return userProfile;
  };
}

export const authService = new AuthService();
