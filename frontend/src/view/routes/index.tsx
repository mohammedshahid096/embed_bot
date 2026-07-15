import React from "react";
import SignupPage from "../pages/auth/SignupPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterVerificationPage from "../pages/auth/RegisterVerificationPage";
import ClientDashboardPage from "../pages/client/ClientDashboardPage";
import AuthWrapper from "../layout/AuthWrapper";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/verification",
    element: <RegisterVerificationPage />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthWrapper roles={["client"]}>
        <ClientDashboardPage />
      </AuthWrapper>
    ),
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
];
