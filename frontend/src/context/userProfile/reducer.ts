import { userProfileAction, type UserProfileActionType } from "./action";
import type { UserProfileStateType } from "@/types/context/userProfile.types";

export const initialUserprofileState: UserProfileStateType = {
  profileDetails: null,
};

interface UserProfileReducerAction {
  type: UserProfileActionType;
  payload?: any;
}

export const userProfileReducer = (
  state: UserProfileStateType = initialUserprofileState,
  action: UserProfileReducerAction,
): UserProfileStateType => {
  switch (action.type) {
    case userProfileAction.GET_MY_PROFILE:
      return {
        ...state,
        profileDetails: action.payload?.data || null,
      };

    case userProfileAction.UPDATE_USER_PROFILE_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case userProfileAction.RESET_USER_PROFILE_STATE:
      return initialUserprofileState;

    default:
      return state;
  }
};
