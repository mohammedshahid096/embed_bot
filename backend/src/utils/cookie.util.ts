import { Response } from "express";
import config from "../config/index.config";

export const sendAccessTokenCookie = (res: Response, accessToken: string) => {
  const AccessTokenOptions = {
    expires: new Date(
      Date.now() + parseInt(config.cookie.ACCESS_TOKEN_COOKIE_TIME) * 60 * 1000,
    ), // for min
    sameSite: "none" as const,
    secure: true,
    httpOnly: true,
  };

  res.cookie("access_token", accessToken, AccessTokenOptions);
};

export const sendRefreshTokenCookie = (res: Response, refreshToken: string) => {
  const RefreshTokenOptions = {
    expires: new Date(
      Date.now() +
        parseInt(config.cookie.REFRESH_TOKEN_COOKIE_TIME) * 24 * 60 * 60 * 1000,
    ), // for days
    sameSite: "none" as const,
    secure: true,
    httpOnly: true,
  };

  res.cookie("refresh_token", refreshToken, RefreshTokenOptions);
};
