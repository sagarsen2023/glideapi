import { UserType } from "../users/user.model";

export interface RegistrationOrLoginResponse {
  user: UserType;
  token: string;
}
