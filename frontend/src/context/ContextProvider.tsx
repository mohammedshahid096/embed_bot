import type { ReactNode } from "react";
import { createElement, memo } from "react";
import useCombineState from "./combineState";
import Context from "./context";

interface ContextProviderProps {
  children: ReactNode;
}

function ContextProviderComponent({ children }: ContextProviderProps) {
  const combineStates = useCombineState();
  return createElement(Context.Provider, { value: combineStates }, children);
}

const ContextProvider = memo(ContextProviderComponent);

export default ContextProvider;
