export const dashboardAction = {
  GET_DASHBOARD_DATA: "GET_DASHBOARD_DATA",

  UPDATE_DASHBOARD_STATE: "UPDATE_DASHBOARD_STATE",
  RESET_DASHBOARD_STATE: "RESET_DASHBOARD_STATE",
} as const;

export type DashboardActionType =
  (typeof dashboardAction)[keyof typeof dashboardAction];
