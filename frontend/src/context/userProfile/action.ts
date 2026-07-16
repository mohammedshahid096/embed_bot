export const userProfileAction = {
  GET_MY_PROFILE: "GET_MY_PROFILE",

  UPDATE_USER_PROFILE_STATE: "UPDATE_USER_PROFILE_STATE",
  RESET_USER_PROFILE_STATE: "RESET_USER_PROFILE_STATE",
} as const;

export type UserProfileActionType =
  (typeof userProfileAction)[keyof typeof userProfileAction];
