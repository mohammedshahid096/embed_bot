import { useMemo } from "react";
import { useUserprofileState } from "./userProfile/state";
import { useOrganisationState } from "./organisation/state";
import { useDashboardState } from "./dashboard/state";

export interface CombineState {
  userProfileState: ReturnType<typeof useUserprofileState>;
  organisationState: ReturnType<typeof useOrganisationState>;
  dashboardState: ReturnType<typeof useDashboardState>;
}

const useCombineState = (): CombineState => {
  const userProfileState = useUserprofileState();
  const organisationState = useOrganisationState();
  const dashboardState = useDashboardState();

  return useMemo(
    () => ({
      userProfileState,
      organisationState,
      dashboardState,
    }),
    [userProfileState, organisationState, dashboardState],
  );
};

export default useCombineState;

