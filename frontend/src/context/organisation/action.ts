export const organisationAction = {
  GET_ORGANISATION_DETAILS: "GET_ORGANISATION_DETAILS",

  UPDATE_ORGANISATION_STATE: "UPDATE_ORGANISATION_STATE",
  RESET_ORGANISATION_STATE: "RESET_ORGANISATION_STATE",
} as const;

export type OrganisationActionType =
  (typeof organisationAction)[keyof typeof organisationAction];
