import { Router } from "express";
import { Authentication } from "../middlewares/auth.middleware";
import { onBoardingOrganisationController } from "../controllers/organisation/user-org.controller";
import { onBoardingOrganisationValidation } from "../validation/organisation/user-org.joi";

const userOrganisationRoutes = Router();

userOrganisationRoutes
  .route("/onboard")
  .post(
    Authentication,
    onBoardingOrganisationValidation,
    onBoardingOrganisationController,
  );

export default userOrganisationRoutes;
