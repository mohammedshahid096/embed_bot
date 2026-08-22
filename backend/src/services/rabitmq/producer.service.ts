import { queueNames, queueJobs } from "../../constants/rabbitmq.constant";
import { getRabbitMQChannel } from "../../config/rabitmq.config";
import {
  IAddToKnowledgeBasePayload,
  IChatMessagePayload,
  IWebsiteScrapperPayload,
} from "../../types/rabbitmq/payload.type";
import logger from "../../config/logger.config";

class RabbitMQProducer {
  constructor() {}

  async websiteScrapperProducer(
    data: IWebsiteScrapperPayload,
  ): Promise<Boolean> {
    const channel = await getRabbitMQChannel();
    await channel.assertQueue(queueNames.knowledgeBase, { durable: false });

    logger.info(
      `producer.Service ==> Sending message for job: ${queueJobs.website_scrapping}`,
    );
    const published = channel.sendToQueue(
      queueNames.knowledgeBase,
      Buffer.from(JSON.stringify({ job: queueJobs.website_scrapping, data })),
    );

    if (published) return true;

    return false;
  }

  async addToKnowledgeBaseProducer(
    sourceType: "faq" | "text",
    data: IAddToKnowledgeBasePayload,
  ): Promise<Boolean> {
    const channel = await getRabbitMQChannel();
    await channel.assertQueue(queueNames.knowledgeBase, { durable: false });

    let queueJobObject = {
      faq: queueJobs.add_faq_to_knowledge_base,
      text: queueJobs.add_text_to_knowledge_base,
    };

    const currentJob = queueJobObject[sourceType];
    logger.info(`producer.Service ==> Sending message for job:  ${currentJob}`);

    const published = channel.sendToQueue(
      queueNames.knowledgeBase,
      Buffer.from(JSON.stringify({ job: currentJob, data })),
    );

    if (published) return true;

    return false;
  }

  async chatMessageProducer(data: IChatMessagePayload): Promise<Boolean> {
    const channel = await getRabbitMQChannel();
    await channel.assertQueue(queueNames.chat_message_queue, {
      durable: false,
    });

    logger.info(
      `producer.Service ==> Sending message for job: ${queueJobs.chat_message}`,
    );
    const published = channel.sendToQueue(
      queueNames.chat_message_queue,
      Buffer.from(JSON.stringify({ job: queueJobs.chat_message, data })),
    );

    if (published) return true;

    return false;
  }
}

export default RabbitMQProducer;
