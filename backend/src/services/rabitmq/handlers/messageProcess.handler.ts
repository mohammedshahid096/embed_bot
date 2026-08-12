import mongoose from "mongoose";
import { queueJobs } from "../../../constants/rabbitmq.constant";
import ChatMessageModel from "../../../schema/chat.model";
import { IChatMessagePayload } from "../../../types/rabbitmq/payload.type";
import AgentService from "../../agent.service";
import RedisServiceClass from "../../redis.service";
import redisExpiryTime from "../../../constants/redis.constant";

const messageProcessHandler = async (message: {
  job: string;
  data: IChatMessagePayload;
}) => {
  const { job, data } = message;

  switch (job) {
    case queueJobs.chat_message:
      console.log("Queue Job :", job, data);

      const agentService = new AgentService({
        sessionId: data.sessionId,
      });

      const cachedKey = `chatSession:${data.sessionId}`;
      const redisService = new RedisServiceClass({
        expiryTime: redisExpiryTime.fifteenMinuteInSec,
      });
      let chatDetails = await redisService.getRedisJSON(cachedKey);

      const aiResponse = await agentService.processRequest(
        data.message,
        chatDetails,
      );

      const tokenUsage = (aiResponse.outputDetails as any)?.response_metadata
        ?.tokenUsage;

      const messageId = new mongoose.Types.ObjectId(data.messageId);

      const updateAiMessage = await ChatMessageModel.findOneAndUpdate(
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

      await redisService.setRedisJSON(cachedKey, updateAiMessage);
      break;

    default:
      console.log("Unknown job:", job);
      return "";
  }
};

export default messageProcessHandler;
