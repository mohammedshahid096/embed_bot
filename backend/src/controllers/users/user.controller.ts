import { Request, Response, NextFunction } from "express";
import httpError from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import {
  RedisRegisterUserBody,
  RegisterUserBody,
} from "../../types/users/index.types";
import UserModel from "../../schema/user.model";
import RedisServiceClass from "../../services/redis.service";
import { createVerificationToken } from "../../utils/jwt.util";

export const sendRegisterVerificationLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body as RegisterUserBody;

    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      return next(httpError.Conflict("User Already Exist"));
    }
    const expiryTime = 5 * 60; //5 minutes
    const MAX_ATTEMPTS = 3;

    const redisService = new RedisServiceClass({ expiryTime: expiryTime });

    const verificationCacheData = (await redisService.getRedisJSON(
      email,
    )) as RedisRegisterUserBody;

    let count = verificationCacheData?.count || 0;

    if (count >= MAX_ATTEMPTS) {
      return next(
        httpError.BadRequest(
          "Maximum verification link requests reached. Please try again in 5 minutes.",
        ),
      );
    }

    // Generate JWT token
    const verificationToken = await createVerificationToken(email);

    const cacheVerificationDetails: RedisRegisterUserBody = {
      ...verificationCacheData,
      email: email,
      password: password,
      count: count + 1,
      token: verificationToken,
      createdAt: new Date().toISOString(),
    };

    await redisService.setRedisJSON(email, cacheVerificationDetails);

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "verification link sent successfully",
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
