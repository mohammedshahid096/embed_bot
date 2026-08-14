import Service from "@/services";

export const getDashboardDataApi = async () => {
  const response = await Service.fetchGetAuth(`/dashboard`);
  return response;
};
