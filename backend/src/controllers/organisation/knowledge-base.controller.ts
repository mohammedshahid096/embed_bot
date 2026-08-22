import { NextFunction, Request, Response } from "express";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import KnowledgeBaseModel from "../../schema/knowledgebase.model";
import logger from "../../config/logger.config";

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

export const addFaqToKnowledgeBaseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info(
      "controllers - organisation - knowledge-base.controller - addFaqToKnowledgeBaseController - Start",
    );
    const { faqItems, collectionName } = req?.body;
    const organisationId = req?.organisation?._id;

    const knowledgebaseOrder = await KnowledgeBaseModel.countDocuments({
      organisationId,
    });

    const faqKnowledgeBase = new KnowledgeBaseModel({
      name: collectionName,
      faqItems,
      organisationId,
      sourceType: "faq",
      order: knowledgebaseOrder + 1,
    });

    await faqKnowledgeBase.save();
    logger.info(
      "controllers - organisation - knowledge-base.controller - addFaqToKnowledgeBaseController - End",
    );
    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "FAQ added successfully",
      data: faqKnowledgeBase,
    });
  } catch (error) {
    logger.error(
      "controllers - organisation - knowledge-base.controller - addFaqToKnowledgeBaseController - Error",
      error,
    );
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
