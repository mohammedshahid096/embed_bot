import { NextFunction, Request, Response } from "express";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import { encrypt } from "../../utils/crypto.util";
import ApiKeyModel, { ApiKeyInterface } from "../../schema/apikey.model";
import httpErrors from "http-errors";
import { AddOrganisationApiKeyBody } from "../../types/organisation/index.types";

export const addOrganisationApiKeyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organisationId = req?.organisation?._id;
    const userId = req?.authUser?._id;

    const { gemini, openrouter } = req.body as AddOrganisationApiKeyBody;

    const isAlreadyExist = await ApiKeyModel.findOne({
      organisationId,
    });

    if (isAlreadyExist) {
      return next(httpErrors.Conflict("Api Key Already Exist"));
    }

    const newApiDetails: Partial<ApiKeyInterface> = {
      organisationId,
      addedBy: userId,
    };

    if (gemini) {
      const encryptedGeminiKey = encrypt(gemini);
      newApiDetails.gemini = {
        encryptedKey: encryptedGeminiKey,
        keyLastFour: gemini.slice(-4),
      };
    }
    if (openrouter) {
      const encryptedOpenRouterKey = encrypt(openrouter);
      newApiDetails.openrouter = {
        encryptedKey: encryptedOpenRouterKey,
        keyLastFour: openrouter.slice(-4),
      };
    }

    await ApiKeyModel.create(newApiDetails);

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 201,
      message: "Apikey added successfully",
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
