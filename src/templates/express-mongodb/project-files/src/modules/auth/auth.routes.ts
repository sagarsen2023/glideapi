import { glideRouter } from "core/factory/glide-router";
import { authController } from "./auth.controller";
import { verifyUserMiddleware } from "./auth.middleware";

const authRouter = glideRouter();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/profile", verifyUserMiddleware, authController.getProfile);

export { authRouter };
