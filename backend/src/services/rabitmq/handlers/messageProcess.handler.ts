import mongoose from "mongoose";
import { queueJobs } from "../../../constants/rabbitmq.constant";
import ChatMessageModel, { IChatMessage } from "../../../schema/chat.model";
import { IChatMessagePayload } from "../../../types/rabbitmq/payload.type";
import AgentService from "../../agent.service";
import RedisServiceClass from "../../redis.service";
import redisExpiryTime from "../../../constants/redis.constant";
import logger from "../../../config/logger.config";

const messageProcessHandler = async (message: {
  job: string;
  data: IChatMessagePayload;
}) => {
  const { job, data } = message;

  switch (job) {
    case queueJobs.chat_message:
      logger.info(
        "messageProcessHandler - chatMessageConsumer chat_message_queue",
      );

      const agentService = new AgentService({
        sessionId: data.sessionId,
      });

      const cachedKey = `chatSession:${data.sessionId}`;
      const redisService = new RedisServiceClass({
        expiryTime: redisExpiryTime.fifteenMinuteInSec,
      });
      let chatDetails = await redisService.getRedisJSON(cachedKey);

      let aiResponse: any;
      const messageId = new mongoose.Types.ObjectId(data.messageId);
      let updateAiMessage: IChatMessage | null = null;

      try {
        aiResponse = await agentService.processRequest(
          data.message,
          chatDetails,
        );
        const tokenUsage = (aiResponse.outputDetails as any)?.response_metadata
          ?.tokenUsage;
        updateAiMessage = await ChatMessageModel.findOneAndUpdate(
          { "messages._id": messageId },
          {
            $set: {
              "messages.$.content": aiResponse.output || "testing",
              "messages.$.timestamp": new Date(),
              "messages.$.tokenUsage": {
                input_tokens: tokenUsage?.promptTokens || 0,
                output_tokens: tokenUsage?.completionTokens || 0,
                total_tokens: tokenUsage?.totalTokens || 0,
              },
              "messages.$.status": "completed",
              "messages.$.order": data.order,
            },
          },
          { new: true },
        );
      } catch (error) {
        logger.error(
          "messageProcessHandler - chatMessageConsumer chat_message_queue",
          error,
        );
        updateAiMessage = await ChatMessageModel.findOneAndUpdate(
          { "messages._id": messageId },
          {
            $set: {
              "messages.$.content": "",
              "messages.$.timestamp": new Date(),
              "messages.$.tokenUsage": {
                input_tokens: 0,
                output_tokens: 0,
                total_tokens: 0,
              },
              "messages.$.status": "failed",
              "messages.$.order": data.order,
              "messages.$.error":
                (error as Error)?.message ||
                "Error Occured, while processing the message. Please try again later.",
            },
          },
          { new: true },
        );
      }

      await redisService.setRedisJSON(cachedKey, updateAiMessage);
      break;

    default:
      console.log("Unknown job:", job);
      return "";
  }
};

export default messageProcessHandler;
