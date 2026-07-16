import { NextFunction, Request, Response } from "express";
import OrganizationModel from "../../schema/organisation.model";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import { OnBoardOrganisationBody } from "../../types/organisation/index.types";
import UserModel from "../../schema/user.model";
import { CheerioWebsiteUrls } from "../../services/cheerio.service";

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
    const cheerioWebsiteUrlService = new CheerioWebsiteUrls({
      baseUrl: "https://www.shahidnagodriya.online",
    });
    const websiteUrls = await cheerioWebsiteUrlService.getWebsiteUrls();

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "Website urls fetched successfully",
      data: websiteUrls,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
