import { createContext } from "react";
import type { CombineState } from "./combineState";
import { initialStateForContext as userProfileState } from "./userProfile/state";

const initialState: CombineState = {
  userProfileState,
};

const Context = createContext(initialState);
export default Context;
