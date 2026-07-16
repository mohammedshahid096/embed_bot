import Service from "@/services";
import type { OnBoardOrganisationBody } from "@/types/api/onboarding.types";

export const createOrganisationDetailsApi = async (
  body: OnBoardOrganisationBody,
) => {
  const response = await Service.fetchPostAuth("/organisation/onboard", body);
  return response;
};
