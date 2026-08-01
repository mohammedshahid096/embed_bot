import { NextFunction, Request, Response } from "express";
import errorHandling, { AppError } from "../utils/errorHandling.util";
import responseHandlingUtil from "../utils/responseHandling.util";
import ChromaService from "../services/chroma.service";
import {
  CheerioTextSplitter,
  CheerioWebsiteScrapping,
} from "../services/cheerio.service";

export const testingController2 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const cheerioService = new CheerioWebsiteScrapping({
    //   url: "https://teamvx.com",
    // });

    // const pageContent = await cheerioService.getPageContent();

    // const cheerioTextSplitter = new CheerioTextSplitter();

    // const document = cheerioTextSplitter.convertToDocument({
    //   content: pageContent,
    //   source: "https://teamvx.com",
    // });

    // let chunks = await cheerioTextSplitter.generateChunks([document]);
    // console.log("chunks ------> ", chunks);

    const chromaService = new ChromaService({ collectionName: "testing" });
    const data = await chromaService?.listAllCollection();
    // await chromaService.insertToCollection(chunks);

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "testing response",
      data,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const testingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const chromaService = new ChromaService({
      collectionName: "knowledge_base_6a6dc3652cbd4148c3641551",
    });
    const data = await chromaService?.getCollectionGroupedBySource();

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "testing response",
      data,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
