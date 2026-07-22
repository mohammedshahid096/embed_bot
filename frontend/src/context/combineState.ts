import { useMemo } from "react";
import { useUserprofileState } from "./userProfile/state";
import { useOrganisationState } from "./organisation/state";

export interface CombineState {
  userProfileState: ReturnType<typeof useUserprofileState>;
  organisationState: ReturnType<typeof useOrganisationState>;
}

const useCombineState = (): CombineState => {
  const userProfileState = useUserprofileState();
  const organisationState = useOrganisationState();

  return useMemo(
    () => ({
      userProfileState,
      organisationState,
    }),
    [userProfileState, organisationState],
  );
};

export default useCombineState;
