import { useMemo } from "react";
import { useUserprofileState } from "./userProfile/state";

export interface CombineState {
  userProfileState: ReturnType<typeof useUserprofileState>;
}

const useCombineState = (): CombineState => {
  const userProfileState = useUserprofileState();

  return useMemo(
    () => ({
      userProfileState,
    }),
    [userProfileState],
  );
};

export default useCombineState;
