import { Router } from "express";
import {
  agentChatValidation,
  newChatSessionValidation,
} from "../validation/chat/chat.joi";
import {
  agentChatController,
  createNewChatSessionController,
  getSessionDetailsController,
} from "../controllers/chat/chat.controller";

const chatRoutes = Router();

chatRoutes
  .route("/:chatbotId/new-chat")
  .post(newChatSessionValidation, createNewChatSessionController);

chatRoutes
  .route("/:chatbotId/:sessionId/chat")
  .get(getSessionDetailsController)
  .post(agentChatValidation, agentChatController);

export default chatRoutes;
