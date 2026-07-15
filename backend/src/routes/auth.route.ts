import { Router } from "express";
import {
  generateAccessTokenController,
  loginAuthController,
  sendRegisterVerificationLinkController,
  verifyRegisterVerificationLinkController,
  checkEmailExistenceController,
  checkRegisterVerificationLinkController,
} from "../controllers/users/auth.controller";
import {
  loginAuthValidation,
  sendRegisterVerificationLinkValidation,
  verifyRegisterVerificationLinkValidation,
  checkEmailAvailabilityValidation,
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
authRoutes
  .route("/register/check-email-availability")
  .get(checkEmailAvailabilityValidation, checkEmailExistenceController);

authRoutes
  .route("/register/verify/check-token-validity")
  .get(checkRegisterVerificationLinkController);

authRoutes.route("/login").post(loginAuthValidation, loginAuthController);

authRoutes.route("/generate-access-token").get(generateAccessTokenController);

export default authRoutes;
