import { queueJobs } from "../../../constants/rabbitmq.constant";
import {
  CheerioWebsiteScrapping,
  CheerioWebsiteUrls,
} from "../../../services/cheerio.service";
import OpenRouterService from "../../../services/open-router.service";

const websiteScrapperHandler = async (message: any) => {
  const { job, data } = message;

  switch (job) {
    case queueJobs.website_scrapping:
      console.log("Start scraping:", data);

      const cheerioWebsiteUrlService = new CheerioWebsiteScrapping({
        url: data.url,
      });
      const content = await cheerioWebsiteUrlService.getPageContent();

      let cleanedContent: string | null = content;

      if (content) {
        const openRouterService = new OpenRouterService();
        const response =
          await openRouterService.cleanContentOpenRouter(content);
        cleanedContent = response?.message || null;
      }

      return cleanedContent;
      break;

    default:
      console.log("Unknown job:", job);
  }
};

export default websiteScrapperHandler;
