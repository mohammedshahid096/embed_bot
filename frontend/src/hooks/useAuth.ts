import { getLoginToken } from "@/helpers/localstorage.helper";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = (): (() => string | Promise<void> | void) => {
  const navigate = useNavigate();
  const isToken = getLoginToken();

  const checkUserAuthState = useCallback((): string | Promise<void> | void => {
    if (!isToken) {
      return navigate("/");
    }
    return isToken;
  }, [isToken]);

  return checkUserAuthState;
};

export default useAuth;
