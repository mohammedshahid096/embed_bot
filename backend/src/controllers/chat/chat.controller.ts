import { NextFunction, Request, Response } from "express";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import ChatBotModel from "../../schema/chatbot.model";
import ChatMessageModel, { IMessage } from "../../schema/chat.model";
import RabbitMQProducer from "../../services/rabitmq/producer.service";
import RedisServiceClass from "../../services/redis.service";
import redisExpiryTime from "../../constants/redis.constant";

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
          timestamp: new Date(),
          status: "completed",
          order: 1,
        },
      ],
    });

    const redisService = new RedisServiceClass({
      expiryTime: redisExpiryTime.fifteenMinuteInSec,
    });

    await redisService.setRedisJSON(
      `chatSession:${chatSession._id.toString()}`,
      chatSession,
    );

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

    let cachedKey = `chatSession:${sessionId}`;

    const redisService = new RedisServiceClass({
      expiryTime: redisExpiryTime.fifteenMinuteInSec,
    });

    let chatDetails = await redisService.getRedisJSON(cachedKey);

    if (!chatDetails) {
      chatDetails = await ChatMessageModel.findOne({
        _id: sessionId,
        chatBotId: chatbotId,
      }).lean();

      if (!chatDetails) {
        return next(httpErrors.NotFound("Session Details not found"));
      }
    }

    // const url = new
    // URL(origin);
    // if (!chatDetails.allowedDomains.includes(url.origin)) {
    //   return next(httpErrors.BadRequest("Domain is not allowed"));
    // }

    const userTimestamp = new Date();

    const rabbitmqProducer = new RabbitMQProducer();

    let newMessageData: IMessage[] = [];

    if (chatDetails?.messages?.length === 1) {
      newMessageData = [
        {
          content: "",
          role: "ai",
          status: "processing",
          order: 2,
        },
      ];
    } else {
      newMessageData = [
        {
          content: inputQuestion || "",
          role: "human",
          timestamp: userTimestamp,
          status: "completed",
          order: chatDetails?.messages?.length + 1,
        },
        {
          content: "",
          role: "ai",
          status: "processing",
          order: chatDetails?.messages?.length + 2,
        },
      ];
    }

    const updatedDetails = await ChatMessageModel.findByIdAndUpdate(
      sessionId,
      { $push: { messages: newMessageData } },
      { new: true },
    );

    await redisService.setRedisJSON(cachedKey, updatedDetails);
    const lastMessage =
      updatedDetails?.messages?.[updatedDetails?.messages?.length - 1];

    const isPublished = await rabbitmqProducer.chatMessageProducer({
      message: inputQuestion || "",
      organisationId: chatDetails.organizationId?.toString()!,
      sessionId: chatDetails._id.toString(),
      messageId: lastMessage?._id?.toString()!,
      order: lastMessage?.order!,
    });

    if (!isPublished) {
      return next(httpErrors.InternalServerError("Failed to publish message"));
    }

    responseHandlingUtil.successResponseStandard(res, {
      data: updatedDetails,
      otherData: { aiMessageId: lastMessage?._id?.toString() },
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

    const redisService = new RedisServiceClass({
      expiryTime: redisExpiryTime.thirtyMinuteInSec,
    });
    const cachedKey = `chatBot:${chatbotId}`;
    let chatBot = await redisService.getRedisJSON(cachedKey);

    if (!chatBot) {
      chatBot = await ChatBotModel.findOne({
        _id: chatbotId,
        isActive: true,
      })
        .select({ config: 1, createdAt: 1, updatedAt: 1 })
        .lean();
      await redisService.setRedisJSON(cachedKey, chatBot);
    }

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

export const updateChatBotDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.organisation?._id.toString();
    const { config } = req.body;

    if (!config) {
      return next(httpErrors.BadRequest("config is required"));
    }

    const updateFields: Record<string, any> = {};
    const allowedGroups = [
      "general",
      "theme",
      "button",
      "input",
      "messages",
    ] as const;

    for (const group of allowedGroups) {
      if (config[group] && typeof config[group] === "object") {
        for (const [key, value] of Object.entries(config[group])) {
          updateFields[`config.${group}.${key}`] = value;
        }
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return next(httpErrors.BadRequest("No valid config fields to update"));
    }

    const updatedChatBot = await ChatBotModel.findOneAndUpdate(
      { organizationId, isActive: true },
      { $set: updateFields },
      { new: true },
    ).lean();

    if (!updatedChatBot) {
      return next(httpErrors.NotFound("Chatbot not found or is inactive"));
    }

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Chatbot details updated successfully",
      data: updatedChatBot,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const pollingSessionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId } = req.params;

    const redisService = new RedisServiceClass();

    let cachedKey = `chatSession:${sessionId}`;

    let chatDetails = await redisService.getRedisJSON(cachedKey);

    if (!chatDetails) {
      chatDetails = await ChatMessageModel.findOne({
        _id: sessionId,
      }).lean();
      redisService.setRedisJSON(cachedKey, chatDetails);
    }
    if (!chatDetails) {
      return next(httpErrors.NotFound("Session Details not found"));
    }

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Session details fetched successfully",
      data: chatDetails,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
