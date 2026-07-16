import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface OnboardingLayoutInitialProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutInitialProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // navigate("/");
  }, []);
  return children;
};

export default OnboardingLayout;
