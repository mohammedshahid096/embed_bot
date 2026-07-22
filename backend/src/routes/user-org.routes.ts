import { Router } from "express";
import { Authentication } from "../middlewares/auth.middleware";
import {
  extractUserOrganisationWebsiteUrlsController,
  getUserOrganisationDetailsController,
  onBoardingOrganisationController,
  scrapeWebsitesController,
} from "../controllers/organisation/user-org.controller";
import {
  onBoardingOrganisationValidation,
  scrapeWebsitesValidation,
} from "../validation/organisation/user-org.joi";
import { OrganisationMiddleware } from "../middlewares/organisation.middleware";
import { addOrganisationApiKeyController } from "../controllers/organisation/apikey.controller";
import { addOrganisationApiKeyValidation } from "../validation/organisation/apikey.joi";

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

userOrganisationRoutes
  .route("/scrape-websites")
  .post(
    Authentication,
    OrganisationMiddleware,
    scrapeWebsitesValidation,
    scrapeWebsitesController,
  );

userOrganisationRoutes
  .route("/onboard/add-api-key")
  .post(
    Authentication,
    OrganisationMiddleware,
    addOrganisationApiKeyValidation,
    addOrganisationApiKeyController,
  );

export default userOrganisationRoutes;
