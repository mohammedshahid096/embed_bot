import Context from "@/context/context";
import { useContext, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface OnboardingLayoutInitialProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutInitialProps) => {
  const navigate = useNavigate();
  const {
    userProfileState: { profileDetails },
  } = useContext(Context);

  useEffect(() => {
    if (profileDetails?.organisationId) {
      navigate("/");
    }
  }, [profileDetails]);
  return children;
};

export default OnboardingLayout;
