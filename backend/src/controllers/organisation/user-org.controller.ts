import { NextFunction, Request, Response } from "express";
import OrganizationModel from "../../schema/organisation.model";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import { OnBoardOrganisationBody } from "../../types/organisation/index.types";
import UserModel from "../../schema/user.model";
import {
  CheerioWebsiteScrapping,
  CheerioWebsiteUrls,
} from "../../services/cheerio.service";
import OpenRouterService from "../../services/open-router.service";
import RabbitMQProducer from "../../services/rabitmq/producer.service";
import { queueJobs } from "../../constants/rabbitmq.constant";
import CrawlJobModel from "../../schema/crawljob.model";

export const onBoardingOrganisationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req?.authUser?._id;
    const onBoardOrgDetails = req.body as OnBoardOrganisationBody;
    const isOrgExist = await OrganizationModel.findOne({ userId });
    if (isOrgExist) return next(httpErrors.Conflict("user already on boarded"));
    const newOrgDetails = await OrganizationModel.create({
      ...onBoardOrgDetails,
      userId: userId!,
    });

    await UserModel.findByIdAndUpdate(userId, {
      organisationId: newOrgDetails?._id,
    });

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 201,
      message: "Organisation Onboarded Successfully",
      data: newOrgDetails,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const getUserOrganisationDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req?.authUser?._id;
    const orgDetails = await OrganizationModel.findOne({ userId });
    if (!orgDetails) return next(httpErrors.NotFound("Organisation not found"));
    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Organisation Details Fetched Successfully",
      data: orgDetails,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const extractUserOrganisationWebsiteUrlsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organisationWebsite = req?.organisation?.website;

    const cheerioWebsiteUrlService = new CheerioWebsiteUrls({
      baseUrl: organisationWebsite!,
    });
    const websiteUrls = await cheerioWebsiteUrlService.getWebsiteUrls();

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Website urls fetched successfully",
      data: websiteUrls ?? [],
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const scrapeWebsitesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organisationId = req?.organisation?._id;

    const { selectedUrls } = req.body as { selectedUrls: string[] };

    const crawlJob = await CrawlJobModel.create({
      organisationId: organisationId,
      selectedUrls,
      status: "pending",
      progress: { total: selectedUrls.length, completed: 0, failed: 0 },
      results: selectedUrls.map((url: string) => ({
        url,
        status: "pending",
      })),
    });

    const rabbitmqProducer = new RabbitMQProducer();

    const publishedToQueue = [];

    for (const url of selectedUrls) {
      const isPublished = await rabbitmqProducer.websiteScrapperProducer({
        url,
        organisationId: organisationId?.toString()!,
        crawlJobId: crawlJob?._id.toString()!,
      });

      if (isPublished) {
        publishedToQueue.push(url);
      }
    }

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Website content scrapping started",
      data: {
        crawlJobId: crawlJob._id,
        publishedToQueue,
      },
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
