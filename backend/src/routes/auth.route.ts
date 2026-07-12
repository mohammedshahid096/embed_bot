import { Router } from "express";
import {
  sendRegisterVerificationLinkController,
  verifyRegisterVerificationLinkController,
} from "../controllers/users/user.controller";
import {
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

export default authRoutes;
