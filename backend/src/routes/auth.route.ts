import { Router } from "express";
import {
  loginAuthController,
  sendRegisterVerificationLinkController,
  verifyRegisterVerificationLinkController,
} from "../controllers/users/auth.controller";
import {
  loginAuthValidation,
  sendRegisterVerificationLinkValidation,
  verifyRegisterVerificationLinkValidation,
} from "../validation/user/auth.joi";

const authRoutes = Router();

authRoutes
  .route("/register")
  .post(
    sendRegisterVerificationLinkValidation,
    sendRegisterVerificationLinkController,
  );

authRoutes
  .route("/register/verify")
  .get(
    verifyRegisterVerificationLinkValidation,
    verifyRegisterVerificationLinkController,
  );

authRoutes.route("/login").post(loginAuthValidation, loginAuthController);

export default authRoutes;
