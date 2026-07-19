import { NextFunction, Request, Response } from "express";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import KnowledgeBaseModel from "../../schema/knowledgebase.model";

export const getOrganisationKnowledgeBasesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organisationId = req?.organisation?._id;

    const knowledgeBases = await KnowledgeBaseModel.find({
      organisationId,
    }).sort({ createdAt: -1 });

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Knowledge bases fetched successfully",
      data: knowledgeBases,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
