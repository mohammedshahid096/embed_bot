import { Router } from "express";
import { Authentication } from "../middlewares/auth.middleware";
import {
  extractUserOrganisationWebsiteUrlsController,
  getUserOrganisationDetailsController,
  onBoardingOrganisationController,
  scrapeWebsitesController,
  updateUserOrganisationDetailsController,
} from "../controllers/organisation/user-org.controller";
import {
  onBoardingOrganisationValidation,
  scrapeWebsitesValidation,
  updateOrganisationValidation,
} from "../validation/organisation/user-org.joi";
import { OrganisationMiddleware } from "../middlewares/organisation.middleware";
import {
  addOrganisationApiKeyController,
  getApiKeySummaryController,
  updateSingleApiKeyController,
} from "../controllers/organisation/apikey.controller";
import {
  addOrganisationApiKeyValidation,
  updateSingleApiKeyValidation,
} from "../validation/organisation/apikey.joi";

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
  .get(Authentication, getUserOrganisationDetailsController)
  .put(
    Authentication,
    updateOrganisationValidation,
    updateUserOrganisationDetailsController,
  );

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

userOrganisationRoutes
  .route("/api-keys")
  .get(Authentication, OrganisationMiddleware, getApiKeySummaryController);

userOrganisationRoutes
  .route("/api-keys/:provider")
  .put(
    Authentication,
    OrganisationMiddleware,
    updateSingleApiKeyValidation,
    updateSingleApiKeyController,
  );

export default userOrganisationRoutes;

