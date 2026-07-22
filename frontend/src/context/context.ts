import { createContext } from "react";
import type { CombineState } from "./combineState";
import { initialStateForContext as userProfileState } from "./userProfile/state";
import { initialStateForContext as organisationState } from "./organisation/state";

const initialState: CombineState = {
  userProfileState,
  organisationState,
};

const Context = createContext(initialState);
export default Context;
