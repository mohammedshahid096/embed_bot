import { Router } from "express";
import {
  agentChatValidation,
  newChatSessionValidation,
} from "../validation/chat/chat.joi";
import {
  agentChatController,
  createNewChatSessionController,
} from "../controllers/chat/chat.controller";

const chatRoutes = Router();

chatRoutes
  .route("/:chatbotId/new-chat")
  .post(newChatSessionValidation, createNewChatSessionController);

chatRoutes
  .route("/:chatbotId/:sessionId/chat")
  .post(agentChatValidation, agentChatController);

export default chatRoutes;
