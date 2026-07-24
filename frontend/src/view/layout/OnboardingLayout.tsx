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
    organisationState: { organisationDetails },
  } = useContext(Context);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profileDetails?.organisationId) {
      setIsLoading(false);
      navigate("/onboard/organisation-details");
    } else if (organisationDetails?.onBoardingStage === "apiKeyAddition") {
      navigate("/dashboard");
    } else if (organisationDetails?.onBoardingStage === "organizationDetails") {
      setIsLoading(false);
      navigate("/onboard/website-urls");
    } else if (organisationDetails?.onBoardingStage === "websiteSetup") {
      setIsLoading(false);
      navigate("/onboard/api-keys");
    } else {
      setIsLoading(false);
    }
  }, [profileDetails, organisationDetails?.onBoardingStage, location.pathname]);

  return isloading ? null : children;
};

export default OnboardingLayout;
