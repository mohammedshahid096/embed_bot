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
    this.chatMessageConsumer();
    this.knowledgeBaseConsumer();
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

  private async knowledgeBaseConsumer(): Promise<void> {
    const channel = await getRabbitMQChannel();

    await channel.assertQueue(queueNames.knowledgeBase, {
      durable: false,
    });

    channel.prefetch(1);

    channel.consume(queueNames.knowledgeBase, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString()) as {
          job: string;
          data: IWebsiteScrapperPayload | IAddToKnowledgeBasePayload;
        };

        logger.info(
          `consumer.Service - knowledgeBaseConsumer ==> Received job: ${content.job}`,
        );

        switch (content.job) {
          case queueJobs.website_scrapping:
            await websiteScrapperHandler(
              content as {
                job: string;
                data: IWebsiteScrapperPayload;
              },
            );
            break;

          case queueJobs.add_faq_to_knowledge_base:
            await websiteScrapperHandler(
              content as {
                job: string;
                data: IAddToKnowledgeBasePayload;
              },
            );
            break;

          default:
            logger.warn(`Unknown knowledge base job: ${content.job}`);
            break;
        }

        channel.ack(msg);
      } catch (error) {
        logger.error(error);
        channel.nack(msg, false, false);
      }
    });
  }
}

export default RabbitMQConsumer;
