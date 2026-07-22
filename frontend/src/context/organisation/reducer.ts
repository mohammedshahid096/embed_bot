import { organisationAction, type OrganisationActionType } from "./action";
import { initialOrganisationState } from "./state";
import type { OrganisationStateType } from "@/types/context/organisation.types";

interface OrganisationReducerAction {
  type: OrganisationActionType;
  payload?: any;
}

export const organisationReducer = (
  state: OrganisationStateType = initialOrganisationState,
  action: OrganisationReducerAction,
): OrganisationStateType => {
  switch (action.type) {
    case organisationAction.GET_ORGANISATION_DETAILS:
      return {
        ...state,
        organisationDetails: action.payload?.data?.organistationDetails || null,
        apiKeyAdded: action.payload?.data?.apiKeyDetails || false,
      };

    case organisationAction.UPDATE_ORGANISATION_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case organisationAction.RESET_ORGANISATION_STATE:
      return initialOrganisationState;

    default:
      return state;
  }
};
