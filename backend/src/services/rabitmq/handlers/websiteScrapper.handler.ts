import { queueJobs } from "../../../constants/rabbitmq.constant";
import CrawlJobModel, {
  CrawlJobInterface,
  CrawlStatusCodes,
} from "../../../schema/crawljob.model";
import KnowledgeBaseModel from "../../../schema/knowledgebase.model";
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
      const { url, crawlJobId, knowledgeBaseId } = data;

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

        await KnowledgeBaseModel.findByIdAndUpdate(knowledgeBaseId, {
          status: "ready",
          content: cleanedContent || content,
          //  chunkCount: chunks.length,
        });

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

        await KnowledgeBaseModel.findByIdAndUpdate(knowledgeBaseId, {
          status: "failed",
        });
      }

      const { progress } = newCrawlUpdatedData!;

      let statusUpdated: CrawlStatusCodes | null = null;
      if (progress?.completed === progress?.total) {
        statusUpdated = "completed";
      } else if (progress?.failed === progress?.total) {
        statusUpdated = "failed";
      } else if (progress?.completed + progress?.failed === progress?.total) {
        statusUpdated = "success_failed";
      }

      if (statusUpdated) {
        await CrawlJobModel.findOneAndUpdate(
          { _id: crawlJobId },
          {
            $set: { status: statusUpdated, completedAt: new Date() },
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
