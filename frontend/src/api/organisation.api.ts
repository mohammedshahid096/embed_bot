import Service from "@/services";

export const getOrganisationDetailsApi = async () => {
  const response = await Service.fetchGetAuth("/organisation/details");
  return response;
};

export const updateOrganisationDetailsApi = async (body: any) => {
  const response = await Service.fetchPutAuth("/organisation/details", body);
  return response;
};

export const getApiKeySummaryApi = async () => {
  const response = await Service.fetchGetAuth("/organisation/api-keys");
  return response;
};

export const updateSingleApiKeyApi = async (
  provider: "gemini" | "openrouter",
  apiKey: string,
) => {
  const response = await Service.fetchPutAuth(
    `/organisation/api-keys/${provider}`,
    { apiKey },
  );
  return response;
};


