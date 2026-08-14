import { dashboardAction, type DashboardActionType } from "./action";
import type { DashboardStateType } from "@/types/context/dashboard.types";

export const initialDashboardState: DashboardStateType = {
  dashboardData: null,
  isLoading: false,
};

interface DashboardReducerAction {
  type: DashboardActionType;
  payload?: any;
}

export const dashboardReducer = (
  state: DashboardStateType = initialDashboardState,
  action: DashboardReducerAction,
): DashboardStateType => {
  switch (action.type) {
    case dashboardAction.GET_DASHBOARD_DATA:
      return {
        ...state,
        dashboardData: action.payload?.data || null,
        isLoading: false,
      };

    case dashboardAction.UPDATE_DASHBOARD_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case dashboardAction.RESET_DASHBOARD_STATE:
      return initialDashboardState;

    default:
      return state;
  }
};
