import { Router } from "express";
import { Authentication } from "../middlewares/auth.middleware";
import {
  extractUserOrganisationWebsiteUrlsController,
  getUserOrganisationDetailsController,
  onBoardingOrganisationController,
} from "../controllers/organisation/user-org.controller";
import { onBoardingOrganisationValidation } from "../validation/organisation/user-org.joi";
import { OrganisationMiddleware } from "../middlewares/organisation.middleware";

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
  .route("/extract-website-urls")
  .get(
    Authentication,
    OrganisationMiddleware,
    extractUserOrganisationWebsiteUrlsController,
  );
export default userOrganisationRoutes;
