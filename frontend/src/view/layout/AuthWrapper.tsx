import type { ReactNode } from "react";
import React, { useEffect, useState, memo, useContext } from "react";
import useAuth from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Service from "@/services";
import useLogout from "@/hooks/useLogout";
import Context from "@/context/context";
import AuthLoader from "@/components/loader/AuthLoader";

interface AuthWrapperType {
  roles: Array<string>;
  children: ReactNode;
}
const AuthWrapper: React.FC<AuthWrapperType> = ({ roles = [], children }) => {
  const checkAuth = useAuth();
  const location = useLocation();
  const logoutFunction = useLogout();
  const navigate = useNavigate();
  const {
    userProfileState: { getUserprofileDetailsAction, profileDetails },
    organisationState: { getOrganisationDetailsAction },
  } = useContext(Context);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = checkAuth();
    if (token && !profileDetails) {
      fetchMyProfileDetails();
    }
  }, []);

  useEffect(() => {
    if (profileDetails) {
      setIsLoading(false);
      // if (!roles.includes(userProfile?.roleName)) {
      // logoutFunction();
      // }
    }
  }, [profileDetails, roles]);

  useEffect(() => {
    // Return cleanup function that will execute when route changes
    return () => {
      if (!isLoading) {
        Service.cancelAllRequests();
      }
    };
  }, [location.pathname, isLoading]);

  const fetchMyProfileDetails = async () => {
    const response = await getUserprofileDetailsAction();
    if (!response[1]?.success) {
      logoutFunction();
    } else {
      const userDetails = response[1]?.data;
      if (!userDetails?.organisationId) {
        setIsLoading(false);
        navigate("/onboard/organisation-details");
        return;
      } else {
        await getOrganisationDetailsAction();
      }
      setIsLoading(false);
    }
  };

  return isLoading ? <AuthLoader /> : children;
};

export default memo(AuthWrapper);
