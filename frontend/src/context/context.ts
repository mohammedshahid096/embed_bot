import { createContext } from "react";
import type { CombineState } from "./combineState";
import { initialStateForContext as userProfileState } from "./userProfile/state";
import { initialStateForContext as organisationState } from "./organisation/state";
import { initialStateForContext as dashboardState } from "./dashboard/state";

const initialState: CombineState = {
  userProfileState,
  organisationState,
  dashboardState,
};

const Context = createContext(initialState);
export default Context;

