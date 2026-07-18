import { queueNames, queueJobs } from "../../constants/rabbitmq.constant";
import { getRabbitMQChannel } from "../../config/rabitmq.config";
import websiteScrapperHandler from "./handlers/websiteScrapper.handler";

class RabbitMQConsumer {
  constructor() {}

  async websiteScrapperConsumer(): Promise<void> {
    const channel = await getRabbitMQChannel();
    await channel.assertQueue(queueNames.scrapping_queue, { durable: false });
    channel.prefetch(1);

    channel.consume(queueNames.scrapping_queue, async (msg) => {
      if (!msg) return;
      try {
        const content = JSON.parse(msg.content.toString());
        const response = await websiteScrapperHandler(content);
        // console.log(response);

        channel.ack(msg);
      } catch (error) {
        console.log(error);
        channel.nack(msg);
      }
    });
  }
}

export default RabbitMQConsumer;
