import { GlideService } from "core/factory/glide-service";
import { UserType } from "./users.model";
import { Users } from "./users.model";

export class UsersService extends GlideService<UserType> {
  constructor() {
    super({
      endPoint: "users",
      model: Users,
    });
  }
}

export const usersService = new UsersService();
