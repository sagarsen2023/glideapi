import { glideRouter } from "core/factory/glide-router";
import { verifyUserMiddleware } from "../auth/auth.middleware";
import { usersController } from "./users.controller";

const usersRouter = glideRouter();

usersRouter.get("/", verifyUserMiddleware, usersController.getAll);
usersRouter.post("/", verifyUserMiddleware, usersController.insert);
usersRouter.get("/:id", verifyUserMiddleware, usersController.getById);
usersRouter.put("/:id", verifyUserMiddleware, usersController.update);
usersRouter.delete("/:id", verifyUserMiddleware, usersController.delete);

export { usersRouter };
