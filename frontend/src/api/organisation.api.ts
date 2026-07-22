import Service from "@/services";

export const getOrganisationDetailsApi = async () => {
  const response = await Service.fetchGetAuth("/organisation/details");
  return response;
};
