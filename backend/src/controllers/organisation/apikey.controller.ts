import { NextFunction, Request, Response } from "express";
import errorHandling, { AppError } from "../../utils/errorHandling.util";
import responseHandlingUtil from "../../utils/responseHandling.util";
import { encrypt, decrypt } from "../../utils/crypto.util";
import ApiKeyModel from "../../schema/apikey.model";

export const addOrganisationApiKeyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const organisationId = req?.organisation?._id;

    const { gemini } = req.body;

    if (gemini) {
      const encryptedGeminiKey = encrypt(gemini);
      console.log(encryptedGeminiKey);

      const descryptedGeminiKey = decrypt(encryptedGeminiKey);
      console.log(descryptedGeminiKey);
    }

    responseHandlingUtil.successResponseStandard(res, {
      statusCode: 201,
      message: "Apikey created successfully",
    });
  } catch (error) {
    errorHandling.handlingControllersError(error as AppError, next);
  }
};
