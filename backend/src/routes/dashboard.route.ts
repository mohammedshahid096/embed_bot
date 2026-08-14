import { Router } from "express";
import { getDashboardDataController } from "../controllers/dashboard/dashboard.controller";
import {
  Authentication,
  DevelopmentAuthentication,
} from "../middlewares/auth.middleware";
import { OrganisationMiddleware } from "../middlewares/organisation.middleware";

const dashboardRoutes = Router();

dashboardRoutes
  .route("/")
  .get(
    DevelopmentAuthentication,
    OrganisationMiddleware,
    getDashboardDataController,
  );

export default dashboardRoutes;
