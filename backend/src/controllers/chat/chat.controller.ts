import { NextFunction, Request, Response } from "express";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import ChatBotModel from "../../schema/chatbot.model";
import ChatMessageModel from "../../schema/chat.model";

export const createNewChatSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatbotId } = req.params;
    const { origin } = req.body;

    // Verify the chatbot exists and is active
    const chatBot = await ChatBotModel.findOne({
      _id: chatbotId,
      isActive: true,
    }).lean();

    if (!chatBot) {
      return next(httpErrors.NotFound("Chatbot not found or is inactive"));
    }

    const url = new URL(origin);
    if (!chatBot.allowedDomains.includes(url.origin)) {
      return next(httpErrors.BadRequest("Domain is not allowed"));
    }

    const chatSession = await ChatMessageModel.create({
      chatBotId: chatBot._id,
      organizationId: chatBot.organizationId?.toString(),
      messages: [],
    });

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 201,
      message: "Chat session created successfully",
      data: chatSession,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
