import { Router } from "express";
import { getDashboardDataController } from "../controllers/dashboard/dashboard.controller";
import { Authentication } from "../middlewares/auth.middleware";
import { OrganisationMiddleware } from "../middlewares/organisation.middleware";

const dashboardRoutes = Router();

dashboardRoutes
  .route("/")
  .get(Authentication, OrganisationMiddleware, getDashboardDataController);

export default dashboardRoutes;
