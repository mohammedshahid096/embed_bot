import { useReducer } from "react";
import { dashboardReducer, initialDashboardState } from "./reducer";
import { dashboardAction } from "./action";
import type { DashboardStateType } from "@/types/context/dashboard.types";
import { getDashboardDataApi } from "@/api/dashboard.api";

export const useDashboardState = () => {
  const [state, dispatch] = useReducer(
    dashboardReducer,
    initialDashboardState,
  );

  const getDashboardDataAction = async () => {
    dispatch({
      type: dashboardAction.UPDATE_DASHBOARD_STATE,
      payload: { isLoading: true },
    });

    const response = await getDashboardDataApi();
    if (response[0]) {
      dispatch({
        type: dashboardAction.GET_DASHBOARD_DATA,
        payload: response[1],
      });
    } else {
      dispatch({
        type: dashboardAction.UPDATE_DASHBOARD_STATE,
        payload: { isLoading: false },
      });
    }

    return response;
  };

  const updateDashboardStateAction = (
    payload: Partial<DashboardStateType>,
  ) => {
    dispatch({
      type: dashboardAction.UPDATE_DASHBOARD_STATE,
      payload,
    });
  };

  const resetDashboardStateAction = () => {
    dispatch({ type: dashboardAction.RESET_DASHBOARD_STATE });
  };

  return {
    ...state,
    getDashboardDataAction,
    updateDashboardStateAction,
    resetDashboardStateAction,
  };
};

export const initialStateForContext = {
  ...initialDashboardState,
  getDashboardDataAction: async (): Promise<any> => {},
  updateDashboardStateAction: () => {},
  resetDashboardStateAction: () => {},
};
