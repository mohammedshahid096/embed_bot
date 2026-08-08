import { Router } from "express";
import {
  agentChatValidation,
  newChatSessionValidation,
} from "../validation/chat/chat.joi";
import {
  agentChatController,
  createNewChatSessionController,
  getChatBotDetailsController,
  getSessionDetailsController,
} from "../controllers/chat/chat.controller";

const chatRoutes = Router();

chatRoutes.route("/bot-details/:chatbotId").get(getChatBotDetailsController);

chatRoutes
  .route("/:chatbotId/new-chat")
  .post(newChatSessionValidation, createNewChatSessionController);

chatRoutes
  .route("/:chatbotId/:sessionId")
  .get(getSessionDetailsController)
  .post(agentChatValidation, agentChatController);

export default chatRoutes;
