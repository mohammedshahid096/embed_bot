import Service from "@/services";

export const getOrganisationDetailsApi = async () => {
  const response = await Service.fetchGetAuth("/organisation/details");
  return response;
};

export const updateOrganisationDetailsApi = async (body: any) => {
  const response = await Service.fetchPutAuth("/organisation/details", body);
  return response;
};

