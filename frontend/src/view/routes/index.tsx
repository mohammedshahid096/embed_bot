import React from "react";
import SignupPage from "../pages/SignupPage";

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <SignupPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
];
