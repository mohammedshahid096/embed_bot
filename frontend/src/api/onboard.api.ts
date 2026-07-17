import Service from "@/services";
import type { OnBoardOrganisationBody } from "@/types/api/onboarding.types";

export const createOrganisationDetailsApi = async (
  body: OnBoardOrganisationBody,
) => {
  const response = await Service.fetchPostAuth("/organisation/onboard", body);
  return response;
};

export const extractOrganisationWebsiteUrlsApi = async () => {
  const response = await Service.fetchGetAuth("/organisation/extract-website-urls");
  return response;
};
