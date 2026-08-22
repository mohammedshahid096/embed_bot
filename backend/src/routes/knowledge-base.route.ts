import { Router } from "express";
import {
  Authentication,
  DevelopmentAuthentication,
} from "../middlewares/auth.middleware";
import { OrganisationMiddleware } from "../middlewares/organisation.middleware";
import {
  addFaqToKnowledgeBaseController,
  getOrganisationKnowledgeBasesController,
} from "../controllers/organisation/knowledge-base.controller";
import { addFaqToKnowledgeBaseValidation } from "../validation/organisation/knowledge-base.joi";

const knowledgeBaseRoutes = Router();

knowledgeBaseRoutes
  .route("/")
  .get(
    Authentication,
    OrganisationMiddleware,
    getOrganisationKnowledgeBasesController,
  );

knowledgeBaseRoutes
  .route("/add/faq")
  .post(
    DevelopmentAuthentication,
    OrganisationMiddleware,
    addFaqToKnowledgeBaseValidation,
    addFaqToKnowledgeBaseController,
  );

export default knowledgeBaseRoutes;
