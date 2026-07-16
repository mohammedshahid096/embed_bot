import { Response, NextFunction, Request } from "express";
import httpErrors from "http-errors";
import errorHandling, { AppError } from "../utils/errorHandling.util";
import OrganizationModel from "../schema/organisation.model";

export const OrganisationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organisationId = req?.authUser?.organisationId;

    if (!organisationId) {
      return next(httpErrors.NotFound("Organisation not found"));
    }

    const orgDetails = await OrganizationModel.findById(organisationId);

    if (!orgDetails) {
      return next(httpErrors.NotFound("Organisation not found"));
    }

    req.organisation = orgDetails;
    next();
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
