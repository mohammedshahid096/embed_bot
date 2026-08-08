import { Router } from "express";
import {
  agentChatValidation,
  newChatSessionValidation,
  updateChatBotDetailsValidation,
} from "../validation/chat/chat.joi";
import {
  agentChatController,
  createNewChatSessionController,
  getChatBotDetailsController,
  getChatBotDetailsPrivateController,
  getSessionDetailsController,
  updateChatBotDetailsController,
} from "../controllers/chat/chat.controller";
import { Authentication } from "../middlewares/auth.middleware";
import { OrganisationMiddleware } from "../middlewares/organisation.middleware";

const chatRoutes = Router();

chatRoutes.route("/bot-details/:chatbotId").get(getChatBotDetailsController);

chatRoutes
  .route("/:chatbotId/new-chat")
  .post(newChatSessionValidation, createNewChatSessionController);

chatRoutes
  .route("/:chatbotId/:sessionId")
  .get(getSessionDetailsController)
  .post(agentChatValidation, agentChatController);

// private controllers
chatRoutes
  .route("/chatbot-details")
  .get(
    Authentication,
    OrganisationMiddleware,
    getChatBotDetailsPrivateController,
  )
  .put(
    Authentication,
    OrganisationMiddleware,
    updateChatBotDetailsValidation,
    updateChatBotDetailsController,
  );

export default chatRoutes;
