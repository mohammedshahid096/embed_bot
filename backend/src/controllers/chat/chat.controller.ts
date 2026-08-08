import { NextFunction, Request, Response } from "express";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import ChatBotModel from "../../schema/chatbot.model";
import ChatMessageModel, { IMessage } from "../../schema/chat.model";
import AgentService from "../../services/agent.service";

export const createNewChatSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatbotId } = req.params;
    const { origin, query } = req.body;

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
      messages: [
        {
          content: query,
          role: "human",
          order: 0,
        },
      ],
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

export const agentChatController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId, chatbotId } = req.params;
    const { inputQuestion } = req.body;

    const chatDetails = await ChatMessageModel.findOne({
      _id: sessionId,
      chatBotId: chatbotId,
    }).lean();

    if (!chatDetails) {
      return next(httpErrors.NotFound("Session Details not found"));
    }

    const userTimestamp = new Date();

    const agentService = new AgentService({
      sessionId: chatDetails._id.toString(),
    });

    const aiResponse = await agentService.processRequest(
      inputQuestion,
      chatDetails,
    );

    const tokenUsage = (aiResponse.outputDetails as any)?.response_metadata
      ?.tokenUsage;

    const newMessageData: IMessage[] = [
      {
        content: inputQuestion || "",
        role: "human",
        timestamp: userTimestamp,
        order: chatDetails?.messages?.length + 1,
      },
      {
        content: aiResponse.output || "",
        role: "ai",
        timestamp: new Date(),
        order: chatDetails?.messages?.length + 2,
        tokenUsage: {
          input_tokens: tokenUsage?.promptTokens || 0,
          output_tokens: tokenUsage?.completionTokens || 0,
          total_tokens: tokenUsage?.totalTokens || 0,
        },
      },
    ];

    const updatedDetails = await ChatMessageModel.findByIdAndUpdate(
      sessionId,
      { $push: { messages: newMessageData } },
      { new: true },
    );

    responseHandlingUtil.successResponseStandard(res, {
      data: updatedDetails,
      otherData: { aiResponse, aiMessage: aiResponse.output },
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const getSessionDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId, chatbotId } = req.params;
    const sessionData = await ChatMessageModel.findOne({
      _id: sessionId,
      chatBotId: chatbotId,
    });

    if (!sessionData) {
      return next(httpErrors.NotFound("Session not found"));
    }

    // const filterDocs = sessionData?.messages?.map((item) => ({
    //   content: item.content,
    //   role: item.role,
    // }));

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "session details fetched successfully",
      data: sessionData,
      // otherData: { filterDocs },
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const getChatBotDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatbotId } = req.params;
    const chatBot = await ChatBotModel.findOne({
      _id: chatbotId,
      isActive: true,
    })
      .select({ config: 1, createdAt: 1, updatedAt: 1 })
      .lean();
    if (!chatBot) {
      return next(httpErrors.NotFound("Chatbot not found or is inactive"));
    }
    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Chatbot details fetched successfully",
      data: chatBot,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const getChatBotDetailsPrivateController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.organisation?._id.toString();
    const chatBot = await ChatBotModel.findOne({
      organizationId,
      isActive: true,
    }).lean();
    if (!chatBot) {
      return next(httpErrors.NotFound("Chatbot not found or is inactive"));
    }
    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Chatbot details fetched successfully",
      data: chatBot,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
