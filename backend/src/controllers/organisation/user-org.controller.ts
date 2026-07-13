import { NextFunction, Request, Response } from "express";
import OrganizationModel from "../../schema/organisation.model";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import { OnBoardOrganisationBody } from "../../types/organisation/index.types";

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

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 201,
      message: "Organisation Onboarded Successfully",
      data: newOrgDetails,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
