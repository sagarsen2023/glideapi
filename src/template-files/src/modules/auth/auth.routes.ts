import { glideRouter } from "core/factory/glide-router";
import { authController } from "./auth.controller";

const authRouter = glideRouter();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

export { authRouter };
