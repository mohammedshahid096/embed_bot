const LOGIN_TOKEN_KEY = "embedbot_login_token" as const;

// Login Token Management
export const getLoginToken = (): string | null => {
  return localStorage.getItem(LOGIN_TOKEN_KEY);
};

export const setLoginToken = (token: string): boolean => {
  localStorage.setItem(LOGIN_TOKEN_KEY, token);
  return true;
};

export const removeLoginToken = (): boolean => {
  localStorage.removeItem(LOGIN_TOKEN_KEY);
  return true;
};

// Clear All Local Storage
export const clearAll = (): boolean => {
  localStorage.clear();
  return true;
};
