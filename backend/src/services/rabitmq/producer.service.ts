import { queueNames, queueJobs } from "../../constants/rabbitmq.constant";
import { getRabbitMQChannel } from "../../config/rabitmq.config";
import { IWebsiteScrapperPayload } from "../../types/rabbitmq/payload.type";

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
}

export default RabbitMQProducer;
