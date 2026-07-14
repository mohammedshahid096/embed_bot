import React from "react";
import SignupPage from "../pages/SignupPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";

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
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
];
