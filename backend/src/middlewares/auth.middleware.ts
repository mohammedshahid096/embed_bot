import { Response, NextFunction, Request } from "express";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../utils/errorHandling.util";
import { verifyAccessToken } from "../utils/jwt.util";
import UserModel from "../schema/user.model";
import config from "../config/index.config";

export const Authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { access_token } = req.cookies;
    if (!access_token) {
      return next(httpErrors.Unauthorized("Authentication token required"));
    }

    const decode = await verifyAccessToken(access_token);

    if (!decode.success || !decode.id) {
      const errorMessage = decode.error?.message || "Invalid token";
      return next(httpErrors.Unauthorized(errorMessage));
    }

    let userExist = await UserModel.findById(decode?.id).lean();

    if (!userExist) return next(httpErrors.NotFound("user not found"));

    req.authUser = {
      _id: userExist?._id,
      email: userExist?.email,
      name: userExist?.name,
      organisationId: userExist?.organisationId,
    };
    console.log(`name : ${userExist.name} email: ${userExist.email}`);
    next();
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

const DevelopmentAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = config.DEVELOPMENT_USER_ID;
    if (!userId)
      return next(
        httpErrors.InternalServerError("Development user ID is not set"),
      );
    const userExist = await UserModel.findById(userId).lean();

    if (!userExist) return next(httpErrors.NotFound("user not found"));

    req.authUser = {
      _id: userExist?._id,
      email: userExist?.email,
      name: userExist?.name,
      organisationId: userExist?.organisationId,
    };
    console.log(`name : ${userExist.name} email: ${userExist.email}`);

    next();
  } catch (error) {
    next(httpErrors.InternalServerError("Internal server error"));
  }
};

// authorization depending  upon a role
// export const Authorization = (...roles: string[]) => {
//   return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     if (!roles.includes(req?.authUser?.role)) {
//       res.clearCookie("access_token");
//       res.clearCookie("refresh_token");
//       return next(httpErrors.Unauthorized("Authentication token required"));
//     }
//     next();
//   };
// };
