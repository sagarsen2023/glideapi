import { GlideController } from "core/factory/glide-controller";
import { UserGetDTO, UserInsertDTO } from "./users.dto";
import { usersService } from "./users.service";

export class UsersController extends GlideController {
  constructor() {
    super({
      endPoint: "users",
      dtoConfig: {
        getDTO: UserGetDTO,
        insertDTO: UserInsertDTO,
        updateDTO: UserInsertDTO,
      },
      service: usersService,
    });
  }
}

export const usersController = new UsersController();
