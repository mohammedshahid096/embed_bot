import React from "react";
import SignupPage from "../pages/auth/SignupPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterVerificationPage from "../pages/auth/RegisterVerificationPage";
import CompanyDetails from "../pages/onboard/CompanyDetails";
import ExtractWebsiteUrls from "../pages/onboard/ExtractWebsiteUrls";
import AddApiKeys from "../pages/onboard/AddApiKeys";
import ClientDashboardPage from "../pages/client/ClientDashboardPage";
import KnowledgeBasePage from "../pages/client/KnowledgeBasePage";
import AuthWrapper from "../layout/AuthWrapper";
import ClientLayout from "../layout/ClientLayout";

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
    path: "/onboard/organisation-details",
    element: (
      <AuthWrapper roles={["client"]}>
        <CompanyDetails />
      </AuthWrapper>
    ),
  },
  {
    path: "/onboard/website-urls",
    element: (
      <AuthWrapper roles={["client"]}>
        <ExtractWebsiteUrls />
      </AuthWrapper>
    ),
  },
  {
    path: "/onboard/api-keys",
    element: (
      <AuthWrapper roles={["client"]}>
        <AddApiKeys />
      </AuthWrapper>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AuthWrapper roles={["client"]}>
        <ClientLayout>
          <ClientDashboardPage />
        </ClientLayout>
      </AuthWrapper>
    ),
  },
  {
    path: "/knowledge-base",
    element: (
      <AuthWrapper roles={["client"]}>
        <ClientLayout>
          <KnowledgeBasePage />
        </ClientLayout>
      </AuthWrapper>
    ),
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
];
