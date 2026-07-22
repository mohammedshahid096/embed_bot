import Context from "@/context/context";
import { useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface OnboardingLayoutInitialProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutInitialProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userProfileState: { profileDetails },
    organisationState: { apiKeyAdded },
  } = useContext(Context);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      profileDetails?.organisationId &&
      location.pathname === "/onboard/organisation-details"
    ) {
      navigate("/");
    } else if (apiKeyAdded && location.pathname === "/onboard/api-keys") {
      navigate("/");
    } else if (apiKeyAdded && location.pathname === "/onboard/website-urls") {
      navigate("/");
    } else {
      setIsLoading(false);
    }
  }, [profileDetails, apiKeyAdded, location.pathname]);

  return isloading ? null : children;
};

export default OnboardingLayout;
