import { Router } from "express";
import { Authentication } from "../middlewares/auth.middleware";
import {
  extractUserOrganisationWebsiteUrlsController,
  getUserOrganisationDetailsController,
  onBoardingOrganisationController,
} from "../controllers/organisation/user-org.controller";
import { onBoardingOrganisationValidation } from "../validation/organisation/user-org.joi";

const userOrganisationRoutes = Router();

userOrganisationRoutes
  .route("/onboard")
  .post(
    Authentication,
    onBoardingOrganisationValidation,
    onBoardingOrganisationController,
  );

userOrganisationRoutes
  .route("/details")
  .get(Authentication, getUserOrganisationDetailsController);

userOrganisationRoutes
  .route("/website-urls")
  .get(extractUserOrganisationWebsiteUrlsController);
export default userOrganisationRoutes;
