import type { ReactNode } from "react";
import React, { useEffect, useState, memo } from "react";
import useAuth from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Service from "@/services";
import useLogout from "@/hooks/useLogout";
import { getMyUserProfileApi } from "@/api/user.api";

interface AuthWrapperType {
  roles: Array<string>;
  children: ReactNode;
}
const AuthWrapper: React.FC<AuthWrapperType> = ({ roles = [], children }) => {
  const checkAuth = useAuth();
  const location = useLocation();
  const logoutFunction = useLogout();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const userProfile = null;

  useEffect(() => {
    const token = checkAuth();
    if (token && !userProfile) {
      fetchMyProfileDetails();
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      setIsLoading(false);
      // if (!roles.includes(userProfile?.roleName)) {
      // logoutFunction();
      // }
    }
  }, [userProfile, roles]);

  useEffect(() => {
    // Return cleanup function that will execute when route changes
    return () => {
      if (!isLoading) {
        Service.cancelAllRequests();
      }
    };
  }, [location.pathname, isLoading]);

  const fetchMyProfileDetails = async () => {
    const response = await getMyUserProfileApi();
    if (!response[1]?.success) {
      logoutFunction();
    } else {
      setIsLoading(false);
      const userDetails = response[1]?.data;
      if (!userDetails?.organisationId) {
        navigate("/onboard/organisation-details");
      }
    }
  };

  return isLoading ? <div>loader</div> : children;
};

export default memo(AuthWrapper);
