import { NextFunction, Request, Response } from "express";
import UserModel from "../../schema/user.model";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";

export const userProfileDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req?.authUser?._id;
    const userExist = await UserModel.findById(userId).lean();
    if (!userExist) return next(httpErrors.NotFound("user not found"));
    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "user profile fetched successfully",
      data: {
        ...userExist,
        organisationId: userExist.organisationId || null,
      },
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
