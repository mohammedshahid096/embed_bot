import Context from "@/context/context";
import { useContext, useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface OnboardingLayoutInitialProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutInitialProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userProfileState: { profileDetails },
  } = useContext(Context);

  useEffect(() => {
    if (
      profileDetails?.organisationId &&
      location.pathname === "/onboard/organisation-details"
    ) {
      navigate("/");
    }
  }, [profileDetails]);
  return children;
};

export default OnboardingLayout;
