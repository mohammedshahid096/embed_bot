import { logoutAuthApi } from "@/api/auth.api";
import { removeSecondaryAccessToken } from "@/helpers/cookie.helper";
import { clearAll } from "@/helpers/localstorage.helper";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// import Context from "@/context/context";

const useLogout = () => {
  const navigate = useNavigate();

  const resetApplications = useCallback(async () => {
    // setTimeout(() => {
    // }, 1000);

    clearAll();
    removeSecondaryAccessToken();
    logoutAuthApi();
    navigate("/");
  }, []);

  return resetApplications;
};

export default useLogout;
