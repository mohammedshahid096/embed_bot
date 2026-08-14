import { NextFunction, Request, Response } from "express";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import ChatBotModel from "../../schema/chatbot.model";
import ChatMessageModel from "../../schema/chat.model";
import KnowledgeBaseModel from "../../schema/knowledgebase.model";

export const getDashboardDataController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organizationId = req.organisation?._id.toString();

    // Run all queries in parallel
    const [
      chatBot,
      totalSessions,
      totalKnowledgeBases,
      knowledgeBaseByStatus,
      recentSessions,
      tokenUsageAggregation,
      messagesPerDay,
    ] = await Promise.all([
      // Get chatbot details
      ChatBotModel.findOne({ organizationId, isActive: true })
        .select({ _id: 1, config: 1, isActive: 1, allowedDomains: 1 })
        .lean(),

      // Total chat sessions count
      ChatMessageModel.countDocuments({ organizationId }),

      // Total knowledge bases count
      KnowledgeBaseModel.countDocuments({ organisationId: organizationId }),

      // Knowledge base grouped by status
      KnowledgeBaseModel.aggregate([
        {
          $match: {
            organisationId:
              ChatBotModel.base.Types.ObjectId.createFromHexString(
                organizationId!,
              ),
          },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Recent 5 chat sessions with message count
      ChatMessageModel.find({ organizationId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select({ messages: 1, createdAt: 1, chatBotId: 1 })
        .lean()
        .then((sessions) =>
          sessions.map((s) => ({
            _id: s._id,
            chatBotId: s.chatBotId,
            messageCount: s.messages?.length || 0,
            lastMessage: s.messages?.[s.messages.length - 1]?.content || "",
            lastMessageRole: s.messages?.[s.messages.length - 1]?.role || "",
            createdAt: s.createdAt,
          })),
        ),

      // Total token usage across all sessions
      ChatMessageModel.aggregate([
        {
          $match: {
            organizationId:
              ChatBotModel.base.Types.ObjectId.createFromHexString(
                organizationId!,
              ),
          },
        },
        { $unwind: "$messages" },
        {
          $group: {
            _id: null,
            totalInputTokens: {
              $sum: "$messages.tokenUsage.input_tokens",
            },
            totalOutputTokens: {
              $sum: "$messages.tokenUsage.output_tokens",
            },
            totalTokens: {
              $sum: "$messages.tokenUsage.total_tokens",
            },
            totalMessages: { $sum: 1 },
            humanMessages: {
              $sum: { $cond: [{ $eq: ["$messages.role", "human"] }, 1, 0] },
            },
            aiMessages: {
              $sum: { $cond: [{ $eq: ["$messages.role", "ai"] }, 1, 0] },
            },
            failedMessages: {
              $sum: {
                $cond: [
                  {
                    $in: ["$messages.status", ["failed", "error"]],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      // Messages per day (last 7 days)
      ChatMessageModel.aggregate([
        {
          $match: {
            organizationId:
              ChatBotModel.base.Types.ObjectId.createFromHexString(
                organizationId!,
              ),
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        { $unwind: "$messages" },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$messages.timestamp",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const tokenStats = tokenUsageAggregation[0] || {
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalTokens: 0,
      totalMessages: 0,
      humanMessages: 0,
      aiMessages: 0,
      failedMessages: 0,
    };

    const knowledgeBaseStatusMap: Record<string, number> = {};
    knowledgeBaseByStatus.forEach((item: { _id: string; count: number }) => {
      knowledgeBaseStatusMap[item._id] = item.count;
    });

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Dashboard data fetched successfully",
      data: {
        chatBotId: chatBot?._id || null,
        chatBot: chatBot || null,
        stats: {
          totalSessions,
          totalMessages: tokenStats.totalMessages,
          humanMessages: tokenStats.humanMessages,
          aiMessages: tokenStats.aiMessages,
          failedMessages: tokenStats.failedMessages,
          totalKnowledgeBases,
          knowledgeBaseByStatus: knowledgeBaseStatusMap,
        },
        tokenUsage: {
          totalInputTokens: tokenStats.totalInputTokens,
          totalOutputTokens: tokenStats.totalOutputTokens,
          totalTokens: tokenStats.totalTokens,
        },
        recentSessions,
        messagesPerDay,
      },
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
