import { UserType } from "../users/users.model";

export interface RegistrationOrLoginResponse {
  user: UserType;
  token: string;
}
