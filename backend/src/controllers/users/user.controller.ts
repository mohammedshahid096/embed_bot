import { NextFunction, Request, Response } from "express";
import UserModel from "../../schema/user.model";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import logger from "../../config/logger.config";

export const userProfileDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info(
      "controllers - users - user.controller - userProfileDetailsController - End",
    );
    const userId = req?.authUser?._id;
    const userExist = await UserModel.findById(userId).lean();
    if (!userExist) return next(httpErrors.NotFound("user not found"));
    logger.info(
      "controllers - users - user.controller - userProfileDetailsController - End",
    );
    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "user profile fetched successfully",
      data: {
        ...userExist,
        organisationId: userExist.organisationId || null,
      },
    });
  } catch (error) {
    logger.error(
      "controllers - users - user.controller - userProfileDetailsController - Error",
      error,
    );
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
