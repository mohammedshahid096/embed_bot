import {
  getSecondaryAccessToken,
  removeSecondaryAccessToken,
} from "@/helpers/cookie.helper";
import { clearAll, getLoginToken } from "@/helpers/localstorage.helper";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = (): (() => string | Promise<void> | void) => {
  const navigate = useNavigate();
  const isToken = getLoginToken();

  const checkUserAuthState = useCallback((): string | Promise<void> | void => {
    if (!isToken) {
      const isCookieExist = getSecondaryAccessToken();
      if (isCookieExist) {
        removeSecondaryAccessToken();
        clearAll();
      }
      return navigate("/");
    }
    return isToken;
  }, [isToken]);

  return checkUserAuthState;
};

export default useAuth;
