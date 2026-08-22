import { queueJobs, queueNames } from "../../constants/rabbitmq.constant";
import { getRabbitMQChannel } from "../../config/rabitmq.config";
import websiteScrapperHandler from "./handlers/websiteScrapper.handler";
import {
  IAddToKnowledgeBasePayload,
  IChatMessagePayload,
  IWebsiteScrapperPayload,
} from "../../types/rabbitmq/payload.type";
import { cyan } from "colorette";
import messageProcessHandler from "./handlers/messageProcess.handler";
import logger from "../../config/logger.config";

class RabbitMQConsumer {
  constructor() {}

  loadConsumers(): void {
    console.log(`${cyan("[RabbitMQ]")} Loading consumers`);
    this.websiteScrapperConsumer();
    this.chatMessageConsumer();
  }

  private async websiteScrapperConsumer(): Promise<void> {
    const channel = await getRabbitMQChannel();
    await channel.assertQueue(queueNames.knowledgeBase, { durable: false });
    channel.prefetch(1);

    channel.consume(queueJobs.website_scrapping, async (msg) => {
      if (!msg) return;
      try {
        const content = JSON.parse(msg.content.toString()) as {
          job: string;
          data: IWebsiteScrapperPayload;
        };

        logger.info(
          `consumer.Service - chatMessageConsumer ==> Received message for job: ${content.job}`,
        );

        await websiteScrapperHandler(content);

        channel.ack(msg);
      } catch (error) {
        console.log(error);
        channel.nack(msg);
      }
    });

    channel.consume(queueJobs.add_to_knowledge_base, async (msg) => {
      if (!msg) return;
      try {
        const content = JSON.parse(msg.content.toString()) as {
          job: string;
          data: IAddToKnowledgeBasePayload;
        };
        logger.info(
          `consumer.Service - chatMessageConsumer ==> Received message for job: ${content.job}`,
        );

        // await addToKnowledgeBaseHandler(content);

        channel.ack(msg);
      } catch (error) {
        console.log(error);
        channel.nack(msg);
      }
    });
  }

  private async chatMessageConsumer(): Promise<void> {
    const channel = await getRabbitMQChannel();
    await channel.assertQueue(queueNames.chat_message_queue, {
      durable: false,
    });
    channel.prefetch(2);

    channel.consume(queueNames.chat_message_queue, async (msg) => {
      if (!msg) return;
      try {
        const content = JSON.parse(msg.content.toString()) as {
          job: string;
          data: IChatMessagePayload;
        };

        logger.info(
          `consumer.Service - chatMessageConsumer ==> Received message for job: ${content.job}`,
        );

        await messageProcessHandler(content);

        channel.ack(msg);
      } catch (error) {
        console.log(error);
        // channel.nack(msg);
      }
    });
  }
}

export default RabbitMQConsumer;
