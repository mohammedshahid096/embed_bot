import React from "react";
import SignupPage from "../pages/SignupPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
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
