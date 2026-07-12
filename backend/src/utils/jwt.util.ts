import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config/index.config";

interface TokenPayload {
  id: string;
}

interface VerifyTokenResult {
  success: boolean;
  id?: string;
  error?: any;
}

export const createAccessToken = async (userId: string): Promise<string> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const payload: TokenPayload = {
    id: userId,
  };

  const signConfig: SignOptions = {
    expiresIn: config.jwt.ACCESS_TOKEN_KEY_TIME as any,
  };

  return jwt.sign(payload, config.jwt.ACCESS_TOKEN_KEY, signConfig);
};

export const verifyAccessToken = async (
  token: string,
): Promise<VerifyTokenResult> => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.ACCESS_TOKEN_KEY,
    ) as TokenPayload;
    return {
      success: true,
      id: decoded.id,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const createVerificationToken = async (
  email: string,
): Promise<string> => {
  if (!email) {
    throw new Error("Email is required");
  }

  const payload: TokenPayload = {
    id: email,
  };

  const signConfig: SignOptions = {
    expiresIn: config.jwt.VERIFICATION_TOKEN_KEY_TIME as any,
  };

  return jwt.sign(payload, config.jwt.VERIFICATION_TOKEN_KEY, signConfig);
};

export const verifyVerificationToken = async (
  token: string,
): Promise<VerifyTokenResult> => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.VERIFICATION_TOKEN_KEY,
    ) as TokenPayload;
    return {
      success: true,
      id: decoded.id,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const createRefreshToken = async (userId: string): Promise<string> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const payload: TokenPayload = {
    id: userId,
  };

  const signConfig: SignOptions = {
    expiresIn: config.jwt.ACCESS_TOKEN_KEY_TIME as any,
  };

  return jwt.sign(payload, config.jwt.REFRESH_TOKEN_KEY, signConfig);
};

export const verifyRefreshToken = async (
  token: string,
): Promise<VerifyTokenResult> => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.REFRESH_TOKEN_KEY,
    ) as TokenPayload;
    return {
      success: true,
      id: decoded.id,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
