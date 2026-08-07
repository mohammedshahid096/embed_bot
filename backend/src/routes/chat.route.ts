import { Router } from "express";
import { newChatSessionValidation } from "../validation/chat/chat.joi";
import { createNewChatSessionController } from "../controllers/chat/chat.controller";

const chatRoutes = Router();

// POST /chat/:chatbotId/new-chat — create a new chat session (public endpoint)
chatRoutes
  .route("/:chatbotId/new-chat")
  .post(newChatSessionValidation, createNewChatSessionController);

export default chatRoutes;
