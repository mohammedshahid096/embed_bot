import { queueJobs } from "../../../constants/rabbitmq.constant";
import CrawlJobModel, {
  CrawlJobInterface,
} from "../../../schema/crawljob.model";
import { CheerioWebsiteScrapping } from "../../../services/cheerio.service";
import OpenRouterService from "../../../services/open-router.service";
import { IWebsiteScrapperPayload } from "../../../types/rabbitmq/payload.type";

const websiteScrapperHandler = async (message: {
  job: string;
  data: IWebsiteScrapperPayload;
}) => {
  const { job, data } = message;

  switch (job) {
    case queueJobs.website_scrapping:
      console.log("Start scraping:", data);
      const crawlExist = await CrawlJobModel.findById(data.crawlJobId);
      if (!crawlExist) {
        console.log("Crawl job not found");
        return "";
      }
      if (crawlExist.status === "pending") {
        await CrawlJobModel.updateOne(
          { _id: data.crawlJobId },
          { $set: { status: "running" } },
        );
      }
      const { url, crawlJobId } = data;

      const cheerioWebsiteUrlService = new CheerioWebsiteScrapping({
        url,
      });

      const content = await cheerioWebsiteUrlService.getPageContent();

      let cleanedContent: string | null = content;
      let newCrawlUpdatedData: null | CrawlJobInterface = null;

      if (content) {
        const openRouterService = new OpenRouterService();
        const response =
          await openRouterService.cleanContentOpenRouter(content);
        cleanedContent = response?.message || null;

        newCrawlUpdatedData = await CrawlJobModel.findOneAndUpdate(
          { _id: crawlJobId, "results.url": url },
          {
            $set: { "results.$.status": "success" },
            $inc: { "progress.completed": 1 },
          },
          { new: true },
        );
      } else {
        newCrawlUpdatedData = await CrawlJobModel.findOneAndUpdate(
          { _id: crawlJobId, "results.url": url },
          {
            $set: {
              "results.$.status": "failed",
              "results.$.error": "url content scrapping failed",
            },
            $inc: { "progress.failed": 1 },
          },
          { new: true },
        );
      }

      const { progress } = newCrawlUpdatedData!;
      if (progress?.completed + progress?.failed === progress?.total) {
        await CrawlJobModel.findOneAndUpdate(
          { _id: crawlJobId },
          {
            $set: { status: "completed", completedAt: new Date() },
          },
        );
      }

      return cleanedContent;
      break;

    default:
      console.log("Unknown job:", job);
      return "";
  }
};

export default websiteScrapperHandler;
