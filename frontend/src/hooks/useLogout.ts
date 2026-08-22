import { logoutAuthApi } from "@/api/auth.api";
import { removeSecondaryAccessToken } from "@/helpers/cookie.helper";
import { clearAll } from "@/helpers/localstorage.helper";
import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Context from "@/context/context";

const useLogout = () => {
  const navigate = useNavigate();
  const {
    userProfileState: { resetUserprofiletStateAction },
    organisationState: { resetOrganisationStateAction },
    dashboardState: { resetDashboardStateAction },
  } = useContext(Context);
  const resetApplications = useCallback(async () => {
    const response = await logoutAuthApi();

    if (response?.[1]?.success) {
      clearAll();
      removeSecondaryAccessToken();
      resetUserprofiletStateAction();
      resetOrganisationStateAction();
      resetDashboardStateAction();
      navigate("/");
    }
  }, []);

  return resetApplications;
};

export default useLogout;
