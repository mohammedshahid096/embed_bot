import { Request, Response, NextFunction } from "express";
import httpError from "http-errors";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import {
  LoginAuthBody,
  RedisRegisterUserBody,
  RegisterUserBody,
} from "../../types/users/index.types";
import UserModel from "../../schema/user.model";
import RedisServiceClass from "../../services/redis.service";
import {
  createAccessToken,
  createRefreshToken,
  createVerificationToken,
  verifyVerificationToken,
} from "../../utils/jwt.util";
import config from "../../config/index.config";
import {
  sendAccessTokenCookie,
  sendRefreshTokenCookie,
} from "../../utils/cookie.util";
import {
  hashPasswordMethod,
  verifyPasswordMethod,
} from "../../utils/bcrypt.util";

export const sendRegisterVerificationLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name } = req.body as RegisterUserBody;

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
      name: name,
      email: email,
      password: password,
      count: count + 1,
      token: verificationToken,
      createdAt: new Date().toISOString(),
    };

    // Construct verification link
    const verificationLink = `${config.hosts.CLIENT_HOST_URL}/signup/verify-email?token=${verificationToken}`;
    console.log(verificationLink);

    await redisService.setRedisJSON(email, cacheVerificationDetails);

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "verification link sent successfully",
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const verifyRegisterVerificationLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.query as { token: string };

    const verfifyResult = await verifyVerificationToken(token);

    if (!verfifyResult?.success) {
      return next(
        httpError.Unauthorized("Invalid or expired verification link"),
      );
    }
    const redisService = new RedisServiceClass();
    const verificationCacheData = (await redisService.getRedisJSON(
      verfifyResult?.id as string,
    )) as RedisRegisterUserBody;
    if (!verificationCacheData) {
      return next(httpError.BadRequest("Invalid or expired verification link"));
    }

    const isAlreadyUserExist = await UserModel.findOne({
      email: verificationCacheData?.email,
    });

    if (isAlreadyUserExist) {
      return next(httpError.Conflict("User Already Exist"));
    }

    const hashPassword = await hashPasswordMethod(
      verificationCacheData.password,
    );

    const newUser = new UserModel({
      name: verificationCacheData.name,
      email: verificationCacheData.email,
      password: hashPassword,
      isEmailVerified: true,
      lastLoginAt: new Date(),
    });
    await newUser.save();
    await redisService.deleteRedisKey(verificationCacheData?.email);

    const accessToken = await createAccessToken(newUser?._id?.toString());
    const refreshToken = await createRefreshToken(newUser?._id?.toString());

    sendAccessTokenCookie(res, accessToken);
    sendRefreshTokenCookie(res, refreshToken);

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "User registered successfully",
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const loginAuthController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body as LoginAuthBody;

    const user = await UserModel.findOneAndUpdate(
      { email },
      { lastLoginAt: new Date() },
      { new: true },
    ).select("+password");
    if (!user) {
      return next(httpError.BadRequest("Invalid Email or Password"));
    }

    const isPasswordValid = await verifyPasswordMethod(password, user.password);
    if (!isPasswordValid) {
      return next(httpError.BadRequest("Invalid Email or Password"));
    }

    const accessToken = await createAccessToken(user?._id?.toString());
    const refreshToken = await createRefreshToken(user?._id?.toString());

    sendAccessTokenCookie(res, accessToken);
    sendRefreshTokenCookie(res, refreshToken);

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "User logged in successfully",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
