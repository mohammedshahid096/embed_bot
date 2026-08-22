import { queueJobs } from "../../../constants/rabbitmq.constant";
import CrawlJobModel, {
  CrawlJobInterface,
  CrawlStatusCodes,
} from "../../../schema/crawljob.model";
import KnowledgeBaseModel from "../../../schema/knowledgebase.model";
import {
  CheerioTextSplitter,
  CheerioWebsiteScrapping,
} from "../../../services/cheerio.service";
import OpenRouterService from "../../../services/open-router.service";
import {
  IAddToKnowledgeBasePayload,
  IWebsiteScrapperPayload,
} from "../../../types/rabbitmq/payload.type";
import ChromaService from "../../chroma.service";

const websiteScrapperHandler = async (message: {
  job: string;
  data: IWebsiteScrapperPayload | IAddToKnowledgeBasePayload;
}) => {
  const { job, data } = message;

  const jobHandlersObject = {
    [queueJobs.website_scrapping]: async () => {
      const { url, crawlJobId, knowledgeBaseId, organisationId } =
        data as IWebsiteScrapperPayload;
      console.log("Queue Job :", job, data);
      const crawlExist = await CrawlJobModel.findById(crawlJobId);
      if (!crawlExist) {
        console.log("Crawl job not found");
        return "";
      }
      if (crawlExist.status === "pending") {
        await CrawlJobModel.updateOne(
          { _id: crawlJobId },
          { $set: { status: "running" } },
        );
      }

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
        });

        const cheerioTextSplitter = new CheerioTextSplitter();

        const document = cheerioTextSplitter.convertToDocument({
          content: cleanedContent || content,
          source: url,
          organisationId,
          knowledgeBaseId,
          type: "website",
        });

        const chunks = await cheerioTextSplitter.generateChunks([document]);

        const chromaService = new ChromaService({
          collectionName: `knowledge_base_${organisationId}`,
        });

        const { chunkCount } = await chromaService.insertToCollection(chunks);
        console.log("chunkCount ------> ", chunkCount);

        await KnowledgeBaseModel.findByIdAndUpdate(knowledgeBaseId, {
          chunkCount: chunkCount,
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
    },

    [queueJobs.add_faq_to_knowledge_base]: async () => {
      const { organisationId, knowledgeBaseId } =
        data as IAddToKnowledgeBasePayload;

      console.log(organisationId, knowledgeBaseId, "recedidf");
      const existingData = await KnowledgeBaseModel.findById(knowledgeBaseId);

      if (!existingData) {
        console.log("Knowledge base not found");
        return "";
      }

      const cheerioTextSplitter = new CheerioTextSplitter();

      const documents = existingData?.faqItems?.map((singleFaq) => {
        return cheerioTextSplitter.convertToDocument({
          content: `Q: ${singleFaq?.question}\n A: ${singleFaq?.answer}`,
          source: existingData?.name,
          organisationId,
          knowledgeBaseId,
          type: "faq",
        });
      });

      console.log(documents);

      const chunks = await cheerioTextSplitter.generateChunks(documents);

      const chromaService = new ChromaService({
        collectionName: `knowledge_base_${organisationId}`,
      });

      const { chunkCount } = await chromaService.insertToCollection(chunks);
      await KnowledgeBaseModel.findByIdAndUpdate(knowledgeBaseId, {
        chunkCount: chunkCount,
        status: "ready",
      });

      return true;
    },
    [queueJobs.add_text_to_knowledge_base]: async () => {},
  };

  return jobHandlersObject[job] ? jobHandlersObject[job]() : "";
};

export default websiteScrapperHandler;
