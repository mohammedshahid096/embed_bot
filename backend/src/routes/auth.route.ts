import { Router } from "express";
import { sendRegisterVerificationLinkController } from "../controllers/users/user.controller";
import { sendRegisterVerificationLinkValidation } from "../validation/user/auth.joi";

const authRoutes = Router();

authRoutes
  .route("/register")
  .post(
    sendRegisterVerificationLinkValidation,
    sendRegisterVerificationLinkController,
  );

export default authRoutes;
