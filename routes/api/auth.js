import express from "express";
import { authController } from "../../controllers/index.js";
import { validateBody } from "../../decorators/index.js";
import usersSchemas from "../../schemas/users-schemas.js";
import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(usersSchemas.userSingupSchema),
  authController.singup
);

authRouter.post(
  "/login",
  validateBody(usersSchemas.userSinginSchema),
  authController.singin
);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.patch("/", authenticate, authController.updateUserSubscription);

export default authRouter;
