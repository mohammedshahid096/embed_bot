import { useReducer } from "react";
import { organisationReducer } from "./reducer";
import { organisationAction } from "./action";
import type { OrganisationStateType } from "@/types/context/organisation.types";
import { getOrganisationDetailsApi } from "@/api/organisation.api";
import { getChatBotDetailsApi } from "@/api/chatbot.api";

export const initialOrganisationState: OrganisationStateType = {
  organisationDetails: null,
  chatBotDetails: null,
};

export const useOrganisationState = () => {
  const [state, dispatch] = useReducer(
    organisationReducer,
    initialOrganisationState,
  );

  const getOrganisationDetailsAction = async () => {
    const response = await getOrganisationDetailsApi();
    if (response[0]) {
      dispatch({
        type: organisationAction.GET_ORGANISATION_DETAILS,
        payload: response[1],
      });
    }

    return response;
  };

  const getChatBotDetailsAction = async () => {
    const response = await getChatBotDetailsApi();
    if (response[0]) {
      dispatch({
        type: organisationAction.GET_CHATBOT_DETAILS,
        payload: response[1],
      });
    }

    return response;
  };

  const updateOrganisationStateAction = (
    payload: Partial<OrganisationStateType>,
  ) => {
    dispatch({
      type: organisationAction.UPDATE_ORGANISATION_STATE,
      payload,
    });
  };

  const resetOrganisationStateAction = () => {
    dispatch({ type: organisationAction.RESET_ORGANISATION_STATE });
  };

  return {
    ...state,
    getOrganisationDetailsAction,
    getChatBotDetailsAction,
    updateOrganisationStateAction,
    resetOrganisationStateAction,
  };
};

export const initialStateForContext = {
  ...initialOrganisationState,
  getOrganisationDetailsAction: async (): Promise<any> => {},
  getChatBotDetailsAction: async (): Promise<any> => {},
  updateOrganisationStateAction: () => {},
  resetOrganisationStateAction: () => {},
};
