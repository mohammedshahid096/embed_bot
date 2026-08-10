import { queueNames, queueJobs } from "../../constants/rabbitmq.constant";
import { getRabbitMQChannel } from "../../config/rabitmq.config";
import {
  IChatMessagePayload,
  IWebsiteScrapperPayload,
} from "../../types/rabbitmq/payload.type";

class RabbitMQProducer {
  constructor() {}

  async websiteScrapperProducer(
    data: IWebsiteScrapperPayload,
  ): Promise<Boolean> {
    const channel = await getRabbitMQChannel();
    await channel.assertQueue(queueNames.scrapping_queue, { durable: false });
    const published = channel.sendToQueue(
      queueNames.scrapping_queue,
      Buffer.from(JSON.stringify({ job: queueJobs.website_scrapping, data })),
    );

    if (published) return true;

    return false;
  }

  async chatMessageProducer(data: IChatMessagePayload): Promise<Boolean> {
    const channel = await getRabbitMQChannel();
    await channel.assertQueue(queueNames.chat_message_queue, {
      durable: false,
    });
    const published = channel.sendToQueue(
      queueNames.chat_message_queue,
      Buffer.from(JSON.stringify({ job: queueJobs.chat_message, data })),
    );

    if (published) return true;

    return false;
  }
}

export default RabbitMQProducer;
