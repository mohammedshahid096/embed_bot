import { useReducer } from "react";
import { userProfileReducer } from "./reducer";
import { userProfileAction } from "./action";
import type { UserProfileStateType } from "@/types/context/userProfile.types";
import { getMyUserProfileApi } from "@/api/user.api";

export const initialUserprofileState: UserProfileStateType = {
  profileDetails: null,
};

export const useUserprofileState = () => {
  const [state, dispatch] = useReducer(
    userProfileReducer,
    initialUserprofileState,
  );

  const getUserprofileDetailsAction = async () => {
    const response = await getMyUserProfileApi();
    if (response[0]) {
      dispatch({
        type: userProfileAction.GET_MY_PROFILE,
        payload: response[1],
      });
    }

    return response;
  };

  const updateUserprofileStateAction = (
    payload: Partial<UserProfileStateType>,
  ) => {
    dispatch({
      type: userProfileAction.UPDATE_USER_PROFILE_STATE,
      payload,
    });
  };

  const resetUserprofiletStateAction = () => {
    dispatch({ type: userProfileAction.RESET_USER_PROFILE_STATE });
  };

  return {
    ...state,
    getUserprofileDetailsAction,
    updateUserprofileStateAction,
    resetUserprofiletStateAction,
  };
};

export const initialStateForContext = {
  ...initialUserprofileState,
  getUserprofileDetailsAction: async (): Promise<any> => {},
  updateUserprofileStateAction: () => {},
  resetUserprofiletStateAction: () => {},
};
