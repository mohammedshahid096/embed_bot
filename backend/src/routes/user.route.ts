import { Router } from "express";
import { userProfileDetailsController } from "../controllers/users/user.controller";
import { Authentication } from "../middlewares/auth.middleware";

const userRoutes = Router();

userRoutes.route("/profile").get(Authentication, userProfileDetailsController);

export default userRoutes;
