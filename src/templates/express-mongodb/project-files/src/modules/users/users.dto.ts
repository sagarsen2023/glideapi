import * as z from "zod";

export const UserGetDTO = z.object({
  _id: z.any(),
  fullName: z.string(),
  email: z.email("Please provide a valid email"),
});

export const UserInsertDTO = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Please provide a valid email"),
});

export const UserRegistrationDTO = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const UserLoginDTO = z.object({
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type UserGetDTOType = z.infer<typeof UserGetDTO>;
export type UserRegistrationDTOType = z.infer<typeof UserRegistrationDTO>;
export type UserLoginDTOType = z.infer<typeof UserLoginDTO>;
