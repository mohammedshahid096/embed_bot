import Cookies from "js-cookie";

export const setCookie = (name: string, value: string, days: number = 7) => {
  Cookies.set(name, value, {
    expires: days,
    path: "/",
    secure: true,
    sameSite: "Strict",
  });
};

export const getCookie = (name: string): string | null => {
  return Cookies.get(name) || null;
};

export const removeCookie = (name: string) => {
  Cookies.remove(name, { path: "/" });
};

// Access Token specific helpers
const SECONDARY_ACCESS_TOKEN_KEY = "secondary_access_token";

// default 5minutes
export const setSecondaryAccessToken = (token: string, minutes: number = 5) => {
  const expiresInDays = minutes / (24 * 60);

  Cookies.set(SECONDARY_ACCESS_TOKEN_KEY, token, {
    expires: expiresInDays,
    path: "/",
    secure: true,
    sameSite: "Strict",
  });
};

export const getSecondaryAccessToken = (): string | null => {
  return getCookie(SECONDARY_ACCESS_TOKEN_KEY);
};

export const removeSecondaryAccessToken = () => {
  removeCookie(SECONDARY_ACCESS_TOKEN_KEY);
};
