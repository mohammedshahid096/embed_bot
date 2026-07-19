import { Router } from "express";
import { Authentication } from "../middlewares/auth.middleware";
import { OrganisationMiddleware } from "../middlewares/organisation.middleware";
import { getOrganisationKnowledgeBasesController } from "../controllers/organisation/knowledge-base.controller";

const knowledgeBaseRoutes = Router();

knowledgeBaseRoutes
  .route("/")
  .get(
    Authentication,
    OrganisationMiddleware,
    getOrganisationKnowledgeBasesController,
  );

export default knowledgeBaseRoutes;
