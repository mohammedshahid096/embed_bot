import { NextFunction, Request, Response } from "express";
import errorHandling, { AppError } from "../utils/errorHandling.util";
import responseHandlingUtil from "../utils/responseHandling.util";
import ChromaService from "../services/chroma.service";

export const testingController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const chromaService = new ChromaService({ collectionName: "testing" });
    const response = await chromaService.getCollectionInfo();
    const response2 = await chromaService.listAllCollection();
    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 201,
      message: "testing response",
      data: response,
      otherData: { response2 },
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
