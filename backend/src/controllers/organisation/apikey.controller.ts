import { NextFunction, Request, Response } from "express";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import { encrypt } from "../../utils/crypto.util";
import ApiKeyModel, { ApiKeyInterface } from "../../schema/apikey.model";
import httpErrors from "http-errors";
import { AddOrganisationApiKeyBody } from "../../types/organisation/index.types";
import OrganizationModel from "../../schema/organisation.model";

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

    await OrganizationModel.findByIdAndUpdate(req?.organisation?._id, {
      onBoardingStage: "apiKeyAddition",
    });

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

export const getApiKeySummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organisationId = req?.organisation?._id;

    const apiKeyDoc = await ApiKeyModel.findOne({ organisationId });

    if (!apiKeyDoc) {
      return next(httpErrors.NotFound("No API keys found for this organisation"));
    }

    // Only return the last 4 digits – never the encrypted key
    const summary: Record<string, { keyLastFour: string } | null> = {
      gemini: apiKeyDoc.gemini?.keyLastFour
        ? { keyLastFour: apiKeyDoc.gemini.keyLastFour }
        : null,
      openrouter: apiKeyDoc.openrouter?.keyLastFour
        ? { keyLastFour: apiKeyDoc.openrouter.keyLastFour }
        : null,
    };

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: "API key summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

export const updateSingleApiKeyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organisationId = req?.organisation?._id;
    const { provider } = req.params as { provider: "gemini" | "openrouter" };
    const { apiKey } = req.body as { apiKey: string };

    const apiKeyDoc = await ApiKeyModel.findOne({ organisationId });

    if (!apiKeyDoc) {
      return next(httpErrors.NotFound("No API keys found for this organisation"));
    }

    const encryptedKey = encrypt(apiKey);
    const keyLastFour = apiKey.slice(-4);

    apiKeyDoc[provider] = {
      encryptedKey,
      keyLastFour,
    };

    await apiKeyDoc.save();

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 200,
      message: `${provider} API key updated successfully`,
      data: {
        provider,
        keyLastFour,
      },
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};

